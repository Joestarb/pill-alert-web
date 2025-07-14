import { configureStore } from "@reduxjs/toolkit";
import { supabaseApi } from "../services/usersSupabase";
import themeReducer from "../slices/themeSlice";
import { supabaseGroupApi } from "../services/GroupSupabase";
import { supabasePatientsbaseApi } from "../services/patientsSupabase";
import { medicationsSupabaseApi } from "../services/medicationsSupabase";
import { supabaseAdminsApi } from "../services/adminsSupabase";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [supabaseGroupApi.reducerPath]: supabaseGroupApi.reducer,
    [supabasePatientsbaseApi.reducerPath]: supabasePatientsbaseApi.reducer,
    [medicationsSupabaseApi.reducerPath]: medicationsSupabaseApi.reducer,
    [supabaseAdminsApi.reducerPath]: supabaseAdminsApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware,
      supabaseGroupApi.middleware,
      supabasePatientsbaseApi.middleware,
      medicationsSupabaseApi.middleware,
      supabaseAdminsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
