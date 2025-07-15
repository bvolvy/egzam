import React, { useState } from 'react';
import { X, Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Upload, Download, User, Settings, Star, Shield, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';

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
      tags: ['plateforme', 'examens', 'haïti', 'éducation']
    },
    {
      id: '2',
      category: 'general',
      question: 'Est-ce que EgzamAchiv est gratuit ?',
      answer: 'Oui, EgzamAchiv est entièrement gratuit ! Vous pouvez télécharger tous les examens sans créer de compte. Seul le téléversement d\'examens nécessite une inscription gratuite.',
      tags: ['gratuit', 'prix', 'coût']
    },
    {
      id: '3',
      category: 'general',
      question: 'Quelles classes et matières sont disponibles ?',
      answer: 'Nous couvrons toutes les classes du système éducatif haïtien (Sixième à Terminale) et toutes les matières principales : Mathématiques, Français, Histoire-Géographie, SVT, Physique-Chimie, Anglais, Espagnol, Philosophie, et plus encore.',
      tags: ['classes', 'matières', 'curriculum']
    },

    // Téléchargement
    {
      id: '4',
      category: 'download',
      question: 'Comment télécharger un examen ?',
      answer: 'C\'est très simple ! Trouvez l\'examen qui vous intéresse, cliquez sur le bouton de téléchargement (icône flèche vers le bas). Le fichier PDF sera automatiquement téléchargé sur votre appareil.',
      tags: ['télécharger', 'download', 'pdf']
    },
    {
      id: '5',
      category: 'download',
      question: 'Ai-je besoin d\'un compte pour télécharger ?',
      answer: 'Non ! Vous pouvez télécharger tous les examens sans créer de compte. L\'inscription n\'est nécessaire que si vous souhaitez téléverser vos propres examens.',
      tags: ['compte', 'inscription', 'téléchargement']
    },
    {
      id: '6',
      category: 'download',
      question: 'Dans quel format sont les examens ?',
      answer: 'Tous les examens sont au format PDF pour garantir une qualité d\'affichage optimale et une compatibilité universelle avec tous les appareils.',
      tags: ['format', 'pdf', 'qualité']
    },

    // Téléversement
    {
      id: '7',
      category: 'upload',
      question: 'Comment téléverser un examen ?',
      answer: 'Créez d\'abord un compte gratuit, puis cliquez sur "Téléverser" dans le menu. Remplissez les informations (titre, description, classe, matière) et sélectionnez votre fichier PDF. Votre examen sera vérifié avant publication.',
      tags: ['téléverser', 'upload', 'partager']
    },
    {
      id: '8',
      category: 'upload',
      question: 'Quels types de fichiers puis-je téléverser ?',
      answer: 'Seuls les fichiers PDF sont acceptés, avec une taille maximale de 5MB. Assurez-vous que votre document est lisible et de bonne qualité.',
      tags: ['fichiers', 'pdf', 'taille', 'format']
    },
    {
      id: '9',
      category: 'upload',
      question: 'Mes examens sont-ils publiés immédiatement ?',
      answer: 'Non, tous les examens téléversés passent par une modération pour vérifier leur qualité et leur conformité. Cela prend généralement 24-48 heures.',
      tags: ['modération', 'publication', 'vérification']
    },
    {
      id: '10',
      category: 'upload',
      question: 'Puis-je téléverser des examens que je n\'ai pas créés ?',
      answer: 'Vous devez avoir le droit légal de partager le document. Ne téléversez que des examens que vous avez créés ou pour lesquels vous avez une autorisation explicite.',
      tags: ['droits', 'autorisation', 'légal']
    },

    // Compte utilisateur
    {
      id: '11',
      category: 'account',
      question: 'Comment créer un compte ?',
      answer: 'Cliquez sur "Se connecter" puis "Créer un compte". Il vous suffit de fournir votre nom, email et un mot de passe. Aucune vérification par email n\'est requise.',
      tags: ['inscription', 'compte', 'email']
    },
    {
      id: '12',
      category: 'account',
      question: 'J\'ai oublié mon mot de passe, que faire ?',
      answer: 'Contactez notre support à support@egzamachiv.ht avec votre adresse email. Nous vous aiderons à récupérer l\'accès à votre compte.',
      tags: ['mot de passe', 'récupération', 'support']
    },
    {
      id: '13',
      category: 'account',
      question: 'Puis-je modifier mes informations de profil ?',
      answer: 'Oui ! Allez dans votre profil utilisateur et cliquez sur "Modifier". Vous pouvez changer votre nom, email et ajouter une biographie.',
      tags: ['profil', 'modification', 'informations']
    },
    {
      id: '14',
      category: 'account',
      question: 'Comment supprimer mon compte ?',
      answer: 'Dans les paramètres de votre profil, section "Zone de danger", vous trouverez l\'option de suppression. Attention : cette action est irréversible.',
      tags: ['suppression', 'compte', 'irréversible']
    },

    // Recherche et navigation
    {
      id: '15',
      category: 'search',
      question: 'Comment rechercher un examen spécifique ?',
      answer: 'Utilisez la barre de recherche en haut de la page. Vous pouvez rechercher par titre, matière, classe, ou nom d\'auteur. Utilisez aussi les filtres sur la gauche pour affiner vos résultats.',
      tags: ['recherche', 'filtres', 'navigation']
    },
    {
      id: '16',
      category: 'search',
      question: 'Comment utiliser les filtres ?',
      answer: 'Dans la sidebar gauche, sélectionnez la classe et/ou la matière qui vous intéresse. Vous pouvez aussi trier par date, popularité ou nombre de favoris.',
      tags: ['filtres', 'tri', 'classe', 'matière']
    },
    {
      id: '17',
      category: 'search',
      question: 'Que signifient les badges "Populaire" et "Nouveau" ?',
      answer: '"Populaire" indique un examen téléchargé plus de 150 fois. "Nouveau" signifie que l\'examen a été ajouté dans les 7 derniers jours.',
      tags: ['badges', 'populaire', 'nouveau']
    },

    // Favoris et fonctionnalités
    {
      id: '18',
      category: 'features',
      question: 'Comment ajouter un examen aux favoris ?',
      answer: 'Cliquez sur l\'icône cœur sur la carte de l\'examen. Vous devez être connecté pour utiliser cette fonctionnalité. Retrouvez vos favoris dans votre profil.',
      tags: ['favoris', 'cœur', 'sauvegarde']
    },
    {
      id: '19',
      category: 'features',
      question: 'Comment fonctionne la prévisualisation ?',
      answer: 'Cliquez sur l\'icône œil pour ouvrir la prévisualisation avancée. Vous pouvez naviguer dans les pages, zoomer, faire pivoter, rechercher dans le texte, et même passer en plein écran.',
      tags: ['prévisualisation', 'zoom', 'navigation']
    },
    {
      id: '20',
      category: 'features',
      question: 'Puis-je imprimer les examens ?',
      answer: 'Oui ! Dans la prévisualisation, cliquez sur l\'icône d\'imprimante ou utilisez Ctrl+P. Vous pouvez aussi télécharger le PDF et l\'imprimer depuis votre lecteur PDF habituel.',
      tags: ['impression', 'imprimer', 'pdf']
    },

    // Problèmes techniques
    {
      id: '21',
      category: 'technical',
      question: 'Un examen ne se télécharge pas, que faire ?',
      answer: 'Vérifiez votre connexion internet et réessayez. Si le problème persiste, essayez avec un autre navigateur ou contactez le support.',
      tags: ['téléchargement', 'problème', 'connexion']
    },
    {
      id: '22',
      category: 'technical',
      question: 'La prévisualisation ne fonctionne pas',
      answer: 'Assurez-vous que JavaScript est activé et que votre navigateur est à jour. La prévisualisation fonctionne mieux avec Chrome, Firefox ou Safari récents.',
      tags: ['prévisualisation', 'navigateur', 'javascript']
    },
    {
      id: '23',
      category: 'technical',
      question: 'Le site est lent, pourquoi ?',
      answer: 'Cela peut être dû à votre connexion internet ou à un trafic élevé. Essayez de rafraîchir la page ou de revenir plus tard.',
      tags: ['lenteur', 'performance', 'connexion']
    },

    // Sécurité et confidentialité
    {
      id: '24',
      category: 'security',
      question: 'Mes données personnelles sont-elles protégées ?',
      answer: 'Absolument ! Nous ne collectons que les informations essentielles et ne les partageons jamais avec des tiers. Consultez notre politique de confidentialité pour plus de détails.',
      tags: ['confidentialité', 'données', 'protection']
    },
    {
      id: '25',
      category: 'security',
      question: 'Comment signaler un contenu inapproprié ?',
      answer: 'Contactez-nous immédiatement à support@egzamachiv.ht en précisant l\'examen concerné. Nous examinerons et prendrons les mesures appropriées.',
      tags: ['signalement', 'contenu', 'modération']
    },

    // Contact et support
    {
      id: '26',
      category: 'support',
      question: 'Comment contacter le support ?',
      answer: 'Vous pouvez nous contacter par email à support@egzamachiv.ht. Nous répondons généralement sous 24 heures.',
      tags: ['contact', 'support', 'email']
    },
    {
      id: '27',
      category: 'support',
      question: 'Puis-je suggérer une amélioration ?',
      answer: 'Bien sûr ! Envoyez vos suggestions à feedback@egzamachiv.ht. Nous apprécions tous les retours pour améliorer la plateforme.',
      tags: ['suggestions', 'amélioration', 'feedback']
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: HelpCircle },
    { id: 'general', name: 'Général', icon: BookOpen },
    { id: 'download', name: 'Téléchargement', icon: Download },
    { id: 'upload', name: 'Téléversement', icon: Upload },
    { id: 'account', name: 'Compte utilisateur', icon: User },
    { id: 'search', name: 'Recherche', icon: Search },
    { id: 'features', name: 'Fonctionnalités', icon: Star },
    { id: 'technical', name: 'Problèmes techniques', icon: Settings },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'support', name: 'Support', icon: MessageCircle }
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

  const expandAll = () => {
    setExpandedItems(filteredFAQs.map(faq => faq.id));
  };

  const collapseAll = () => {
    setExpandedItems([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
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

        <div className="flex h-[calc(95vh-100px)]">
          {/* Sidebar avec catégories */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Recherche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher dans la FAQ..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Catégories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégories
                </label>
                <div className="space-y-1">
                  {categories.map(category => {
                    const count = category.id === 'all' 
                      ? faqData.length 
                      : faqData.filter(faq => faq.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <category.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={expandAll}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tout développer
                  </button>
                  <button
                    onClick={collapseAll}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-700"
                  >
                    Tout réduire
                  </button>
                </div>
              </div>

              {/* Contact rapide */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Besoin d'aide ?</h3>
                <div className="space-y-2">
                  <a
                    href="mailto:support@egzamachiv.ht"
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="h-4 w-4" />
                    <span>support@egzamachiv.ht</span>
                  </a>
                  <a
                    href="mailto:feedback@egzamachiv.ht"
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Suggestions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* En-tête des résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'Toutes les questions' : 
                   categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredFAQs.length} question{filteredFAQs.length > 1 ? 's' : ''} trouvée{filteredFAQs.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>
              
              {filteredFAQs.length > 0 && (
                <div className="text-sm text-gray-500">
                  {expandedItems.length} / {filteredFAQs.length} développée{expandedItems.length > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Liste des FAQ */}
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-sm font-medium text-blue-600">
                            Q{index + 1}
                          </span>
                          <h3 className="text-base font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
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
                      <div className="ml-4">
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
                          
                          {/* Tags complets */}
                          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 mr-2">Tags:</span>
                            {faq.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setSearchTerm(tag)}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
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
                <div className="space-y-2">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Effacer la recherche
                    </button>
                  )}
                  <p className="text-sm text-gray-500">
                    Vous ne trouvez pas votre réponse ?{' '}
                    <a
                      href="mailto:support@egzamachiv.ht"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Contactez-nous
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Cette FAQ vous a-t-elle été utile ?
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:feedback@egzamachiv.ht?subject=Feedback FAQ"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Donner un avis</span>
              </a>
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
    </div>
  );
};

export default FAQPage;