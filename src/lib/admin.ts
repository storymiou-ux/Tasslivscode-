import { supabase } from './supabase';

export async function fetchAllOrdersAsAdmin() {
  const { data, error } = await supabase.rpc('get_all_orders_admin');
  if (error) throw error;
  return data;
}

export async function fetchAllCustomersAsAdmin() {
  const { data, error } = await supabase.rpc('get_all_customers_admin');
  if (error) throw error;
  return data;
}

export async function fetchAllProfilesAsAdmin() {
  const { data, error } = await supabase.rpc('get_all_profiles_admin');
  if (error) throw error;
  return data;
}

export async function updateOrderStatusAsAdmin(orderId: string, status: string) {
  const { error } = await supabase.rpc('update_order_status_admin', {
    order_id: orderId,
    new_status: status
  });
  if (error) throw error;
}
