import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Filter, X, RotateCcw, Search, BookOpen, GraduationCap, Wrench, FileText } from 'lucide-react';
import { FilterOptions } from '../types';
import { educationLevels, getClassesByLevel, getMatieresByLevel, EducationLevel } from '../data/educationHierarchy';

interface HierarchicalFilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const HierarchicalFilterPanel: React.FC<HierarchicalFilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Réinitialiser la sélection de niveau quand les filtres changent
  useEffect(() => {
    if (!filters.classe && !filters.matiere) {
      setSelectedLevel('');
    }
  }, [filters.classe, filters.matiere]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleLevelSelect = (levelId: string) => {
    if (selectedLevel === levelId) {
      // Déselectionner le niveau
      setSelectedLevel('');
      onFiltersChange({ ...filters, classe: '', matiere: '' });
    } else {
      // Sélectionner le nouveau niveau
      setSelectedLevel(levelId);
      // Réinitialiser les filtres classe et matière
      onFiltersChange({ ...filters, classe: '', matiere: '' });
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const clearFilters = () => {
    setSelectedLevel('');
    setSearchTerm('');
    onFiltersChange({
      classe: '',
      matiere: '',
      sortBy: 'recent',
      searchTerm: ''
    });
  };

  const getActiveFiltersCount = () => {
    return [filters.classe, filters.matiere, selectedLevel].filter(Boolean).length;
  };

  const getFilteredLevels = () => {
    if (!searchTerm) return educationLevels;
    
    return educationLevels.filter(level => 
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.classes.some(classe => classe.toLowerCase().includes(searchTerm.toLowerCase())) ||
      level.matieres.some(matiere => matiere.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getLevelIcon = (levelId: string) => {
    switch (levelId) {
      case 'secondaire':
        return <BookOpen className="h-4 w-4" />;
      case 'officiel':
        return <FileText className="h-4 w-4" />;
      case 'universite':
        return <GraduationCap className="h-4 w-4" />;
      case 'technique':
        return <Wrench className="h-4 w-4" />;
      case 'concours':
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();
  const filteredLevels = getFilteredLevels();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtres</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 font-semibold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={onToggle}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres par niveau</h3>
                <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Panel */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filtres par niveau</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );

  function FilterContent() {
    return (
      <div className="space-y-6">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher niveau, classe, matière..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Niveaux d'enseignement */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Niveaux d'enseignement
          </h4>
          
          {filteredLevels.map((level) => (
            <div key={level.id} className="space-y-2">
              {/* Niveau principal */}
              <button
                onClick={() => handleLevelSelect(level.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedLevel === level.id
                    ? `border-${level.color.accent} bg-${level.color.secondary} shadow-md`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{level.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold ${
                      selectedLevel === level.id ? `text-${level.color.accent}` : 'text-gray-900'
                    }`}>
                      {level.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {level.classes.length} classes • {level.matieres.length} matières
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedLevel === level.id && (
                    <div className={`w-2 h-2 bg-${level.color.accent} rounded-full animate-pulse`}></div>
                  )}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(level.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                  >
                    {expandedSections.has(level.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Détails du niveau (expandable) */}
              {expandedSections.has(level.id) && (
                <div className={`ml-4 p-4 bg-${level.color.secondary} rounded-lg border border-${level.color.primary}-200`}>
                  <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Classes disponibles
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {level.classes.slice(0, 4).map((classe) => (
                          <span
                            key={classe}
                            className={`text-xs px-2 py-1 bg-${level.color.primary}-100 text-${level.color.accent} rounded-full`}
                          >
                            {classe}
                          </span>
                        ))}
                        {level.classes.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{level.classes.length - 4} autres
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Matières principales
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {level.matieres.slice(0, 3).map((matiere) => (
                          <span
                            key={matiere}
                            className={`text-xs px-2 py-1 bg-${level.color.primary}-100 text-${level.color.accent} rounded-full`}
                          >
                            {matiere}
                          </span>
                        ))}
                        {level.matieres.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{level.matieres.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Filtres spécifiques si un niveau est sélectionné */}
        {selectedLevel && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filtres spécifiques
            </h4>
            
            {/* Classes du niveau sélectionné */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <select
                value={filters.classe}
                onChange={(e) => handleFilterChange('classe', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Toutes les classes</option>
                {(educationLevels.find(l => l.id === selectedLevel)?.classes || []).map(classe => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>

            {/* Matières du niveau sélectionné */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière
              </label>
              <select
                value={filters.matiere}
                onChange={(e) => handleFilterChange('matiere', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Toutes les matières</option>
                {(educationLevels.find(l => l.id === selectedLevel)?.matieres || []).map(matiere => (
                  <option key={matiere} value={matiere}>{matiere}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tri */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus téléchargés</option>
            <option value="favorites">Plus de favoris</option>
          </select>
        </div>

        {/* Résumé des filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Filtres actifs</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                {selectedLevel && (
                  <div>Niveau: {educationLevels.find(l => l.id === selectedLevel)?.name}</div>
                )}
                {filters.classe && <div>Classe: {filters.classe}</div>}
                {filters.matiere && <div>Matière: {filters.matiere}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default HierarchicalFilterPanel;