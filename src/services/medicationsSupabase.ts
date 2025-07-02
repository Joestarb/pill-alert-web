import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../utils/supabase";

export const medicationsSupabaseApi = createApi({
  reducerPath: "medicationsSupabaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["Medications"],
  endpoints: (builder) => ({
    getMedications: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("medications")
          .select("medications_id, medications");

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
          };
        }

        return { data };
      },
      providesTags: ["Medications"],
    }),

    insertMedication: builder.mutation({
      queryFn: async ({ name }: { name: string }) => {
        const { data, error } = await supabase
          .from("medications")
          .insert({ medications: name })
          .select();

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }

        return { data };
      },
      invalidatesTags: ["Medications"],
    }),

    updateMedication: builder.mutation({
      queryFn: async ({
        id,
        name,
      }: {
        id: number;
        name: string;
      }) => {
        const { data, error } = await supabase
          .from("medications")
          .update({ medications: name })
          .eq("medications_id", id)
          .select();

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }

        return { data };
      },
      invalidatesTags: ["Medications"],
    }),

    deleteMedication: builder.mutation({
      queryFn: async (id: number) => {
        // Primero elimina registros en medication_consumed
        await supabase
          .from("medication_consumed")
          .delete()
          .eq("fk_medication_id", id);

        const { data, error } = await supabase
          .from("medications")
          .delete()
          .eq("medications_id", id);

        if (error) {
          return {
            error: { status: 400, data: { message: error.message } },
            data: undefined,
          };
        }

        return { data };
      },
      invalidatesTags: ["Medications"],
    }),
  }),
});

export const {
  useGetMedicationsQuery,
  useInsertMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
} = medicationsSupabaseApi;
