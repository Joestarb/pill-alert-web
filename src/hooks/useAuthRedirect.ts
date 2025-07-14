import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const session = Cookies.get("user_session");
    // Si no hay sesión y no estamos en la página de login, redirigir al login
    if (!session && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);
}
