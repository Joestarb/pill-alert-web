import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import {
  useGetMedicationsQuery,
  useInsertMedicationMutation,
} from "../../../../services/medicationsSupabase";

interface InsertMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchMedications?: () => void;
}

const InsertMedicationModal: React.FC<InsertMedicationModalProps> = ({
  isOpen,
  onClose,
  refetchMedications,
}) => {
  const [form, setForm] = useState({ medications: "" });

  const { refetch } = useGetMedicationsQuery({});
  const [insertMedication, { isLoading, error, isSuccess }] =
    useInsertMedicationMutation();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  useEffect(() => {
    setForm({ medications: "" });
    setAlertMessage("");
    setAlertType("success");
    setPendingAlert(null);
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
        message: "Medicamento insertado correctamente",
      });
      if (typeof refetchMedications === "function") refetchMedications();
      refetch();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al insertar medicamento",
      });
    }
  }, [isSuccess, error, refetchMedications, refetch, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ medications: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await insertMedication({ name: form.medications });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Medicamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Medicamento"
          value={form.medications}
          onChange={handleChange}
          required
        />
        <Button type="submit" loading={isLoading}>
          Agregar
        </Button>
      </form>
      {showAlert && <Alert type={alertType} message={alertMessage} />}
    </Modal>
  );
};

export default InsertMedicationModal;
