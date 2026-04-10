/*
  # Update admin profile function to include phone

  1. Changes
    - Drop and recreate `get_all_profiles_admin` function to return phone field
    - Add phone to the returned columns for seller/expeditor information
*/

DROP FUNCTION IF EXISTS public.get_all_profiles_admin();

CREATE OR REPLACE FUNCTION public.get_all_profiles_admin()
RETURNS TABLE(id uuid, email text, full_name text, phone text, business_name text, subscription_plan text)
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
p.id,
(SELECT au.email::text FROM auth.users au WHERE au.id = p.id) as email,
p.full_name,
p.phone,
p.business_name,
p.subscription_plan
FROM profiles p;
END;
$function$;