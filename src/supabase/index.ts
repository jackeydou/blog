// import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// @ts-ignore
const supabase = createServerComponentClient({ cookies });

export async function getBooks() {
  return await supabase.from('Books').select();
}
