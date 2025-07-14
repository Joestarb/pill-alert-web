import { Route, Routes } from "react-router-dom";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import Login from "../pages/admin/login/Login";
import Error404 from "../pages/Error404";
import AdminRoutes from "./admin.routes";

export default function AppRoutes() {
  useAuthRedirect();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
