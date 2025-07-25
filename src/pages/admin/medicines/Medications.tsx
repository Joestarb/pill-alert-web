import React, { useState } from "react";
import { useGetMedicationsQuery } from "../../../services/medicationsSupabase";
import EditMedicationModal from "./components/EditMedicationModal";
import InsertMedicationModal from "./components/InsertMedicationModal";
import MedicationsTable from "./components/MedicationsTable";

const Medications: React.FC = () => {
  const [isInsertModalOpen, setInsertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<{
    medications_id: number;
    medications: string;
  } | null>(null);

  const { refetch } = useGetMedicationsQuery({});

  const handleInsert = () => setInsertModalOpen(true);
  const handleEdit = (medication: {
    medications_id: number;
    medications: string;
  }) => {
    setSelectedMedication(medication);
    setEditModalOpen(true);
  };

  return (
    <>
      <MedicationsTable
        onEdit={handleEdit}
        onInsert={handleInsert}
        refetchMedications={refetch}
      />
      <InsertMedicationModal
        isOpen={isInsertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        refetchMedications={refetch}
      />
      <EditMedicationModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        medication={selectedMedication}
        refetchMedications={refetch}
      />
    </>
  );
};

export default Medications;
