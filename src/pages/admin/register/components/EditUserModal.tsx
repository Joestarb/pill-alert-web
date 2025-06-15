import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { User } from "../../../../interfaces/api/userInterface";
import { Group } from "../../../../interfaces/groups";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useUpdateUserMutation } from "../../../../services/usersSupabase";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  refetchUsers?: () => void; // Nueva prop opcional
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  refetchUsers, // Desestructuramos la nueva prop
}) => {
  const [form, setForm] = useState({
    user_name: user?.user_name || "",
    user_email: user?.user_email || "",
    user_password: "",
    fk_group_id: user?.user_groups?.group_id || "",
  });
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Nuevo estado para controlar si se debe mostrar el alert después de cerrar el modal
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const { data: groupsData } = useGetGroupsQuery({});
  useEffect(() => {
    setForm({
      user_name: user?.user_name || "",
      user_email: user?.user_email || "",
      user_password: "",
      fk_group_id: user?.user_groups?.group_id || "",
    });
  }, [user]);

  // Mostrar alert solo cuando el modal ya está cerrado
  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlertType(pendingAlert.type);
      setAlertMessage(pendingAlert.message);
      setShowAlert(true);
      setPendingAlert(null);
    }
  }, [isOpen, pendingAlert]);

  // Ya no mostramos el alert aquí directamente
  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Usuario actualizado correctamente",
      });
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al actualizar el usuario",
      });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "fk_group_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateUser({
      user_id: user.user_id,
      user_name: form.user_name,
      user_email: form.user_email,
      user_password: form.user_password || undefined,
      fk_group_id: Number(form.fk_group_id),
    });
    if (typeof refetchUsers === "function") {
      refetchUsers();
    }
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Editar Usuario
          </h2>
          <Input
            type="text"
            name="user_name"
            label="Nombre"
            placeholder="Nombre del usuario"
            value={form.user_name}
            onChange={handleChange}
            required={true}
            className="mb-4"
          />
          <Input
            type="email"
            name="user_email"
            label="Correo Electrónico"
            placeholder="correo@ejemplo.com"
            value={form.user_email}
            onChange={handleChange}
            required={true}
            className="mb-4"
          />
          <Input
            type="password"
            name="user_password"
            label="Contraseña (opcional)"
            placeholder="Dejar en blanco para no cambiar"
            value={form.user_password}
            onChange={handleChange}
            required={false}
            className="mb-4"
          />
          {/* Campo para fk_group_id */}
          <div className="mb-4">
            <label
              htmlFor="fk_group_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Grupo
            </label>
            <select
              id="fk_group_id"
              name="fk_group_id"
              value={form.fk_group_id}
              onChange={handleChange}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-white"
            >
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {Array.isArray(groupsData) &&
                groupsData.map((group: Group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
      {showAlert && (
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setShowAlert(false)}
        >
          <Alert
            variant={alertType}
            title={alertType === "success" ? "Éxito" : "Error"}
            message={alertMessage}
          />
        </div>
      )}
    </>
  );
};

export default EditUserModal;
