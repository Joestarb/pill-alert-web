/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FiCpu, FiMail, FiShield, FiUser, FiUsers } from "react-icons/fi";
import Button from "../../../../components/common/Button";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Table, { Column } from "../../../../components/common/Table";
import { Modal } from "../../../../components/ui/modal";
import { User } from "../../../../interfaces/api/userInterface";
import { useLazyGetUserGroupsQuery } from "../../../../services/usersSupabase";
import UserGroupsTable from "./UserGroupsTable";
import EditUserModal from "./EditUserModal";

interface UserGroup {
  user_id: number;
  user_name: string;
  user_email: string;
  device_ip: string;
  roles: {
    role_name: string;
  };
  user_groups: {
    group_name: string;
  };
  actions: React.ReactNode;
}

interface UsersTableProps {
  data: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeviceIp, setShowDeviceIp] = useState<UserGroup | boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [triggerGetUserGroups, { data: userGroupsData, error, isLoading }] =
    useLazyGetUserGroupsQuery();
  if (!selectedUser) console.log("error en el fetch de datos");
  const handleInfoClick = (user_id: number) => {
    setIsModalOpen(true);
    setShowDeviceIp(true);
    setSelectedUser(data.find((u) => u.user_id === user_id) ?? null);
    triggerGetUserGroups(user_id);
  };

  const columns: Column<User>[] = [
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
  ];

  if (showDeviceIp) {
    columns.splice(2, 0, {
      key: "device_ip",
      title: "IP del Dispositivo",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center">
          <FiCpu className="mr-2 text-gray-500" />
          {value as string}
        </div>
      ),
    });
  }

  columns.push(
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
    {
      key: "patients",
      title: "Pacientes",
      sortable: false,
      render: (_: unknown, row: User) => (
        <Button
          onClick={() => handleInfoClick(row.user_id)}
          type={"button"}
          disabled={false}
          variant={"secondary"}
        >
          Info
        </Button>
      ),
    },
    {
      key: "actions",
      title: "Operación",
      sortable: false,
      render: (_: unknown, row: User) => (
        <div className="flex">
          <Button
            type="button"
            disabled={false}
            variant="cuarteatry"
            className="flex items-center"
            onClick={() => {
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
          >
            <FaPencil className="mr-2 text-emerald-500" />
          </Button>
          <Button
            type="button"
            disabled={false}
            variant="cuarteatry"
            className="flex items-center"
          >
            <FaTrash className="mr-2 text-red-500" />
          </Button>
        </div>
      ),
    }
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowDeviceIp(false);
        }}
      >
        <div className="p-6">
          <p>Contenido del modal...</p>
          {isLoading && <SkeletonLoader />}
          {error && <p>Error al cargar datos</p>}
          {userGroupsData && (
            <UserGroupsTable
              data={userGroupsData.map((user: any) => ({
                ...user,
                actions: null,
                patients: null,
              }))}
            />
           )}
        </div>
      </Modal>
      {/* Modal de edición de usuario */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Lista de Usuarios
      </h2>
      <Table columns={columns} data={data} className="border border-gray-200" />
    </div>
  );
};

export default UsersTable;
