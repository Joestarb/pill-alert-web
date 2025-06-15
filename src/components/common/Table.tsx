import { ReactNode } from "react";
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from "react-icons/fi";

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: "ascending" | "descending";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  sortConfig?: SortConfig<T>;
  onSort?: (key: keyof T) => void;
  className?: string;
}
const Table = <T,>({
  columns,
  data,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  className = "",
}: TableProps<T>) => {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className={`overflow-x-auto rounded-lg shadow ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    : ""
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && sortConfig?.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={column.key.toString()}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {column.render
                      ? column.render(row[column.key], row)
                      : (row[column.key] as ReactNode)}
                  </div>
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
