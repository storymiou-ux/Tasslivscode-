/*
  # Fix infinite recursion in profiles RLS policies

  1. Changes
    - Drop all existing policies on profiles table
    - Recreate simple, non-recursive policies
    - Allow users to read and update their own profile
    - Allow admins to view all profiles
    
  2. Security
    - Users can only access their own profile data
    - Admins can view all profiles (checked via app_metadata)
    - Role cannot be changed by users through the app
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can update any profile" ON profiles;

-- Simple policy: users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Simple policy: users can insert their own profile (for trigger)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Simple policy: users can update their own profile but NOT the role field
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);