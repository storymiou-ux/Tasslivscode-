/*
  # Update get_all_orders_admin function to include sender information

  1. Changes
    - Drop and recreate `get_all_orders_admin` function
    - Add sender_name, sender_phone, sender_address, sender_business_name to returned columns
    - These fields contain the pickup/sender information entered during order creation
*/

DROP FUNCTION IF EXISTS public.get_all_orders_admin();

CREATE OR REPLACE FUNCTION public.get_all_orders_admin()
RETURNS TABLE(
  id uuid, 
  order_number text, 
  product_name text, 
  amount numeric, 
  delivery_fee numeric, 
  status text, 
  delivery_zone text, 
  created_at timestamp with time zone, 
  user_id uuid, 
  customer_id uuid,
  sender_name text,
  sender_phone text,
  sender_address text,
  sender_business_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
orders.sender_name,
orders.sender_phone,
orders.sender_address,
orders.sender_business_name
FROM orders
ORDER BY orders.created_at DESC;
END;
$function$;