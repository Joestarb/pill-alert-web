import React from "react";
import { FiCpu, FiMail, FiShield, FiUser, FiUsers } from "react-icons/fi";
import Table, { Column } from "../../../../components/common/Table";
import { User } from "../../../../interfaces/api/userInterface";

interface UserGroupsTableProps {
  data: User[];
  columns?: Column<User>[];
  isLoading?: boolean;
  error?: boolean;
}

const UserGroupsTable: React.FC<UserGroupsTableProps> = ({
  data,
  columns,
  isLoading,
  error,
}) => {
  // Si no se pasan columnas, usar las por defecto para userGroups
  const defaultColumns: Column<User>[] = [
    {
      key: "user_name",
      title: "Nombre",
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
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiMail className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    },
    {
      key: "device_ip",
      title: "IP del Dispositivo",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiCpu className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    },
    {
      key: "roles",
      title: "Rol",
      sortable: false,
      render: (_: unknown, row: User) => (
        <div className="flex items-center">
          <FiShield className="mr-2 text-gray-500" />
          {row.roles.role_name}
        </div>
      ),
    },
    {
      key: "user_groups",
      title: "Grupo",
      sortable: false,
      render: (_: unknown, row: User) => (
        <div className="flex items-center">
          <FiUsers className="mr-2 text-gray-500" />
          {row.user_groups.group_name}
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar datos</div>;

  return (
    <Table
      columns={columns || defaultColumns}
      data={data}
      className="border border-gray-200"
    />
  );
};

export default UserGroupsTable;
