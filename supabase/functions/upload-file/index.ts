import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!metadataStr) {
      return new Response(
        JSON.stringify({ error: 'Métadonnées manquantes' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const metadata = JSON.parse(metadataStr);

    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Seuls les fichiers PDF sont acceptés' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'Le fichier ne doit pas dépasser 10MB' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const timestamp = Date.now();
    const randomId = crypto.randomUUID().substring(0, 8);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${randomId}_${sanitizedFileName}`;
    const filePath = `exams/${uniqueFileName}`;

    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(fileArrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('exam-files')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Erreur upload Supabase Storage:', uploadError);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de l\'upload',
          details: uploadError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('exam-files')
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        fileUrl: publicUrl,
        fileName: uniqueFileName,
        originalFileName: file.name,
        fileSize: file.size,
        filePath: uploadData.path,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur dans upload-file:', error);

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