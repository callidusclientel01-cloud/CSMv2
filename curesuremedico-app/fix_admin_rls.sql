-- ==============================================================================
-- FIX RLS: OPTION 2 (TEMPORARY FIX)
-- This script replaces the strict 'TO authenticated' policies with open policies
-- so that the custom React Admin Panel (which runs as 'anon') can insert data.
-- WARNING: This allows anyone to insert data if they know your Supabase URL.
-- ==============================================================================

-- 1. HOSPITALS
DROP POLICY IF EXISTS "Admins can insert hospitals" ON hospitals;
CREATE POLICY "Admins can insert hospitals" ON hospitals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update hospitals" ON hospitals;
CREATE POLICY "Admins can update hospitals" ON hospitals FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete hospitals" ON hospitals;
CREATE POLICY "Admins can delete hospitals" ON hospitals FOR DELETE USING (true);

-- 2. TREATMENTS
DROP POLICY IF EXISTS "Admins can insert treatments" ON treatments;
CREATE POLICY "Admins can insert treatments" ON treatments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update treatments" ON treatments;
CREATE POLICY "Admins can update treatments" ON treatments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete treatments" ON treatments;
CREATE POLICY "Admins can delete treatments" ON treatments FOR DELETE USING (true);

-- 3. DESTINATIONS
DROP POLICY IF EXISTS "Admins can insert destinations" ON destinations;
CREATE POLICY "Admins can insert destinations" ON destinations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update destinations" ON destinations;
CREATE POLICY "Admins can update destinations" ON destinations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete destinations" ON destinations;
CREATE POLICY "Admins can delete destinations" ON destinations FOR DELETE USING (true);

-- 4. BLOG POSTS
DROP POLICY IF EXISTS "Admins can insert blog_posts" ON blog_posts;
CREATE POLICY "Admins can insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update blog_posts" ON blog_posts;
CREATE POLICY "Admins can update blog_posts" ON blog_posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete blog_posts" ON blog_posts;
CREATE POLICY "Admins can delete blog_posts" ON blog_posts FOR DELETE USING (true);

-- 5. PACKAGES (if RLS is enabled)
ALTER TABLE IF EXISTS packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view packages" ON packages;
CREATE POLICY "Public can view packages" ON packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert packages" ON packages;
CREATE POLICY "Admins can insert packages" ON packages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update packages" ON packages;
CREATE POLICY "Admins can update packages" ON packages FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete packages" ON packages;
CREATE POLICY "Admins can delete packages" ON packages FOR DELETE USING (true);

-- 6. PATIENT STORIES (if RLS is enabled)
ALTER TABLE IF EXISTS patient_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view patient_stories" ON patient_stories;
CREATE POLICY "Public can view patient_stories" ON patient_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert patient_stories" ON patient_stories;
CREATE POLICY "Admins can insert patient_stories" ON patient_stories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update patient_stories" ON patient_stories;
CREATE POLICY "Admins can update patient_stories" ON patient_stories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete patient_stories" ON patient_stories;
CREATE POLICY "Admins can delete patient_stories" ON patient_stories FOR DELETE USING (true);

-- 7. CURRENCIES (the one we just created, dropping 'TO authenticated')
DROP POLICY IF EXISTS "Currencies are manageable by authenticated admins" ON currencies;

DROP POLICY IF EXISTS "Admins can insert currencies" ON currencies;
CREATE POLICY "Admins can insert currencies" ON currencies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update currencies" ON currencies;
CREATE POLICY "Admins can update currencies" ON currencies FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete currencies" ON currencies;
CREATE POLICY "Admins can delete currencies" ON currencies FOR DELETE USING (true);
