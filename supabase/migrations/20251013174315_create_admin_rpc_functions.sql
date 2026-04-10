/*
  # Create RPC functions for admin operations

  1. New Functions
    - get_all_orders_admin: Returns all orders for admins
    - get_all_customers_admin: Returns all customers for admins
    - get_all_profiles_admin: Returns all profiles for admins
    - update_order_status_admin: Updates order status for admins
    
  2. Security
    - Functions check if the calling user has admin role
    - Functions use SECURITY DEFINER to bypass RLS
    - Only accessible to authenticated users with admin role
*/

-- Function to get all orders (admin only)
CREATE OR REPLACE FUNCTION get_all_orders_admin()
RETURNS TABLE (
  id uuid,
  order_number text,
  product_name text,
  amount numeric,
  delivery_fee numeric,
  status text,
  delivery_zone text,
  created_at timestamptz,
  user_id uuid,
  customer_id uuid,
  notes text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  calling_user_role text;
BEGIN
  SELECT role INTO calling_user_role
  FROM profiles
  WHERE profiles.id = auth.uid();
  
  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    orders.id,
    orders.order_number,
    orders.product_name,
    orders.amount,
    orders.delivery_fee,
    orders.status,
    orders.delivery_zone,
    orders.created_at,
    orders.user_id,
    orders.customer_id,
    orders.notes
  FROM orders
  ORDER BY orders.created_at DESC;
END;
$$;

-- Function to get all customers (admin only)
CREATE OR REPLACE FUNCTION get_all_customers_admin()
RETURNS TABLE (
  id uuid,
  full_name text,
  phone text,
  address text,
  zone text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  calling_user_role text;
BEGIN
  SELECT role INTO calling_user_role
  FROM profiles
  WHERE profiles.id = auth.uid();
  
  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    customers.id,
    customers.full_name,
    customers.phone,
    customers.address,
    customers.zone
  FROM customers;
END;
$$;

-- Function to get all profiles (admin only)
CREATE OR REPLACE FUNCTION get_all_profiles_admin()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  business_name text,
  subscription_plan text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  calling_user_role text;
BEGIN
  SELECT role INTO calling_user_role
  FROM profiles
  WHERE profiles.id = auth.uid();
  
  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    profiles.id,
    (SELECT email FROM auth.users WHERE auth.users.id = profiles.id) as email,
    profiles.full_name,
    profiles.business_name,
    profiles.subscription_plan
  FROM profiles;
END;
$$;

-- Function to update order status (admin only)
CREATE OR REPLACE FUNCTION update_order_status_admin(
  order_id uuid,
  new_status text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  calling_user_role text;
BEGIN
  SELECT role INTO calling_user_role
  FROM profiles
  WHERE profiles.id = auth.uid();
  
  IF calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  UPDATE orders
  SET status = new_status
  WHERE orders.id = order_id;
END;
$$;