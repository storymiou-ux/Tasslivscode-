import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { startSessionMonitoring, stopSessionMonitoring } from '../lib/sessionManager';
import { getUserProfile, getUserRole, UserProfile } from '../lib/profile';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadUserData = async (userId: string) => {
    console.log('Loading user data for:', userId);
    const [userProfile, role] = await Promise.all([
      getUserProfile(userId),
      getUserRole(userId)
    ]);

    console.log('Loaded profile:', userProfile);
    setProfile(userProfile);
    setIsAdmin(role === 'admin');
  };

  useEffect(() => {
    // Toujours vérifier d'abord Supabase pour s'assurer qu'on a la session courante
    const initAuth = async () => {
      console.log('InitAuth: Checking Supabase session...');
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Utilisateur connecté via Supabase - clear dev mode et utiliser Supabase
          console.log('Supabase session found for:', session.user.email);
          localStorage.removeItem('dev-auth-user');
          setUser(session.user);
          startSessionMonitoring();
          await loadUserData(session.user.id);
        } else {
          // Pas de session Supabase - vérifier dev mode
          const devUser = localStorage.getItem('dev-auth-user');
          if (devUser) {
            console.log('Dev mode user found');
            const parsedUser = JSON.parse(devUser);
            setUser(parsedUser);
            await loadUserData(parsedUser.id);
          } else {
            console.log('No user logged in');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      }
      
      setLoading(false);
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'User:', session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        // Nouvelle connexion - clear dev mode
        localStorage.removeItem('dev-auth-user');
        setUser(session?.user ?? null);
        if (session?.user) {
          startSessionMonitoring();
          loadUserData(session.user.id);
        }
      } else if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
        if (session?.user) {
          startSessionMonitoring();
          loadUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
        localStorage.removeItem('dev-auth-user');
        stopSessionMonitoring();
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserData(session.user.id);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      stopSessionMonitoring();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
