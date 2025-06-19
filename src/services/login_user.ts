import supabase from '../utils/supabase';

export async function loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

  if (error) {
    throw error;
  }
  return data;
}
