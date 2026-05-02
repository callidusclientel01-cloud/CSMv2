-- Add status column to all content tables for the approval workflow

ALTER TABLE public.hospitals
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

ALTER TABLE public.treatments
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

ALTER TABLE public.patient_stories
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

-- Update existing records to 'published' so they don't disappear from the site
UPDATE public.hospitals SET status = 'published' WHERE status = 'draft';
UPDATE public.treatments SET status = 'published' WHERE status = 'draft';
UPDATE public.destinations SET status = 'published' WHERE status = 'draft';
UPDATE public.packages SET status = 'published' WHERE status = 'draft';
UPDATE public.blog_posts SET status = 'published' WHERE status = 'draft';
UPDATE public.patient_stories SET status = 'published' WHERE status = 'draft';
