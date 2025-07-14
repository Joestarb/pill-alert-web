import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const session = Cookies.get("user_session");

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  // Mientras se redirige, puedes retornar null o un loader
  if (!session) {
    return null; // o <Loader />
  }

  return <Outlet />;
};

export default ProtectedRoute;
