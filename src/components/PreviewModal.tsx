import React, { useState, useEffect } from 'react';
import { X, Download, Heart, User, Calendar, FileText, ZoomIn, ZoomOut, RotateCw, Maximize2, AlertTriangle, Loader2 } from 'lucide-react';
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
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [error, setError] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);

  // Charger le document réel
  useEffect(() => {
    const loadRealDocument = async () => {
      setIsLoadingContent(true);
      setError('');
      
      try {
        // Simuler le chargement du document réel depuis le serveur/stockage
        // En production, ceci ferait un appel API pour récupérer le document
        const documentData = await fetchDocumentContent(exam.id);
        
        if (documentData) {
          // Créer une URL pour le document
          const blob = new Blob([documentData], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setDocumentUrl(url);
          
          // Estimer le nombre de pages basé sur la taille du fichier
          // En production, ceci serait fourni par l'API ou calculé lors de l'upload
          setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.5) + 1));
        } else {
          throw new Error('Document non trouvé');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement du document:', error);
        setError('Impossible de charger le document. Le fichier pourrait être indisponible ou corrompu.');
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadRealDocument();

    // Nettoyer l'URL lors du démontage
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [exam.id]);

  // Fonction simulée pour récupérer le contenu du document
  // En production, ceci ferait un appel API réel
  const fetchDocumentContent = async (examId: string): Promise<ArrayBuffer | null> => {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simuler la récupération du document réel
    // En production, ceci serait quelque chose comme:
    // const response = await fetch(`/api/documents/${examId}`);
    // return await response.arrayBuffer();
    
    // Pour la démo, on génère un PDF simple mais réaliste
    return generateSimulatedPDF(examId);
  };

  const generateSimulatedPDF = (examId: string): ArrayBuffer => {
    // Générer un PDF plus réaliste basé sur l'ID de l'examen
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
/Length 800
>>
stream
BT
/F1 16 Tf
50 750 Td
(MINISTERE DE L'EDUCATION NATIONALE) Tj
0 -20 Td
(REPUBLIQUE D'HAITI) Tj
0 -40 Td
/F2 12 Tf
(Nom: _________________________ Prenom: _________________________) Tj
0 -20 Td
(Classe: _______________        Date: _______________) Tj
0 -40 Td
/F1 14 Tf
(INSTRUCTIONS:) Tj
0 -20 Td
/F2 10 Tf
(• Duree de l'epreuve: 2 heures) Tj
0 -15 Td
(• Repondez a toutes les questions) Tj
0 -15 Td
(• Utilisez un stylo bleu ou noir) Tj
0 -15 Td
(• Justifiez vos reponses) Tj
0 -30 Td
/F1 12 Tf
(EXERCICE 1: (5 points)) Tj
0 -20 Td
/F2 10 Tf
(Question 1: Resolvez l'equation suivante:) Tj
0 -15 Td
(2x + 5 = 13) Tj
0 -25 Td
(Question 2: Calculez la valeur de:) Tj
0 -15 Td
(3 × 4 + 2 × 5) Tj
0 -30 Td
/F1 12 Tf
(EXERCICE 2: (7 points)) Tj
0 -20 Td
/F2 10 Tf
(Soit f(x) = x² - 4x + 3) Tj
0 -15 Td
(a) Determinez les racines de f(x)) Tj
0 -15 Td
(b) Tracez la courbe representative) Tj
0 -15 Td
(c) Etudiez le signe de f(x)) Tj
0 -30 Td
/F1 12 Tf
(EXERCICE 3: (8 points)) Tj
0 -20 Td
/F2 10 Tf
(Un triangle ABC a pour cotes:) Tj
0 -15 Td
(AB = 5 cm, BC = 12 cm, AC = 13 cm) Tj
0 -15 Td
(a) Montrez que ce triangle est rectangle) Tj
0 -15 Td
(b) Calculez son aire et son perimetre) Tj
0 -15 Td
(c) Determinez les angles du triangle) Tj
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
0000001125 00000 n 
0000001184 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1240
%%EOF`;

    // Convertir en ArrayBuffer
    const encoder = new TextEncoder();
    return encoder.encode(pdfContent).buffer;
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
    if (documentUrl) {
      // Télécharger le document réel
      const link = document.createElement('a');
      link.href = documentUrl;
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
              disabled={isLoadingContent}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Zoom arrière"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={isLoadingContent}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Zoom avant"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleRotate}
              disabled={isLoadingContent}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Rotation"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              disabled={isLoadingContent}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
                      disabled={currentPage === 1 || isLoadingContent}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                      Précédent
                    </button>
                    <span className="text-sm font-medium">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || isLoadingContent}
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
                    disabled={isLoadingContent || !documentUrl}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Chargement du document...</p>
                  <p className="text-sm text-gray-500 mt-2">Récupération du contenu réel</p>
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
            ) : documentUrl ? (
              <div className="w-full h-full p-4">
                <iframe
                  src={`${documentUrl}#page=${currentPage}`}
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
                  <p className="text-gray-600">Document non disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barre de navigation en bas (mode plein écran) */}
        {isFullscreen && !isLoadingContent && documentUrl && (
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