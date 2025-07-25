import Cookies from "js-cookie";
import { hashPassword } from "../utils/hashPassword";
import supabase from "../utils/supabase";

const HASH_SECRET_KEY = import.meta.env.VITE_HASH_SECRET_KEY;

export async function loginUser(email: string, password: string) {
  const hashedPassword = hashPassword(password, HASH_SECRET_KEY);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_email", email)
    .eq("user_password", hashedPassword)
    .eq("fk_role_id", 3)
    .single();
  if (error) {
    throw error;
  }
  // Guardar la sesión en las cookies (puedes ajustar los datos a guardar según tu necesidad)
  if (data) {
    // Por seguridad, no guardes la contraseña ni datos sensibles
    Cookies.set(
      "user_session",
      JSON.stringify({
        id: data.user_id,
        email: data.user_email,
        name: data.user_name,
        role: data.user_role,
      }),
      { expires: 1 }
    ); // 1 día de expiración
  }
  return data;
}
