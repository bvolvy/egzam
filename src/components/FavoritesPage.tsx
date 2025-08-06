import React, { useState } from 'react';
import { Star, Search, Filter, Download, Eye, Heart, Calendar, User, FileText, Trash2, X } from 'lucide-react';
import { Exam } from '../types';
import ExamCard from './ExamCard';
import MENFPBadge from './MENFPBadge';
import { getLevelByClasse } from '../data/educationHierarchy';

interface FavoritesPageProps {
  favorites: Exam[];
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
  onPreview: (examId: string) => void;
  onClose: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onDownload,
  onFavorite,
  onPreview,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'downloads'>('recent');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filtrer et trier les favoris
  const filteredFavorites = favorites
    .filter(exam => 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.classe.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'downloads':
          return b.downloads - a.downloads;
        case 'recent':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

  const handleSelectItem = (examId: string) => {
    setSelectedItems(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(exam => exam.id));
    }
  };

  const handleRemoveSelected = () => {
    if (confirm(`Êtes-vous sûr de vouloir retirer ${selectedItems.length} élément(s) de vos favoris ?`)) {
      selectedItems.forEach(examId => onFavorite(examId));
      setSelectedItems([]);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 via-pink-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Star className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Favoris</h1>
              <p className="text-sm text-gray-600">
                {favorites.length} examen{favorites.length > 1 ? 's' : ''} dans vos favoris
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Barre d'outils */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher dans vos favoris..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center space-x-4">
              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="recent">Plus récents</option>
                <option value="alphabetical">Alphabétique</option>
                <option value="downloads">Plus téléchargés</option>
              </select>

              {/* Sélection multiple */}
              {filteredFavorites.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    {selectedItems.length === filteredFavorites.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </button>
                  
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleRemoveSelected}
                      className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Retirer ({selectedItems.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          {filteredFavorites.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-red-600">{filteredFavorites.length}</div>
                <div className="text-sm text-gray-600">Favoris</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-blue-600">
                  {new Set(filteredFavorites.map(f => f.matiere)).size}
                </div>
                <div className="text-sm text-gray-600">Matières</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-green-600">
                  {new Set(filteredFavorites.map(f => f.classe)).size}
                </div>
                <div className="text-sm text-gray-600">Classes</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-purple-600">
                  {filteredFavorites.reduce((sum, f) => sum + f.downloads, 0)}
                </div>
                <div className="text-sm text-gray-600">Téléchargements totaux</div>
              </div>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 max-h-[calc(95vh-300px)] overflow-y-auto">
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((exam) => (
                <div key={exam.id} className="relative group">
                  {/* Checkbox de sélection */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(exam.id)}
                      onChange={() => handleSelectItem(exam.id)}
                      className="w-4 h-4 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                  </div>

                  {/* Badge favori */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                  
                  {/* Badge MENFP pour examens officiels */}
                  {(exam.isOfficial === true || exam.level === 'officiel') && (
                    <div className="absolute top-2 left-2 z-10">
                      <MENFPBadge size="sm" variant="award" />
                    </div>
                  )}

                  {/* Carte d'examen */}
                  <div className={`transition-all duration-200 ${selectedItems.includes(exam.id) ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
                    <ExamCard
                      exam={exam}
                      onDownload={onDownload}
                      onFavorite={onFavorite}
                      onPreview={onPreview}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            // Aucun favori
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Star className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun favori pour le moment
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Commencez à ajouter des examens à vos favoris en cliquant sur l'icône cœur 
                sur les examens qui vous intéressent.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Parcourir les examens
              </button>
            </div>
          ) : (
            // Aucun résultat de recherche
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Aucun favori ne correspond à votre recherche "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>

        {/* Footer avec actions rapides */}
        {filteredFavorites.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredFavorites.length} favori{filteredFavorites.length > 1 ? 's' : ''} affiché{filteredFavorites.length > 1 ? 's' : ''}
                {selectedItems.length > 0 && ` • ${selectedItems.length} sélectionné${selectedItems.length > 1 ? 's' : ''}`}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    filteredFavorites.forEach(exam => onDownload(exam.id));
                  }}
                  className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tout télécharger
                </button>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;