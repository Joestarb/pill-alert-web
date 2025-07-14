import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Table, { Column } from "../../../../components/common/Table";
import Alert from "../../../../components/ui/alert/Alert";
import {
  useDeleteUserMutation,
  useGetItemsQuery,
} from "../../../../services/adminsSupabase";
import EditAdminModal from "./EditAdminModal";

export interface Admin {
  user_id: number;
  user_name: string;
  user_email: string;
  device_ip?: string;
  fk_group_id?: number;
  user_groups?: { group_id: number; group_name: string }[];
}

interface AdminsTableProps {
  onEdit: (admin: Admin) => void;
  refetchAdmins?: () => void;
}

const AdminsTable: React.FC<AdminsTableProps> = ({ onEdit, refetchAdmins }) => {
  const { data, isLoading, error, refetch } = useGetItemsQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const columns: Column<Admin>[] = [
    {
      key: "user_name",
      title: "Nombre del Admin",
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
  ];

  const handleEdit = (row: Admin) => {
    setSelectedAdmin(row);
    setEditModalOpen(true);
  };

  const handleDelete = async (row: Admin) => {
    if (window.confirm("¿Seguro que deseas eliminar este admin?")) {
      await deleteUser(row.user_id);
      if (typeof refetchAdmins === "function") refetchAdmins();
      refetch();
    }
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <Alert
        variant="error"
        title="Error"
        message="Error al cargar los administradores"
      />
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Lista de Administradores
        </h2>
      </div>
      <Table
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="border border-gray-200"
      />
      {selectedAdmin && (
        <EditAdminModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAdmin(null);
            if (typeof refetchAdmins === "function") refetchAdmins();
            refetch();
          }}
          admin={selectedAdmin}
          refetchAdmins={refetchAdmins}
        />
      )}
    </div>
  );
};

export default AdminsTable;
