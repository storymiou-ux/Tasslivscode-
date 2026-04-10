import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  business_name: string | null;
  role?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, business_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}
