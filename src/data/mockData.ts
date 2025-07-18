import { Exam } from '../types';
import { customDataStorage } from '../utils/storage';
import { getAllClasses, getAllMatieres } from './educationHierarchy';

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Devoir de Mathématiques - Fonctions',
    description: 'Évaluation sur les fonctions du second degré et leurs propriétés',
    classe: 'Terminale',
    matiere: 'Mathématiques',
    fileName: 'math_term_fonctions.pdf',
    fileSize: 2.5,
    uploadDate: new Date('2024-01-15'),
    downloads: 245,
    favorites: 34,
    uploader: { id: '1', name: 'Prof. Martin' },
    isFavorited: false,
    documentUrl: undefined // Pas de document réel pour les mocks
  },
  {
    id: '2',
    title: 'Contrôle de Physique - Mécanique',
    description: 'Exercices sur la cinématique et la dynamique',
    classe: 'Première',
    matiere: 'Physique-Chimie',
    fileName: 'physique_1ere_mecanique.pdf',
    fileSize: 1.8,
    uploadDate: new Date('2024-01-20'),
    downloads: 187,
    favorites: 28,
    uploader: { id: '2', name: 'Marie Dupont' },
    isFavorited: true,
    documentUrl: undefined
  },
  {
    id: '3',
    title: 'Évaluation Histoire - Révolution Française',
    description: 'Analyse des causes et conséquences de la Révolution de 1789',
    classe: 'Quatrième',
    matiere: 'Histoire-Géographie',
    fileName: 'histoire_4e_revolution.pdf',
    fileSize: 3.2,
    uploadDate: new Date('2024-01-25'),
    downloads: 156,
    favorites: 19,
    uploader: { id: '3', name: 'Mme Leblanc' },
    isFavorited: false,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '4',
    title: 'Test SVT - Système Nerveux',
    description: 'Questionnaire sur le fonctionnement du système nerveux',
    classe: 'Troisième',
    matiere: 'SVT',
    fileName: 'svt_3e_systeme_nerveux.pdf',
    fileSize: 2.1,
    uploadDate: new Date('2024-02-01'),
    downloads: 134,
    favorites: 22,
    uploader: { id: '4', name: 'Dr. Rousseau' },
    isFavorited: false,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '5',
    title: 'Devoir de Français - Analyse Littéraire',
    description: 'Étude de texte sur les œuvres du romantisme français',
    classe: 'Seconde',
    matiere: 'Français',
    fileName: 'francais_2nde_romantisme.pdf',
    fileSize: 2.8,
    uploadDate: new Date('2024-02-05'),
    downloads: 201,
    favorites: 31,
    uploader: { id: '5', name: 'Prof. Durand' },
    isFavorited: true
  },
  {
    id: '6',
    title: 'Contrôle Anglais - Grammar Test',
    description: 'Évaluation des temps verbaux et structures grammaticales',
    classe: 'Cinquième',
    matiere: 'Anglais',
    fileName: 'anglais_5e_grammar.pdf',
    fileSize: 1.5,
    uploadDate: new Date('2024-02-10'),
    downloads: 98,
    favorites: 15,
    uploader: { id: '6', name: 'Ms. Johnson' },
    isFavorited: false
  },
  {
    id: '7',
    title: 'Évaluation Espagnol - Conjugaison',
    description: 'Test sur les temps du passé en espagnol',
    classe: 'Terminale',
    matiere: 'Espagnol',
    fileName: 'espagnol_term_passe.pdf',
    fileSize: 1.9,
    uploadDate: new Date('2024-02-12'),
    downloads: 143,
    favorites: 18,
    uploader: { id: '7', name: 'Señora García' },
    isFavorited: false,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '8',
    title: 'Devoir de Chimie - Réactions Acide-Base',
    description: 'Exercices sur les équilibres chimiques et le pH',
    classe: 'Première',
    matiere: 'Physique-Chimie',
    fileName: 'chimie_1ere_ph.pdf',
    fileSize: 2.3,
    uploadDate: new Date('2024-02-15'),
    downloads: 176,
    favorites: 25,
    uploader: { id: '8', name: 'Prof. Lambert' },
    isFavorited: true
  },
  // Nouveaux examens ajoutés
  {
    id: '9',
    title: 'Examen de Géométrie - Triangles',
    description: 'Propriétés des triangles et théorèmes de géométrie plane',
    classe: 'Quatrième',
    matiere: 'Mathématiques',
    fileName: 'math_4e_triangles.pdf',
    fileSize: 2.0,
    uploadDate: new Date('2024-02-18'),
    downloads: 89,
    favorites: 12,
    uploader: { id: '9', name: 'Prof. Moreau' },
    isFavorited: false,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '10',
    title: 'Test de Français - Grammaire',
    description: 'Évaluation sur les classes grammaticales et fonctions',
    classe: 'Sixième',
    matiere: 'Français',
    fileName: 'francais_6e_grammaire.pdf',
    fileSize: 1.7,
    uploadDate: new Date('2024-02-20'),
    downloads: 67,
    favorites: 8,
    uploader: { id: '10', name: 'Mme Petit' },
    isFavorited: false
  },
  {
    id: '11',
    title: 'Contrôle Histoire - Moyen Âge',
    description: 'La société féodale et les croisades',
    classe: 'Cinquième',
    matiere: 'Histoire-Géographie',
    fileName: 'histoire_5e_moyen_age.pdf',
    fileSize: 2.9,
    uploadDate: new Date('2024-02-22'),
    downloads: 112,
    favorites: 16,
    uploader: { id: '11', name: 'M. Dubois' },
    isFavorited: true,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '12',
    title: 'Évaluation SVT - Reproduction',
    description: 'La reproduction humaine et la puberté',
    classe: 'Quatrième',
    matiere: 'SVT',
    fileName: 'svt_4e_reproduction.pdf',
    fileSize: 2.4,
    uploadDate: new Date('2024-02-25'),
    downloads: 145,
    favorites: 21,
    uploader: { id: '12', name: 'Dr. Blanc' },
    isFavorited: false,
    isOfficial: true // Marquer comme examen officiel
  },
  {
    id: '13',
    title: 'Devoir de Philosophie - Conscience',
    description: 'Dissertation sur la conscience et l\'inconscient',
    classe: 'Terminale',
    matiere: 'Philosophie',
    fileName: 'philo_term_conscience.pdf',
    fileSize: 3.1,
    uploadDate: new Date('2024-02-28'),
    downloads: 198,
    favorites: 29,
    uploader: { id: '13', name: 'Prof. Sage' },
    isFavorited: true
  },
  {
    id: '14',
    title: 'Test Anglais - Vocabulary',
    description: 'Évaluation du vocabulaire thématique et expressions',
    classe: 'Troisième',
    matiere: 'Anglais',
    fileName: 'anglais_3e_vocab.pdf',
    fileSize: 1.6,
    uploadDate: new Date('2024-03-02'),
    downloads: 78,
    favorites: 11,
    uploader: { id: '14', name: 'Mr. Smith' },
    isFavorited: false
  },
  {
    id: '15',
    title: 'Contrôle Physique - Électricité',
    description: 'Circuits électriques et loi d\'Ohm',
    classe: 'Troisième',
    matiere: 'Physique-Chimie',
    fileName: 'physique_3e_electricite.pdf',
    fileSize: 2.2,
    uploadDate: new Date('2024-03-05'),
    downloads: 156,
    favorites: 23,
    uploader: { id: '15', name: 'Prof. Volt' },
    isFavorited: false
  },
  {
    id: '16',
    title: 'Évaluation Économie - Marché',
    description: 'Mécanismes du marché et formation des prix',
    classe: 'Première',
    matiere: 'Économie',
    fileName: 'eco_1ere_marche.pdf',
    fileSize: 2.7,
    uploadDate: new Date('2024-03-08'),
    downloads: 134,
    favorites: 19,
    uploader: { id: '16', name: 'Prof. Euro' },
    isFavorited: true
  },
  {
    id: '17',
    title: 'Test de Géographie - Climats',
    description: 'Les différents climats mondiaux et leurs caractéristiques',
    classe: 'Sixième',
    matiere: 'Histoire-Géographie',
    fileName: 'geo_6e_climats.pdf',
    fileSize: 2.5,
    uploadDate: new Date('2024-03-10'),
    downloads: 92,
    favorites: 14,
    uploader: { id: '17', name: 'Mme Terre' },
    isFavorited: false
  },
  {
    id: '18',
    title: 'Devoir de Littérature - Poésie',
    description: 'Analyse de poèmes du XIXe siècle',
    classe: 'Première',
    matiere: 'Français',
    fileName: 'francais_1ere_poesie.pdf',
    fileSize: 2.1,
    uploadDate: new Date('2024-03-12'),
    downloads: 167,
    favorites: 26,
    uploader: { id: '18', name: 'Prof. Vers' },
    isFavorited: false
  },
  {
    id: '19',
    title: 'Contrôle Mathématiques - Probabilités',
    description: 'Calculs de probabilités et statistiques',
    classe: 'Seconde',
    matiere: 'Mathématiques',
    fileName: 'math_2nde_proba.pdf',
    fileSize: 1.9,
    uploadDate: new Date('2024-03-15'),
    downloads: 203,
    favorites: 32,
    uploader: { id: '19', name: 'Prof. Hasard' },
    isFavorited: true
  },
  {
    id: '20',
    title: 'Évaluation Arts - Renaissance',
    description: 'L\'art de la Renaissance italienne',
    classe: 'Seconde',
    matiere: 'Arts Plastiques',
    fileName: 'arts_2nde_renaissance.pdf',
    fileSize: 3.4,
    uploadDate: new Date('2024-03-18'),
    downloads: 85,
    favorites: 13,
    uploader: { id: '20', name: 'Prof. Pinceau' },
    isFavorited: false
  },
  {
    id: '21',
    title: 'Test SVT - Évolution',
    description: 'Théories de l\'évolution et sélection naturelle',
    classe: 'Terminale',
    matiere: 'SVT',
    fileName: 'svt_term_evolution.pdf',
    fileSize: 2.8,
    uploadDate: new Date('2024-03-20'),
    downloads: 189,
    favorites: 27,
    uploader: { id: '21', name: 'Dr. Darwin' },
    isFavorited: true
  },
  {
    id: '22',
    title: 'Contrôle Allemand - Déclinaisons',
    description: 'Les déclinaisons allemandes et cas grammaticaux',
    classe: 'Première',
    matiere: 'Allemand',
    fileName: 'allemand_1ere_declinaisons.pdf',
    fileSize: 1.8,
    uploadDate: new Date('2024-03-22'),
    downloads: 76,
    favorites: 9,
    uploader: { id: '22', name: 'Frau Schmidt' },
    isFavorited: false
  },
  {
    id: '23',
    title: 'Évaluation Musique - Baroque',
    description: 'Caractéristiques de la musique baroque',
    classe: 'Cinquième',
    matiere: 'Musique',
    fileName: 'musique_5e_baroque.pdf',
    fileSize: 2.0,
    uploadDate: new Date('2024-03-25'),
    downloads: 54,
    favorites: 7,
    uploader: { id: '23', name: 'Prof. Note' },
    isFavorited: false
  },
  {
    id: '24',
    title: 'Devoir de Chimie - Atomes',
    description: 'Structure atomique et classification périodique',
    classe: 'Seconde',
    matiere: 'Physique-Chimie',
    fileName: 'chimie_2nde_atomes.pdf',
    fileSize: 2.3,
    uploadDate: new Date('2024-03-28'),
    downloads: 142,
    favorites: 20,
    uploader: { id: '24', name: 'Prof. Mendeleïev' },
    isFavorited: false
  }
];

// Classes et matières du système hiérarchique
const defaultClasses = getAllClasses();
const defaultMatieres = getAllMatieres();

// Charger les classes et matières depuis le stockage
export let classes = customDataStorage.loadClasses(defaultClasses);
export let matieres = customDataStorage.loadMatieres(defaultMatieres);

// Fonctions pour gérer les classes et matières
export const addCustomClasse = (classe: string) => {
  if (!classes.includes(classe)) {
    classes.push(classe);
    customDataStorage.saveClasses(classes);
  }
};

export const addCustomMatiere = (matiere: string) => {
  if (!matieres.includes(matiere)) {
    matieres.push(matiere);
    customDataStorage.saveMatieres(matieres);
  }
};

export const removeCustomClasse = (classe: string) => {
  classes = classes.filter(c => c !== classe);
  customDataStorage.saveClasses(classes);
};

export const removeCustomMatiere = (matiere: string) => {
  matieres = matieres.filter(m => m !== matiere);
  customDataStorage.saveMatieres(matieres);
};

// Recharger les données personnalisées
export const reloadCustomData = () => {
  classes = customDataStorage.loadClasses(defaultClasses);
  matieres = customDataStorage.loadMatieres(defaultMatieres);
};
