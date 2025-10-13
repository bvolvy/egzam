import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, BookOpen, GraduationCap, Wrench, FileCheck } from 'lucide-react';
import { educationLevels, getClassesByLevel, getMatieresByLevel } from '../data/educationHierarchy';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata: any) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedLevel, setSelectedLevel] = useState('');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableMatieres, setAvailableMatieres] = useState<string[]>([]);

  const [metadata, setMetadata] = useState({
    title: '',
    classe: '',
    matiere: '',
    level: '',
    year: '',
    session: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleLevelChange = (levelId: string) => {
    setSelectedLevel(levelId);
    const classes = getClassesByLevel(levelId);
    const matieres = getMatieresByLevel(levelId);

    setAvailableClasses(classes);
    setAvailableMatieres(matieres);

    setMetadata(prev => ({
      ...prev,
      level: levelId,
      classe: '',
      matiere: ''
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    if (selectedFile.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 10MB');
      return;
    }

    setFile(selectedFile);
    if (!metadata.title) {
      setMetadata(prev => ({
        ...prev,
        title: selectedFile.name.replace('.pdf', '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    if (!metadata.level || !metadata.classe || !metadata.matiere || !metadata.title) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const isOfficial = metadata.level === 'officiel';

      await onUpload(file, {
        title: metadata.title,
        description: metadata.description || `Examen ${metadata.matiere} - ${metadata.classe}`,
        classe: metadata.classe,
        matiere: metadata.matiere,
        level: metadata.level,
        isOfficial
      });

      setUploadSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedLevel('');
    setAvailableClasses([]);
    setAvailableMatieres([]);
    setMetadata({
      title: '',
      classe: '',
      matiere: '',
      level: '',
      year: '',
      session: '',
      description: ''
    });
    setUploadSuccess(false);
    setError(null);
    setUploading(false);
  };

  const getLevelIcon = (levelId: string) => {
    switch (levelId) {
      case 'secondaire':
        return <BookOpen className="h-5 w-5" />;
      case 'officiel':
        return <FileCheck className="h-5 w-5" />;
      case 'universite':
        return <GraduationCap className="h-5 w-5" />;
      case 'technique':
        return <Wrench className="h-5 w-5" />;
      case 'concours':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Téléverser un examen</h2>
            <p className="text-sm text-gray-500 mt-1">Partagez vos examens avec la communauté</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="ml-4 p-2 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-green-700" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Glissez votre fichier PDF ici
                </p>
                <p className="text-gray-500 mb-4">ou</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choisir un fichier
                </button>
                <p className="text-xs text-gray-400 mt-2">PDF uniquement, max 10MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Sélection du niveau d'enseignement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Niveau d'enseignement *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {educationLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => handleLevelChange(level.id)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    selectedLevel === level.id
                      ? `border-${level.color.accent} bg-${level.color.secondary} shadow-md`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{level.icon}</span>
                  <div className="text-left flex-1">
                    <div className={`font-semibold text-sm ${
                      selectedLevel === level.id ? `text-${level.color.accent}` : 'text-gray-900'
                    }`}>
                      {level.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {level.classes.length} classes
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Champs conditionnels basés sur le niveau */}
          {selectedLevel && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getLevelIcon(selectedLevel)}
                <span className="font-medium">
                  {educationLevels.find(l => l.id === selectedLevel)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'examen *
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Examen de Mathématiques - Philo"
                    required
                  />
                </div>

                {/* Classe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe *
                  </label>
                  <select
                    value={metadata.classe}
                    onChange={(e) => setMetadata(prev => ({ ...prev, classe: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {availableClasses.map(classe => (
                      <option key={classe} value={classe}>{classe}</option>
                    ))}
                  </select>
                </div>

                {/* Matière */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matière *
                  </label>
                  <select
                    value={metadata.matiere}
                    onChange={(e) => setMetadata(prev => ({ ...prev, matiere: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {availableMatieres.map(matiere => (
                      <option key={matiere} value={matiere}>{matiere}</option>
                    ))}
                  </select>
                </div>

                {/* Année (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année
                  </label>
                  <input
                    type="number"
                    value={metadata.year}
                    onChange={(e) => setMetadata(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2024"
                    min="2020"
                    max="2030"
                  />
                </div>

                {/* Session (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session
                  </label>
                  <select
                    value={metadata.session}
                    onChange={(e) => setMetadata(prev => ({ ...prev, session: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une session</option>
                    <option value="1ère Session">1ère Session</option>
                    <option value="2ème Session">2ème Session</option>
                    <option value="Session de Rattrapage">Session de Rattrapage</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description ou remarques sur l'examen..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">Fichier téléversé avec succès ! En attente de validation.</p>
            </div>
          )}

          {/* Note d'information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              <strong>Note :</strong> Votre examen sera examiné par un administrateur avant d'être publié sur la plateforme.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={uploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!file || !selectedLevel || uploading || uploadSuccess}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Téléversement...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Téléverser</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
