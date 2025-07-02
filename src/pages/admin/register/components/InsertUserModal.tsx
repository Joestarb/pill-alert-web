import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { Group } from "../../../../interfaces/groups";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useInsertUserMutation } from "../../../../services/usersSupabase";

interface InsertUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUsers?: () => void;
}

const InsertUserModal: React.FC<InsertUserModalProps> = ({
  isOpen,
  onClose,
  refetchUsers,
}) => {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    fk_group_id: "",
  });

  const [insertUser, { isLoading, error, isSuccess }] = useInsertUserMutation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const { data: groupsData } = useGetGroupsQuery({});

  useEffect(() => {
    setForm({
      user_name: "",
      user_email: "",
      user_password: "",
      fk_group_id: "",
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlertType(pendingAlert.type);
      setAlertMessage(pendingAlert.message);
      setShowAlert(true);
      setPendingAlert(null);
    }
  }, [isOpen, pendingAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Usuario insertado correctamente",
      });
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al insertar el usuario",
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await insertUser({
      user_name: form.user_name,
      user_email: form.user_email,
      user_password: form.user_password,
      fk_group_id: Number(form.fk_group_id),
    });

    if (typeof refetchUsers === "function") refetchUsers();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-5"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Insertar Usuario
          </h2>

          <div className="space-y-4">
            <Input
              name="user_name"
              label="Nombre"
              placeholder="Nombre del usuario"
              value={form.user_name}
              onChange={handleChange}
              required
            />
            <Input
              name="user_email"
              label="Correo Electrónico"
              placeholder="correo@ejemplo.com"
              value={form.user_email}
              onChange={handleChange}
              required
              type="email"
            />
            <Input
              name="user_password"
              label="Contraseña"
              placeholder="Contraseña"
              value={form.user_password}
              onChange={handleChange}
              required
              type="password"
            />
            <Select
              name="fk_group_id"
              label="Grupo"
              value={form.fk_group_id}
              onChange={handleChange}
              required
              options={(groupsData || []).map((group: Group) => ({
                value: group.group_id,
                label: group.group_name,
              }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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

export default InsertUserModal;
