/*
  # Fix RPC functions column issues

  1. Changes
    - Update get_all_orders_admin to remove non-existent 'notes' column
    - Fix get_all_profiles_admin email column ambiguity
    
  2. Security
    - Maintains admin-only access checks
    - Uses SECURITY DEFINER to bypass RLS
*/

-- Drop and recreate get_all_orders_admin without notes column
DROP FUNCTION IF EXISTS get_all_orders_admin();

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
  customer_id uuid
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
    orders.customer_id
  FROM orders
  ORDER BY orders.created_at DESC;
END;
$$;

-- Drop and recreate get_all_profiles_admin with fixed email reference
DROP FUNCTION IF EXISTS get_all_profiles_admin();

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
    p.id,
    (SELECT au.email FROM auth.users au WHERE au.id = p.id) as email,
    p.full_name,
    p.business_name,
    p.subscription_plan
  FROM profiles p;
END;
$$;