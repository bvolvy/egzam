// Utilitaires pour la persistance des données dans localStorage

const STORAGE_KEYS = {
  USER: 'egzamachiv_user',
  EXAMS: 'egzamachiv_exams',
  CLASSES: 'egzamachiv_classes',
  MATIERES: 'egzamachiv_matieres',
  USER_PREFERENCES: 'egzamachiv_preferences',
  FAVORITES: 'egzamachiv_favorites',
  UPLOADS: 'egzamachiv_uploads',
  USER_STATS: 'egzamachiv_user_stats'
} as const;

// Interface pour les préférences utilisateur
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  notificationsEnabled: boolean;
  autoSave: boolean;
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
}

// Fonctions génériques de stockage
export const storage = {
  // Sauvegarder des données
  set: <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },

  // Récupérer des données
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return defaultValue;
    }
  },

  // Supprimer des données
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  },

  // Vider tout le stockage
  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }
};

// Fonctions spécifiques pour les examens
export const examStorage = {
  save: (exams: any[]) => {
    // Nettoyer les objets File avant la sauvegarde car ils ne peuvent pas être sérialisés
    const cleanedExams = exams.map(exam => {
      const { fileData, ...examWithoutFile } = exam;
      return examWithoutFile;
    });
    storage.set(STORAGE_KEYS.EXAMS, cleanedExams);
  },

  load: (defaultExams: any[] = []) => {
    const exams = storage.get(STORAGE_KEYS.EXAMS, defaultExams);
    // Convertir les dates string en objets Date après récupération du localStorage
    return exams.map((exam: any) => ({
      ...exam,
      uploadDate: exam.uploadDate ? new Date(exam.uploadDate) : new Date(),
      // Convertir aussi d'autres dates si elles existent
      createdAt: exam.createdAt ? new Date(exam.createdAt) : undefined,
      updatedAt: exam.updatedAt ? new Date(exam.updatedAt) : undefined
    }));
  },

  addExam: (exam: any) => {
    const exams = examStorage.load();
    const updatedExams = [exam, ...exams];
    examStorage.save(updatedExams);
    return updatedExams;
  },

  updateExam: (examId: string, updates: Partial<any>) => {
    const exams = examStorage.load();
    const updatedExams = exams.map((exam: any) => 
      exam.id === examId ? { ...exam, ...updates } : exam
    );
    examStorage.save(updatedExams);
    return updatedExams;
  },

  removeExam: (examId: string) => {
    const exams = examStorage.load();
    const updatedExams = exams.filter((exam: any) => exam.id !== examId);
    examStorage.save(updatedExams);
    return updatedExams;
  }
};

// Fonctions pour les examens en attente
export const pendingExamStorage = {
  save: (pendingExams: any[]) => {
    // Nettoyer les objets File avant la sauvegarde
    const cleanedExams = pendingExams.map(exam => {
      const { fileData, ...examWithoutFile } = exam;
      return examWithoutFile;
    });
    storage.set('egzamachiv_pending_exams', cleanedExams);
  },

  load: (defaultExams: any[] = []) => {
    const exams = storage.get('egzamachiv_pending_exams', defaultExams);
    return exams.map((exam: any) => ({
      ...exam,
      uploadDate: exam.uploadDate ? new Date(exam.uploadDate) : new Date(),
      submissionDate: exam.submissionDate ? new Date(exam.submissionDate) : new Date(),
      approvalDate: exam.approvalDate ? new Date(exam.approvalDate) : undefined,
      rejectionDate: exam.rejectionDate ? new Date(exam.rejectionDate) : undefined
    }));
  },

  approve: (examId: string) => {
    const pending = pendingExamStorage.load();
    const updated = pending.map((exam: any) => 
      exam.id === examId 
        ? { ...exam, status: 'approved', approvalDate: new Date() }
        : exam
    );
    pendingExamStorage.save(updated);
    return updated;
  },

  reject: (examId: string, reason?: string) => {
    const pending = pendingExamStorage.load();
    const updated = pending.map((exam: any) => 
      exam.id === examId 
        ? { ...exam, status: 'rejected', rejectionDate: new Date(), rejectionReason: reason }
        : exam
    );
    pendingExamStorage.save(updated);
    return updated;
  },

  remove: (examId: string) => {
    const pending = pendingExamStorage.load();
    const updated = pending.filter((exam: any) => exam.id !== examId);
    pendingExamStorage.save(updated);
    return updated;
  }
};

// Fonctions pour les favoris
export const favoritesStorage = {
  save: (favorites: string[]) => {
    storage.set(STORAGE_KEYS.FAVORITES, favorites);
  },

  load: (): string[] => {
    return storage.get(STORAGE_KEYS.FAVORITES, []);
  },

  add: (examId: string) => {
    const favorites = favoritesStorage.load();
    if (!favorites.includes(examId)) {
      const updated = [...favorites, examId];
      favoritesStorage.save(updated);
      return updated;
    }
    return favorites;
  },

  remove: (examId: string) => {
    const favorites = favoritesStorage.load();
    const updated = favorites.filter(id => id !== examId);
    favoritesStorage.save(updated);
    return updated;
  },

  toggle: (examId: string) => {
    const favorites = favoritesStorage.load();
    if (favorites.includes(examId)) {
      return favoritesStorage.remove(examId);
    } else {
      return favoritesStorage.add(examId);
    }
  }
};

// Fonctions pour les classes et matières personnalisées
export const customDataStorage = {
  saveClasses: (classes: string[]) => {
    storage.set(STORAGE_KEYS.CLASSES, classes);
  },

  loadClasses: (defaultClasses: string[] = []) => {
    return storage.get(STORAGE_KEYS.CLASSES, defaultClasses);
  },

  saveMatieres: (matieres: string[]) => {
    storage.set(STORAGE_KEYS.MATIERES, matieres);
  },

  loadMatieres: (defaultMatieres: string[] = []) => {
    return storage.get(STORAGE_KEYS.MATIERES, defaultMatieres);
  }
};

// Fonctions pour les préférences utilisateur
export const preferencesStorage = {
  save: (preferences: Partial<UserPreferences>) => {
    const current = preferencesStorage.load();
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
    return updated;
  },

  load: (): UserPreferences => {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      language: 'fr',
      notificationsEnabled: true,
      autoSave: true,
      defaultView: 'grid',
      itemsPerPage: 24
    });
  },

  reset: () => {
    storage.remove(STORAGE_KEYS.USER_PREFERENCES);
    return preferencesStorage.load();
  }
};

// Fonctions pour les uploads utilisateur
export const uploadsStorage = {
  save: (uploads: any[]) => {
    storage.set(STORAGE_KEYS.UPLOADS, uploads);
  },

  load: (): any[] => {
    return storage.get(STORAGE_KEYS.UPLOADS, []);
  },

  add: (upload: any) => {
    const uploads = uploadsStorage.load();
    const updated = [upload, ...uploads];
    uploadsStorage.save(updated);
    return updated;
  },

  remove: (uploadId: string) => {
    const uploads = uploadsStorage.load();
    const updated = uploads.filter((upload: any) => upload.id !== uploadId);
    uploadsStorage.save(updated);
    return updated;
  }
};

// Fonctions pour les statistiques utilisateur
export const userStatsStorage = {
  init: (userId: string) => {
    const stats = {
      uploads: 0,
      downloads: 0,
      favorites: 0,
      lastActivity: new Date().toISOString()
    };
    storage.set(`${STORAGE_KEYS.USER_STATS}_${userId}`, stats);
    return stats;
  },

  load: (userId: string) => {
    return storage.get(`${STORAGE_KEYS.USER_STATS}_${userId}`, {
      uploads: 0,
      downloads: 0,
      favorites: 0,
      lastActivity: new Date().toISOString()
    });
  },

  save: (userId: string, stats: any) => {
    const updatedStats = {
      ...stats,
      lastActivity: new Date().toISOString()
    };
    storage.set(`${STORAGE_KEYS.USER_STATS}_${userId}`, updatedStats);
    return updatedStats;
  },

  increment: (userId: string, field: 'uploads' | 'downloads' | 'favorites') => {
    const stats = userStatsStorage.load(userId);
    stats[field] += 1;
    return userStatsStorage.save(userId, stats);
  },

  decrement: (userId: string, field: 'uploads' | 'downloads' | 'favorites') => {
    const stats = userStatsStorage.load(userId);
    if (stats[field] > 0) {
      stats[field] -= 1;
    }
    return userStatsStorage.save(userId, stats);
  }
};
// Hook pour la synchronisation automatique
export const useAutoSave = (data: any, key: string, delay: number = 1000) => {
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      storage.set(key, data);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, key, delay]);
};

// Fonction d'initialisation pour charger toutes les données au démarrage
export const initializeStorage = () => {
  try {
    // Vérifier si c'est la première visite
    const isFirstVisit = !localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    
    if (isFirstVisit) {
      // Initialiser les préférences par défaut
      preferencesStorage.save({});
      console.log('🎉 Première visite - Préférences initialisées');
    }

    // Charger les données existantes
    const preferences = preferencesStorage.load();
    const favorites = favoritesStorage.load();
    const uploads = uploadsStorage.load();

    console.log('📦 Données chargées depuis le stockage local:', {
      preferences,
      favoritesCount: favorites.length,
      uploadsCount: uploads.length
    });

    return {
      preferences,
      favorites,
      uploads,
      isFirstVisit
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du stockage:', error);
    return {
      preferences: preferencesStorage.load(),
      favorites: [],
      uploads: [],
      isFirstVisit: true
    };
  }
};

// Fonction de nettoyage pour supprimer les données anciennes
export const cleanupStorage = (daysOld: number = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Nettoyer les uploads anciens
    const uploads = uploadsStorage.load();
    const recentUploads = uploads.filter((upload: any) => {
      const uploadDate = new Date(upload.uploadDate);
      return uploadDate > cutoffDate;
    });

    if (recentUploads.length !== uploads.length) {
      uploadsStorage.save(recentUploads);
      console.log(`🧹 Nettoyage: ${uploads.length - recentUploads.length} uploads anciens supprimés`);
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
};

export { STORAGE_KEYS };