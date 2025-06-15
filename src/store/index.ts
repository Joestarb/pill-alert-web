import { configureStore } from "@reduxjs/toolkit";
import { supabaseApi } from "../services/usersSupabase";
import themeReducer from "../slices/themeSlice";
import { supabaseGroupApi } from "../services/GroupSupabase";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [supabaseGroupApi.reducerPath]: supabaseGroupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware,
      supabaseGroupApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
