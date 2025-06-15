import { configureStore } from "@reduxjs/toolkit";
import { supabaseApi } from "../services/usersSupabase";
import themeReducer from "../slices/themeSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
