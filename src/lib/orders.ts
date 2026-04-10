import { supabase } from './supabase';

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  address?: string;
  zone?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  product_name: string;
  product_description?: string;
  amount: number;
  delivery_zone: string;
  delivery_address: string;
  delivery_fee: number;
  status: 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  requires_closing: boolean;
  closing_status?: 'pending' | 'confirmed' | 'rejected';
  closing_notes?: string;
  closing_called_at?: string;
  tracking_number?: string;
  delivered_at?: string;
  sender_name?: string;
  sender_phone?: string;
  sender_address?: string;
  sender_business_name?: string;
  created_at: string;
  updated_at: string;
  customers?: Customer;
}

export interface DashboardStats {
  ordersThisMonth: number;
  conversionRate: number;
  inProgress: number;
  deliveredToday: number;
}

export const getOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        id,
        full_name,
        phone,
        address,
        zone
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
};

export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const deliveredThisMonth = deliveredOrders.filter(
    order => new Date(order.created_at) >= startOfMonth
  ).length;

  const totalOrders = orders.length;
  const conversionRate = totalOrders > 0 ? Math.round((deliveredOrders.length / totalOrders) * 100) : 0;

  const inProgress = orders.filter(
    order => order.status === 'processing' || order.status === 'in_transit'
  ).length;

  const deliveredToday = deliveredOrders.filter(
    order => new Date(order.delivered_at || order.updated_at) >= startOfDay
  ).length;

  return {
    ordersThisMonth: deliveredThisMonth,
    conversionRate,
    inProgress,
    deliveredToday
  };
};

export const createOrder = async (orderData: {
  user_id: string;
  customer_id: string;
  order_number: string;
  product_name: string;
  product_description?: string;
  amount: number;
  delivery_zone: string;
  delivery_address: string;
  delivery_fee: number;
  requires_closing?: boolean;
  sender_name?: string;
  sender_phone?: string;
  sender_address?: string;
  sender_business_name?: string;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  additionalData?: Partial<Order>
) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, ...additionalData })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClosingStatus = async (
  orderId: string,
  closingStatus: 'pending' | 'confirmed' | 'rejected',
  notes?: string
) => {
  const updateData: any = {
    closing_status: closingStatus,
    closing_called_at: new Date().toISOString()
  };

  if (notes) {
    updateData.closing_notes = notes;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
