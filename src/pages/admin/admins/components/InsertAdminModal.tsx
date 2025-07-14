import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useInsertUserMutation } from "../../../../services/adminsSupabase";

interface InsertAdminModalProps {
  open: boolean;
  onClose: () => void;
  refetchAdmins?: () => void;
}

const InsertAdminModal: React.FC<InsertAdminModalProps> = ({
  open,
  onClose,
  refetchAdmins,
}) => {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    device_ip: "",
    fk_group_id: "",
  });
  const { data: groupsData } = useGetGroupsQuery({});
  const [insertUser, { isLoading, error, isSuccess }] = useInsertUserMutation();
  const [alert, setAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const [pendingAlert, setPendingAlert] = useState<typeof alert>(null);

  useEffect(() => {
    setForm({
      user_name: "",
      user_email: "",
      user_password: "",
      device_ip: "",
      fk_group_id: "",
    });
    setAlert(null);
    setPendingAlert(null);
  }, [open]);

  useEffect(() => {
    if (!open && pendingAlert) {
      setAlert(pendingAlert);
      setPendingAlert(null);
    }
  }, [open, pendingAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Admin insertado correctamente",
      });
      if (typeof refetchAdmins === "function") refetchAdmins();
      onClose();
    } else if (error) {
      setPendingAlert({ type: "error", message: "Error al insertar el admin" });
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
    await insertUser({
      user_name: form.user_name,
      user_email: form.user_email,
      user_password: form.user_password,
      device_ip: form.device_ip,
      fk_group_id: form.fk_group_id ? Number(form.fk_group_id) : undefined,
    });
  };

  return (
    <>
      <Modal isOpen={open} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">Registrar Admin</h2>

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
            label="Contraseña"
            value={form.user_password}
            onChange={handleChange}
            required
            type="password"
            placeholder="Contraseña"
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

export default InsertAdminModal;
