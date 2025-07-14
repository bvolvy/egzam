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
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [error, setError] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [iframeKey, setIframeKey] = useState(0); // Pour forcer le rechargement de l'iframe

  // Charger le document réel
  useEffect(() => {
    const loadRealDocument = async () => {
      setIsLoadingContent(true);
      setError('');
      
      try {
        // Si c'est un document téléversé récemment avec fileData
        if (exam.fileData) {
          console.log('📄 Chargement du fichier téléversé:', exam.fileData.name);
          const url = URL.createObjectURL(exam.fileData);
          setDocumentUrl(url);
          setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.5) + 1));
        } 
        // Si c'est un document existant avec documentUrl
        else if (exam.documentUrl) {
          console.log('🔗 Chargement du document existant:', exam.documentUrl);
          setDocumentUrl(exam.documentUrl);
          setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.5) + 1));
        }
        // Sinon, récupérer depuis le serveur/stockage
        else {
          console.log('🌐 Récupération du document depuis le serveur pour:', exam.id);
          const documentData = await fetchDocumentFromServer(exam.id);
          
          if (documentData) {
            const blob = new Blob([documentData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDocumentUrl(url);
            setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.5) + 1));
          } else {
            throw new Error('Document non trouvé sur le serveur');
          }
        }
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement du document:', error);
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
  }, [exam.id, exam.fileData, exam.documentUrl]);

  // Fonction pour récupérer le document depuis le serveur
  const fetchDocumentFromServer = async (examId: string): Promise<ArrayBuffer | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En production, ceci ferait un appel API réel:
    // const response = await fetch(`/api/documents/${examId}`);
    // if (!response.ok) throw new Error('Document non trouvé');
    // return await response.arrayBuffer();
    
    console.log('🔧 Génération d\'un document mock pour:', examId);
    return generateMockDocument(examId);
  };

  const generateMockDocument = (examId: string): ArrayBuffer => {
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
/Length 400
>>
stream
BT
/F1 16 Tf
50 750 Td
(DOCUMENT D'EXAMEN - ${examId}) Tj
0 -40 Td
/F2 12 Tf
(Ceci est un document d'exemple pour la demonstration.) Tj
0 -20 Td
(Le contenu reel du fichier televerse apparaitrait ici.) Tj
0 -40 Td
(En production, ce sera le vrai contenu PDF.) Tj
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
0000000725 00000 n 
0000000784 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
840
%%EOF`;

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
    const newZoom = Math.min(zoom + 0.25, 3.0);
    setZoom(newZoom);
    setIframeKey(prev => prev + 1); // Force iframe reload
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 0.5);
    setZoom(newZoom);
    setIframeKey(prev => prev + 1); // Force iframe reload
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    setIframeKey(prev => prev + 1); // Force iframe reload
  };

  const handleDownloadClick = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = exam.fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownload(exam.id);
    }
  };

  // Construire l'URL avec les paramètres de zoom et rotation
  const buildPdfUrl = () => {
    if (!documentUrl) return '';
    
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('zoom', (zoom * 100).toString()); // Convertir en pourcentage
    
    // Pour la rotation, on utilise un paramètre personnalisé
    if (rotation !== 0) {
      params.set('rotate', rotation.toString());
    }
    
    return `${documentUrl}#${params.toString()}`;
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
              {exam.fileData && (
                <p className="text-xs text-green-600">📄 Document téléversé récemment</p>
              )}
            </div>
          </div>
          
          {/* Contrôles de prévisualisation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              disabled={isLoadingContent || zoom <= 0.5}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Zoom arrière"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={isLoadingContent || zoom >= 3.0}
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

                {/* Statut du document */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Statut</h4>
                  <div className="text-sm">
                    {exam.fileData ? (
                      <div className="flex items-center p-2 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-800">Document téléversé récemment</span>
                      </div>
                    ) : (
                      <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-blue-800">Document existant</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contrôles de zoom détaillés */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Zoom</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Niveau actuel:</span>
                      <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => { setZoom(0.5); setIframeKey(prev => prev + 1); }}
                        disabled={isLoadingContent}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => { setZoom(1.0); setIframeKey(prev => prev + 1); }}
                        disabled={isLoadingContent}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                      >
                        100%
                      </button>
                      <button
                        onClick={() => { setZoom(1.5); setIframeKey(prev => prev + 1); }}
                        disabled={isLoadingContent}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                      >
                        150%
                      </button>
                      <button
                        onClick={() => { setZoom(2.0); setIframeKey(prev => prev + 1); }}
                        disabled={isLoadingContent}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                      >
                        200%
                      </button>
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
          <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
            {isLoadingContent ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Chargement du document...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {exam.fileData ? 'Traitement du fichier téléversé' : 'Récupération du contenu'}
                  </p>
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
              <div className="w-full h-full relative">
                <iframe
                  key={iframeKey} // Force le rechargement quand les paramètres changent
                  src={buildPdfUrl()}
                  className="w-full h-full border-0"
                  style={{
                    transform: rotation !== 0 ? `rotate(${rotation}deg)` : 'none',
                    transformOrigin: 'center'
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
              <span className="text-xs text-gray-600">{Math.round(zoom * 100)}%</span>
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