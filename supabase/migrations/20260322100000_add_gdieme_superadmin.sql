-- Add Georges DIEME as super_admin
--
-- Username: gdieme | Password: probiteE@08020 | Role: super_admin

-- Ensure Maison Etoile hotel exists
INSERT INTO "Hotel" ("id", "name", "slug", "address", "city", "country", "description", "stars", "phone", "email", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text, 'Maison Etoile', 'maison-etoile', '12 Rue de Rivoli', 'Paris', 'France',
  'A charming 4-star boutique hotel in the heart of Paris, steps from the Louvre and the Seine.',
  4, '+33 1 42 60 00 00', 'bonjour@maison-etoile.fr', true, NOW(), NOW()
) ON CONFLICT ("slug") DO NOTHING;

-- Create auth user, identity, guest, and staff assignment
DO $$
DECLARE
  _uid uuid;
  _hotel_id text;
BEGIN
  SELECT "id" INTO _hotel_id FROM "Hotel" WHERE "slug" = 'maison-etoile';

  SELECT id INTO _uid FROM auth.users WHERE email = 'gdieme@parisvasy.com';

  IF _uid IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at
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
    )
    RETURNING id INTO _uid;
  END IF;

  -- Create identity record (required for Supabase Auth sign-in)
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    _uid,
    _uid,
    jsonb_build_object('sub', _uid::text, 'email', 'gdieme@parisvasy.com', 'email_verified', true),
    'email',
    _uid::text,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT DO NOTHING;

  -- Create Guest record
  INSERT INTO "Guest" ("id", "authUserId", "email", "firstName", "lastName", "phone", "createdAt", "updatedAt")
  VALUES (gen_random_uuid()::text, _uid::text, 'gdieme@parisvasy.com', 'Georges', 'DIEME', '+33 6 00 00 00 00', NOW(), NOW())
  ON CONFLICT ("email") DO UPDATE SET
    "firstName" = 'Georges',
    "lastName" = 'DIEME',
    "authUserId" = _uid::text,
    "updatedAt" = NOW();

  -- Create StaffAssignment (super_admin)
  INSERT INTO "StaffAssignment" ("id", "userId", "hotelId", "role", "isActive", "createdAt")
  VALUES (gen_random_uuid()::text, _uid::text, _hotel_id, 'super_admin', true, NOW())
  ON CONFLICT ("userId", "hotelId") DO UPDATE SET
    "role" = 'super_admin',
    "isActive" = true;
END $$;
