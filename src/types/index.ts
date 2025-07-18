export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  joinDate: Date;
  uploads: number;
  downloads: number;
  isActive?: boolean;
  isSuspended?: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  classe: string;
  matiere: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  downloads: number;
  favorites: number;
  uploader: {
    id: string;
    name: string;
  };
  isFavorited?: boolean;
  fileData?: File; // Référence au fichier réel pour les nouveaux uploads
  documentUrl?: string; // URL du document stocké
  status?: 'pending' | 'approved' | 'rejected';
  submissionDate?: Date;
  approvalDate?: Date;
  rejectionDate?: Date;
  rejectionReason?: string;
  isOfficial?: boolean; // Indique si c'est un examen officiel MENFP
}

export interface FilterOptions {
  classe: string;
  matiere: string;
  sortBy: 'recent' | 'popular' | 'favorites';
  searchTerm: string;
}

export type ViewMode = 'bookshelf' | 'grid' | 'list';