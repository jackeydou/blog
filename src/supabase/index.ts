import { createClient } from '@supabase/supabase-js'

// @ts-ignore
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function getBooks() {
  return await supabase.from('Books').select()
}