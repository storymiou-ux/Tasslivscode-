/*
  # Fix profiles RLS policies for signup

  1. Changes
    - Drop existing INSERT policy for profiles
    - Create new INSERT policy that allows users to create their own profile during signup
    - The policy checks that the user_id matches auth.uid() which is available during signup

  2. Security
    - Users can only insert their own profile (id = auth.uid())
    - No other security is compromised
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new INSERT policy that works during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);