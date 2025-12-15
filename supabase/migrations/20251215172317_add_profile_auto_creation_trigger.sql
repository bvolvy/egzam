/*
  # Auto-create user profiles on signup
  
  1. New Function
    - `handle_new_user()` - Automatically creates a profile when a new user registers
  
  2. New Trigger
    - `on_auth_user_created` - Triggers the function when auth.users is modified
  
  3. Security
    - Ensures every authenticated user has a profile entry
    - Prevents foreign key constraint violations
    - Uses proper PostgreSQL function syntax
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (new.id, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();