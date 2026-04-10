import { supabase } from './supabase';

export interface Customer {
  id?: string;
  user_id: string;
  full_name: string;
  phone: string;
  address?: string;
  zone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const getCustomers = async (userId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createCustomer = async (customer: Customer) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCustomer = async (customerId: string) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);

  if (error) throw error;
};

export const findOrCreateCustomer = async (
  userId: string,
  phone: string,
  full_name: string,
  address?: string,
  zone?: string
) => {
  const { data: existing, error: searchError } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .eq('phone', phone)
    .maybeSingle();

  if (searchError) throw searchError;

  if (existing) {
    return existing;
  }

  return createCustomer({
    user_id: userId,
    full_name,
    phone,
    address,
    zone
  });
};
