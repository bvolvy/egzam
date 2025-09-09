/*
  # Recréer le système de profils utilisateur

  1. Nettoyage complet
    - Supprime tous les triggers et fonctions existants
    - Recrée la table profiles avec la bonne structure
  
  2. Nouvelle fonction de création de profil
    - Gère correctement les métadonnées utilisateur
    - Utilise des valeurs par défaut sûres
    - Gestion d'erreur robuste
  
  3. Trigger optimisé
    - Se déclenche après insertion dans auth.users
    - Utilise la nouvelle fonction
*/

-- Nettoyage complet des anciens triggers et fonctions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;

-- S'assurer que la table profiles a la bonne structure
ALTER TABLE public.profiles 
  ALTER COLUMN name DROP NOT NULL;

-- Créer la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar_url,
    is_premium,
    uploads_count,
    downloads_count,
    favorites_count,
    is_active,
    is_suspended
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'),
    NEW.raw_user_meta_data->>'avatar_url',
    false,
    0,
    0,
    0,
    true,
    false
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne fait pas échouer l'inscription
    RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- S'assurer que les politiques RLS sont en place
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de lire leur propre profil
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour permettre l'insertion de nouveaux profils (pour le trigger)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);