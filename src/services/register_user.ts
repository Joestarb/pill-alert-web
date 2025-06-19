import supabase from '../utils/supabase';


export async function registerUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

  if (error) {
    throw error;
  }
  return data;
}



