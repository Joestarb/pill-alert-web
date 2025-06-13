import { StatCardProps } from '../../interfaces/StatCardProps';

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="flex items-center justify-between p-5 rounded-2xl shadow-lg theme-dark:bg-white hover:scale-105 transition-transform duration-300 ease-in-out">
    <div>
      <h2 className="text-sm theme-dark:text-gray-500">{title}</h2>
      <p className="text-3xl font-bold theme-dark:text-gray-800">{value}</p>
    </div>
    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default StatCard;
