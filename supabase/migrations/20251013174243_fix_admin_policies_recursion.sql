/*
  # Fix admin policies to prevent infinite recursion

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy
    - Drop the "Admins can view all orders" policy  
    - Drop the "Admins can view all customers" policy
    - Drop the "Admins can update all orders" policy
    - We'll use app-level logic instead for admin access
    
  2. Security
    - Admins will still need to authenticate
    - Admin access will be controlled at the application level
    - Regular users still only see their own data through existing policies
*/

-- Drop all admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;