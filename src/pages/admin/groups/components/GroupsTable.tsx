import React from "react";
import { FiUsers } from "react-icons/fi";
import Button from "../../../../components/common/Button";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Table, { Column } from "../../../../components/common/Table";
import Alert from "../../../../components/ui/alert/Alert";
import {
  useDeleteGroupMutation,
  useGetGroupsQuery,
} from "../../../../services/GroupSupabase";

interface Group {
  group_id: number;
  group_name: string;
}

interface GroupsTableProps {
  onEdit: (group: Group) => void;
  onInsert: () => void;
  refetchGroups?: () => void;
}

const GroupsTable: React.FC<GroupsTableProps> = ({
  onEdit,
  onInsert,
  refetchGroups,
}) => {
  const { data, isLoading, error, refetch } = useGetGroupsQuery({});
  const [deleteGroup] = useDeleteGroupMutation();

  const columns: Column<Group>[] = [
    {
      key: "group_name",
      title: "Nombre del Grupo",
      sortable: true, 
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiUsers className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    },
  ];

  const handleEdit = (row: Group) => {
    onEdit(row);
          if (typeof refetchGroups === "function") refetchGroups();
      refetch();
  };

  const handleDelete = async (row: Group) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      await deleteGroup(row.group_id);
      if (typeof refetchGroups === "function") refetchGroups();
      refetch();
    }
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <Alert
        variant="error"
        title="Error"
        message="Error al cargar los grupos"
      />
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Lista de Grupos
        </h2>
        <Button
          type="button"
          variant="primary"
          onClick={onInsert}
          disabled={false}
        >
          Agregar Grupo
        </Button>
      </div>
      <Table
        columns={columns}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="border border-gray-200"
      />
    </div>
  );
};

export default GroupsTable;
