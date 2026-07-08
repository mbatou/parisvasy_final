-- ─── SUPABASE STORAGE BUCKETS ───
-- Create storage buckets for image uploads with public read access
-- Run this in the Supabase SQL Editor

-- Create buckets (public = true means files are accessible without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('hotel-images', 'hotel-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('room-images', 'room-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('experience-images', 'experience-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── STORAGE POLICIES ───

-- Public read access (anyone can view images)
CREATE POLICY "public_read_hotel_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'hotel-images');

CREATE POLICY "public_read_room_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'room-images');

CREATE POLICY "public_read_experience_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'experience-images');

-- Authenticated upload (only logged-in users can upload)
CREATE POLICY "auth_upload_hotel_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "auth_upload_room_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "auth_upload_experience_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'experience-images');

-- Authenticated delete (only logged-in users can delete)
CREATE POLICY "auth_delete_hotel_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'hotel-images');

CREATE POLICY "auth_delete_room_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'room-images');

CREATE POLICY "auth_delete_experience_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'experience-images');

-- Service role full access (used by the admin API via service_role key)
CREATE POLICY "service_role_all_hotel_images" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'hotel-images')
  WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "service_role_all_room_images" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'room-images')
  WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "service_role_all_experience_images" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'experience-images')
  WITH CHECK (bucket_id = 'experience-images');
