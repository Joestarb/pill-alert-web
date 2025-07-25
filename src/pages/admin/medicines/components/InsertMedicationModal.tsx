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
  const [touched, setTouched] = useState(false);

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
    if (isOpen) {
      setForm({ medications: "" });
      setTouched(false);
      setAlertMessage("");
      setAlertType("success");
      setPendingAlert(null);
    }
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
        message: "Medicamento agregado correctamente",
      });
      if (typeof refetchMedications === "function") refetchMedications();
      refetch();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al agregar el medicamento. Por favor, inténtelo nuevamente.",
      });
    }
  }, [isSuccess, error, refetchMedications, refetch, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!touched) setTouched(true);
    setForm({ medications: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medications.trim()) {
      setAlertType("error");
      setAlertMessage("Por favor ingrese un nombre de medicamento");
      setShowAlert(true);
      return;
    }
    await insertMedication({ name: form.medications });
  };

  const isFormValid = form.medications.trim() !== "";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Agregar Nuevo Medicamento"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <Input
              label="Nombre del Medicamento"
              placeholder="Ej: Paracetamol 500mg"
              value={form.medications}
              onChange={handleChange}
              required
              autoFocus
              error={touched && !isFormValid ? "Este campo es requerido" : undefined}
            />
            <p className="mt-2 text-sm text-gray-500">
              Ingrese el nombre completo del medicamento, incluyendo la dosis si es aplicable.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isFormValid || isLoading}
              variant="primary"
            >
              {isLoading ? "Agregando..." : "Agregar Medicamento"}
            </Button>
          </div>
        </form>
      </Modal>

      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          autoClose={5000}
        />
      )}
    </>
  );
};

export default InsertMedicationModal;