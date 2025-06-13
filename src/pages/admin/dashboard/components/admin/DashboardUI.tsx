import {
  FaCapsules,
  FaClipboardList,
  FaClock,
  FaListAlt,
  FaPills,
  FaUser,
  FaUserLock,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import StatCard from "../../../../../components/ui/StatCard";

const stats = [
  {
    title: "Medicación consumida",
    value: 150,
    icon: <FaCapsules className="text-white text-xl" />,
    color: "bg-purple-500",
  },
  {
    title: "Registros de medicación",
    value: 120,
    icon: <FaClipboardList className="text-white text-xl" />,
    color: "bg-emerald-500",
  },
  {
    title: "Medicamentos disponibles",
    value: 80,
    icon: <FaPills className="text-white text-xl" />,
    color: "bg-green-500",
  },
  {
    title: "Tipos de permisos",
    value: 5,
    icon: <FaListAlt className="text-white text-xl" />,
    color: "bg-indigo-500",
  },
  {
    title: "Roles",
    value: 3,
    icon: <FaUserShield className="text-white text-xl" />,
    color: "bg-blue-600",
  },
  {
    title: "Horarios registrados",
    value: 25,
    icon: <FaClock className="text-white text-xl" />,
    color: "bg-yellow-500",
  },
  {
    title: "Grupos de usuarios",
    value: 7,
    icon: <FaUsers className="text-white text-xl" />,
    color: "bg-pink-500",
  },
  {
    title: "Permisos asignados",
    value: 45,
    icon: <FaUserLock className="text-white text-xl" />,
    color: "bg-red-500",
  },
  {
    title: "Total de usuarios",
    value: 100,
    icon: <FaUser className="text-white text-xl" />,
    color: "bg-cyan-600",
  },
];

const DashboardUI = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard del Administrador</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardUI;
