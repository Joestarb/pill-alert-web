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
    user_name: "",
    user_email: "",
    device_ip: "",
    fk_group_id: "",
  });

  const { data: groupsData } = useGetGroupsQuery({});
  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
  const [alert, setAlert] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [pendingAlert, setPendingAlert] = useState<typeof alert>(null);

  useEffect(() => {
    if (patient) {
      setForm({
        user_name: patient.user_name || "",
        user_email: patient.user_email || "",
        device_ip: patient.device_ip || "",
        fk_group_id: patient.fk_group_id ? String(patient.fk_group_id) : "",
      });
    }
    setAlert(null);
    setPendingAlert(null);
  }, [patient, isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlert(pendingAlert);
      setPendingAlert(null);
    }
  }, [isOpen, pendingAlert]);

  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({ type: "success", message: "Paciente actualizado correctamente" });
      if (typeof refetchPatients === "function") refetchPatients();
      onClose();
    } else if (error) {
      setPendingAlert({ type: "error", message: "Error al actualizar el paciente" });
    }
  }, [isSuccess, error, onClose, refetchPatients]);

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
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">Editar Paciente</h2>

          <Input
            name="user_name"
            label="Nombre del Paciente"
            value={form.user_name}
            onChange={handleChange}
            required
            type="text"
            placeholder="Nombre del paciente"
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
            required
            options={(groupsData || []).map(
              (g: { group_id: number; group_name: string }) => ({
                value: g.group_id,
                label: g.group_name,
              })
            )}
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

export default EditPatientModal;
