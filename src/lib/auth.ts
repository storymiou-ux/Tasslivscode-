import { supabase } from './supabase';

// Check if we're in development mode with placeholder values
const isDevelopmentMode = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') ||
                         !import.meta.env.VITE_SUPABASE_URL ||
                         import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  businessName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  if (isDevelopmentMode) {
    // Simulate successful signup in development mode
    console.log('Development mode: Simulating signup for', data.email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Store user data in localStorage for development
    const mockUser = {
      id: 'dev-user-' + Date.now(),
      email: data.email,
      user_metadata: {
        full_name: data.fullName,
        phone: data.phone,
        business_name: data.businessName,
      },
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('dev-auth-user', JSON.stringify(mockUser));

    return {
      user: mockUser,
      session: null,
    };
  }

  const { email, password, fullName, phone, businessName } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth?confirmed=true`,
      data: {
        full_name: fullName,
        phone: phone || null,
        business_name: businessName || null,
      }
    }
  });

  if (authError) {
    throw authError;
  }

  if (authData.user) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone || null,
        business_name: businessName || null,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.warn('Profile update error:', profileError);
    }
  }

  return authData;
};

export const signIn = async (data: SignInData) => {
  if (isDevelopmentMode) {
    // Simulate successful signin in development mode
    console.log('Development mode: Simulating signin for', data.email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Check if user exists in localStorage (from previous signup)
    const storedUser = localStorage.getItem('dev-auth-user');
    let mockUser;

    if (storedUser) {
      mockUser = JSON.parse(storedUser);
    } else {
      // Create a mock user if none exists
      mockUser = {
        id: 'dev-user-' + Date.now(),
        email: data.email,
        user_metadata: {
          full_name: 'Utilisateur de développement',
        },
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
      };
      localStorage.setItem('dev-auth-user', JSON.stringify(mockUser));
    }

    return {
      user: mockUser,
      session: {
        access_token: 'dev-token',
        refresh_token: 'dev-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour
      },
    };
  }

  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return authData;
};

export const signOut = async () => {
  if (isDevelopmentMode) {
    console.log('Development mode: Simulating signout');
    localStorage.removeItem('dev-auth-user');
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  if (isDevelopmentMode) {
    const storedUser = localStorage.getItem('dev-auth-user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
};

export const getProfile = async (userId: string) => {
  if (isDevelopmentMode) {
    // Return mock profile data in development mode
    const storedUser = localStorage.getItem('dev-auth-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Utilisateur Dev',
        phone: user.user_metadata?.phone || '+221700000000',
        business_name: user.user_metadata?.business_name || 'Entreprise Dev',
        role: 'user',
        created_at: user.created_at,
      };
    }
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
