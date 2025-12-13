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
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      console.log('Tentative de connexion:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        setError(error.message || 'Erreur de connexion');
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Connexion réussie:', data.user.email);
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
        setError(null);
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur technique';
      console.error('Erreur lors de la connexion:', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Tentative d\'inscription:', email);
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
        setError(error.message || 'Erreur d\'inscription');
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Utilisateur créé:', data.user.email);

        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name: name || 'Utilisateur',
          avatar_url: data.user.user_metadata?.avatar_url,
          is_admin: false
        });

        if (profileError) {
          console.error('Erreur lors de la création du profil:', profileError);
          throw profileError;
        }

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
        setError(null);
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur technique';
      console.error('Erreur lors de l\'inscription:', errorMsg);
      setError(errorMsg);
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
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading, error }}>
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