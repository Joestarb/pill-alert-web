import { Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Register from "../pages/admin/register/Register";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
