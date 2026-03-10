import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

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

    const { fileName, examId } = await req.json();

    if (!fileName && !examId) {
      return new Response(
        JSON.stringify({ error: 'Nom de fichier ou ID examen requis' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configuration Supabase manquante');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let filePath = '';

    if (examId) {
      const { data: exam, error: dbError } = await supabase
        .from('exams')
        .select('file_path')
        .eq('id', examId)
        .maybeSingle();

      if (dbError || !exam?.file_path) {
        throw new Error('Examen non trouvé ou chemin de fichier manquant');
      }
      filePath = exam.file_path;
    } else {
      filePath = `exams/${fileName}`;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('exam-files')
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl: publicUrl,
        expiresIn: 3600
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