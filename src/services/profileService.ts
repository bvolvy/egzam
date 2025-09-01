import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface ProfileUpdate {
  name?: string;
  avatar_url?: string;
}

export class ProfileService {
  // Récupérer le profil d'un utilisateur
  static async getProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.avatar_url,
        isPremium: data.is_premium,
        joinDate: new Date(data.created_at),
        uploads: data.uploads_count,
        downloads: data.downloads_count,
        isActive: data.is_active,
        isSuspended: data.is_suspended
      };
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      return null;
    }
  }

  // Mettre à jour le profil
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return false;
    }
  }

  // Incrémenter les statistiques utilisateur
  static async incrementUserStats(userId: string, field: 'uploads_count' | 'downloads_count' | 'favorites_count'): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_user_stat', {
        user_id: userId,
        stat_field: field
      });

      return !error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
      return false;
    }
  }

  // Récupérer les examens uploadés par un utilisateur
  static async getUserUploads(userId: string): Promise<Exam[]> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          uploader:profiles(name)
        `)
        .eq('uploader_id', userId)
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
        status: exam.status as any
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des uploads:', error);
      return [];
    }
  }
}