import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useGetGroupsQuery } from "../../../../services/GroupSupabase";
import { useUpdateUserMutation } from "../../../../services/patientsSupabase";

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    user_id: number;
    user_name: string;
    user_email: string;
    device_ip?: string;
    fk_group_id?: number;
  } | null;
  refetchPatients?: () => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  refetchPatients,
}) => {
  const [form, setForm] = useState({
    user_name: patient?.user_name || "",
    user_email: patient?.user_email || "",
    device_ip: patient?.device_ip || "",
    fk_group_id: patient?.fk_group_id ? String(patient.fk_group_id) : "",
  });
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
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
      user_name: patient?.user_name || "",
      user_email: patient?.user_email || "",
      device_ip: patient?.device_ip || "",
      fk_group_id: patient?.fk_group_id ? String(patient.fk_group_id) : "",
    });
    setAlertMessage("");
    setAlertType("success");
    setPendingAlert(null);
  }, [patient, isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlertType(pendingAlert.type);
      setAlertMessage(pendingAlert.message);
      setPendingAlert(null);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [isOpen, pendingAlert]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Paciente actualizado correctamente",
      });
      if (typeof refetchPatients === "function") refetchPatients();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al actualizar el paciente",
      });
    }
  }, [isSuccess, error, onClose, refetchPatients]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setShowAlert(true);
    e.preventDefault();
    if (patient) {
      await updateUser({
        user_id: patient.user_id,
        user_name: form.user_name,
        user_email: form.user_email,
        device_ip: form.device_ip,
        fk_group_id: form.fk_group_id ? Number(form.fk_group_id) : undefined,
      });
    }
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
            options={(groupsData || []).map(
              (g: { group_id: number; group_name: string }) => ({
                value: g.group_id,
                label: g.group_name,
              })
            )}
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

export default EditPatientModal;
