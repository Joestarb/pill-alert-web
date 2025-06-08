import { useEffect, useState } from "react";
import { FiCalendar, FiMail, FiUser } from "react-icons/fi";
import Table from "../../../../components/common/Table";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  joinDate: string;
}

const ExampleTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig<User>>({
    key: "name",
    direction: "ascending",
  });

  const handleSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const columns: Column<User>[] = [
    {
      key: "name",
      title: "Nombre",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-gray-500" />
          {value}
        </div>
      ),
    },
    {
      key: "email",
      title: "Correo Electrónico",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FiMail className="mr-2 text-gray-500" />
          {value}
        </div>
      ),
    },
    {
      key: "age",
      title: "Edad",
      sortable: true,
    },
    {
      key: "joinDate",
      title: "Fecha de Ingreso",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FiCalendar className="mr-2 text-gray-500" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setData([
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan@example.com",
        age: 28,
        joinDate: "2022-01-15",
      },
      {
        id: 2,
        name: "María García",
        email: "maria@example.com",
        age: 34,
        joinDate: "2021-11-03",
      },
      {
        id: 3,
        name: "Carlos López",
        email: "carlos@example.com",
        age: 22,
        joinDate: "2023-02-20",
      },
    ]);
  }, []);

  const handleEdit = (row: User) => {
    console.log("Editar:", row);
  };

  const handleDelete = (row: User) => {
    console.log("Eliminar:", row);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Usuarios Registrados
      </h2>
      <Table
        columns={columns}
        data={sortedData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortConfig={sortConfig}
        onSort={handleSort}
        className="border border-gray-200"
      />
    </div>
  );
};

export default ExampleTable;
