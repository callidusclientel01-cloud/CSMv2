-- Add missing fields to the hospitals table to support the advanced hospital profile template

ALTER TABLE public.hospitals
ADD COLUMN IF NOT EXISTS short_location text,
ADD COLUMN IF NOT EXISTS established_year integer,
ADD COLUMN IF NOT EXISTS beds_count text,
ADD COLUMN IF NOT EXISTS ots_count text,
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS facilities jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specialties text, -- Stored as comma-separated string for simplicity
ADD COLUMN IF NOT EXISTS gallery_image_1 text,
ADD COLUMN IF NOT EXISTS gallery_image_2 text,
ADD COLUMN IF NOT EXISTS gallery_image_3 text,
ADD COLUMN IF NOT EXISTS gallery_image_4 text;
