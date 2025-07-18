import React, { useState } from 'react';
import { X, Users, FileText, Settings, Trash2, Eye, Check, AlertTriangle, Download, Upload, Plus, Edit2, Save, Ambulance as Cancel, UserX, Shield, Crown, Mail, Calendar, Ban, UserCheck, BookOpen, GraduationCap, Wrench } from 'lucide-react';
import { mockExams } from '../data/mockData';
import { educationLevels, getAllClasses, getAllMatieres } from '../data/educationHierarchy';
import { Exam, User } from '../types';
import PreviewModal from './PreviewModal';
import { customDataStorage } from '../utils/storage';

// Logo pour le panneau admin
const AdminLogo: React.FC = () => (
  <div className="relative h-6 w-6">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 rounded-lg shadow-md"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-lg"></div>
    <div className="relative h-full w-full flex items-center justify-center">
      <Settings className="h-4 w-4 text-white drop-shadow-sm" />
    </div>
    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-sm"></div>
  </div>
);
interface AdminPanelProps {
  onClose: () => void;
  pendingExams: Exam[];
  publishedExams: Exam[];
  onApproveExam: (examId: string) => void;
  onRejectExam: (examId: string) => void;
  onDeletePendingExam: (examId: string) => void;
  onDeletePublishedExam: (examId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, 
  pendingExams, 
  publishedExams, 
  onApproveExam, 
  onRejectExam, 
  onDeletePendingExam, 
  onDeletePublishedExam 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'exams' | 'pending' | 'settings'>('pending');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [editingClasse, setEditingClasse] = useState<string | null>(null);
  const [editingMatiere, setEditingMatiere] = useState<string | null>(null);
  const [newClasse, setNewClasse] = useState('');
  const [newMatiere, setNewMatiere] = useState('');
  const [selectedLevelForClasse, setSelectedLevelForClasse] = useState('');
  const [selectedLevelForMatiere, setSelectedLevelForMatiere] = useState('');
  const [editValue, setEditValue] = useState('');
  const [customLevels, setCustomLevels] = useState(educationLevels);

  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [examToReject, setExamToReject] = useState<string | null>(null);

  // Mock data pour les utilisateurs
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@egzamachiv.ht',
      name: 'Admin EgzamAchiv',
      isPremium: true,
      joinDate: new Date('2024-01-15'),
      uploads: 25,
      downloads: 150,
      isActive: true,
      isSuspended: false
    },
    {
      id: '2',
      email: 'marie@example.com',
      name: 'Marie Dupont',
      isPremium: false,
      joinDate: new Date('2024-02-20'),
      uploads: 8,
      downloads: 45,
      isActive: true,
      isSuspended: false
    },
    {
      id: '3',
      email: 'jean@example.com',
      name: 'Jean Martin',
      isPremium: false,
      joinDate: new Date('2024-03-01'),
      uploads: 3,
      downloads: 12,
      isActive: true,
      isSuspended: true
    },
    {
      id: '4',
      email: 'sophie@example.com',
      name: 'Sophie Leblanc',
      isPremium: true,
      joinDate: new Date('2024-01-30'),
      uploads: 15,
      downloads: 89,
      isActive: false,
      isSuspended: false
    }
  ];

  const [users, setUsers] = useState<User[]>(mockUsers);

  // Charger les niveaux personnalisés au démarrage
  React.useEffect(() => {
    const savedLevels = customDataStorage.loadCustomLevels(educationLevels);
    setCustomLevels(savedLevels);
  }, []);

  // Sauvegarder les niveaux personnalisés
  const saveCustomLevels = (levels: any[]) => {
    setCustomLevels(levels);
    customDataStorage.saveCustomLevels(levels);
  };

  // Ajouter une classe à un niveau
  const addClasseToLevel = (levelId: string, newClasse: string) => {
    if (!newClasse.trim()) return;
    
    const updatedLevels = customLevels.map(level => 
      level.id === levelId 
        ? { ...level, classes: [...level.classes, newClasse.trim()] }
        : level
    );
    saveCustomLevels(updatedLevels);
    setNewClasse('');
    setSelectedLevelForClasse('');
  };

  // Supprimer une classe d'un niveau
  const removeClasseFromLevel = (levelId: string, classeToRemove: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classeToRemove}" ?`)) {
      const updatedLevels = customLevels.map(level => 
        level.id === levelId 
          ? { ...level, classes: level.classes.filter(c => c !== classeToRemove) }
          : level
      );
      saveCustomLevels(updatedLevels);
    }
  };

  // Ajouter une matière à un niveau
  const addMatiereToLevel = (levelId: string, newMatiere: string) => {
    if (!newMatiere.trim()) return;
    
    const updatedLevels = customLevels.map(level => 
      level.id === levelId 
        ? { ...level, matieres: [...level.matieres, newMatiere.trim()] }
        : level
    );
    saveCustomLevels(updatedLevels);
    setNewMatiere('');
    setSelectedLevelForMatiere('');
  };

  // Supprimer une matière d'un niveau
  const removeMatiereFromLevel = (levelId: string, matiereToRemove: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${matiereToRemove}" ?`)) {
      const updatedLevels = customLevels.map(level => 
        level.id === levelId 
          ? { ...level, matieres: level.matieres.filter(m => m !== matiereToRemove) }
          : level
      );
      saveCustomLevels(updatedLevels);
    }
  };

  // Modifier une classe
  const editClasse = (levelId: string, oldClasse: string, newClasse: string) => {
    if (!newClasse.trim()) return;
    
    const updatedLevels = customLevels.map(level => 
      level.id === levelId 
        ? { 
            ...level, 
            classes: level.classes.map(c => c === oldClasse ? newClasse.trim() : c) 
          }
        : level
    );
    saveCustomLevels(updatedLevels);
    setEditingClasse(null);
    setEditValue('');
  };

  // Modifier une matière
  const editMatiere = (levelId: string, oldMatiere: string, newMatiere: string) => {
    if (!newMatiere.trim()) return;
    
    const updatedLevels = customLevels.map(level => 
      level.id === levelId 
        ? { 
            ...level, 
            matieres: level.matieres.map(m => m === oldMatiere ? newMatiere.trim() : m) 
          }
        : level
    );
    saveCustomLevels(updatedLevels);
    setEditingMatiere(null);
    setEditValue('');
  };

  const handlePreviewExam = (exam: Exam) => {
    setPreviewExam(exam);
    setShowPreviewModal(true);
  };

  const handleApproveClick = (examId: string) => {
    onApproveExam(examId);
    alert('Examen approuvé avec succès !');
  };

  const handleRejectClick = (examId: string) => {
    setExamToReject(examId);
    setShowRejectionModal(true);
  };

  const confirmReject = () => {
    if (examToReject) {
      onRejectExam(examToReject);
      setShowRejectionModal(false);
      setExamToReject(null);
      setRejectionReason('');
      alert('Examen rejeté.');
    }
  };

  const handleDeletePendingClick = (examId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      onDeletePendingExam(examId);
      alert('Examen supprimé.');
    }
  };

  const handleDeletePublishedClick = (examId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet examen publié ?')) {
      onDeletePublishedExam(examId);
      alert('Examen publié supprimé.');
    }
  };

  // Obtenir toutes les classes et matières du système hiérarchique
  const allClasses = getAllClasses();
  const allMatieres = getAllMatieres();

  // Fonctions de gestion des utilisateurs
  const handleSuspendUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir suspendre cet utilisateur ?')) {
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isSuspended: true }
            : user
        )
      );
      alert('Utilisateur suspendu avec succès.');
    }
  };

  const handleUnsuspendUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isSuspended: false }
          : user
      )
    );
    alert('Suspension levée avec succès.');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('Utilisateur supprimé avec succès.');
    }
  };

  const handleTogglePremium = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isPremium: !user.isPremium }
          : user
      )
    );
    alert('Statut Premium modifié avec succès.');
  };

  const handleSendEmail = (userEmail: string) => {
    // Simulation d'envoi d'email
    const subject = encodeURIComponent('Message depuis EgzamAchiv');
    const body = encodeURIComponent('Bonjour,\n\nNous vous contactons concernant votre compte EgzamAchiv.\n\nCordialement,\nL\'équipe EgzamAchiv');
    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'Inconnu';
    }
  };

  const pendingCount = pendingExams.filter(exam => exam.status === 'pending').length;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <AdminLogo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panneau d'administration</h1>
                <p className="text-sm text-gray-600">Gestion de la plateforme EgzamAchiv</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Examens en attente
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'exams'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Tous les examens
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {activeTab === 'pending' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Examens en attente d'approbation</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>{pendingCount} examen{pendingCount > 1 ? 's' : ''} en attente</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingExams.filter(exam => !exam.status || exam.status === 'pending').map(exam => (
                    <div key={exam.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(exam.status)}`}>
                              {getStatusText(exam.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{exam.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Classe:</span>
                              <p className="text-gray-600">{exam.classe}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Matière:</span>
                              <p className="text-gray-600">{exam.matiere}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Taille:</span>
                              <p className="text-gray-600">{exam.fileSize} MB</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Soumis le:</span>
                              <p className="text-gray-600">{formatDate(exam.submissionDate || exam.uploadDate)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">Auteur:</span>
                            <span className="text-gray-600 ml-2">{exam.uploader.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handlePreviewExam(exam)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Prévisualiser"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproveClick(exam.id)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approuver"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectClick(exam.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePendingClick(exam.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {pendingExams.filter(exam => !exam.status || exam.status === 'pending').length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun examen en attente</h3>
                      <p className="text-gray-600">Tous les examens soumis ont été traités.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'exams' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Tous les examens</h2>
                  <div className="text-sm text-gray-600">
                    {publishedExams.length} examens publiés
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publishedExams.map(exam => (
                    <div key={exam.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exam.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{exam.classe}</span>
                        <span>{exam.matiere}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {exam.downloads}
                          </span>
                          <span>{Math.round(exam.fileSize * 10) / 10} MB</span>
                        </div>
                        <button
                          onClick={() => handleDeletePublishedClick(exam.id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{users.length} utilisateurs inscrits</span>
                    <span>•</span>
                    <span className="text-red-600">{users.filter(u => u.isSuspended).length} suspendus</span>
                    <span>•</span>
                    <span className="text-yellow-600">{users.filter(u => u.isPremium).length} premium</span>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.isActive).length}</div>
                        <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                      </div>
                      <UserCheck className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{users.filter(u => u.isPremium).length}</div>
                        <div className="text-sm text-gray-600">Comptes Premium</div>
                      </div>
                      <Crown className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{users.filter(u => u.isSuspended).length}</div>
                        <div className="text-sm text-gray-600">Suspendus</div>
                      </div>
                      <Ban className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{users.reduce((sum, u) => sum + u.uploads, 0)}</div>
                        <div className="text-sm text-gray-600">Total uploads</div>
                      </div>
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                                user.isSuspended ? 'bg-red-500' : user.isPremium ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}>
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="flex items-center space-x-2 mt-1">
                                  {user.isSuspended && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      <Ban className="h-3 w-3 mr-1" />
                                      Suspendu
                                    </span>
                                  )}
                                  {!user.isActive && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      Inactif
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isPremium 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isPremium ? (
                                <span className="flex items-center">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Premium
                                </span>
                              ) : (
                                'Standard'
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.uploads}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(user.joinDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {/* Bouton Email */}
                              <button
                                onClick={() => handleSendEmail(user.email)}
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Envoyer un email"
                              >
                                <Mail className="h-4 w-4" />
                              </button>
                              
                              {/* Bouton Premium */}
                              <button
                                onClick={() => handleTogglePremium(user.id)}
                                className={`p-1 rounded transition-colors ${
                                  user.isPremium
                                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                }`}
                                title={user.isPremium ? 'Retirer Premium' : 'Activer Premium'}
                              >
                                <Crown className="h-4 w-4" />
                              </button>
                              
                              {/* Bouton Suspension */}
                              {user.isSuspended ? (
                                <button
                                  onClick={() => handleUnsuspendUser(user.id)}
                                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                  title="Lever la suspension"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="p-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                                  title="Suspendre"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                              )}
                              
                              {/* Bouton Suppression */}
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Légende des actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions disponibles :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-blue-600" />
                      <span>Envoyer un email</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-3 w-3 text-yellow-600" />
                      <span>Gérer le statut Premium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ban className="h-3 w-3 text-orange-600" />
                      <span>Suspendre/Réactiver</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-3 w-3 text-green-600" />
                      <span>Lever la suspension</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trash2 className="h-3 w-3 text-red-600" />
                      <span>Supprimer définitivement</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Système éducatif hiérarchique */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Système éducatif haïtien</h2>
                    <div className="text-sm text-gray-600">
                      {customLevels.length} niveaux • {customLevels.reduce((sum, l) => sum + l.classes.length, 0)} classes • {customLevels.reduce((sum, l) => sum + l.matieres.length, 0)} matières
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {customLevels.map((level) => (
                      <div key={level.id} className={`bg-${level.color.secondary} border border-${level.color.primary}-200 rounded-lg p-6`}>
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-2xl">{level.icon}</span>
                          <div>
                            <h3 className={`text-lg font-semibold text-${level.color.accent}`}>
                              {level.name}
                            </h3>
                            <p className="text-sm text-gray-600">{level.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Classes */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                              Classes ({level.classes.length})
                              </h4>
                              <button
                                onClick={() => {
                                  setSelectedLevelForClasse(level.id);
                                  setNewClasse('');
                                }}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                              >
                                <Plus className="h-3 w-3 inline mr-1" />
                                Ajouter
                              </button>
                            </div>
                            
                            {/* Formulaire d'ajout de classe */}
                            {selectedLevelForClasse === level.id && (
                              <div className="mb-3 p-3 bg-white rounded border border-green-200">
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={newClasse}
                                    onChange={(e) => setNewClasse(e.target.value)}
                                    placeholder="Nouvelle classe..."
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        addClasseToLevel(level.id, newClasse);
                                      } else if (e.key === 'Escape') {
                                        setSelectedLevelForClasse('');
                                        setNewClasse('');
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => addClasseToLevel(level.id, newClasse)}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLevelForClasse('');
                                      setNewClasse('');
                                    }}
                                    className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                              {level.classes.map((classe) => (
                                <div
                                  key={classe}
                                  className={`group flex items-center px-3 py-1 bg-${level.color.primary}-100 text-${level.color.accent} text-sm rounded-full border border-${level.color.primary}-200`}
                                >
                                  {editingClasse === `${level.id}-${classe}` ? (
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          editClasse(level.id, classe, editValue);
                                        } else if (e.key === 'Escape') {
                                          setEditingClasse(null);
                                          setEditValue('');
                                        }
                                      }}
                                      className="bg-white px-1 py-0 text-xs border border-gray-300 rounded w-20"
                                      autoFocus
                                    />
                                  ) : (
                                    <span>{classe}</span>
                                  )}
                                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button
                                      onClick={() => {
                                        setEditingClasse(`${level.id}-${classe}`);
                                        setEditValue(classe);
                                      }}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => removeClasseFromLevel(level.id, classe)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Matières */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                              Matières ({level.matieres.length})
                              </h4>
                              <button
                                onClick={() => {
                                  setSelectedLevelForMatiere(level.id);
                                  setNewMatiere('');
                                }}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="h-3 w-3 inline mr-1" />
                                Ajouter
                              </button>
                            </div>
                            
                            {/* Formulaire d'ajout de matière */}
                            {selectedLevelForMatiere === level.id && (
                              <div className="mb-3 p-3 bg-white rounded border border-blue-200">
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={newMatiere}
                                    onChange={(e) => setNewMatiere(e.target.value)}
                                    placeholder="Nouvelle matière..."
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        addMatiereToLevel(level.id, newMatiere);
                                      } else if (e.key === 'Escape') {
                                        setSelectedLevelForMatiere('');
                                        setNewMatiere('');
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => addMatiereToLevel(level.id, newMatiere)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLevelForMatiere('');
                                      setNewMatiere('');
                                    }}
                                    className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                              {level.matieres.map((matiere) => (
                                <div
                                  key={matiere}
                                  className={`group flex items-center px-3 py-1 bg-${level.color.primary}-100 text-${level.color.accent} text-sm rounded-full border border-${level.color.primary}-200`}
                                >
                                  {editingMatiere === `${level.id}-${matiere}` ? (
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          editMatiere(level.id, matiere, editValue);
                                        } else if (e.key === 'Escape') {
                                          setEditingMatiere(null);
                                          setEditValue('');
                                        }
                                      }}
                                      className="bg-white px-1 py-0 text-xs border border-gray-300 rounded w-24"
                                      autoFocus
                                    />
                                  ) : (
                                    <span>{matiere}</span>
                                  )}
                                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button
                                      onClick={() => {
                                        setEditingMatiere(`${level.id}-${matiere}`);
                                        setEditValue(matiere);
                                      }}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => removeMatiereFromLevel(level.id, matiere)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paramètres généraux */}
                <div>
                  <h2 className="text-lg font-semibold mb-6">Paramètres généraux</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Système éducatif</h3>
                          <p className="text-sm text-gray-600">
                            {customLevels.length} niveaux • {customLevels.reduce((sum, l) => sum + l.classes.length, 0)} classes • {customLevels.reduce((sum, l) => sum + l.matieres.length, 0)} matières
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Haïtien
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Taille maximale des fichiers</h3>
                          <p className="text-sm text-gray-600">Limite actuelle: 5 MB pour les fichiers PDF</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          5 MB
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Types de fichiers acceptés</h3>
                          <p className="text-sm text-gray-600">Formats autorisés pour les examens</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          PDF uniquement
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Modération automatique</h3>
                          <p className="text-sm text-gray-600">Tous les uploads nécessitent une approbation</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          Activée
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Gestion des niveaux</h3>
                          <p className="text-sm text-gray-600">Ajouter/modifier/supprimer classes et matières</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          Personnalisable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de rejet avec raison */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rejeter l'examen
              </h3>
              <p className="text-gray-600 mb-4">
                Veuillez indiquer la raison du rejet (optionnel) :
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Raison du rejet..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setExamToReject(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreviewModal && previewExam && (
        <PreviewModal
          exam={previewExam}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewExam(null);
          }}
          onDownload={() => {}}
          onFavorite={() => {}}
        />
      )}
    </>
  );
};

export default AdminPanel;