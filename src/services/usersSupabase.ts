import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../utils/supabase";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  tagTypes: ["Item"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getItems: builder.query({
      queryFn: async () => {
        
        const { data } = await supabase
          .from("users")
          .select(
            "user_name,user_email,device_ip, roles(role_name), user_groups(group_name)"
          )
          .eq("deleted", 0)
          .order("created_at", { ascending: false });
        return { data };
      },
    }),
  }),
});

export const { useGetItemsQuery } = supabaseApi;
