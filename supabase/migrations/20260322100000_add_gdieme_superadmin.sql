-- Add Georges DIEME as super_admin
--
-- This migration creates the auth user and associated Guest + StaffAssignment records.
-- Username: gdieme | Password: probiteE@08020 | Role: super_admin
--
-- NOTE: The auth.users INSERT uses Supabase's internal password hashing via crypt().
-- If this migration fails on auth.users (e.g., user already exists), the Guest and
-- StaffAssignment records will still be created via ON CONFLICT DO NOTHING.

-- Step 1: Create auth user (gdieme@parisvasy.com)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'gdieme@parisvasy.com',
  crypt('probiteE@08020', gen_salt('bf')),
  NOW(),
  '{"first_name": "Georges", "last_name": "DIEME", "username": "gdieme", "role": "super_admin"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Step 2: Create Guest record
INSERT INTO "Guest" (
  "id", "authUserId", "email", "firstName", "lastName", "phone", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  (SELECT id::text FROM auth.users WHERE email = 'gdieme@parisvasy.com'),
  'gdieme@parisvasy.com',
  'Georges',
  'DIEME',
  '+33 6 00 00 00 00',
  NOW(),
  NOW()
) ON CONFLICT ("email") DO UPDATE SET
  "firstName" = 'Georges',
  "lastName" = 'DIEME',
  "authUserId" = (SELECT id::text FROM auth.users WHERE email = 'gdieme@parisvasy.com'),
  "updatedAt" = NOW();

-- Step 3: Create StaffAssignment (super_admin at first hotel)
INSERT INTO "StaffAssignment" (
  "id", "userId", "hotelId", "role", "isActive", "createdAt"
) VALUES (
  gen_random_uuid()::text,
  (SELECT id::text FROM auth.users WHERE email = 'gdieme@parisvasy.com'),
  (SELECT "id" FROM "Hotel" LIMIT 1),
  'super_admin',
  true,
  NOW()
) ON CONFLICT ("userId", "hotelId") DO UPDATE SET
  "role" = 'super_admin',
  "isActive" = true;
