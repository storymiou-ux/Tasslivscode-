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
    const [userProfile, role] = await Promise.all([
      getUserProfile(userId),
      getUserRole(userId)
    ]);

    setProfile(userProfile);
    setIsAdmin(role === 'admin');
  };

  useEffect(() => {
    // Check for development mode user first
    const devUser = localStorage.getItem('dev-auth-user');
    if (devUser) {
      const parsedUser = JSON.parse(devUser);
      setUser(parsedUser);
      setLoading(false);
      loadUserData(parsedUser.id);
      return;
    }

    // Then check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        startSessionMonitoring();
        loadUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          startSessionMonitoring();
          loadUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
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
