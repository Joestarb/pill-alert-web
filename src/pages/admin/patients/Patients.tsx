import React, { useState } from "react";
import EditPatientModal from "./components/EditPatientModal";
import InsertPatientModal from "./components/InsertPatientModal";
import PatientsTable from "./components/PatientsTable";

const Patients: React.FC = () => {
  const [isInsertModalOpen, setInsertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    user_id: number;
    user_name: string;
    user_email: string;
    device_ip?: string;
  } | null>(null);

  const [refetch, setRefetch] = useState<() => void>(() => () => {});

  const handleInsert = () => setInsertModalOpen(true);
  const handleEdit = (patient: {
    user_id: number;
    user_name: string;
    user_email: string;
    device_ip?: string;
  }) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  return (
    <>
      <PatientsTable
        onEdit={handleEdit}
        onInsert={handleInsert}
        refetchPatients={refetch}
      />
      <InsertPatientModal
        isOpen={isInsertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        refetchPatients={refetch}
      />
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        patient={selectedPatient}
        refetchPatients={refetch}
      />
    </>
  );
};

export default Patients;
