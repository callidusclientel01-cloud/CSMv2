-- Run this script in the Supabase SQL Editor to add the 'role' column
-- to your existing admin_users table.

ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'editor';

-- If you want to update existing users to be superadmin or viewer, you can do:
-- UPDATE public.admin_users SET role = 'superadmin' WHERE name = 'Your Name';
