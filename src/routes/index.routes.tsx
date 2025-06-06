import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "../pages/Error404";
import AdminRoutes from "./admin.routes";
import Login from "../pages/admin/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>, // Página principal
    errorElement: <Error404 />, // Página 404
  },

  {
    path: "/admin/*",
    element: <AdminRoutes />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}