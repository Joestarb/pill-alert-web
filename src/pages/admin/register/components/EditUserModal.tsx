import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import { Modal } from "../../../../components/ui/modal";
import { User } from "../../../../interfaces/api/userInterface";
import { useUpdateUserMutation } from "../../../../services/usersSupabase";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [form, setForm] = useState({
    user_name: user?.user_name || "",
    user_email: user?.user_email || "",
    user_password: "",
  });
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();

  useEffect(() => {
    setForm({
      user_name: user?.user_name || "",
      user_email: user?.user_email || "",
      user_password: "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateUser({
      user_id: user.user_id,
      user_name: form.user_name,
      user_email: form.user_email,
      user_password: form.user_password || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Editar Usuario
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="user_email"
            value={form.user_email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Contraseña (opcional)
          </label>
          <input
            type="password"
            name="user_password"
            value={form.user_password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-white"
            placeholder="Dejar en blanco para no cambiar"
          />
        </div>
        {error && (
          <div className="text-red-500 mb-2">
            Error al actualizar el usuario
          </div>
        )}
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
        {isSuccess && (
          <div className="text-green-500 mt-2">
            Usuario actualizado correctamente
          </div>
        )}
      </form>
    </Modal>
  );
};

export default EditUserModal;
