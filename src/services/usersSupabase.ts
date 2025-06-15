import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hashPassword } from "../utils/hashPassword";
import supabase from "../utils/supabase";

const HASH_SECRET_KEY = import.meta.env.VITE_HASH_SECRET_KEY;
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
          .eq("fk_role_id", 1)
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
          .eq("fk_group_id", gruopId)
          .neq("fk_role_id", 1)
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
    UpdateUser: builder.mutation({
      queryFn: async ({
        user_id,
        user_name,
        user_email,
        user_password,
        fk_group_id,
      }: {
        user_id: number;
        user_name?: string;
        user_email?: string;
        user_password?: string;
        fk_group_id?: number;
      }) => {
        const updateFields: Record<string, unknown> = {};
        if (user_name !== undefined) updateFields.user_name = user_name;
        if (user_email !== undefined) updateFields.user_email = user_email;
        if (user_password !== undefined) {
          updateFields.user_password = hashPassword(
            user_password,
            HASH_SECRET_KEY
          );
        }
        if (fk_group_id !== undefined) updateFields.fk_group_id = fk_group_id;

        const { data, error } = await supabase
          .from("users")
          .update(updateFields)
          .eq("user_id", user_id)
          .select();

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }
        return { data, error: undefined };
      },
    }),
    DeleteUser: builder.mutation({
      queryFn: async (user_id: number) => {
        const { data, error } = await supabase
          .from("users")
          .update({ deleted: 1 })
          .eq("user_id", user_id)
          .select();

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }
        return { data, error: undefined };
      },
    }),
    InsertUser: builder.mutation({
      queryFn: async ({
        user_name,
        user_email,
        user_password,
        fk_group_id,
      }: {
        user_name: string;
        user_email: string;
        user_password: string;
        fk_group_id?: number;
      }) => {
        const { data, error } = await supabase
          .from("users")
          .insert({
            user_name,
            user_email,
            user_password: hashPassword(user_password, HASH_SECRET_KEY),
            fk_group_id,
            fk_role_id: 1,
          })
          .select();

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }
        return { data, error: undefined };
      }
    }),
  }),
});
export const {
  useGetItemsQuery,
  useLazyGetUserGroupsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useInsertUserMutation,
} = supabaseApi;
