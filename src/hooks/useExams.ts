import { useState, useEffect } from 'react';
import { Exam, FilterOptions } from '../types';
import { ExamService } from '../services/examService';
import { FavoriteService } from '../services/favoriteService';
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
      const approvedExams = await ExamService.getApprovedExams();
      
      // Charger les favoris de l'utilisateur si connecté
      if (user) {
        const userFavorites = await FavoriteService.getUserFavorites(user.id);
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
    if (!user || user.email !== 'admin@egzamachiv.ht') return;
    
    try {
      const pending = await ExamService.getPendingExams();
      setPendingExams(pending);
    } catch (err) {
      console.error('Erreur lors du chargement des examens en attente:', err);
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

    const success = await FavoriteService.toggleFavorite(user.id, examId);
    
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
      // Enregistrer le téléchargement
      await ExamService.recordDownload(examId, user?.id);
      
      // Générer l'URL de téléchargement sécurisée
      const fileName = exam.documentUrl?.split('/').pop();
      if (fileName) {
        const downloadUrl = await ExamService.generateDownloadUrl(fileName);
        
        if (downloadUrl) {
          // Déclencher le téléchargement
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = exam.fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Mettre à jour le compteur localement
          setExams(prev => prev.map(e => 
            e.id === examId 
              ? { ...e, downloads: e.downloads + 1 }
              : e
          ));
        }
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  // Approuver un examen
  const approveExam = async (examId: string) => {
    const success = await ExamService.approveExam(examId);
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
    const success = await ExamService.rejectExam(examId, reason);
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
    const success = await ExamService.deleteExam(examId);
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