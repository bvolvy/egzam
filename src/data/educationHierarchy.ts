// Système éducatif haïtien hiérarchique
export interface EducationLevel {
  id: string;
  name: string;
  icon: string;
  description: string;
  classes: string[];
  matieres: string[];
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const educationLevels: EducationLevel[] = [
  {
    id: 'secondaire',
    name: 'Secondaire',
    icon: '🎒',
    description: 'Enseignement fondamental et secondaire (6e AF à Philo)',
    classes: [
      '6e AF',
      '7e AF', 
      '8e AF',
      '9e AF',
      '3e Sec. [NS1]',
      '2nde [NS2]',
      'Rhéto [NS3]',
      'Philo [NS4]'
    ],
    matieres: [
      'Français',
      'Créole',
      'Anglais',
      'Espagnol',
      'Mathématiques',
      'Physique',
      'Chimie',
      'Physique-Chimie',
      'Biologie',
      'Géologie',
      'SVT',
      'Sciences expérimentales',
      'Sciences sociales',
      'Histoire-Géographie',
      'Informatique',
      'Littératures',
      'Philosophie',
      'Economie',
      'Sociologie',
      'Arts et Musique',
      'EC',
      'EEA',
      'EPS',
      'ETAP'
    ],
    color: {
      primary: 'blue',
      secondary: 'blue-50',
      accent: 'blue-600'
    }
  },
  {
    id: 'officiel',
    name: 'Examens officiels',
    icon: '📋',
    description: 'Examens d\'État du MENFP',
    classes: [
      '6e AF',
      '9e AF',
      'Rhéto [NS3]',
      'Philo [NS4]'
    ],
    matieres: [
      'Français',
      'Créole',
      'Anglais',
      'Espagnol',
      'Mathématiques',
      'Physique',
      'Chimie',
      'Physique-Chimie',
      'Biologie',
      'Géologie',
      'SVT',
      'Sciences expérimentales',
      'Sciences sociales',
      'Histoire-Géographie',
      'Informatique',
      'Littératures',
      'Philosophie',
      'Economie',
      'Sociologie',
      'Arts et Musique',
      'EC',
      'EEA',
      'EPS',
      'ETAP'
    ],
    color: {
      primary: 'red',
      secondary: 'red-50',
      accent: 'red-600'
    }
  },
  {
    id: 'universite',
    name: 'Université',
    icon: '🎓',
    description: 'Enseignement supérieur et recherche',
    classes: [
      'Préparatoire',
      'DUT1',
      'DUT2',
      'Bac + 1 (L1)',
      'Bac + 2 (L2)',
      'Bac + 3 (L3)',
      'Master 1 (M1)',
      'Master 2 (M2)',
      'Doctorat'
    ],
    matieres: [
      'Médecine & Santé',
      'Mathématiques',
      'Physique',
      'Chimie',
      'Biologie',
      'Informatique',
      'Génie informatique',
      'Génie civil',
      'Génie électrique',
      'Génie mécanique',
      'Droit',
      'Relations internationales',
      'Sciences politiques',
      'Lettres & Langues',
      'Communication & Journalisme',
      'Sciences de l\'éducation',
      'Économie',
      'Gestion & Administration',
      'Comptabilité & Finance',
      'Marketing',
      'Agronomie & Environnement',
      'Architecture & Design',
      'Sociologie',
      'Anthropologie',
      'Psychologie',
      'Histoire',
      'Philosophie',
      'Théologie'
    ],
    color: {
      primary: 'purple',
      secondary: 'purple-50',
      accent: 'purple-600'
    }
  },
  {
    id: 'technique',
    name: 'Professionnel',
    icon: '🛠️',
    description: 'Formation technique et professionnelle',
    classes: [
      'CQP',
      'CAP',
      'BTP',
      'BTS'
    ],
    matieres: [
      'Électricité',
      'Mécanique',
      'Maintenance industrielle',
      'Construction & Bâtiment',
      'Informatique Bureautique',
      'Couture & Stylisme',
      'Cuisine & Pâtisserie',
      'Hôtellerie',
      'Coiffure & Esthétique',
      'Soins corporels',
      'Secrétariat',
      'Comptabilité',
      'Marketing',
      'Gestion de PME',
      'Agriculture',
      'Sécurité & Secourisme'
    ],
    color: {
      primary: 'orange',
      secondary: 'orange-50',
      accent: 'orange-600'
    }
  }
];

// Fonction pour obtenir toutes les classes
export const getAllClasses = (): string[] => {
  return educationLevels.reduce((acc, level) => {
    return [...acc, ...level.classes];
  }, [] as string[]);
};

// Fonction pour obtenir toutes les matières
export const getAllMatieres = (): string[] => {
  return educationLevels.reduce((acc, level) => {
    return [...acc, ...level.matieres];
  }, [] as string[]);
};

// Fonction pour obtenir les classes d'un niveau
export const getClassesByLevel = (levelId: string): string[] => {
  const level = educationLevels.find(l => l.id === levelId);
  return level ? level.classes : [];
};

// Fonction pour obtenir les matières d'un niveau
export const getMatieresByLevel = (levelId: string): string[] => {
  const level = educationLevels.find(l => l.id === levelId);
  return level ? level.matieres : [];
};

// Fonction pour obtenir le niveau d'une classe
export const getLevelByClasse = (classe: string): EducationLevel | null => {
  return educationLevels.find(level => level.classes.includes(classe)) || null;
};

// Fonction pour obtenir le niveau d'une matière
export const getLevelByMatiere = (matiere: string): EducationLevel | null => {
  return educationLevels.find(level => level.matieres.includes(matiere)) || null;
};