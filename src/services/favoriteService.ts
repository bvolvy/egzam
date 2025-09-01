import { supabase } from '../lib/supabase';

export class FavoriteService {
  // Récupérer les favoris d'un utilisateur
  static async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('exam_id')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(fav => fav.exam_id);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      return [];
    }
  }

  // Ajouter un favori
  static async addFavorite(userId: string, examId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          exam_id: examId
        });

      return !error;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      return false;
    }
  }

  // Retirer un favori
  static async removeFavorite(userId: string, examId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('exam_id', examId);

      return !error;
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      return false;
    }
  }

  // Basculer un favori
  static async toggleFavorite(userId: string, examId: string): Promise<boolean> {
    try {
      // Vérifier si le favori existe déjà
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('exam_id', examId)
        .single();

      if (existing) {
        // Retirer le favori
        return await this.removeFavorite(userId, examId);
      } else {
        // Ajouter le favori
        return await this.addFavorite(userId, examId);
      }
    } catch (error) {
      console.error('Erreur lors du basculement du favori:', error);
      return false;
    }
  }
}