import React, { useState } from 'react';
import { BookOpen, Search, User, Upload, Menu, X, Star, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import NotificationCenter from './NotificationCenter';
import UserAvatar from './UserAvatar';
import FavoritesPage from './FavoritesPage';

// Composant Logo avec les couleurs d'Haïti
const HaitiLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <div className={`relative ${className}`}>
    {/* Fond avec gradient des couleurs d'Haïti */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 rounded-lg shadow-lg"></div>
    
    {/* Effet de brillance */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-lg"></div>
    
    {/* Icône du livre */}
    <div className="relative h-full w-full flex items-center justify-center">
      <BookOpen className="h-5 w-5 text-white drop-shadow-sm" />
    </div>
    
    {/* Petit accent doré pour l'élégance */}
    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-sm"></div>
  </div>
);
interface HeaderProps {
  onSearch: (term: string) => void;
  onUploadClick: () => void;
  onAdminClick: () => void;
  favorites: any[];
  onDownload: (examId: string) => void;
  onFavorite: (examId: string) => void;
  onPreview: (examId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onUploadClick, 
  onAdminClick, 
  favorites, 
  onDownload, 
  onFavorite, 
  onPreview 
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleUploadClick = () => {
    if (user) {
      onUploadClick();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
    setShowUserMenu(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    setShowUserMenu(false);
  };

  const handleFavoritesClick = () => {
    setShowFavorites(true);
    setShowUserMenu(false);
  };
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <HaitiLogo className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EgzamAchiv</h1>
                <p className="text-xs text-gray-600 -mt-1">Bibliothèque des Examens Haïtiens</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un examen, matière, classe..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleUploadClick}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Téléverser
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <UserAvatar name={user.name} size="md" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button 
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mon profil
                        </button>
                        <button 
                          onClick={handleFavoritesClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Mes favoris ({favorites.length})
                        </button>
                        {user.email === 'admin@egzamachiv.ht' && (
                          <button 
                            onClick={onAdminClick}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Administration
                          </button>
                        )}
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Se connecter
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <button
                onClick={handleUploadClick}
                className="w-full flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Upload className="h-4 w-4 mr-3" />
                Téléverser
              </button>
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2 space-x-3">
                    <UserAvatar name={user.name} size="md" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Mon profil
                  </button>
                  <button 
                    onClick={handleNotificationClick}
                    className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <button 
                    onClick={handleFavoritesClick}
                    className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Star className="h-4 w-4 mr-3" />
                    Mes favoris ({favorites.length})
                  </button>
                  {user.email === 'admin@egzamachiv.ht' && (
                    <button 
                      onClick={onAdminClick}
                      className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Administration
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Se connecter
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}

      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {showFavorites && (
        <FavoritesPage
          favorites={favorites}
          onDownload={onDownload}
          onFavorite={onFavorite}
          onPreview={onPreview}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </>
  );
};

export default Header;