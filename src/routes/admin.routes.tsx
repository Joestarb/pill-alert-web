import { Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Register from "../pages/admin/register/Register";
import Groups from "../pages/admin/groups/Groups";
import Patients from "../pages/admin/patients/Patients";
import Calendar from "../pages/admin/calendar/Calendar";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="register" element={<Register />} />
        <Route path="groups" element={<Groups />} />
        <Route path="patients" element={<Patients />} />
        <Route path="calendar" element={<Calendar />} />
        
      </Route>
    </Routes>
  );
}
