import { useState, useEffect } from 'react';
import { Exam, FilterOptions } from '../types';
import { mockExams } from '../data/mockData';
import { favoritesStorage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export const useExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [pendingExams, setPendingExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les examens approuvés
  const loadExams = async () => {
    try {
      setIsLoading(true);
      // Utiliser les données mock pour éviter les problèmes de base de données
      const approvedExams = mockExams;
      
      // Charger les favoris de l'utilisateur si connecté
      if (user) {
        const userFavorites = favoritesStorage.load();
        const examsWithFavorites = approvedExams.map(exam => ({
          ...exam,
          isFavorited: userFavorites.includes(exam.id)
        }));
        setExams(examsWithFavorites);
      } else {
        setExams(approvedExams);
      }
    } catch (err) {
      setError('Erreur lors du chargement des examens');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les examens en attente (admin seulement)
  const loadPendingExams = async () => {
    if (!user || user.email !== 'admin@egzamachiv.ht') {
      setPendingExams([]);
      return;
    }
    
    try {
      // Pour l'instant, pas d'examens en attente
      setPendingExams([]);
    } catch (err) {
      console.error('Erreur lors du chargement des examens en attente:', err);
      setPendingExams([]);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadExams();
  }, [user]);

  // Charger les examens en attente si admin
  useEffect(() => {
    if (user?.email === 'admin@egzamachiv.ht') {
      loadPendingExams();
    }
  }, [user]);

  // Gérer les favoris
  const handleFavorite = async (examId: string) => {
    if (!user) return;

    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    // Utiliser le stockage local pour les favoris
    const favorites = favoritesStorage.toggle(examId);
    const success = true;
    
    if (success) {
      setExams(prev => prev.map(e => 
        e.id === examId 
          ? { 
              ...e, 
              isFavorited: !e.isFavorited,
              favorites: e.isFavorited ? e.favorites - 1 : e.favorites + 1
            }
          : e
      ));
    }
  };

  // Gérer les téléchargements
  const handleDownload = async (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    try {
      // Mettre à jour le compteur localement
      setExams(prev => prev.map(e => 
        e.id === examId 
          ? { ...e, downloads: e.downloads + 1 }
          : e
      ));
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  // Approuver un examen
  const approveExam = async (examId: string) => {
    const success = true; // Simuler le succès
    if (success) {
      // Déplacer de pending vers approved
      const examToApprove = pendingExams.find(e => e.id === examId);
      if (examToApprove) {
        setPendingExams(prev => prev.filter(e => e.id !== examId));
        setExams(prev => [{
          ...examToApprove,
          status: 'approved' as const
        }, ...prev]);
      }
    }
    return success;
  };

  // Rejeter un examen
  const rejectExam = async (examId: string, reason?: string) => {
    const success = true; // Simuler le succès
    if (success) {
      setPendingExams(prev => prev.map(e => 
        e.id === examId 
          ? { ...e, status: 'rejected' as const }
          : e
      ));
    }
    return success;
  };

  // Supprimer un examen
  const deleteExam = async (examId: string) => {
    const success = true; // Simuler le succès
    if (success) {
      setExams(prev => prev.filter(e => e.id !== examId));
      setPendingExams(prev => prev.filter(e => e.id !== examId));
    }
    return success;
  };

  return {
    exams,
    pendingExams,
    isLoading,
    error,
    handleFavorite,
    handleDownload,
    approveExam,
    rejectExam,
    deleteExam,
    refreshExams: loadExams,
    refreshPendingExams: loadPendingExams
  };
};