// API endpoint pour charger la configuration depuis Vercel
export async function getConfig() {
  // En développement, utilise les variables Vite
  if (import.meta.env.DEV) {
    return {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }

  // En production, crée un endpoint qui retourne les variables
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    return {
      SUPABASE_URL: '',
      SUPABASE_ANON_KEY: '',
    };
  }
}
