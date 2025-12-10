/*
  # Create Database Schema for Exam Sharing Platform
  
  1. New Tables
    - `profiles` - User profile information
    - `exams` - Uploaded exam documents
    - `downloads` - Track file downloads
    - `favorites` - User favorite exams
  
  2. Security
    - Enable RLS on all tables
    - Create policies for proper access control
    - Allow authenticated users to upload and view exams
  
  3. Features
    - Automatic timestamp tracking
    - Download and favorite counting
    - Admin approval workflow for submissions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  avatar_url text,
  bio text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  classe text NOT NULL,
  matiere text NOT NULL,
  level text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  status text DEFAULT 'pending',
  is_official boolean DEFAULT false,
  downloads_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved exams"
  ON public.exams FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can view all exams"
  ON public.exams FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Uploaders can view their own pending exams"
  ON public.exams FOR SELECT
  TO authenticated
  USING (uploader_id = auth.uid());

CREATE POLICY "Authenticated users can create exams"
  ON public.exams FOR INSERT
  TO authenticated
  WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Uploaders can update their own exams"
  ON public.exams FOR UPDATE
  TO authenticated
  USING (uploader_id = auth.uid())
  WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Admins can update exam status"
  ON public.exams FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Uploaders can delete their own exams"
  ON public.exams FOR DELETE
  TO authenticated
  USING (uploader_id = auth.uid());

-- Create downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles ON DELETE SET NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads"
  ON public.downloads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all downloads"
  ON public.downloads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can create downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (true);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES public.exams ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_uploader ON public.exams(uploader_id);
CREATE INDEX IF NOT EXISTS idx_exams_level ON public.exams(level);
CREATE INDEX IF NOT EXISTS idx_exams_matiere ON public.exams(matiere);
CREATE INDEX IF NOT EXISTS idx_downloads_exam ON public.downloads(exam_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_exam ON public.favorites(exam_id);
