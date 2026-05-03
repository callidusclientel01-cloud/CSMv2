-- ENABLE RLS FOR TABLES (Just in case they aren't enabled)
ALTER TABLE IF EXISTS destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

-----------------------------------------------------------
-- POLICIES FOR DESTINATIONS
-----------------------------------------------------------
DROP POLICY IF EXISTS "Public can view destinations" ON destinations;
CREATE POLICY "Public can view destinations" ON destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert destinations" ON destinations;
CREATE POLICY "Admins can insert destinations" ON destinations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update destinations" ON destinations;
CREATE POLICY "Admins can update destinations" ON destinations FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete destinations" ON destinations;
CREATE POLICY "Admins can delete destinations" ON destinations FOR DELETE TO authenticated USING (true);

-----------------------------------------------------------
-- POLICIES FOR HOSPITALS
-----------------------------------------------------------
DROP POLICY IF EXISTS "Public can view hospitals" ON hospitals;
CREATE POLICY "Public can view hospitals" ON hospitals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert hospitals" ON hospitals;
CREATE POLICY "Admins can insert hospitals" ON hospitals FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update hospitals" ON hospitals;
CREATE POLICY "Admins can update hospitals" ON hospitals FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete hospitals" ON hospitals;
CREATE POLICY "Admins can delete hospitals" ON hospitals FOR DELETE TO authenticated USING (true);

-----------------------------------------------------------
-- POLICIES FOR TREATMENTS
-----------------------------------------------------------
DROP POLICY IF EXISTS "Public can view treatments" ON treatments;
CREATE POLICY "Public can view treatments" ON treatments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert treatments" ON treatments;
CREATE POLICY "Admins can insert treatments" ON treatments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update treatments" ON treatments;
CREATE POLICY "Admins can update treatments" ON treatments FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete treatments" ON treatments;
CREATE POLICY "Admins can delete treatments" ON treatments FOR DELETE TO authenticated USING (true);

-----------------------------------------------------------
-- POLICIES FOR BLOG POSTS
-----------------------------------------------------------
DROP POLICY IF EXISTS "Public can view blog_posts" ON blog_posts;
CREATE POLICY "Public can view blog_posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert blog_posts" ON blog_posts;
CREATE POLICY "Admins can insert blog_posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update blog_posts" ON blog_posts;
CREATE POLICY "Admins can update blog_posts" ON blog_posts FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete blog_posts" ON blog_posts;
CREATE POLICY "Admins can delete blog_posts" ON blog_posts FOR DELETE TO authenticated USING (true);
