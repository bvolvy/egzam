import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase, auth, AuthUser } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session Supabase existante
    const initializeAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Créer un utilisateur basique à partir des données auth
          const basicUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || 'Utilisateur',
            avatar: authUser.user_metadata?.avatar_url,
            isPremium: false,
            joinDate: new Date(authUser.created_at),
            uploads: 0,
            downloads: 0,
            isActive: true,
            isSuspended: false
          };
          setUser(basicUser);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Créer un utilisateur basique à partir des données auth
          const basicUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Utilisateur',
            avatar: session.user.user_metadata?.avatar_url,
            isPremium: false,
            joinDate: new Date(session.user.created_at),
            uploads: 0,
            downloads: 0,
            isActive: true,
            isSuspended: false
          };
          setUser(basicUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erreur de connexion:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Créer un utilisateur basique à partir des données auth
        const basicUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'Utilisateur',
          avatar: data.user.user_metadata?.avatar_url,
          isPremium: false,
          joinDate: new Date(data.user.created_at),
          uploads: 0,
          downloads: 0,
          isActive: true,
          isSuspended: false
        };
        setUser(basicUser);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Créer un utilisateur basique à partir des données auth
        const basicUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: name || 'Utilisateur',
          avatar: data.user.user_metadata?.avatar_url,
          isPremium: false,
          joinDate: new Date(data.user.created_at),
          uploads: 0,
          downloads: 0,
          isActive: true,
          isSuspended: false
        };
        setUser(basicUser);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
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