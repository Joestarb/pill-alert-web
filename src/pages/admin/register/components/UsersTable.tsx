import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FiCpu, FiMail, FiShield, FiUser, FiUsers } from "react-icons/fi";
import Button from "../../../../components/common/Button";
import Table, { Column } from "../../../../components/common/Table";
import { User } from "../../../../interfaces/api/userInterface";

interface UsersTableProps {
  data: User[];
  showDeviceIp?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  data,
  showDeviceIp = true,
}) => {
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

  // Insertar la columna de IP solo si showDeviceIp es true
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
      key: "actions", // Cambiado de user_name a actions
      title: "Operación",
      sortable: false,
      render: () => (
        <div className="flex">
          <Button
            type="button"
            disabled={false}
            variant="cuarteatry"
            className="flex items-center"
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Lista de Usuarios
      </h2>
      <Table columns={columns} data={data} className="border border-gray-200" />
    </div>
  );
};

export default UsersTable;
