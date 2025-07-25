import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useUpdateMedicationMutation } from "../../../../services/medicationsSupabase";

interface EditMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: { medications_id: number; medications: string } | null;
  refetchMedications?: () => void;
}

const EditMedicationModal: React.FC<EditMedicationModalProps> = ({
  isOpen,
  onClose,
  medication,
  refetchMedications,
}) => {
  const [form, setForm] = useState({
    medications: medication?.medications || "",
  });

  const [updateMedication, { isLoading, error, isSuccess }] =
    useUpdateMedicationMutation();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  useEffect(() => {
    setForm({ medications: medication?.medications || "" });
    setAlertMessage("");
    setAlertType("success");
    setPendingAlert(null);
  }, [medication, isOpen]);

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
        message: "Medicamento actualizado correctamente",
      });
      if (typeof refetchMedications === "function") refetchMedications();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al actualizar medicamento",
      });
    }
  }, [isSuccess, error, refetchMedications, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ medications: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication) return;
    await updateMedication({
      id: medication.medications_id,
      name: form.medications,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Medicamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Medicamento"
          value={form.medications}
          onChange={handleChange}
          required
        />
        <Button type="submit" loading={isLoading}>
          Guardar Cambios
        </Button>
      </form>
      {showAlert && <Alert type={alertType} message={alertMessage} />}
    </Modal>
  );
};

export default EditMedicationModal;
