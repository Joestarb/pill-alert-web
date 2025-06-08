import supabase from "../utils/supabase";



export async function getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("user_name,user_email,device_ip, roles(role_name), user_groups(group_name)")
      .eq("deleted", 0)
      .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}