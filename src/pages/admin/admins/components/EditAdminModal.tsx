import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useUpdateUserMutation } from "../../../../services/adminsSupabase";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: {
    user_id: number;
    user_name: string;
    user_email: string;
    device_ip?: string;
    fk_group_id?: number;
    user_groups?: { group_id: number; group_name: string }[];
  } | null;
  refetchAdmins?: () => void;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({
  isOpen,
  onClose,
  admin,
  refetchAdmins,
}) => {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    device_ip: "",
    fk_group_id: "",
    user_password: "",
  });
  const { data: groupsData } = useGetGroupsQuery({});
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
  const [alert, setAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const [pendingAlert, setPendingAlert] = useState<typeof alert>(null);

  useEffect(() => {
    if (admin) {
      setForm({
        user_name: admin.user_name || "",
        user_email: admin.user_email || "",
        device_ip: admin.device_ip || "",
        fk_group_id: admin.fk_group_id
          ? String(admin.fk_group_id)
          : admin.user_groups?.[0]?.group_id
          ? String(admin.user_groups[0].group_id)
          : "",
        user_password: "",
      });
    }
    setAlert(null);
    setPendingAlert(null);
  }, [admin, isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlert(pendingAlert);
      setPendingAlert(null);
    }
  }, [isOpen, pendingAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Admin actualizado correctamente",
      });
      if (typeof refetchAdmins === "function") refetchAdmins();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al actualizar el admin",
      });
    }
  }, [isSuccess, error, onClose, refetchAdmins]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin) {
      await updateUser({
        user_id: admin.user_id,
        user_name: form.user_name,
        user_email: form.user_email,
        device_ip: form.device_ip,
        fk_group_id: form.fk_group_id ? Number(form.fk_group_id) : undefined,
        user_password: form.user_password,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">Editar Admin</h2>

          <Input
            name="user_name"
            label="Nombre del Admin"
            value={form.user_name}
            onChange={handleChange}
            required
            type="text"
            placeholder="Nombre del admin"
          />

          <Input
            name="user_email"
            label="Correo Electrónico"
            value={form.user_email}
            onChange={handleChange}
            required
            type="email"
            placeholder="Correo electrónico"
          />

          <Input
            name="user_password"
            label="Nueva contraseña (opcional)"
            value={form.user_password}
            onChange={handleChange}
            required={false}
            type="password"
            placeholder="Nueva contraseña (opcional)"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={false}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {alert && (
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setAlert(null)}
        >
          <Alert
            variant={alert.type}
            title={alert.type === "success" ? "Éxito" : "Error"}
            message={alert.message}
          />
        </div>
      )}
    </>
  );
};

export default EditAdminModal;
