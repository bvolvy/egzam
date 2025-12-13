import { supabase } from '../lib/supabase';
import { Exam } from '../types';

export interface ExamMetadata {
  title: string;
  description: string;
  classe: string;
  matiere: string;
  level: string;
  isOfficial?: boolean;
}

export interface UploadResult {
  success: boolean;
  examId?: string;
  error?: string;
}

export class ExamService {
  // Récupérer tous les examens approuvés
  static async getApprovedExams(): Promise<Exam[]> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          uploader:profiles(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(exam => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        classe: exam.classe,
        matiere: exam.matiere,
        fileName: exam.file_name,
        fileSize: exam.file_size,
        uploadDate: new Date(exam.created_at),
        downloads: exam.downloads_count,
        favorites: exam.favorites_count,
        uploader: {
          id: exam.uploader_id,
          name: exam.uploader?.name || 'Utilisateur'
        },
        isFavorited: false, // Sera mis à jour par le service des favoris
        documentUrl: exam.file_url,
        isOfficial: exam.is_official,
        level: exam.level,
        status: exam.status as 'approved'
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des examens:', error);
      return [];
    }
  }

  // Récupérer les examens en attente (admin seulement)
  static async getPendingExams(): Promise<Exam[]> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          uploader:profiles(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(exam => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        classe: exam.classe,
        matiere: exam.matiere,
        fileName: exam.file_name,
        fileSize: exam.file_size,
        uploadDate: new Date(exam.created_at),
        downloads: exam.downloads_count,
        favorites: exam.favorites_count,
        uploader: {
          id: exam.uploader_id,
          name: exam.uploader?.name || 'Utilisateur'
        },
        documentUrl: exam.file_url,
        isOfficial: exam.is_official,
        level: exam.level,
        status: exam.status as 'pending',
        submissionDate: new Date(exam.created_at)
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des examens en attente:', error);
      return [];
    }
  }

  // Upload d'un nouvel examen
  static async uploadExam(file: File, metadata: ExamMetadata): Promise<UploadResult> {
    try {
      // Vérifier l'authentification et obtenir le token JWT
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const token = session.access_token;

      // Préparer les données pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      // Upload vers edge function
      const uploadResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-file`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        return { success: false, error: errorData.error || 'Erreur lors de l\'upload' };
      }

      const uploadResult = await uploadResponse.json();

      // Sauvegarder les métadonnées dans Supabase
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .insert({
          title: metadata.title,
          description: metadata.description,
          classe: metadata.classe,
          matiere: metadata.matiere,
          level: metadata.level,
          file_name: uploadResult.originalFileName,
          file_size: uploadResult.fileSize,
          file_url: uploadResult.fileUrl,
          uploader_id: session.user.id,
          is_official: metadata.isOfficial || metadata.level === 'officiel',
          status: 'pending'
        })
        .select()
        .single();

      if (examError) {
        console.error('Erreur lors de la sauvegarde des métadonnées:', examError);
        return { success: false, error: 'Erreur lors de la sauvegarde' };
      }

      return { success: true, examId: examData.id };

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  // Approuver un examen (admin seulement)
  static async approveExam(examId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exams')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', examId);

      return !error;
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      return false;
    }
  }

  // Rejeter un examen (admin seulement)
  static async rejectExam(examId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exams')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', examId);

      return !error;
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      return false;
    }
  }

  // Supprimer un examen
  static async deleteExam(examId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      return !error;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  // Enregistrer un téléchargement
  static async recordDownload(examId: string, userId?: string): Promise<void> {
    try {
      await supabase
        .from('downloads')
        .insert({
          exam_id: examId,
          user_id: userId || null,
          ip_address: 'unknown', // En production, récupérer la vraie IP
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du téléchargement:', error);
    }
  }

  // Générer une URL de téléchargement sécurisée
  static async generateDownloadUrl(fileName: string): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-download-url`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'URL');
      }

      const result = await response.json();
      return result.downloadUrl;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'URL:', error);
      return null;
    }
  }
}