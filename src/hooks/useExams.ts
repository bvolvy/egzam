import { useState, useEffect } from 'react';
import { Exam, FilterOptions } from '../types';
import { mockExams } from '../data/mockData';
import { favoritesStorage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { ExamService } from '../services/examService';

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
      const approvedExams = await ExamService.getApprovedExams();

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
      setExams(mockExams);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les examens en attente (admin seulement)
  const loadPendingExams = async () => {
    if (!user) {
      setPendingExams([]);
      return;
    }

    try {
      const pending = await ExamService.getPendingExams();
      setPendingExams(pending);
    } catch (err) {
      console.error('Erreur lors du chargement des examens en attente:', err);
      setPendingExams([]);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadExams();
  }, [user]);

  // Charger les examens en attente si connecté
  useEffect(() => {
    if (user) {
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
    try {
      const success = await ExamService.approveExam(examId);
      if (success) {
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
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      return false;
    }
  };

  // Rejeter un examen
  const rejectExam = async (examId: string, reason?: string) => {
    try {
      const success = await ExamService.rejectExam(examId, reason);
      if (success) {
        setPendingExams(prev => prev.filter(e => e.id !== examId));
      }
      return success;
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      return false;
    }
  };

  // Supprimer un examen
  const deleteExam = async (examId: string) => {
    try {
      const success = await ExamService.deleteExam(examId);
      if (success) {
        setExams(prev => prev.filter(e => e.id !== examId));
        setPendingExams(prev => prev.filter(e => e.id !== examId));
      }
      return success;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
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