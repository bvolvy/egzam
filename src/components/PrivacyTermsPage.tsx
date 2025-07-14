import React, { useState } from 'react';
import { X, Shield, FileText, Users, Lock, AlertCircle, CheckCircle, Scale, Eye } from 'lucide-react';

interface PrivacyTermsPageProps {
  onClose: () => void;
}

const PrivacyTermsPage: React.FC<PrivacyTermsPageProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Politique de confidentialité & Conditions d'utilisation
              </h1>
              <p className="text-sm text-gray-600">EgzamAchiv - Bibliothèque des examens Haïtiens</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection('privacy')}
            className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
              activeSection === 'privacy'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Politique de confidentialité
          </button>
          <button
            onClick={() => setActiveSection('terms')}
            className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
              activeSection === 'terms'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Scale className="h-4 w-4 mr-2" />
            Conditions d'utilisation
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeSection === 'privacy' && (
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Notre engagement</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Chez EgzamAchiv, nous respectons votre vie privée et nous nous engageons à protéger 
                      vos données personnelles. Cette politique explique comment nous collectons, utilisons 
                      et protégeons vos informations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Données collectées */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  1. Données que nous collectons
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Informations personnelles</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Adresse email (obligatoire pour créer un compte)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Nom complet
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Photo de profil (optionnelle)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Données techniques</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Adresse IP pour la sécurité
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Type de navigateur et appareil
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Historique de navigation sur le site
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Fichiers téléversés</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Documents d'examens que vous partagez
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Métadonnées des fichiers (taille, format)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Descriptions et catégories associées
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Utilisation des données */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  2. Comment nous utilisons vos données
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Fonctionnement du service</h3>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• Gestion de votre compte utilisateur</li>
                      <li>• Stockage et partage de vos examens</li>
                      <li>• Personnalisation de votre expérience</li>
                      <li>• Notifications importantes</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Sécurité et qualité</h3>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Protection contre les abus</li>
                      <li>• Modération du contenu</li>
                      <li>• Prévention de la fraude</li>
                      <li>• Amélioration du service</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Statistiques anonymes</h3>
                    <ul className="space-y-1 text-purple-800 text-sm">
                      <li>• Analyse d'utilisation générale</li>
                      <li>• Amélioration de l'interface</li>
                      <li>• Tendances éducatives</li>
                      <li>• Performance technique</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Communication</h3>
                    <ul className="space-y-1 text-orange-800 text-sm">
                      <li>• Réponses à vos questions</li>
                      <li>• Mises à jour importantes</li>
                      <li>• Newsletters (avec votre accord)</li>
                      <li>• Support technique</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Droits des utilisateurs */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-blue-600 mr-2" />
                  3. Vos droits et contrôles
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Vous disposez de droits importants concernant vos données personnelles :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Accès et consultation</h4>
                          <p className="text-sm text-gray-600">Voir toutes les données que nous avons sur vous</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Modification</h4>
                          <p className="text-sm text-gray-600">Corriger ou mettre à jour vos informations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Suppression</h4>
                          <p className="text-sm text-gray-600">Demander l'effacement de vos données</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Portabilité</h4>
                          <p className="text-sm text-gray-600">Récupérer vos données dans un format lisible</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Opposition</h4>
                          <p className="text-sm text-gray-600">Refuser certains traitements de données</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Limitation</h4>
                          <p className="text-sm text-gray-600">Restreindre l'utilisation de vos données</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Pour exercer ces droits :</strong> Contactez-nous à{' '}
                      <a href="mailto:privacy@egzamachiv.ht" className="text-blue-600 hover:underline">
                        privacy@egzamachiv.ht
                      </a>{' '}
                      ou via votre profil utilisateur.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact et questions</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email :</strong> privacy@egzamachiv.ht</p>
                  <p><strong>Responsable :</strong> Équipe EgzamAchiv</p>
                  <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </section>
            </div>
          )}

          {activeSection === 'terms' && (
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <Scale className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Conditions d'utilisation</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      En utilisant EgzamAchiv, vous acceptez ces conditions. Elles définissent vos droits 
                      et responsabilités lors de l'utilisation de notre plateforme éducative.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptation */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  1. Acceptation des conditions
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    En accédant à EgzamAchiv et en l'utilisant, vous confirmez que vous avez lu, compris et accepté 
                    ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
                    notre service.
                  </p>
                </div>
              </section>

              {/* Comptes utilisateur */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  2. Comptes utilisateur
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Téléchargement libre</h3>
                    <p className="text-green-800 text-sm">
                      Aucun compte n'est requis pour télécharger et consulter les examens disponibles sur la plateforme.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Compte requis pour téléverser</h3>
                    <p className="text-blue-800 text-sm mb-3">
                      Un compte utilisateur est obligatoire pour téléverser des examens. Lors de la création :
                    </p>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Fournissez des informations exactes et à jour</li>
                      <li>• Choisissez un mot de passe sécurisé</li>
                      <li>• Vous êtes responsable de la sécurité de votre compte</li>
                      <li>• Signalez immédiatement tout usage non autorisé</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contenu et téléversement */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  3. Contenu et téléversement
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-2">Contenu interdit</h3>
                        <p className="text-red-800 text-sm mb-3">
                          Il est strictement interdit de téléverser :
                        </p>
                        <ul className="space-y-1 text-red-800 text-sm">
                          <li>• Du contenu protégé par des droits d'auteur sans autorisation</li>
                          <li>• Du matériel publicitaire ou commercial</li>
                          <li>• Du contenu illégal, offensant ou inapproprié</li>
                          <li>• Des virus, malwares ou codes malveillants</li>
                          <li>• Du contenu qui viole la vie privée d'autrui</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Contenu autorisé</h3>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• Examens scolaires haïtiens authentiques</li>
                      <li>• Documents éducatifs créés par vous-même</li>
                      <li>• Matériel pédagogique libre de droits</li>
                      <li>• Contenu avec autorisation explicite du détenteur des droits</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Responsabilité du contenu</h3>
                    <p className="text-blue-800 text-sm">
                      En téléversant un document, vous certifiez avoir le droit légal de le partager et vous assumez 
                      l'entière responsabilité de son contenu. EgzamAchiv se réserve le droit de vérifier et modérer 
                      tout contenu téléversé.
                    </p>
                  </div>
                </div>
              </section>

              {/* Modération */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  4. Modération et sanctions
                </h2>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Pouvoirs de l'équipe EgzamAchiv</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Notre équipe se réserve le droit, à sa seule discrétion et sans préavis :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Suppression de contenu</h4>
                          <p className="text-sm text-gray-600">Retirer tout document non conforme</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Suspension temporaire</h4>
                          <p className="text-sm text-gray-600">Bloquer l'accès en cas d'abus mineur</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Suppression de compte</h4>
                          <p className="text-sm text-gray-600">Fermer définitivement un compte en cas d'abus grave</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Signalement aux autorités</h4>
                          <p className="text-sm text-gray-600">En cas de contenu illégal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-700">
                      <strong>Procédure d'appel :</strong> Si vous estimez qu'une sanction est injustifiée, 
                      contactez-nous à{' '}
                      <a href="mailto:support@egzamachiv.ht" className="text-blue-600 hover:underline">
                        support@egzamachiv.ht
                      </a>{' '}
                      dans les 30 jours.
                    </p>
                  </div>
                </div>
              </section>

              {/* Propriété intellectuelle */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-blue-600 mr-2" />
                  5. Propriété intellectuelle
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Vos droits sur votre contenu</h3>
                    <p className="text-purple-800 text-sm">
                      Vous conservez tous vos droits sur les documents que vous téléversez. En les partageant sur 
                      EgzamAchiv, vous accordez à la plateforme une licence non exclusive pour les diffuser à des fins éducatives.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Droits d'EgzamAchiv</h3>
                    <p className="text-blue-800 text-sm">
                      Le nom, le logo, l'interface et les fonctionnalités d'EgzamAchiv sont protégés par des droits 
                      de propriété intellectuelle. Toute reproduction non autorisée est interdite.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation de responsabilité */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  6. Limitation de responsabilité
                </h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    EgzamAchiv fournit la plateforme "en l'état". Nous ne garantissons pas l'exactitude, la complétude 
                    ou la qualité du contenu partagé par les utilisateurs. Nous ne sommes pas responsables des dommages 
                    résultant de l'utilisation du service, sauf en cas de faute grave de notre part.
                  </p>
                </div>
              </section>

              {/* Modifications et contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Modifications et contact</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Modifications des conditions</h3>
                    <p className="text-gray-700 text-sm">
                      Nous pouvons modifier ces conditions à tout moment. Les changements importants vous seront 
                      notifiés par email ou via la plateforme.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Support :</strong> support@egzamachiv.ht</p>
                      <p><strong>Équipe juridique :</strong> legal@egzamachiv.ht</p>
                      <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTermsPage;