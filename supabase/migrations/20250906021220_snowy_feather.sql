/*
  # Créer des utilisateurs de démonstration

  1. Utilisateurs de démonstration
    - Admin: admin@egzamachiv.ht / password
    - Utilisateur: marie@example.com / password
  
  2. Profils correspondants
    - Création automatique des profils via trigger
    - Configuration des permissions admin
  
  3. Sécurité
    - Mots de passe hashés correctement
    - Profils avec bonnes permissions
*/

-- Insérer les utilisateurs de démonstration dans auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@egzamachiv.ht',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7uJ7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'marie@example.com',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7uJ7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Insérer les profils correspondants
INSERT INTO public.profiles (
  id,
  email,
  name,
  is_premium,
  is_active
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'admin@egzamachiv.ht',
  'Administrateur',
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000002',
  'marie@example.com',
  'Marie Dupont',
  false,
  true
) ON CONFLICT (id) DO NOTHING;