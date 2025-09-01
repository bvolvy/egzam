/*
  # Schéma initial pour EgzamAchiv

  1. Nouvelles Tables
    - `profiles` - Profils utilisateurs étendus
      - `id` (uuid, clé primaire, référence auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text, optionnel)
      - `is_premium` (boolean, défaut false)
      - `uploads_count` (integer, défaut 0)
      - `downloads_count` (integer, défaut 0)
      - `favorites_count` (integer, défaut 0)
      - `is_active` (boolean, défaut true)
      - `is_suspended` (boolean, défaut false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `exams` - Métadonnées des examens
      - `id` (uuid, clé primaire)
      - `title` (text)
      - `description` (text)
      - `classe` (text)
      - `matiere` (text)
      - `level` (text)
      - `file_name` (text)
      - `file_size` (numeric)
      - `file_url` (text, URL Backblaze B2)
      - `thumbnail_url` (text, optionnel)
      - `uploader_id` (uuid, référence profiles)
      - `status` (enum: pending, approved, rejected)
      - `is_official` (boolean, défaut false)
      - `downloads_count` (integer, défaut 0)
      - `favorites_count` (integer, défaut 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `approved_at` (timestamptz, optionnel)
      - `rejected_at` (timestamptz, optionnel)
      - `rejection_reason` (text, optionnel)

    - `favorites` - Relations favoris utilisateur-examen
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence profiles)
      - `exam_id` (uuid, référence exams)
      - `created_at` (timestamptz)

    - `downloads` - Historique des téléchargements
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence profiles, optionnel)
      - `exam_id` (uuid, référence exams)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
    - Politiques pour les administrateurs
    - Politiques de lecture publique pour les examens approuvés

  3. Fonctions
    - Trigger pour mettre à jour les compteurs
    - Fonction pour créer automatiquement un profil utilisateur
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  is_premium boolean DEFAULT false,
  uploads_count integer DEFAULT 0,
  downloads_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_suspended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  classe text NOT NULL,
  matiere text NOT NULL,
  level text NOT NULL,
  file_name text NOT NULL,
  file_size numeric NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_official boolean DEFAULT false,
  downloads_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

-- Table des téléchargements
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_level ON exams(level);
CREATE INDEX IF NOT EXISTS idx_exams_classe ON exams(classe);
CREATE INDEX IF NOT EXISTS idx_exams_matiere ON exams(matiere);
CREATE INDEX IF NOT EXISTS idx_exams_uploader ON exams(uploader_id);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_exam ON favorites(exam_id);
CREATE INDEX IF NOT EXISTS idx_downloads_exam ON downloads(exam_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND email = 'admin@egzamachiv.ht'
    )
  );

-- Politiques RLS pour exams
CREATE POLICY "Anyone can read approved exams"
  ON exams
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can read own exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (uploader_id = auth.uid());

CREATE POLICY "Users can insert own exams"
  ON exams
  FOR INSERT
  TO authenticated
  WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Users can update own pending exams"
  ON exams
  FOR UPDATE
  TO authenticated
  USING (uploader_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND email = 'admin@egzamachiv.ht'
    )
  );

-- Politiques RLS pour favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour downloads
CREATE POLICY "Users can read own downloads"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert downloads"
  ON downloads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all downloads"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND email = 'admin@egzamachiv.ht'
    )
  );

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Fonction pour mettre à jour les compteurs
CREATE OR REPLACE FUNCTION update_counters()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le compteur de favoris de l'examen
  IF TG_TABLE_NAME = 'favorites' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE exams 
      SET favorites_count = favorites_count + 1,
          updated_at = now()
      WHERE id = NEW.exam_id;
      
      UPDATE profiles 
      SET favorites_count = favorites_count + 1,
          updated_at = now()
      WHERE id = NEW.user_id;
      
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE exams 
      SET favorites_count = GREATEST(favorites_count - 1, 0),
          updated_at = now()
      WHERE id = OLD.exam_id;
      
      UPDATE profiles 
      SET favorites_count = GREATEST(favorites_count - 1, 0),
          updated_at = now()
      WHERE id = OLD.user_id;
      
      RETURN OLD;
    END IF;
  END IF;

  -- Mettre à jour le compteur de téléchargements
  IF TG_TABLE_NAME = 'downloads' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE exams 
      SET downloads_count = downloads_count + 1,
          updated_at = now()
      WHERE id = NEW.exam_id;
      
      IF NEW.user_id IS NOT NULL THEN
        UPDATE profiles 
        SET downloads_count = downloads_count + 1,
            updated_at = now()
        WHERE id = NEW.user_id;
      END IF;
      
      RETURN NEW;
    END IF;
  END IF;

  -- Mettre à jour le compteur d'uploads
  IF TG_TABLE_NAME = 'exams' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE profiles 
      SET uploads_count = uploads_count + 1,
          updated_at = now()
      WHERE id = NEW.uploader_id;
      
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE profiles 
      SET uploads_count = GREATEST(uploads_count - 1, 0),
          updated_at = now()
      WHERE id = OLD.uploader_id;
      
      RETURN OLD;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour les compteurs
DROP TRIGGER IF EXISTS favorites_counter_trigger ON favorites;
CREATE TRIGGER favorites_counter_trigger
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_counters();

DROP TRIGGER IF EXISTS downloads_counter_trigger ON downloads;
CREATE TRIGGER downloads_counter_trigger
  AFTER INSERT ON downloads
  FOR EACH ROW
  EXECUTE FUNCTION update_counters();

DROP TRIGGER IF EXISTS exams_counter_trigger ON exams;
CREATE TRIGGER exams_counter_trigger
  AFTER INSERT OR DELETE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_counters();

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS exams_updated_at ON exams;
CREATE TRIGGER exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();