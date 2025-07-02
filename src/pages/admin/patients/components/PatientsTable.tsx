import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import Button from "../../../../components/common/Button";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Table, { Column } from "../../../../components/common/Table";
import Alert from "../../../../components/ui/alert/Alert";
import AssignMedicationModal from "./AssignMedicationModal"; // NUEVO

import {
  useDeleteUserMutation,
  useGetItemsQuery,
} from "../../../../services/patientsSupabase";

interface Patient {
  user_id: number;
  user_name: string;
  user_email: string;
  user_groups: string;
  device_ip?: string;
}

interface PatientsTableProps {
  onEdit: (patient: Patient) => void;
  onInsert: () => void;
  refetchPatients?: () => void;
}

const PatientsTable: React.FC<PatientsTableProps> = ({
  onEdit,
  onInsert,
  refetchPatients,
}) => {
  const { data, isLoading, error, refetch } = useGetItemsQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // NUEVO

  const columns: Column<Patient>[] = [
    {
      key: "user_name",
      title: "Nombre del Paciente",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    },
    {
      key: "user_email",
      title: "Correo Electrónico",
      sortable: true,
    },
    {
      key: "device_ip",
      title: "IP del Dispositivo",
      sortable: false,
    },
    {
      key: "user_groups",
      title: "Grupo",
      sortable: false,
      render: (value: unknown) => {
        if (Array.isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return value.map((g: any) => g.group_name).join(", ");
        } else if (value && typeof value === "object" && "group_name" in value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (value as any).group_name;
        }
        return "-";
      },
    },
    {
      key: "asignar_medicamento", // NUEVO
      title: "Medicamentos",
      sortable: false,
      render: (_, row) => (
        <Button 
              variant="primary"
          onClick={() => handleAssignMedication(row)}
        >
          Asignar
        </Button>
      ),
    },
  ];

  const handleEdit = (row: Patient) => {
    onEdit(row);
    if (typeof refetchPatients === "function") refetchPatients();
    refetch();
  };

  const handleDelete = async (row: Patient) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      await deleteUser(row.user_id);
      if (typeof refetchPatients === "function") refetchPatients();
      refetch();
    }
  };

  const handleAssignMedication = (row: Patient) => {
    setSelectedPatient(row);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <Alert
        variant="error"
        title="Error"
        message="Error al cargar los pacientes"
      />
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Lista de Pacientes
        </h2>
        <Button
          type="button"
          variant="primary"
          onClick={onInsert}
          disabled={false}
        >
          Agregar Paciente
        </Button>
      </div>
      <Table
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="border border-gray-200"
      />
      {selectedPatient && (
        <AssignMedicationModal
          visible={!!selectedPatient}
          patientId={selectedPatient.user_id}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default PatientsTable;
