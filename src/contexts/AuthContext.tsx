import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage, STORAGE_KEYS, userStatsStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateUserStats: (action: 'upload' | 'download' | 'favorite') => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@egzamachiv.ht',
    name: 'Admin EgzamAchiv',
    isPremium: true,
    joinDate: new Date('2024-01-15'),
    uploads: 25,
    downloads: 150,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    email: 'marie@example.com',
    name: 'Marie Dupont',
    isPremium: false,
    joinDate: new Date('2024-02-20'),
    uploads: 8,
    downloads: 45,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a une session existante
    const savedUser = storage.get<User | null>(STORAGE_KEYS.USER, null);
    if (savedUser) {
      // Convert joinDate back to Date object
      savedUser.joinDate = new Date(savedUser.joinDate);
      
      // Charger les statistiques utilisateur
      const stats = userStatsStorage.load(savedUser.id);
      const updatedUser = {
        ...savedUser,
        uploads: stats.uploads,
        downloads: stats.downloads,
        favorites: stats.favorites
      };
      
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      // Charger les statistiques utilisateur
      const stats = userStatsStorage.load(foundUser.id);
      const userWithStats = {
        ...foundUser,
        uploads: stats.uploads,
        downloads: stats.downloads,
        favorites: stats.favorites
      };
      
      setUser(userWithStats);
      storage.set(STORAGE_KEYS.USER, userWithStats);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      isPremium: false,
      joinDate: new Date(),
      uploads: 0,
      downloads: 0
    };
    
    // Initialiser les statistiques utilisateur
    userStatsStorage.init(newUser.id);
    
    setUser(newUser);
    storage.set(STORAGE_KEYS.USER, newUser);
    setIsLoading(false);
    return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER, updatedUser);
    }
  };

  const updateUserStats = (action: 'upload' | 'download' | 'favorite') => {
    if (user) {
      const stats = userStatsStorage.load(user.id);
      
      switch (action) {
        case 'upload':
          stats.uploads += 1;
          break;
        case 'download':
          stats.downloads += 1;
          break;
        case 'favorite':
          stats.favorites += 1;
          break;
      }
      
      userStatsStorage.save(user.id, stats);
      
      // Mettre à jour l'utilisateur en mémoire
      const updatedUser = {
        ...user,
        uploads: stats.uploads,
        downloads: stats.downloads,
        favorites: stats.favorites
      };
      
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER, updatedUser);
    }
  };
  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, updateUserStats, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};