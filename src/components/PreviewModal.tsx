import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Heart, User, Calendar, FileText, ZoomIn, ZoomOut, RotateCw, Maximize2, AlertTriangle, Loader2, ChevronLeft, ChevronRight, RotateCcw, Minimize2, Search, BookOpen, Home, RefreshCw, Settings, Info, Share2, Printer as Print, Copy, ExternalLink } from 'lucide-react';
import { Exam } from '../types';
import MENFPBadge from './MENFPBadge';
import { getLevelByClasse } from '../data/educationHierarchy';

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
  const [iframeKey, setIframeKey] = useState(0);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'page' | 'auto'>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Vérifier si c'est un examen officiel MENFP
  const examLevel = getLevelByClasse(exam.classe);
  const isMENFPOfficial = examLevel?.id === 'officiel';
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  // Charger le document réel
  useEffect(() => {
    const loadRealDocument = async () => {
      setIsLoadingContent(true);
      setError('');
      
      try {
        // Vérifier d'abord si on a le fichier réel en mémoire
        if (exam.fileData && exam.fileData instanceof File) {
          console.log('📄 Chargement du fichier téléversé réel:', exam.fileData.name);
          const url = URL.createObjectURL(exam.fileData);
          setDocumentUrl(url);
          setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.3) + 1));
        }
        // Sinon, vérifier si on a une URL de document stockée
        else if (exam.documentUrl) {
          console.log('🔗 Chargement du document depuis URL stockée:', exam.documentUrl);
          setDocumentUrl(exam.documentUrl);
          setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.3) + 1));
        }
        // Pour les examens sans fichier réel, essayer de récupérer depuis le stockage local
        else {
          console.log('🗄️ Tentative de récupération depuis le stockage local pour:', exam.id);
          const storedFileUrl = localStorage.getItem(`exam_file_${exam.id}`);
          
          if (storedFileUrl) {
            console.log('✅ Fichier trouvé dans le stockage local');
            setDocumentUrl(storedFileUrl);
            setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.3) + 1));
          } else {
            console.log('⚠️ Aucun fichier réel disponible, génération d\'un document de démonstration');
            // Générer un document de démonstration uniquement si aucun fichier réel n'est disponible
            const documentData = await generateDemoDocument(exam);
            const blob = new Blob([documentData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDocumentUrl(url);
            setTotalPages(Math.max(1, Math.floor(exam.fileSize / 0.3) + 1));
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

    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [exam.id, exam.fileData, exam.documentUrl]);

  // Focus sur l'input de page quand il s'affiche
  useEffect(() => {
    if (showPageInput && pageInputRef.current) {
      pageInputRef.current.focus();
      pageInputRef.current.select();
    }
  }, [showPageInput]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentPage(1);
          break;
        case 'End':
          e.preventDefault();
          setCurrentPage(totalPages);
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
          e.preventDefault();
          handleRotate();
          break;
        case 'f':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case 'g':
          e.preventDefault();
          setShowPageInput(true);
          setPageInputValue(currentPage.toString());
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFullscreen, zoom]);


  const generateDemoDocument = async (exam: Exam): Promise<ArrayBuffer> => {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
>>
>>
>>
endobj

4 0 obj
<<
/Length 300
>>
stream
BT
/F1 14 Tf
50 750 Td
(${exam.title}) Tj
0 -30 Td
(Classe: ${exam.classe} - Matière: ${exam.matiere}) Tj
0 -30 Td
(⚠️ Aperçu de démonstration) Tj
0 -30 Td
(Le fichier original n'est plus disponible.) Tj
0 -30 Td
(Téléversé par: ${exam.uploader.name}) Tj
0 -30 Td
(Taille: ${exam.fileSize} MB) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000525 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
582
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

  // Navigation des pages
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setIframeKey(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setIframeKey(prev => prev + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIframeKey(prev => prev + 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    setIframeKey(prev => prev + 1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setIframeKey(prev => prev + 1);
  };

  // Contrôles de zoom
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.25, 5.0);
    setZoom(newZoom);
    setIframeKey(prev => prev + 1);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 0.25);
    setZoom(newZoom);
    setIframeKey(prev => prev + 1);
  };

  const setZoomLevel = (level: number) => {
    setZoom(level);
    setIframeKey(prev => prev + 1);
  };

  // Contrôles de rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    setIframeKey(prev => prev + 1);
  };

  const handleRotateCounterClockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
    setIframeKey(prev => prev + 1);
  };

  const resetRotation = () => {
    setRotation(0);
    setIframeKey(prev => prev + 1);
  };

  // Modes d'ajustement
  const handleFitMode = (mode: typeof fitMode) => {
    setFitMode(mode);
    switch (mode) {
      case 'width':
        setZoom(1.0);
        break;
      case 'height':
        setZoom(1.2);
        break;
      case 'page':
        setZoom(0.8);
        break;
      case 'auto':
        setZoom(1.0);
        break;
    }
    setIframeKey(prev => prev + 1);
  };

  // Téléchargement
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

  // Partage
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: exam.title,
          text: exam.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  // Impression
  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.print();
    }
  };

  // Actualisation
  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  // Gestion de l'input de page
  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInputValue);
    if (page >= 1 && page <= totalPages) {
      goToPage(page);
    }
    setShowPageInput(false);
  };

  // Recherche dans le document
  const handleSearch = () => {
    if (searchTerm && iframeRef.current) {
      // En production, utiliser l'API de recherche PDF
      console.log('Recherche:', searchTerm);
    }
  };

  // Construire l'URL du PDF avec tous les paramètres
  const buildPdfUrl = () => {
    if (!documentUrl) return '';
    
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    
    // Zoom en pourcentage
    const zoomPercent = Math.round(zoom * 100);
    params.set('zoom', zoomPercent.toString());
    
    // Mode d'ajustement
    if (fitMode !== 'auto') {
      params.set('view', `Fit${fitMode.charAt(0).toUpperCase() + fitMode.slice(1)}`);
    }
    
    // Rotation
    if (rotation !== 0) {
      params.set('rotate', rotation.toString());
    }
    
    // Recherche
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    return `${documentUrl}#${params.toString()}`;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-7xl w-full max-h-[95vh]'} ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        
        {/* Header avec contrôles avancés */}
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-red-50'}`}>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Prévisualisation avancée
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {exam.fileName}
              </p>
              {exam.fileData && (
                <p className="text-xs text-green-600">📄 Document téléversé récemment</p>
              )}
            </div>
          </div>
          
          {/* Barre d'outils principale */}
          <div className="flex items-center space-x-2">
            {/* Navigation des pages */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-2 py-1">
              <button
                onClick={goToFirstPage}
                disabled={isLoadingContent || currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Première page (Home)"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </button>
              
              <button
                onClick={goToPreviousPage}
                disabled={isLoadingContent || currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Page précédente (←)"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Input de page */}
              {showPageInput ? (
                <form onSubmit={handlePageInputSubmit} className="flex items-center">
                  <input
                    ref={pageInputRef}
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInputValue}
                    onChange={(e) => setPageInputValue(e.target.value)}
                    onBlur={() => setShowPageInput(false)}
                    className="w-12 px-1 py-0.5 text-center text-sm border border-gray-300 rounded"
                  />
                </form>
              ) : (
                <button
                  onClick={() => {
                    setShowPageInput(true);
                    setPageInputValue(currentPage.toString());
                  }}
                  className="px-2 py-1 text-sm font-medium hover:bg-gray-100 rounded"
                  title="Aller à la page (G)"
                >
                  {currentPage}
                </button>
              )}
              
              <span className="text-sm text-gray-500">/ {totalPages}</span>
              
              <button
                onClick={goToNextPage}
                disabled={isLoadingContent || currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Page suivante (→)"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={goToLastPage}
                disabled={isLoadingContent || currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Dernière page (End)"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </button>
            </div>

            {/* Contrôles de zoom */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-2 py-1">
              <button
                onClick={handleZoomOut}
                disabled={isLoadingContent || zoom <= 0.25}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Zoom arrière (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              
              <select
                value={zoom}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="text-sm border-0 bg-transparent focus:outline-none"
                disabled={isLoadingContent}
              >
                <option value={0.25}>25%</option>
                <option value={0.5}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1.0}>100%</option>
                <option value={1.25}>125%</option>
                <option value={1.5}>150%</option>
                <option value={2.0}>200%</option>
                <option value={3.0}>300%</option>
                <option value={5.0}>500%</option>
              </select>
              
              <button
                onClick={handleZoomIn}
                disabled={isLoadingContent || zoom >= 5.0}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Zoom avant (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Modes d'ajustement */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-2 py-1">
              <select
                value={fitMode}
                onChange={(e) => handleFitMode(e.target.value as typeof fitMode)}
                className="text-sm border-0 bg-transparent focus:outline-none"
                disabled={isLoadingContent}
              >
                <option value="auto">Automatique</option>
                <option value="width">Ajuster largeur</option>
                <option value="height">Ajuster hauteur</option>
                <option value="page">Page entière</option>
              </select>
            </div>

            {/* Rotation */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-1 py-1">
              <button
                onClick={handleRotateCounterClockwise}
                disabled={isLoadingContent}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Rotation anti-horaire"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleRotate}
                disabled={isLoadingContent}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Rotation horaire (R)"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              
              {rotation !== 0 && (
                <button
                  onClick={resetRotation}
                  disabled={isLoadingContent}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 text-xs"
                  title="Réinitialiser rotation"
                >
                  {rotation}°
                </button>
              )}
            </div>

            {/* Recherche */}
            <div className="flex items-center space-x-1">
              {isSearchMode ? (
                <div className="flex items-center bg-white rounded-lg border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Rechercher..."
                    className="w-32 text-sm border-0 focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsSearchMode(false);
                      setSearchTerm('');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchMode(true)}
                  disabled={isLoadingContent}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Rechercher dans le document"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleRefresh}
                disabled={isLoadingContent}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Actualiser"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              
              <button
                onClick={handlePrint}
                disabled={isLoadingContent || !documentUrl}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Imprimer"
              >
                <Print className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleShare}
                disabled={isLoadingContent}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Informations"
              >
                <Info className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Paramètres"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Plein écran */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              disabled={isLoadingContent}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title={isFullscreen ? "Quitter plein écran (F)" : "Plein écran (F)"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Fermer (Échap)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Panneau des paramètres */}
        {showSettings && (
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="darkMode" className="text-sm">Mode sombre</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRotate"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRotate" className="text-sm">Rotation automatique</label>
              </div>
              
              <div className="text-sm text-gray-600">
                Raccourcis: ←→ (pages), +- (zoom), R (rotation), F (plein écran), G (aller à)
              </div>
            </div>
          </div>
        )}

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar avec informations */}
          {!isFullscreen && (showInfo || !isLoadingContent) && (
            <div className={`w-80 border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} p-6 overflow-y-auto`}>
              <div className="space-y-6">
                {/* Informations du document */}
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {exam.title}
                  </h3>
                  
                  {/* Badge MENFP pour examens officiels */}
                  {isMENFPOfficial && (
                    <div className="mb-3">
                      <MENFPBadge size="md" variant="crown" />
                    </div>
                  )}
                  
                  <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                    {/* Badge niveau officiel */}
                    {isMENFPOfficial && (
                      <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs font-bold rounded-full border border-red-300">
                        📋 Examen d'État
                      </span>
                    )}
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Auteur :</span>
                      <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{exam.uploader.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Date :</span>
                      <span className={`ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(exam.uploadDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Taille :</span>
                      <span className={`ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{Math.round(exam.fileSize * 10) / 10} MB</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Téléchargements :</span>
                      <span className={`ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{exam.downloads}</span>
                    </div>
                  </div>
                </div>

                {/* Statut du document */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut</h4>
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

                {/* Informations de visualisation */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Visualisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Page actuelle:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPage} / {totalPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Zoom:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rotation:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rotation}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Mode:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fitMode}</span>
                    </div>
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
          <div className={`flex-1 flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {isLoadingContent ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement du document...</p>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {exam.fileData ? 'Traitement du fichier téléversé' : 'Récupération du contenu'}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Erreur de chargement</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
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
                  ref={iframeRef}
                  key={iframeKey}
                  src={buildPdfUrl()}
                  className="w-full h-full border-0"
                  title={`Prévisualisation de ${exam.title}`}
                  style={{
                    filter: darkMode ? 'invert(1) hue-rotate(180deg)' : 'none'
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Document non disponible</p>
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
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                ←
              </button>
              
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                →
              </button>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <span className="text-xs text-gray-600">{Math.round(zoom * 100)}%</span>
              
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