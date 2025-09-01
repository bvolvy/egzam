import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import BookshelfView from './components/BookshelfView';
import SearchResults from './components/SearchResults';
import HierarchicalFilterPanel from './components/HierarchicalFilterPanel';
import UploadModal from './components/UploadModal';
import AdminPanel from './components/AdminPanel';
import PreviewModal from './components/PreviewModal';
import Footer from './components/Footer';
import { Exam, FilterOptions } from './types';
import { useExams } from './hooks/useExams';

// Composant principal avec accès au contexte d'authentification
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { 
    exams, 
    pendingExams, 
    isLoading, 
    error, 
    handleFavorite, 
    handleDownload, 
    approveExam, 
    rejectExam, 
    deleteExam,
    refreshExams,
    refreshPendingExams
  } = useExams();
  
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
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

  const handlePreview = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setPreviewExam(exam);
      setShowPreviewModal(true);
    }
  };

  const handleUploadSuccess = () => {
    refreshPendingExams();
    setShowUploadModal(false);
  };

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement d'EgzamAchiv...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le chargement a échoué
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
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
                <HierarchicalFilterPanel
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
            onUpload={handleUploadSuccess}
          />
        )}

        {showAdminPanel && (
          <AdminPanel
            onClose={() => setShowAdminPanel(false)}
            pendingExams={pendingExams}
            publishedExams={exams}
            onApproveExam={approveExam}
            onRejectExam={rejectExam}
            onDeletePendingExam={deleteExam}
            onDeletePublishedExam={deleteExam}
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
  );
}

// Wrapper principal avec AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;