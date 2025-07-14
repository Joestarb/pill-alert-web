import { createClient, SupabaseClient } from '@supabase/supabase-js';



const supabaseUrl = 'https://cvrnzmdgqzifbaxqgifd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;
    
 const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
if (!supabase) {
    throw new Error('Supabase client could not be created');
}

export default supabase;