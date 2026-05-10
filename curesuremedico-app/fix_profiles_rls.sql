-- ==============================================================================
-- FIX PROFILES RLS: Allow Admins (and public for now) to view profiles
-- ==============================================================================

-- Make sure RLS is enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the profiles table
-- (This allows the Admin Panel using the anon key to fetch the patients list)
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow public update access to the profiles table
-- (This allows the Admin Panel to update the roadmap_phase)
DROP POLICY IF EXISTS "Public can update profiles" ON public.profiles;
CREATE POLICY "Public can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);
