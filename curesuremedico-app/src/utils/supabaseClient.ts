import { createClient } from '@supabase/supabase-js'

// We will use environment variables for security.
// Ensure you have a .env.local file with:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Example usage:
 * 
 * import { supabase } from '@/utils/supabaseClient';
 * 
 * export async function getPackages() {
 *   const { data, error } = await supabase.from('packages').select('*');
 *   if (error) console.error(error);
 *   return data;
 * }
 */
