import React, { useState } from 'react';
import { BookOpen, Heart } from 'lucide-react';
import PrivacyTermsPage from './PrivacyTermsPage';

// Composant Logo pour le footer (version plus petite)
const HaitiLogoSmall: React.FC = () => (
  <div className="relative h-6 w-6">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 rounded-md shadow-md"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-md"></div>
    <div className="relative h-full w-full flex items-center justify-center">
      <BookOpen className="h-3.5 w-3.5 text-white drop-shadow-sm" />
    </div>
    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-sm"></div>
  </div>
);
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-3">
              <HaitiLogoSmall />
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-gray-900">EgzamAchiv</p>
                <p className="text-xs text-gray-600">
                  © {currentYear} EgzamAchiv. Tous droits réservés.
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => setShowPrivacyTerms(true)}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Politique de confidentialité
              </button>
              <button 
                onClick={() => setShowPrivacyTerms(true)}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Conditions d'utilisation
              </button>
              <a 
                href="#" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                FAQ
              </a>
            </nav>

            {/* Made with love */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>Fait avec</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>en Haïti</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy & Terms Modal */}
      {showPrivacyTerms && (
        <PrivacyTermsPage onClose={() => setShowPrivacyTerms(false)} />
      )}
    </>
  );
};

export default Footer;