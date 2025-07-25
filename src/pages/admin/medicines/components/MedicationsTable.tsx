import React from "react";
import { FiPackage } from "react-icons/fi";
import Button from "../../../../components/common/Button";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Table, { Column } from "../../../../components/common/Table";
import Alert from "../../../../components/ui/alert/Alert";
import {
  useDeleteMedicationMutation,
  useGetMedicationsQuery,
} from "../../../../services/medicationsSupabase";

interface Medication {
  medications_id: number;
  medications: string;
}

interface MedicationsTableProps {
  onEdit: (medication: Medication) => void;
  onInsert: () => void;
  refetchMedications?: () => void;
}

const MedicationsTable: React.FC<MedicationsTableProps> = ({
  onEdit,
  onInsert,
  refetchMedications,
}) => {
  const { data, isLoading, error, refetch } = useGetMedicationsQuery({});
  const [deleteMedication] = useDeleteMedicationMutation();

  const columns: Column<Medication>[] = [
    {
      key: "medications",
      title: "Nombre del Medicamento",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiPackage className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    },
  ];

  const handleEdit = (row: Medication) => {
    onEdit(row);
    if (typeof refetchMedications === "function") refetchMedications();
    refetch();
  };

  const handleDelete = async (row: Medication) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este medicamento?")
    ) {
      await deleteMedication(row.medications_id);
      if (typeof refetchMedications === "function") refetchMedications();
      refetch();
    }
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <Alert type="error" message="Error al cargar medicamentos" />;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Medicamentos</h2>
        <Button onClick={onInsert}>Agregar Medicamento</Button>
      </div>
      <Table
        columns={columns}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MedicationsTable;
