import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { login, logout, updateUser } from "../slices/AuthSlice";

export default function Auth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    dispatch(
      login({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateUser = () => {
    dispatch(updateUser({ name: "Jane Doe" }));
  };

  return (
    <div>
      <h1>Autenticación</h1>
      {isAuthenticated ? (
        <div>
          <p>Usuario: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <button onClick={handleUpdateUser}>Actualizar Usuario</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <p>No estás autenticado</p>
          <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>
      )}
    </div>
  );
}