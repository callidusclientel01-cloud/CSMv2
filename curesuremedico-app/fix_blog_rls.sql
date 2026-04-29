-- Enable Row Level Security (just in case)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public selection (allows frontend and admin to read blog posts)
CREATE POLICY "Allow Public Select for Blog Posts"
ON blog_posts FOR SELECT
USING (true);

-- Allow public insertion (allows admin panel to create blog posts)
CREATE POLICY "Allow Public Insert for Blog Posts"
ON blog_posts FOR INSERT
WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow Public Update for Blog Posts"
ON blog_posts FOR UPDATE
USING (true);

-- Allow public deletion
CREATE POLICY "Allow Public Delete for Blog Posts"
ON blog_posts FOR DELETE
USING (true);
