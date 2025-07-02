import { useState } from "react";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import Button from "../../../../components/common/Button";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import {
  useGetMedicationsQuery, 
  useDeleteMedicationMutation, 
  useInsertMedicationMutation, 
  useUpdateMedicationMutation
} from "../../../../services/medicationsSupabase";
import { assignMedicationToUser } from "../../../../services/patientsSupabase";
import { message } from "antd";






interface AssignMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  patientId: number;
}

const AssignMedicationModal: React.FC<AssignMedicationModalProps> = ({
  visible,
  onClose,
  patientId,
}) => {

  const [selectedMedication, setSelectedMedication] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [newMedication, setNewMedication] = useState("");
  const [editingMedication, setEditingMedication] = useState<any | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

 const { data: medications = [], isLoading } = useGetMedicationsQuery(undefined, { skip: !visible });



  const resetForm = () => {
    setSelectedMedication(null);
    setNewMedication("");
    setEditingMedication(null);
    setAlert(null);
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAssign = async () => {
    if (!selectedMedication) return;
    setLoading(true);
    try {
      await assignMedicationToUser(patientId, selectedMedication);
      showAlert("success", "Medicamento asignado exitosamente");
      onClose();
    } catch (e: any) {
      showAlert("error", e.message || "Error al asignar medicamento");
    } finally {
      setLoading(false);
    }
  };

const [insertMedication] = useInsertMedicationMutation();

const handleAddMedication = async () => {
  if (!newMedication.trim()) return;
  try {
    await insertMedication({ name: newMedication }).unwrap();
    message.success("Medicamento agregado");
    setNewMedication("");
  } catch (error) {
    message.error("Error al agregar medicamento");
  }
};


const [updateMedication] = useUpdateMedicationMutation();

const handleUpdateMedication = async () => {
  if (!editingMedication || !newMedication.trim()) return;
  try {
    await updateMedication({ id: editingMedication.medications_id, name: newMedication }).unwrap();
    message.success("Medicamento actualizado");
    setEditingMedication(null);
    setNewMedication("");
  } catch (error) {
    message.error("Error al actualizar medicamento");
  }
};


  const handleEditClick = (med: any) => {
    setEditingMedication(med);
    setNewMedication(med.medications);
  };

const [deleteMedication] = useDeleteMedicationMutation();

const handleDeleteMedication = async (id: number) => {
  try {
    await deleteMedication(id).unwrap();
    message.success("Medicamento eliminado");
  } catch (error) {
    message.error("Error al eliminar medicamento");
  }
};

  return (
    <>
      <Modal isOpen={visible} onClose={onClose}>
        <div className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">Asignar Medicamento</h2>

          <Select
            name="selectedMedication"
            label="Selecciona un medicamento"
            value={selectedMedication?.toString() || ""}
            onChange={(e) => setSelectedMedication(Number(e.target.value))}
            required={true}
            options={medications.map((med) => ({
              value: med.medications_id,
              label: med.medications,
            }))}
          />

          <Input
            name="newMedication"
            label={editingMedication ? "Editar Medicamento" : "Nuevo Medicamento"}
            placeholder="Nombre del medicamento"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            required
            type="text"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={editingMedication ? handleUpdateMedication : handleAddMedication}
                disabled={false}
            >
              {editingMedication ? "Actualizar" : "Agregar"}
            </Button>
            {editingMedication && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => resetForm()}
                  disabled={false}
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
            {medications.map((item) => (
              <div
                key={item.medications_id}
                className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100 transition"
              >
                <span>{item.medications}</span>
                <div className="flex gap-2 text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditClick(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteMedication(item.medications_id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={false}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedMedication || loading}
            >
              {loading ? "Asignando..." : "Asignar"}
            </Button>
          </div>
        </div>
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

export default AssignMedicationModal;
