import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Configuración del servicio API
export const api = createApi({
  reducerPath: "api", // Nombre del reducer en el store
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }), // URL base de la API
  endpoints: (builder) => ({
    // Endpoint para obtener los posts
    getPosts: builder.query({
      query: () => "/posts", // Ruta del endpoint
    }),
  }),
});

// Exportar el hook generado automáticamente por RTK Query
export const { useGetPostsQuery } = api;