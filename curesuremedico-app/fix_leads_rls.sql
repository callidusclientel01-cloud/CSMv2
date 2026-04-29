-- Enable Row Level Security (just in case it's not enabled)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (this allows the frontend forms to submit new leads)
CREATE POLICY "Allow Public Insert for Leads"
ON leads FOR INSERT
WITH CHECK (true);

-- Allow public selection (this allows the admin panel to read leads without being authenticated)
-- Warning: Since we don't have a secure login system yet, this makes leads public.
-- In a production environment with real authentication, you would restrict this to authenticated admins only.
CREATE POLICY "Allow Public Select for Leads"
ON leads FOR SELECT
USING (true);

-- Allow public deletion (allows the admin panel to delete leads)
CREATE POLICY "Allow Public Delete for Leads"
ON leads FOR DELETE
USING (true);
