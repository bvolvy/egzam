import React from 'react';
import { Search, Filter, SortAsc, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Exam } from '../types';
import ExamCard from './ExamCard';
import MENFPBadge from './MENFPBadge';
import { getLevelByClasse } from '../data/educationHierarchy';

interface SearchResultsProps {
  searchTerm: string;
  results: Exam[];
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
  onPreview: (examId: string) => void;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchTerm,
  results,
  onDownload,
  onFavorite,
  onPreview,
  onClearSearch
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const resultsPerPage = 24;
  
  // Calculer la pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);
  
  // Réinitialiser à la page 1 quand les résultats changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [results.length, searchTerm]);
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut pour une meilleure UX
    const element = document.getElementById('search-results-container');
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div id="search-results-container" className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Résultats de recherche
              </h2>
              <p className="text-gray-600">
                {results.length} résultat{results.length > 1 ? 's' : ''} pour "
                <span className="font-semibold text-blue-600">{searchTerm}</span>"
                {totalPages > 1 && ` • Page ${currentPage}/${totalPages}`}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClearSearch}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Effacer</span>
          </button>
        </div>

        {/* Search Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{results.length}</div>
            <div className="text-sm text-gray-600">Documents trouvés</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {new Set(results.map(r => r.matiere)).size}
            </div>
            <div className="text-sm text-gray-600">Matières différentes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(results.map(r => r.classe)).size}
            </div>
            <div className="text-sm text-gray-600">Classes différentes</div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtrer</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <SortAsc className="h-4 w-4" />
            <span className="text-sm font-medium">Trier</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Triés par pertinence {totalPages > 1 && `• Affichage de ${startIndex + 1}-${Math.min(endIndex, results.length)}`}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentResults.map((exam, index) => (
              <div 
                key={exam.id}
                className="transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <ExamCard 
                    exam={{
                      ...exam,
                      title: highlightText(exam.title, searchTerm) as any,
                      description: highlightText(exam.description, searchTerm) as any
                    }}
                    onDownload={onDownload}
                    onFavorite={onFavorite}
                    onPreview={onPreview}
                  />
                  
                  {/* Search relevance indicator */}
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    #{startIndex + index + 1}
                  </div>
                  
                  {/* Badge MENFP pour examens officiels */}
                  {(exam.isOfficial === true || exam.level === 'officiel') && (
                    <div className="absolute top-2 left-2 z-10">
                      <MENFPBadge size="sm" variant="shield" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination pour les résultats de recherche */}
          {totalPages > 1 && (
            <div className="mt-12">
              {/* Informations de pagination */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
                  <Search className="h-4 w-4 text-blue-600 mr-3" />
                  <span className="text-gray-600 text-sm font-medium">
                    Résultats {startIndex + 1} à {Math.min(endIndex, results.length)} sur {results.length}
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
              
              {/* Navigation rapide pour les recherches avec beaucoup de résultats */}
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
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Nous n'avons trouvé aucun examen correspondant à votre recherche "
              <span className="font-semibold">{searchTerm}</span>".
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vérifiez l'orthographe</li>
                <li>Utilisez des mots-clés plus généraux</li>
                <li>Essayez des synonymes</li>
              </ul>
            </div>
            <button
              onClick={onClearSearch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à la bibliothèque
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;