import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../utils/supabase";

export const supabaseGroupApi = createApi({
  reducerPath: "supabaseGroupApi",
  tagTypes: ["Item"],
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getGroups: builder.query({
      queryFn: async () => {
        const { data } = await supabase
          .from("user_groups")
          .select("group_id, group_name")
          .eq("deleted", 0)
          .order("created_at", { ascending: false });
        return { data };
      },
      keepUnusedDataFor: 300,
    }),
    UpdateGroups: builder.mutation({
      queryFn: async ({
        group_id,
        group_name,
      }: {
        group_id: number;
        group_name: string;
      }) => {
        const { data, error } = await supabase
          .from("user_groups")
          .update({ group_name })
          .eq("group_id", group_id);

        if (error) {
          return {
            error:
              error as unknown as import("@reduxjs/toolkit/query").FetchBaseQueryError,
            data: undefined,
          };
        }

        return { data, error: undefined };
      },
    }),
    CreateGroup: builder.mutation({
      queryFn: async (group_name: string) => {
        const { data, error } = await supabase
          .from("user_groups")
          .insert({ group_name })
          .select();

        if (error) {
          return {
            error:
              error as unknown as import("@reduxjs/toolkit/query").FetchBaseQueryError,
            data: undefined,
          };
        }

        return { data, error: undefined };
      },
    }),
    DeleteGroup: builder.mutation({
      queryFn: async (group_id: number) => {
        const { data, error } = await supabase
          .from("user_groups")
          .update({ deleted: 1 })
          .eq("group_id", group_id);

        if (error) {
          return {
            error:
              error as unknown as import("@reduxjs/toolkit/query").FetchBaseQueryError,
            data: undefined,
          };
        }

        return { data, error: undefined };
      },
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupsMutation,
} = supabaseGroupApi;
