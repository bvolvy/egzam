import React, { useState } from 'react';
import { X, User, Mail, Calendar, Upload, Download, Star, Settings, Edit2, Save, Camera, Award, TrendingUp, FileText, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockExams } from '../data/mockData';
import { favoritesStorage } from '../utils/storage';
import UserAvatar from './UserAvatar';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads' | 'favorites' | 'settings'>('overview');
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionné d\'éducation et de partage de connaissances.'
  });

  if (!user) return null;

  // Calculer les statistiques réelles
  const userUploads = mockExams.filter(exam => exam.uploader.name === user.name);
  const favoriteIds = favoritesStorage.load();
  const userFavorites = mockExams.filter(exam => favoriteIds.includes(exam.id));
  const totalDownloadsReceived = userUploads.reduce((sum, exam) => sum + exam.downloads, 0);
  
  // Calculer les jours depuis l'inscription
  const daysSinceJoin = Math.floor((Date.now() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleSave = () => {
    // Sauvegarder les modifications du profil
    updateUser({
      name: editData.name,
      email: editData.email
    });
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header avec photo de profil */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 h-32">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Photo de profil avec initiales */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <UserAvatar name={user.name} size="xl" className="border-4 border-white shadow-lg" />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="pt-16 px-6 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full text-gray-600 bg-gray-50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    {user.isPremium && (
                      <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <p className="text-gray-600 text-sm">{editData.bio}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user.uploads}</div>
              <div className="text-sm text-gray-600">Uploads</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user.downloads}</div>
              <div className="text-sm text-gray-600">Téléchargements</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{favoriteIds.length}</div>
              <div className="text-sm text-gray-600">Favoris</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {daysSinceJoin}
              </div>
              <div className="text-sm text-gray-600">Jours</div>
            </div>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'uploads'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mes uploads ({userUploads.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Favoris ({userFavorites.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Paramètres
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Activité récente */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Activité récente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Upload className="h-4 w-4 text-green-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload d'un nouvel examen</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Download className="h-4 w-4 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Votre examen a été téléchargé 5 fois</p>
                      <p className="text-xs text-gray-500">Il y a 1 jour</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations du compte */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informations du compte
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">Membre depuis</span>
                    </div>
                    <p className="text-gray-900">{formatDate(user.joinDate)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">Email vérifié</span>
                    </div>
                    <p className="text-green-600 font-medium">✓ Vérifié</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="space-y-4">
              {userUploads.length > 0 ? (
                userUploads.map(exam => (
                  <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{exam.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {exam.downloads} téléchargements
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {exam.favorites} favoris
                          </span>
                          <span>{formatDate(exam.uploadDate)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {exam.classe}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {exam.matiere}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun examen uploadé pour le moment</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {userFavorites.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Mes examens favoris</h3>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      {userFavorites.length} favori{userFavorites.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {userFavorites.map(exam => (
                    <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                            <Star className="h-4 w-4 text-red-500 fill-current" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Par {exam.uploader.name}</span>
                            <span>{formatDate(exam.uploadDate)}</span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {exam.downloads} téléchargements
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {exam.classe}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {exam.matiere}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Prévisualiser"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                              title="Télécharger"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Retirer des favoris"
                            >
                              <Heart className="h-3 w-3 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori pour le moment</h3>
                  <p className="text-gray-600 mb-4">Commencez à ajouter des examens à vos favoris</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Parcourir les examens
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Préférences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-gray-600">Recevoir des notifications pour les nouveaux examens</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Profil public</p>
                      <p className="text-sm text-gray-600">Permettre aux autres de voir votre profil</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Zone de danger</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-700 mb-3">
                    La suppression de votre compte est irréversible. Tous vos examens uploadés seront supprimés.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;