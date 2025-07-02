import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hashPassword } from "../utils/hashPassword";
import supabase from "../utils/supabase";

const HASH_SECRET_KEY = import.meta.env.VITE_HASH_SECRET_KEY;

export const supabasePatientsbaseApi = createApi({
  reducerPath: "supabasePatientsbaseApi",
  tagTypes: ["Item"],
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getItems: builder.query({
      queryFn: async () => {
        const { data } = await supabase
          .from("users")
          .select(
            "user_id, user_name, user_email, device_ip, roles(role_name), user_groups(group_id,group_name)"
          )
          .eq("fk_role_id", 2)
          .eq("deleted", 0)
          .order("created_at", { ascending: false });
        return { data };
      },
      keepUnusedDataFor: 300,
    }),

    UpdateUser: builder.mutation({
      queryFn: async ({
        user_id,
        user_name,
        user_email,
        user_password,
        fk_group_id,
        device_ip,
      }: {
        user_id: number;
        user_name?: string;
        user_email?: string;
        user_password?: string;
        fk_group_id?: number;
        device_ip?: string;
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
        if (device_ip !== undefined) updateFields.device_ip = device_ip;

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
        device_ip,
      }: {
        user_name: string;
        user_email: string;
        user_password: string;
        fk_group_id?: number;
        device_ip?: string;
      }) => {
        const { data, error } = await supabase
          .from("users")
          .insert({
            user_name,
            user_email,
            user_password: hashPassword(user_password, HASH_SECRET_KEY),
            fk_group_id,
            fk_role_id: 2,
            device_ip,
          })
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
  }),
});

// Hooks de Redux
export const {
  useGetItemsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useInsertUserMutation,
} = supabasePatientsbaseApi;

// 🚨 Funciones fuera de Redux Toolkit (usadas directamente por componentes)

export const getMedications = async () => {
  const { data, error } = await supabase
    .from("medications")
    .select("medications_id, medications");

  if (error) {
    console.error("Error al obtener medicamentos:", error.message);
    return [];
  }

  return data || [];
};

export const assignMedicationToUser = async (
  userId: number,
  medicationId: number,
  scheduleId: number = 1 // puedes pasar otro si luego lo haces dinámico
) => {
  // 1. Verificar si ya existe
  const { data: existing, error: checkError } = await supabase
    .from("medication_consumed")
    .select("medication_consumed_id") // o el nombre de tu PK
    .eq("fk_user_id", userId)
    .eq("fk_medication_id", medicationId)
    .eq("fk_schedule_id", scheduleId)
    .eq("deleted", 0)
    .maybeSingle();

  if (checkError) {
    console.error("Error al verificar duplicado:", checkError.message);
    throw checkError;
  }

  if (existing) {
    console.warn("Este medicamento ya fue asignado a este paciente con este horario.");
    throw new Error("Este medicamento ya está asignado con ese horario.");
  }

  // 2. Insertar si no existe
  const { data, error } = await supabase.from("medication_consumed").insert([
    {
      fk_user_id: userId,
      fk_medication_id: medicationId,
      fk_schedule_id: scheduleId,
      created_at: new Date().toISOString(),
      deleted: 0,
    },
  ]);

  if (error) {
    console.error("Error al asignar medicamento:", error.message);
    throw error;
  }

  return data;
};

