import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../utils/supabase";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  tagTypes: ["Item"],
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getItems: builder.query({
      queryFn: async () => {
        const { data } = await supabase
          .from("users")
          .select(
            "user_id, user_name, user_email, device_ip, roles(role_name), user_groups(group_name)"
          )
          .neq("fk_role_id", 1)
          .eq("deleted", 0)
          .order("created_at", { ascending: false });
        return { data };
      },
      // Mantiene los datos en caché por 5 minutos (300 segundos)
      keepUnusedDataFor: 300,
    }),
    getUserGroups: builder.query({
      queryFn: async (gruopId: number) => {
        const { data: user_groups, error } = await supabase
          .from("users")
          .select(
            "user_id, user_name, user_email, device_ip, roles(role_name), user_groups(group_name)"
          )
          .neq("fk_role_id", gruopId)
          .eq("deleted", 0)
          .order("created_at", { ascending: false });

        if (error) {
          return {
            error:
              error as unknown as import("@reduxjs/toolkit/query").FetchBaseQueryError,
            data: undefined,
          };
        }

        return { data: user_groups, error: undefined };
      },
    }),
  }),
});

export const { useGetItemsQuery, useGetUserGroupsQuery } = supabaseApi;
