import { corsHeaders } from '../_shared/cors.ts';

interface BackblazeConfig {
  applicationKeyId: string;
  applicationKey: string;
  bucketName: string;
}

interface BackblazeAuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

const getBackblazeConfig = (): BackblazeConfig => {
  const applicationKeyId = Deno.env.get('BACKBLAZE_APPLICATION_KEY_ID');
  const applicationKey = Deno.env.get('BACKBLAZE_APPLICATION_KEY');
  const bucketName = Deno.env.get('BACKBLAZE_BUCKET_NAME');

  if (!applicationKeyId || !applicationKey || !bucketName) {
    throw new Error('Configuration Backblaze manquante');
  }

  return { applicationKeyId, applicationKey, bucketName };
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

Deno.serve(async (req: Request) => {
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

    const { fileName } = await req.json();

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'Nom de fichier requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const config = getBackblazeConfig();
    const authData = await authenticateWithBackblaze(config);

    // Générer une URL de téléchargement sécurisée (valide 1 heure)
    const downloadUrl = `${authData.downloadUrl}/file/${config.bucketName}/${fileName}`;

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl,
        expiresIn: 3600 // 1 heure
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la génération de l\'URL de téléchargement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});