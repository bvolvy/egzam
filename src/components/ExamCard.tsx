import React from 'react';
import { Download, Heart, User, Calendar, FileText, TrendingUp, Eye } from 'lucide-react';
import { Exam } from '../types';
import MENFPBadge from './MENFPBadge';
import { getLevelByClasse } from '../data/educationHierarchy';

interface ExamCardProps {
  exam: Exam;
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
  onPreview: (examId: string) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onDownload, onFavorite, onPreview }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
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

  const handleDownloadClick = () => {
    // Créer un lien de téléchargement simulé
    const link = document.createElement('a');
    
    // Créer un contenu PDF simulé
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
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(${exam.title}) Tj
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
0000000369 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
466
%%EOF`;
    
    // Créer un blob PDF
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Configurer le téléchargement
    link.href = url;
    link.download = exam.fileName;
    link.style.display = 'none';
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    // Mettre à jour le compteur
    onDownload(exam.id);
  };

  const isPopular = exam.downloads > 150;
  const isRecent = new Date(exam.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Vérifier si c'est un examen officiel MENFP
  const isMENFPOfficial = exam.isOfficial || exam.level === 'officiel';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group backdrop-blur-sm">
      {/* Header with gradient accent */}
      <div className={`h-2 bg-gradient-to-r ${isPopular ? 'from-red-500 to-red-600' : isRecent ? 'from-blue-500 to-blue-600' : 'from-gray-400 to-gray-500'}`}></div>
      
      <div className="p-6">
        {/* Title and description */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-3">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                {exam.title}
              </h3>
              {/* Badge MENFP pour examens officiels */}
              {isMENFPOfficial && (
                <div className="mt-2">
                  <MENFPBadge size="sm" variant="crown" />
                </div>
              )}
            </div>
            <div className="ml-3 flex-shrink-0">
              <FileText className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            {exam.classe}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getMatiereColor(exam.matiere)}`}>
            {exam.matiere}
          </span>
          {/* Badge niveau officiel */}
          {isMENFPOfficial && (
            <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs font-bold rounded-full border border-red-300">
              📋 Officiel
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium">{exam.uploader.name}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(exam.uploadDate)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{Math.round(exam.fileSize * 10) / 10} MB</span>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{exam.downloads} téléchargements</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onFavorite(exam.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              exam.isFavorited
                ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${exam.isFavorited ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{exam.favorites}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPreview(exam.id)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-200"
              title="Prévisualiser"
            >
              <Eye className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDownloadClick}
              className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;