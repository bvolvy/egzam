/*
  # Créer le bucket de stockage pour les examens

  1. Storage
    - Crée un bucket 'exam-files' pour stocker les PDF d'examens
    - Configure le bucket comme public pour permettre les téléchargements
    - Ajoute des politiques RLS pour contrôler les uploads

  2. Sécurité
    - Seuls les utilisateurs authentifiés peuvent uploader
    - Tous les utilisateurs peuvent télécharger les fichiers
    - Limite la taille des fichiers à 10MB
*/

-- Créer le bucket pour les fichiers d'examens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exam-files',
  'exam-files',
  true,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Authenticated users can upload exam files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can download exam files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Politique : Les utilisateurs authentifiés peuvent uploader des fichiers
CREATE POLICY "Authenticated users can upload exam files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'exam-files' AND
  (storage.foldername(name))[1] = 'exams'
);

-- Politique : Tout le monde peut télécharger les fichiers
CREATE POLICY "Anyone can download exam files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'exam-files');

-- Politique : Les utilisateurs peuvent supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'exam-files' AND
  owner = auth.uid()
);
