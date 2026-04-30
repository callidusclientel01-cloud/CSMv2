-- Create the admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    auth_key TEXT NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., ["/admin/hospitals", "/admin/blog"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public selection (since we use anon key from the client)
CREATE POLICY "Allow Public Select for Admin Users"
ON public.admin_users FOR SELECT
USING (true);

-- Allow public insert (only superadmin will trigger this from the UI)
CREATE POLICY "Allow Public Insert for Admin Users"
ON public.admin_users FOR INSERT
WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow Public Update for Admin Users"
ON public.admin_users FOR UPDATE
USING (true);

-- Allow public delete
CREATE POLICY "Allow Public Delete for Admin Users"
ON public.admin_users FOR DELETE
USING (true);
