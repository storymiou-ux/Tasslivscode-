/*
  # Create automatic profile creation trigger

  1. Changes
    - Create a trigger function that automatically creates a profile when a new user signs up
    - This runs at the database level, bypassing RLS issues
    - The profile is created with default values

  2. Security
    - Trigger runs with elevated privileges
    - Only creates profile for new auth.users entries
    - All RLS policies remain in place for normal operations
*/

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_plan, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    'simple',
    'trial'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();