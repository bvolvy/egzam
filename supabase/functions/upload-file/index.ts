import { corsHeaders } from '../_shared/cors.ts';

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface BackblazeConfig {
  applicationKeyId: string;
  applicationKey: string;
  bucketId: string;
  bucketName: string;
}

interface BackblazeAuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

interface BackblazeUploadResponse {
  fileId: string;
  fileName: string;
  contentLength: number;
  contentSha1: string;
  fileInfo: Record<string, string>;
}

const getBackblazeConfig = (): BackblazeConfig => {
  const applicationKeyId = Deno.env.get('BACKBLAZE_APPLICATION_KEY_ID');
  const applicationKey = Deno.env.get('BACKBLAZE_APPLICATION_KEY');
  const bucketId = Deno.env.get('BACKBLAZE_BUCKET_ID');
  const bucketName = Deno.env.get('BACKBLAZE_BUCKET_NAME');

  if (!applicationKeyId || !applicationKey || !bucketId || !bucketName) {
    throw new Error('Configuration Backblaze manquante');
  }

  return { applicationKeyId, applicationKey, bucketId, bucketName };
};

const authenticateWithBackblaze = async (config: BackblazeConfig): Promise<BackblazeAuthResponse> => {
  const credentials = btoa(`${config.applicationKeyId}:${config.applicationKey}`);
  
  const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur d'authentification Backblaze: ${response.statusText}`);
  }

  return await response.json();
};

const getUploadUrl = async (authData: BackblazeAuthResponse, bucketId: string) => {
  const response = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      'Authorization': authData.authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bucketId }),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'obtention de l'URL d'upload: ${response.statusText}`);
  }

  return await response.json();
};

const uploadFileToBackblaze = async (
  uploadUrl: string,
  uploadAuthToken: string,
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
): Promise<BackblazeUploadResponse> => {
  // Calculer le SHA1 du fichier
  const hashBuffer = await crypto.subtle.digest('SHA-1', fileData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha1 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': uploadAuthToken,
      'X-Bz-File-Name': encodeURIComponent(fileName),
      'Content-Type': contentType,
      'X-Bz-Content-Sha1': sha1,
      'X-Bz-Info-src_last_modified_millis': Date.now().toString(),
    },
    body: fileData,
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'upload: ${response.statusText}`);
  }

  return await response.json();
};

Deno.serve(async (req: Request) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer les données du formulaire
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const examMetadata = JSON.parse(formData.get('metadata') as string);

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Vérifications de sécurité
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Seuls les fichiers PDF sont acceptés' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'Le fichier ne doit pas dépasser 5MB' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Configuration Backblaze
    const config = getBackblazeConfig();
    
    // Authentification avec Backblaze
    const authData = await authenticateWithBackblaze(config);
    
    // Obtenir l'URL d'upload
    const uploadData = await getUploadUrl(authData, config.bucketId);
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().substring(0, 8);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `exams/${timestamp}_${randomId}_${sanitizedFileName}`;
    
    // Convertir le fichier en ArrayBuffer
    const fileData = await file.arrayBuffer();
    
    // Upload vers Backblaze B2
    const uploadResult = await uploadFileToBackblaze(
      uploadData.uploadUrl,
      uploadData.authorizationToken,
      uniqueFileName,
      fileData,
      file.type
    );

    // Construire l'URL de téléchargement public
    const fileUrl = `${authData.downloadUrl}/file/${config.bucketName}/${uniqueFileName}`;

    // Retourner les informations du fichier uploadé
    return new Response(
      JSON.stringify({
        success: true,
        fileUrl,
        fileName: uniqueFileName,
        originalFileName: file.name,
        fileSize: file.size,
        fileId: uploadResult.fileId,
        contentSha1: uploadResult.contentSha1,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'upload du fichier',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});