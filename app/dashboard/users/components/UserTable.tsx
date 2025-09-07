import { Eye, PencilSimple as Edit, Trash } from "@phosphor-icons/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  province?: string | null;
  city?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    children: number;
    testAttempts: number;
  };
}

interface UserTableProps {
  users: User[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({
  users,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  const roleColors = {
    PARENT: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
    HEALTH_WORKER:
      "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
    CAREGIVER:
      "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300",
    CADRE:
      "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300",
    ADMIN: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                User
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Role
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Location
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                Children
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                Tests
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                Join Date
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      {user.phone || "-"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role as keyof typeof roleColors]
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>{user.city || "-"}</div>
                  <div className="text-gray-500 dark:text-gray-500">
                    {user.province || "-"}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {user._count?.children || 0}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user._count?.testAttempts || 0}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.isActive
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(user.createdAt)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                      title="Edit User"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      title="Delete User"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
