/*
  # Fix email type mismatch in admin RPC functions

  1. Changes
    - Update get_all_profiles_admin to cast email to text type
    
  2. Security
    - Maintains admin-only access checks
    - Uses SECURITY DEFINER to bypass RLS
*/

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
    (SELECT au.email::text FROM auth.users au WHERE au.id = p.id) as email,
    p.full_name,
    p.business_name,
    p.subscription_plan
  FROM profiles p;
END;
$$;