import React, { useState } from 'react';
import { X, Upload, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { classes, matieres } from '../data/mockData';
import PrivacyTermsPage from './PrivacyTermsPage';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (examData: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classe: '',
    matiere: '',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        alert('Seuls les fichiers PDF sont acceptés.');
        return;
      }
      
      // Vérifier la taille du fichier (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        alert('Le fichier ne doit pas dépasser 5MB.');
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Vérifier le type de fichier
      if (file.type !== 'application/pdf') {
        alert('Seuls les fichiers PDF sont acceptés.');
        return;
      }
      
      // Vérifier la taille du fichier (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        alert('Le fichier ne doit pas dépasser 5MB.');
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    setIsUploading(true);
    
    // Simuler l'upload du fichier réel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // En production, ici on uploadrait le fichier réel vers le serveur
    // const formDataToSend = new FormData();
    // formDataToSend.append('file', formData.file);
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('description', formData.description);
    // formDataToSend.append('classe', formData.classe);
    // formDataToSend.append('matiere', formData.matiere);
    // 
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formDataToSend
    // });
    
    // Stocker le fichier réel dans le stockage local pour la prévisualisation
    const fileUrl = URL.createObjectURL(formData.file);
    const examId = Date.now().toString();
    localStorage.setItem(`exam_file_${examId}`, fileUrl);
    
    const examData = {
      id: examId,
      title: formData.title,
      description: formData.description,
      classe: formData.classe,
      matiere: formData.matiere,
      fileName: formData.file.name,
      fileSize: formData.file.size / (1024 * 1024), // Convert to MB
      fileData: formData.file, // Garder une référence au fichier réel
      documentUrl: fileUrl // URL pour la prévisualisation
    };

    onUpload(examData);
    setIsUploading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Téléverser un examen
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Warning Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 leading-relaxed">
                    📤 <strong>En téléversant un fichier, vous certifiez avoir le droit de le partager.</strong> Aucun contenu publicitaire, illégal ou protégé sans autorisation n'est accepté. Voir nos{' '}
                    <button 
                      type="button"
                      onClick={() => setShowPrivacyTerms(true)}
                      className="underline hover:text-red-900 font-medium"
                    >
                      Conditions d'utilisation
                    </button>{' '}
                    et notre{' '}
                    <button 
                      type="button"
                      onClick={() => setShowPrivacyTerms(true)}
                      className="underline hover:text-red-900 font-medium"
                    >
                      Politique de confidentialité
                    </button>.
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'examen *
              </label>
              <input
                type="text"
                name="title"
                accept=".pdf"
                onChange={handleChange}
                accept=".pdf"
                placeholder="Ex: Examen de Mathématiques - Fonctions"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez brièvement le contenu de l'examen..."
              />
            </div>

            {/* Classe and Matière */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe *
                </label>
                <select
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(classe => (
                    <option key={classe} value={classe}>{classe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                <select
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {matieres.map(matiere => (
                    <option key={matiere} value={matiere}>{matiere}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier de l'examen *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="space-y-2">
                  {formData.file ? (
                    <>
                      <FileText className="h-10 w-10 text-blue-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-900">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round((formData.file.size / (1024 * 1024)) * 10) / 10} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Glissez-déposez votre fichier ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF uniquement jusqu'à 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Téléversement...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Privacy & Terms Modal */}
      {showPrivacyTerms && (
        <PrivacyTermsPage onClose={() => setShowPrivacyTerms(false)} />
      )}
    </>
  );
};

export default UploadModal;