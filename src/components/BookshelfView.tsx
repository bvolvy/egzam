import React from 'react';
import { Exam } from '../types';
import ExamCard from './ExamCard';
import QuickStats from './QuickStats';
import MENFPBadge from './MENFPBadge';
import { getLevelByClasse } from '../data/educationHierarchy';
import { BookOpen, TrendingUp, Star, Users, Download, FileText, Sparkles, Target, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUp } from 'lucide-react';

interface BookshelfViewProps {
  exams: Exam[];
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
  onPreview: (examId: string) => void;
}

const BookshelfView: React.FC<BookshelfViewProps> = ({ exams, onDownload, onFavorite, onPreview }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const examsPerPage = 24;
  
  // Calculer la pagination
  const totalPages = Math.ceil(exams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const currentExams = exams.slice(startIndex, endIndex);
  
  // Réinitialiser à la page 1 quand les examens changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [exams.length]);
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut pour une meilleure UX
    const element = document.getElementById('exams-grid-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si elles sont peu nombreuses
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        // Début: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Extract the SVG data URL to avoid parsing issues in JSX
  const dotPatternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  if (exams.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun examen trouvé</h3>
        <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  const totalDownloads = exams.reduce((sum, exam) => sum + exam.downloads, 0);
  const totalFavorites = exams.reduce((sum, exam) => sum + exam.favorites, 0);
  const popularExams = exams.filter(exam => exam.downloads > 150).length;
  const recentUploads = exams.filter(exam => 
    new Date(exam.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="relative">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden mb-12">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-red-600/5 to-blue-800/10">
          <div className={`absolute inset-0 bg-[url('${dotPatternUrl}')] opacity-40`}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-red-500/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-600/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-red-600/10 rounded-full animate-pulse delay-1500"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-red-600 to-blue-800 bg-clip-text text-transparent">
                  Bibliothèque
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Téléversez, découvrez et téléchargez des examens scolaires Haitiens.
            </p>
          </div>

          {/* Statistiques rapides */}
          <QuickStats
            totalExams={exams.length}
            totalDownloads={totalDownloads}
            totalFavorites={totalFavorites}
            popularExams={popularExams}
            recentUploads={recentUploads}
          />

          {/* Results Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Examens disponibles 
                  </h2>
                  <p className="text-gray-600">
                    {exams.length} Examen{exams.length > 1 ? 's' : ''} trouvé{exams.length > 1 ? 's' : ''} 
                    {totalPages > 1}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse delay-600"></div>
                      <span className="text-sm text-gray-600 font-medium">Page {currentPage}/{totalPages}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Récents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse delay-300"></div>
                    <span className="text-sm text-gray-600 font-medium">Populaires</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Haïti</div>
                  <div className="text-sm font-medium text-gray-700">La Perle des Antilles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div id="exams-grid-container" className="relative">
        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentExams.map((exam, index) => (
            <div 
              key={exam.id} 
              className="group relative"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Floating effect with subtle shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              
              {/* Card container */}
              <div className="relative transform hover:scale-105 transition-all duration-300 hover:-translate-y-2">
                <ExamCard 
                  exam={exam} 
                  onDownload={onDownload} 
                  onFavorite={onFavorite}
                  onPreview={onPreview}
                />
              </div>

              {/* Popularity indicator */}
              {exam.downloads > 150 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 animate-bounce">
                    <TrendingUp className="h-3 w-3" />
                    <span>Populaire</span>
                  </div>
                </div>
              )}

              {/* Recent indicator */}
              {new Date(exam.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    <span>Nouveau</span>
                  </div>
                </div>
              )}
              
              {/* Badge MENFP pour examens officiels */}
              {(() => {
                const examLevel = getLevelByClasse(exam.classe);
                const isMENFPOfficial = examLevel?.id === 'officiel';
                return isMENFPOfficial && (
                  <div className="absolute top-2 left-2 z-10">
                    <MENFPBadge size="sm" variant="crown" />
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16">
            {/* Informations de pagination */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 mr-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 rounded-xl shadow-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-xl"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <BookOpen className="h-7 w-7 text-white drop-shadow-sm" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-md"></div>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-400"></div>
                </div>
                <span className="text-gray-600 text-sm ml-4 font-medium">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, exams.length)} sur {exams.length} examens
                </span>
              </div>
            </div>
            
            {/* Contrôles de pagination */}
            <div className="flex items-center justify-center space-x-2">
              {/* Bouton Précédent */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </button>
              
              {/* Numéros de pages */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === 'ellipsis' ? (
                      <div className="flex items-center justify-center w-10 h-10">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() => goToPage(page as number)}
                        className={`w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Bouton Suivant */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                }`}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            {/* Navigation rapide */}
            {totalPages > 10 && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-sm text-gray-600">Aller à la page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">sur {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Message si tous les examens sont affichés sur une page */}
        {totalPages <= 1 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-400"></div>
              </div>
              <span className="text-gray-600 text-sm ml-4 font-medium">
                Tous les examens sont affichés
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfView;