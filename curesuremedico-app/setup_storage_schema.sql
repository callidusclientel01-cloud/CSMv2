-- Create a new public bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('curesuremedico-media', 'curesuremedico-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'curesuremedico-media');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'curesuremedico-media');

-- Allow updates
DROP POLICY IF EXISTS "Allow Updates" ON storage.objects;
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'curesuremedico-media');

-- Allow deletes
DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;
CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'curesuremedico-media');

