import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking profiles...");
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles);
  if (pError) console.error(pError);

  console.log("Checking admin_users...");
  const { data: adminUsers, error: aError } = await supabase.from('admin_users').select('*');
  console.log("Admin Users:", adminUsers);
  if (aError) console.error(aError);
}

check();
