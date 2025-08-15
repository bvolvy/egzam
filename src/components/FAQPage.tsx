import React, { useState } from 'react';
import { X, Search, ChevronDown, ChevronUp, HelpCircle, Mail, MessageCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

interface FAQPageProps {
  onClose: () => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    // Général
    {
      id: '1',
      category: 'general',
      question: 'Qu\'est-ce qu\'EgzamAchiv ?',
      answer: 'EgzamAchiv est une plateforme collaborative dédiée au partage d\'examens scolaires haïtiens. Elle permet aux étudiants, enseignants et parents d\'accéder à une vaste bibliothèque d\'examens pour faciliter l\'apprentissage et la préparation aux évaluations.',
      tags: ['plateforme', 'examens', 'haïti']
    },
    {
      id: '2',
      category: 'general',
      question: 'Est-ce que EgzamAchiv est gratuit ?',
      answer: 'Oui, EgzamAchiv est entièrement gratuit ! Vous pouvez télécharger tous les examens sans créer de compte. Seul le téléversement d\'examens nécessite une inscription gratuite.',
      tags: ['gratuit', 'prix']
    },
    {
      id: '3',
      category: 'general',
      question: 'Quelles classes et matières sont disponibles ?',
      answer: 'Nous couvrons toutes les classes du système éducatif haïtien (6e AF à Philo) et toutes les matières principales : Mathématiques, Français, Histoire-Géographie, SVT, Physique-Chimie, Anglais, Espagnol, Philosophie, et plus encore.',
      tags: ['classes', 'matières']
    },

    // Téléchargement
    {
      id: '4',
      category: 'download',
      question: 'Comment télécharger un examen ?',
      answer: 'C\'est très simple ! Trouvez l\'examen qui vous intéresse, cliquez sur le bouton de téléchargement (icône flèche vers le bas). Le fichier PDF sera automatiquement téléchargé sur votre appareil.',
      tags: ['télécharger', 'pdf']
    },
    {
      id: '5',
      category: 'download',
      question: 'Ai-je besoin d\'un compte pour télécharger ?',
      answer: 'Non ! Vous pouvez télécharger tous les examens sans créer de compte. L\'inscription n\'est nécessaire que si vous souhaitez téléverser vos propres examens.',
      tags: ['compte', 'inscription']
    },
    {
      id: '6',
      category: 'download',
      question: 'Dans quel format sont les examens ?',
      answer: 'Tous les examens sont au format PDF pour garantir une qualité d\'affichage optimale et une compatibilité universelle avec tous les appareils.',
      tags: ['format', 'pdf']
    },

    // Téléversement
    {
      id: '7',
      category: 'upload',
      question: 'Comment téléverser un examen ?',
      answer: 'Créez d\'abord un compte gratuit, puis cliquez sur "Téléverser" dans le menu. Remplissez les informations (titre, description, classe, matière) et sélectionnez votre fichier PDF. Votre examen sera vérifié avant publication.',
      tags: ['téléverser', 'partager']
    },
    {
      id: '8',
      category: 'upload',
      question: 'Quels types de fichiers puis-je téléverser ?',
      answer: 'Seuls les fichiers PDF sont acceptés, avec une taille maximale de 5MB. Assurez-vous que votre document est lisible et de bonne qualité.',
      tags: ['fichiers', 'pdf', 'taille']
    },
    {
      id: '9',
      category: 'upload',
      question: 'Mes examens sont-ils publiés immédiatement ?',
      answer: 'Non, tous les examens téléversés passent par une modération pour vérifier leur qualité et leur conformité. Cela prend généralement 24-48 heures.',
      tags: ['modération', 'publication']
    },

    // Compte utilisateur
    {
      id: '10',
      category: 'account',
      question: 'Comment créer un compte ?',
      answer: 'Cliquez sur "Se connecter" puis "Créer un compte". Il vous suffit de fournir votre nom, email et un mot de passe. Aucune vérification par email n\'est requise.',
      tags: ['inscription', 'compte']
    },
    {
      id: '11',
      category: 'account',
      question: 'J\'ai oublié mon mot de passe, que faire ?',
      answer: 'Contactez notre support à support@egzamachiv.ht avec votre adresse email. Nous vous aiderons à récupérer l\'accès à votre compte.',
      tags: ['mot de passe', 'support']
    },
    {
      id: '12',
      category: 'account',
      question: 'Puis-je modifier mes informations de profil ?',
      answer: 'Oui ! Allez dans votre profil utilisateur et cliquez sur "Modifier". Vous pouvez changer votre nom, email et ajouter une biographie.',
      tags: ['profil', 'modification']
    },

    // Support
    {
      id: '13',
      category: 'support',
      question: 'Comment contacter le support ?',
      answer: 'Vous pouvez nous contacter par email à support@egzamachiv.ht. Nous répondons généralement sous 24 heures.',
      tags: ['contact', 'support']
    },
    {
      id: '14',
      category: 'support',
      question: 'Comment signaler un problème ?',
      answer: 'Pour signaler un contenu inapproprié ou un problème technique, contactez-nous à support@egzamachiv.ht en précisant les détails du problème.',
      tags: ['signalement', 'problème']
    },
    {
      id: '15',
      category: 'support',
      question: 'Puis-je suggérer une amélioration ?',
      answer: 'Bien sûr ! Envoyez vos suggestions à feedback@egzamachiv.ht. Nous apprécions tous les retours pour améliorer la plateforme.',
      tags: ['suggestions', 'amélioration']
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les questions' },
    { id: 'general', name: 'Général' },
    { id: 'download', name: 'Téléchargement' },
    { id: 'upload', name: 'Téléversement' },
    { id: 'account', name: 'Compte utilisateur' },
    { id: 'support', name: 'Support' }
  ];

  // Filtrer les FAQ
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Foire Aux Questions</h1>
              <p className="text-sm text-gray-600">Trouvez rapidement les réponses à vos questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans la FAQ..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name}
                  {category.id !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({faqData.filter(faq => faq.category === category.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              {filteredFAQs.length} question{filteredFAQs.length > 1 ? 's' : ''} trouvée{filteredFAQs.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="p-6 max-h-[calc(90vh-300px)] overflow-y-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `Aucun résultat pour "${searchTerm}"`
                  : 'Aucune question dans cette catégorie'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="mailto:support@egzamachiv.ht"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Mail className="h-4 w-4" />
                <span>Support</span>
              </a>
              <a
                href="mailto:feedback@egzamachiv.ht"
                className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Suggestions</span>
              </a>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;