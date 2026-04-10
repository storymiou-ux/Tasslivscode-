import { createClient } from '@supabase/supabase-js';

// Support pour les deux formats de variables (avec et sans préfixe VITE_)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

// Log pour debug en développement
if (import.meta.env.DEV) {
  console.log('Supabase URL (from env):', supabaseUrl);
  console.log('Supabase Key (from env):', supabaseAnonKey ? 'EXISTS' : 'MISSING');
  console.log('Environment Mode:', import.meta.env.MODE);
}

// Fonction pour charger la configuration depuis l'API en production
async function loadConfigFromApi() {
  if (supabaseUrl && supabaseAnonKey) {
    return; // Déjà configuré depuis les variables d'environnement
  }

  try {
    console.log('Loading Supabase config from API...');
    const response = await fetch('/api/config');
    if (response.ok) {
      const config = await response.json();
      supabaseUrl = config.SUPABASE_URL || supabaseUrl;
      supabaseAnonKey = config.SUPABASE_ANON_KEY || supabaseAnonKey;
      console.log('Config loaded from API. URL:', supabaseUrl ? 'SET' : 'MISSING');
    }
  } catch (error) {
    console.error('Error loading config from API:', error);
  }
}

// Charger la config au démarrage
loadConfigFromApi();

function createSupabaseClient() {
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || 'placeholder-key';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not properly configured:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'tassli-auth-token',
      flowType: 'pkce'
    }
  });
}

export let supabase = createSupabaseClient();

// Réexporter la fonction pour rafraîchir le client si nécessaire
export function refreshSupabaseClient() {
  supabase = createSupabaseClient();
}

// Exporter les variables de configuration
export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
    isConfigured: !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co'
  };
}
