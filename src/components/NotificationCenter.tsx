import React, { useState } from 'react';
import { Bell, X, Check, Download, Upload, Star, User, Calendar, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'download' | 'upload' | 'favorite' | 'system' | 'user';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate: (count: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'download',
      title: 'Nouvel téléchargement',
      message: 'Votre examen "Devoir de Mathématiques" a été téléchargé 5 fois aujourd\'hui',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '2',
      type: 'favorite',
      title: 'Nouveau favori',
      message: 'Marie Dupont a ajouté votre examen en favori',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '3',
      type: 'system',
      title: 'Mise à jour système',
      message: 'Nouvelles fonctionnalités disponibles dans votre tableau de bord',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: '4',
      type: 'upload',
      title: 'Upload approuvé',
      message: 'Votre examen "Contrôle de Physique" a été approuvé et publié',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: '5',
      type: 'user',
      title: 'Nouveau follower',
      message: 'Jean Martin suit maintenant vos publications',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true
    }
  ]);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mettre à jour le compteur dans le Header quand les notifications changent
  React.useEffect(() => {
    onNotificationUpdate(unreadCount);
  }, [unreadCount, onNotificationUpdate]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Ajouter une nouvelle notification (fonction utilitaire)
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Marquer toutes les notifications comme lues lors de l'ouverture
  React.useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Délai pour permettre à l'utilisateur de voir les notifications
      const timer = setTimeout(() => {
        // Marquer automatiquement comme lues après 3 secondes d'ouverture
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, unreadCount]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'download':
        return <Download className="h-4 w-4 text-blue-600" />;
      case 'upload':
        return <Upload className="h-4 w-4 text-green-600" />;
      case 'favorite':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'system':
        return <Bell className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'download':
        return 'bg-blue-50 border-blue-200';
      case 'upload':
        return 'bg-green-50 border-green-200';
      case 'favorite':
        return 'bg-yellow-50 border-yellow-200';
      case 'user':
        return 'bg-purple-50 border-purple-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };

  // Fonction pour simuler l'ajout de nouvelles notifications (pour les tests)
  const simulateNewNotification = () => {
    const types = ['download', 'favorite', 'upload', 'system', 'user'];
    const messages = [
      'Votre examen a été téléchargé',
      'Nouveau favori ajouté',
      'Upload approuvé',
      'Mise à jour disponible',
      'Nouveau follower'
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    addNotification({
      type: randomType as any,
      title: 'Nouvelle notification',
      message: randomMessage,
      timestamp: new Date(),
      isRead: false
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Check className="h-4 w-4" />
              <span>Marquer tout comme lu</span>
            </button>
          </div>
        )}
            
            {/* Bouton pour simuler une nouvelle notification (développement) */}
            <button
              onClick={simulateNewNotification}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
              title="Simuler une nouvelle notification"
            >
              + Test
            </button>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Indicateur de notification non lue */}
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Marquer comme lu"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune notification</p>
              <button
                onClick={simulateNewNotification}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Ajouter une notification test
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir toutes les notifications
            </button>
            <div className="text-xs text-gray-500">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;