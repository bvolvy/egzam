import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';
import { classes, matieres } from '../data/mockData';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      classe: '',
      matiere: '',
      sortBy: 'recent',
      searchTerm: ''
    });
  };

  const activeFiltersCount = [filters.classe, filters.matiere].filter(Boolean).length;

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span>Filtres</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={onToggle}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filtres</h3>
              <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Classe Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe
                </label>
                <select
                  value={filters.classe}
                  onChange={(e) => handleFilterChange('classe', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les classes</option>
                  {classes.map(classe => (
                    <option key={classe} value={classe}>{classe}</option>
                  ))}
                </select>
              </div>

              {/* Matière Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière
                </label>
                <select
                  value={filters.matiere}
                  onChange={(e) => handleFilterChange('matiere', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les matières</option>
                  {matieres.map(matiere => (
                    <option key={matiere} value={matiere}>{matiere}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus téléchargés</option>
                  <option value="favorites">Plus de favoris</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtres</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Effacer
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Classe Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={filters.classe}
              onChange={(e) => handleFilterChange('classe', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              {classes.map(classe => (
                <option key={classe} value={classe}>{classe}</option>
              ))}
            </select>
          </div>

          {/* Matière Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière
            </label>
            <select
              value={filters.matiere}
              onChange={(e) => handleFilterChange('matiere', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              {matieres.map(matiere => (
                <option key={matiere} value={matiere}>{matiere}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus téléchargés</option>
              <option value="favorites">Plus de favoris</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;