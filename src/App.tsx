import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import BookshelfView from './components/BookshelfView';
import SearchResults from './components/SearchResults';
import FilterPanel from './components/FilterPanel';
import UploadModal from './components/UploadModal';
import AdminPanel from './components/AdminPanel';
import PreviewModal from './components/PreviewModal';
import Footer from './components/Footer';
import { mockExams } from './data/mockData';
import { Exam, FilterOptions } from './types';
import { examStorage, favoritesStorage, initializeStorage, cleanupStorage } from './utils/storage';

function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>(mockExams);
  const [searchResults, setSearchResults] = useState<Exam[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    classe: '',
    matiere: '',
    sortBy: 'recent',
    searchTerm: ''
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingExams, setPendingExams] = useState<Exam[]>([]);

  // Initialisation des données au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialiser le stockage
        const { isFirstVisit } = initializeStorage();
        
        // Charger les examens depuis le stockage ou utiliser les mocks
        const storedExams = examStorage.load();
        const initialExams = storedExams.length > 0 ? storedExams : mockExams;
        
        // Charger les favoris
        const storedFavorites = favoritesStorage.load();
        
        // Appliquer les favoris aux examens
        const examsWithFavorites = initialExams.map(exam => ({
          ...exam,
          isFavorited: storedFavorites.includes(exam.id)
        }));
        
        setExams(examsWithFavorites);
        
        // Charger les examens en attente
        const storedPendingExams = pendingExamStorage.load();
        setPendingExams(storedPendingExams);
        
        // Si c'est la première visite, sauvegarder les examens mock
        if (isFirstVisit && storedExams.length === 0) {
          examStorage.save(examsWithFavorites);
        }
        
        // Nettoyer les données anciennes
        cleanupStorage(30);
        
        setIsInitialized(true);
        console.log('✅ Application initialisée avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        // En cas d'erreur, utiliser les données mock
        setExams(mockExams);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Sauvegarder automatiquement les examens quand ils changent
  useEffect(() => {
    if (isInitialized && exams.length > 0) {
      examStorage.save(exams);
    }
  }, [exams, isInitialized]);
  // Filter and sort exams
  useEffect(() => {
    let filtered = [...exams];

    // Apply filters
    if (filters.classe) {
      filtered = filtered.filter(exam => exam.classe === filters.classe);
    }
    if (filters.matiere) {
      filtered = filtered.filter(exam => exam.matiere === filters.matiere);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchLower) ||
        exam.description.toLowerCase().includes(searchLower) ||
        exam.matiere.toLowerCase().includes(searchLower) ||
        exam.classe.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'favorites':
        filtered.sort((a, b) => b.favorites - a.favorites);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
    }

    setFilteredExams(filtered);
  }, [exams, filters]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      setCurrentSearchTerm(searchTerm);
      setIsSearching(true);
      
      // Perform search
      const searchLower = searchTerm.toLowerCase();
      const results = exams.filter(exam => 
        exam.title.toLowerCase().includes(searchLower) ||
        exam.description.toLowerCase().includes(searchLower) ||
        exam.matiere.toLowerCase().includes(searchLower) ||
        exam.classe.toLowerCase().includes(searchLower) ||
        exam.uploader.name.toLowerCase().includes(searchLower)
      );
      
      // Sort by relevance (simple scoring based on title matches)
      results.sort((a, b) => {
        const aScore = a.title.toLowerCase().includes(searchLower) ? 2 : 1;
        const bScore = b.title.toLowerCase().includes(searchLower) ? 2 : 1;
        return bScore - aScore;
      });
      
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setCurrentSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setCurrentSearchTerm('');
    setSearchResults([]);
  };

  const handleDownload = (examId: string) => {
    // Simulate download
    setExams(prev => {
      const updated = prev.map(exam => 
        exam.id === examId 
          ? { ...exam, downloads: exam.downloads + 1 }
          : exam
      );
      return updated;
    });
    
    // Show success message
    alert('Téléchargement démarré !');
  };

  const handleFavorite = (examId: string) => {
    setExams(prev => {
      const updated = prev.map(exam => 
        exam.id === examId 
          ? { 
              ...exam, 
              isFavorited: !exam.isFavorited,
              favorites: exam.isFavorited ? exam.favorites - 1 : exam.favorites + 1
            }
          : exam
      );
      
      // Mettre à jour les favoris dans le stockage
      const exam = updated.find(e => e.id === examId);
      if (exam) {
        if (exam.isFavorited) {
          favoritesStorage.add(examId);
        } else {
          favoritesStorage.remove(examId);
        }
      }
      
      return updated;
    });
  };

  const handlePreview = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setPreviewExam(exam);
      setShowPreviewModal(true);
    }
  };

  const handleUpload = (examData: any) => {
    const newExam: Exam = {
      id: Date.now().toString(),
      title: examData.title,
      description: examData.description,
      classe: examData.classe,
      matiere: examData.matiere,
      fileName: examData.fileName,
      fileSize: Math.round(examData.fileSize * 10) / 10,
      uploadDate: new Date(),
      downloads: 0,
      favorites: 0,
      uploader: { id: '1', name: 'Utilisateur' },
      isFavorited: false,
      status: 'pending',
      submissionDate: new Date()
    };

    // Ajouter aux examens en attente au lieu des examens publiés
    setPendingExams(prev => {
      const updated = [newExam, ...prev];
      pendingExamStorage.save(updated);
      return updated;
    });
    
    setShowUploadModal(false);
    alert('Examen soumis avec succès ! Il sera visible après approbation par un administrateur.');
  };

  // Fonctions de gestion des examens en attente
  const handleApproveExam = (examId: string) => {
    const examToApprove = pendingExams.find(exam => exam.id === examId);
    if (examToApprove) {
      // Retirer de la liste d'attente
      const updatedPending = pendingExams.filter(exam => exam.id !== examId);
      setPendingExams(updatedPending);
      pendingExamStorage.save(updatedPending);
      
      // Ajouter aux examens publiés
      const approvedExam = {
        ...examToApprove,
        status: 'approved',
        approvalDate: new Date()
      };
      
      setExams(prev => {
        const updated = [approvedExam, ...prev];
        examStorage.save(updated);
        return updated;
      });
    }
  };

  const handleRejectExam = (examId: string) => {
    const updatedPending = pendingExams.map(exam => 
      exam.id === examId 
        ? { ...exam, status: 'rejected', rejectionDate: new Date() }
        : exam
    );
    setPendingExams(updatedPending);
    pendingExamStorage.save(updatedPending);
  };

  const handleDeletePendingExam = (examId: string) => {
    const updatedPending = pendingExams.filter(exam => exam.id !== examId);
    setPendingExams(updatedPending);
    pendingExamStorage.save(updatedPending);
  };

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement d'EgzamAchiv...</p>
        </div>
      </div>
    );
  }
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 flex flex-col">
        <Header 
          onSearch={handleSearch}
          onUploadClick={() => setShowUploadModal(true)}
          onAdminClick={() => setShowAdminPanel(true)}
          favorites={exams.filter(exam => exam.isFavorited)}
          onDownload={handleDownload}
          onFavorite={handleFavorite}
          onPreview={handlePreview}
        />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="lg:flex lg:gap-8">
            {/* Sidebar - Only show when not searching */}
            {!isSearching && (
              <div className="lg:w-64 mb-8 lg:mb-0">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  isOpen={isFilterPanelOpen}
                  onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="lg:flex-1">
              {isSearching ? (
                <SearchResults
                  searchTerm={currentSearchTerm}
                  results={searchResults}
                  onDownload={handleDownload}
                  onFavorite={handleFavorite}
                  onPreview={handlePreview}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <BookshelfView
                  exams={filteredExams}
                  onDownload={handleDownload}
                  onFavorite={handleFavorite}
                  onPreview={handlePreview}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />

        {/* Modals */}
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
          />
        )}

        {showAdminPanel && (
          <AdminPanel
            onClose={() => setShowAdminPanel(false)}
            pendingExams={pendingExams}
            publishedExams={exams}
            onApproveExam={handleApproveExam}
            onRejectExam={handleRejectExam}
            onDeletePendingExam={handleDeletePendingExam}
            onDeletePublishedExam={(examId) => {
              const updated = exams.filter(exam => exam.id !== examId);
              setExams(updated);
              examStorage.save(updated);
            }}
          />
        )}

        {showPreviewModal && previewExam && (
          <PreviewModal
            exam={previewExam}
            onClose={() => {
              setShowPreviewModal(false);
              setPreviewExam(null);
            }}
            onDownload={handleDownload}
            onFavorite={handleFavorite}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;