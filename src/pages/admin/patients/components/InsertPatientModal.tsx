import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useInsertUserMutation } from "../../../../services/patientsSupabase";

interface InsertPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchPatients?: () => void;
}

const InsertPatientModal: React.FC<InsertPatientModalProps> = ({
  isOpen,
  onClose,
  refetchPatients,
}) => {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    device_ip: "",
    fk_group_id: "",
  });
  const { data: groupsData } = useGetGroupsQuery({});
  const [createUser, { isLoading, error, isSuccess }] = useInsertUserMutation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  useEffect(() => {
    setForm({
      user_name: "",
      user_email: "",
      user_password: "",
      device_ip: "",
      fk_group_id: "",
    });
    setAlertMessage("");
    setAlertType("success");
    setPendingAlert(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlertType(pendingAlert.type);
      setAlertMessage(pendingAlert.message);
      setPendingAlert(null);
    }
  }, [isOpen, pendingAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Paciente insertado correctamente",
      });
      if (typeof refetchPatients === "function") refetchPatients();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al insertar el paciente",
      });
    }
  }, [isSuccess, error, onClose, refetchPatients]);

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
    setShowAlert(true);
    await createUser({
      user_name: form.user_name,
      user_email: form.user_email,
      user_password: form.user_password,
      device_ip: form.device_ip,
      fk_group_id: form.fk_group_id ? Number(form.fk_group_id) : undefined,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="user_name"
            label="Nombre del Paciente"
            value={form.user_name}
            onChange={handleChange}
            required={true}
            type="text"
            placeholder="Nombre del paciente"
          />
          <Input
            name="user_email"
            label="Correo Electrónico"
            value={form.user_email}
            onChange={handleChange}
            required={true}
            type="email"
            placeholder="Correo electrónico"
          />
          <Input
            name="user_password"
            label="Contraseña"
            value={form.user_password}
            onChange={handleChange}
            required={true}
            type="password"
            placeholder="Contraseña"
          />
          <Input
            name="device_ip"
            label="IP del Dispositivo"
            value={form.device_ip}
            onChange={handleChange}
            required={false}
            type="text"
            placeholder="IP del dispositivo"
          />
          <Select
            name="fk_group_id"
            label="Grupo"
            value={form.fk_group_id}
            onChange={handleChange}
            required={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options={(groupsData || []).map((g: any) => ({
              value: g.group_id,
              label: g.group_name,
            }))}
          />
          <div className="flex justify-end gap-2">
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

export default InsertPatientModal;
