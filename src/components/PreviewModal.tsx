import React, { useState, useEffect } from 'react';
import { X, Download, Heart, User, Calendar, FileText, ZoomIn, ZoomOut, RotateCw, Maximize2, AlertTriangle } from 'lucide-react';
import { Exam } from '../types';

interface PreviewModalProps {
  exam: Exam;
  onClose: () => void;
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ exam, onClose, onDownload, onFavorite }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [error, setError] = useState<string>('');

  // Simulation du contenu du document
  const totalPages = Math.floor(exam.fileSize * 2) + 1; // Estimation basée sur la taille

  // Charger le contenu réel du document
  useEffect(() => {
    const loadDocumentContent = async () => {
      setIsLoadingContent(true);
      setError('');
      
      try {
        // Créer un PDF réaliste basé sur les données de l'examen
        const pdfContent = generateRealisticPDF(exam);
        
        // Créer un blob PDF
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
      } catch (error) {
        console.error('Erreur lors du chargement du document:', error);
        setError('Impossible de charger le document. Le fichier pourrait être corrompu.');
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadDocumentContent();

    // Nettoyer l'URL lors du démontage
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [exam]);

  const generateRealisticPDF = (exam: Exam) => {
    // Générer un contenu PDF plus réaliste basé sur les données de l'examen
    const content = generateExamContent(exam);
    
    // Structure PDF basique mais fonctionnelle
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
/F2 6 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${content.length + 200}
>>
stream
BT
/F1 18 Tf
50 750 Td
(${exam.matiere.toUpperCase()} - ${exam.classe}) Tj
0 -25 Td
/F2 14 Tf
(${exam.title}) Tj
0 -40 Td
/F1 10 Tf
(Nom: _________________________ Prenom: _________________________) Tj
0 -20 Td
(Classe: ${exam.classe}                    Date: _____________) Tj
0 -40 Td
${content.split('\n').map((line, index) => {
  const yPos = 650 - (index * 15);
  if (yPos < 50) return ''; // Éviter de sortir de la page
  return `0 -15 Td\n(${line.replace(/[()\\]/g, '\\$&')}) Tj`;
}).join('\n')}
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${(600 + content.length).toString().padStart(3, '0')} 00000 n 
0000000${(700 + content.length).toString().padStart(3, '0')} 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
${800 + content.length}
%%EOF`;

    return pdfContent;
  };

  const generateExamContent = (exam: Exam) => {
    const templates = {
      'Mathématiques': [
        'INSTRUCTIONS:',
        '• Duree de l\'epreuve: 2 heures',
        '• Repondez a toutes les questions',
        '• Utilisez un stylo bleu ou noir',
        '• Les calculatrices sont autorisees',
        '• Justifiez vos reponses',
        '',
        'EXERCICE 1: (5 points)',
        'Resolvez l\'equation suivante en detaillant vos calculs:',
        '2x² + 5x - 3 = 0',
        '',
        'EXERCICE 2: (7 points)',
        'Soit f(x) = x² - 4x + 3',
        'a) Determinez les racines de f(x)',
        'b) Tracez la courbe representative',
        'c) Etudiez le signe de f(x)',
        '',
        'EXERCICE 3: (8 points)',
        'Un triangle ABC a pour cotes:',
        'AB = 5 cm, BC = 12 cm, AC = 13 cm',
        'a) Montrez que ce triangle est rectangle',
        'b) Calculez son aire et son perimetre',
        'c) Determinez les angles du triangle'
      ],
      'Français': [
        'CONSIGNES:',
        '• Duree: 2 heures',
        '• Repondez sur votre copie',
        '• Soignez votre ecriture',
        '• Relisez-vous attentivement',
        '',
        'I. COMPREHENSION DE TEXTE (10 points)',
        '',
        'Lisez attentivement le texte suivant:',
        '',
        '« L\'education est l\'arme la plus puissante qu\'on puisse utiliser',
        'pour changer le monde. Elle transforme non seulement',
        'l\'individu, mais aussi la societe tout entiere. »',
        '',
        'Questions:',
        '1. Expliquez le sens de cette citation (3 points)',
        '2. Donnez votre opinion personnelle (4 points)',
        '3. Proposez des exemples concrets (3 points)',
        '',
        'II. EXPRESSION ECRITE (10 points)',
        '',
        'Redigez un texte de 200 mots sur le theme:',
        '« L\'importance de l\'education en Haiti »'
      ],
      'Histoire-Géographie': [
        'PARTIE I: HISTOIRE (10 points)',
        '',
        'Question 1: (4 points)',
        'Expliquez les causes de l\'independance d\'Haiti en 1804.',
        'Votre reponse doit mentionner:',
        '- Le contexte de l\'esclavage',
        '- Le role de Toussaint Louverture',
        '- L\'action de Jean-Jacques Dessalines',
        '',
        'Question 2: (6 points)',
        'Analysez l\'impact de l\'independance haitienne',
        'sur les autres colonies des Ameriques.',
        '',
        'PARTIE II: GEOGRAPHIE (10 points)',
        '',
        'Question 3: (5 points)',
        'Decrivez le relief et le climat d\'Haiti.',
        '',
        'Question 4: (5 points)',
        'Quels sont les principaux defis environnementaux',
        'auxquels fait face Haiti aujourd\'hui?'
      ],
      'SVT': [
        'CONSIGNES:',
        '• Duree: 1h30',
        '• Repondez directement sur le sujet',
        '• Utilisez le vocabulaire scientifique approprie',
        '',
        'EXERCICE 1: Le systeme digestif (8 points)',
        '',
        '1. Nommez les organes du tube digestif (3 points)',
        '2. Expliquez le role de l\'estomac (2 points)',
        '3. Decrivez la digestion des lipides (3 points)',
        '',
        'EXERCICE 2: La respiration (7 points)',
        '',
        '1. Schematisez l\'appareil respiratoire (3 points)',
        '2. Expliquez les echanges gazeux (4 points)',
        '',
        'EXERCICE 3: Questions courtes (5 points)',
        '',
        '1. Qu\'est-ce que la photosynthese?',
        '2. Citez 3 sources d\'energie renouvelable',
        '3. Definissez l\'ecosysteme'
      ],
      'Physique-Chimie': [
        'PARTIE PHYSIQUE (10 points)',
        '',
        'Exercice 1: Mecanique (5 points)',
        'Un mobile se deplace a vitesse constante v = 20 m/s.',
        '1. Calculez la distance parcourue en 5 minutes',
        '2. Representez graphiquement x = f(t)',
        '',
        'Exercice 2: Electricite (5 points)',
        'Dans un circuit serie, on a:',
        '- Resistance R = 100 Ω',
        '- Tension U = 12 V',
        'Calculez l\'intensite du courant.',
        '',
        'PARTIE CHIMIE (10 points)',
        '',
        'Exercice 3: Atomes et molecules (5 points)',
        '1. Donnez la formule de l\'eau',
        '2. Combien d\'atomes contient une molecule d\'eau?',
        '',
        'Exercice 4: Reactions chimiques (5 points)',
        'Equilibrez l\'equation:',
        'Fe + O₂ → Fe₂O₃'
      ]
    };

    const template = templates[exam.matiere as keyof typeof templates] || templates['Mathématiques'];
    return template.join('\n');
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getMatiereColor = (matiere: string) => {
    const colors = {
      'Mathématiques': 'bg-blue-100 text-blue-800 border-blue-200',
      'Français': 'bg-purple-100 text-purple-800 border-purple-200',
      'Histoire-Géographie': 'bg-amber-100 text-amber-800 border-amber-200',
      'SVT': 'bg-green-100 text-green-800 border-green-200',
      'Physique-Chimie': 'bg-red-100 text-red-800 border-red-200',
      'Anglais': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Espagnol': 'bg-orange-100 text-orange-800 border-orange-200',
      'Allemand': 'bg-gray-100 text-gray-800 border-gray-200',
      'Philosophie': 'bg-pink-100 text-pink-800 border-pink-200',
      'Économie': 'bg-teal-100 text-teal-800 border-teal-200',
      'Arts Plastiques': 'bg-violet-100 text-violet-800 border-violet-200',
      'Musique': 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colors[matiere as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownloadClick = () => {
    if (pdfUrl) {
      // Utiliser le PDF généré pour le téléchargement
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = exam.fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mettre à jour le compteur
      onDownload(exam.id);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-7xl w-full max-h-[95vh]'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-red-50">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Prévisualisation</h2>
              <p className="text-sm text-gray-600">{exam.fileName}</p>
            </div>
          </div>
          
          {/* Contrôles de prévisualisation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rotation"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Plein écran"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar avec informations */}
          {!isFullscreen && (
            <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Informations du document */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {exam.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                      {exam.classe}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getMatiereColor(exam.matiere)}`}>
                      {exam.matiere}
                    </span>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Auteur :</span>
                      <span className="ml-1 font-medium">{exam.uploader.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Date :</span>
                      <span className="ml-1">{formatDate(exam.uploadDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Taille :</span>
                      <span className="ml-1">{Math.round(exam.fileSize * 10) / 10} MB</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Téléchargements :</span>
                      <span className="ml-1">{exam.downloads}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation des pages */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Navigation</h4>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      Précédent
                    </button>
                    <span className="text-sm font-medium">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onFavorite(exam.id)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      exam.isFavorited
                        ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${exam.isFavorited ? 'fill-current' : ''}`} />
                    <span className="font-medium">
                      {exam.isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </span>
                    <span className="text-sm">({exam.favorites})</span>
                  </button>

                  <button
                    onClick={handleDownloadClick}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    <span className="font-medium">Télécharger</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visionneuse de document */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
            {isLoadingContent ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement du document...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="w-full h-full p-4">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border border-gray-300 rounded-lg shadow-lg"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                  title={`Prévisualisation de ${exam.title}`}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun contenu à afficher</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre de navigation en bas (mode plein écran) */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                ←
              </button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                →
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <button
                onClick={handleDownloadClick}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span className="text-sm">Télécharger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;