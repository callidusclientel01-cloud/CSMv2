-- Create a new public bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('curesuremedico-media', 'curesuremedico-media', true);

-- Policy to allow public viewing
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'curesuremedico-media' );

-- Policy to allow uploads (Warning: public upload is allowed here for simplicity. You can restrict to 'authenticated' users later if needed)
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'curesuremedico-media' );

-- Policy to allow updates
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'curesuremedico-media' );

-- Policy to allow deletes
CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'curesuremedico-media' );
