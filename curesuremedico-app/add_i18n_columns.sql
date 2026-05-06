-- ==============================================================================
-- i18n MIGRATION SCRIPT (FR & AR)
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. HOSPITALS
ALTER TABLE hospitals 
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- 2. TREATMENTS
ALTER TABLE treatments
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS short_description_fr TEXT,
  ADD COLUMN IF NOT EXISTS short_description_ar TEXT,
  ADD COLUMN IF NOT EXISTS overview_title_fr TEXT,
  ADD COLUMN IF NOT EXISTS overview_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS overview_description_fr TEXT,
  ADD COLUMN IF NOT EXISTS overview_description_ar TEXT,
  ADD COLUMN IF NOT EXISTS procedures_fr JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS procedures_ar JSONB DEFAULT '[]'::jsonb;

-- 3. PACKAGES
ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- 4. DESTINATIONS
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS country_name_fr TEXT,
  ADD COLUMN IF NOT EXISTS country_name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- 5. BLOG POSTS
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';

-- Optional: Update existing blog posts to be 'en'
UPDATE blog_posts SET locale = 'en' WHERE locale IS NULL;
