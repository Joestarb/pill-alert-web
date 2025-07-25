import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Admins from "../pages/admin/admins/Admins";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Groups from "../pages/admin/groups/Groups";
import Patients from "../pages/admin/patients/Patients";
import Register from "../pages/admin/register/Register";
import ProtectedRoute from "./ProtectedRoute";
import Medications from "../pages/admin/medicines/Medications";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="register" element={<Register />} />
          <Route path="groups" element={<Groups />} />
          <Route path="patients" element={<Patients />} />
          <Route path="admins" element={<Admins />} />
          <Route path="medicnies" element={<Medications />} />

        </Route>
      </Route>
    </Routes>
  );
}
