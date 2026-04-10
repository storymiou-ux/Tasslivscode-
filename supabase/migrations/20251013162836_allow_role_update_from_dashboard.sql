/*
  # Allow role updates from Supabase Dashboard

  1. Changes
    - Modify the UPDATE policy to allow role changes when done by service role (Dashboard)
    - Users still cannot change their own role through the app
    
  2. Security
    - Regular users cannot change their own role through authenticated requests
    - Only service role (Dashboard admin) can change roles
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate the update policy to exclude role from user updates
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );

-- Create a policy that allows service role to update any profile
CREATE POLICY "Service role can update any profile"
  ON profiles
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);