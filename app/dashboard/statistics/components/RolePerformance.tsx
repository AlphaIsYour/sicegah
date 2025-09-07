interface RolePerformanceData {
  role: string;
  users: number;
  avgScore: number;
  completionRate: number;
}

interface RolePerformanceProps {
  data: RolePerformanceData[];
}

export default function RolePerformance({ data }: RolePerformanceProps) {
  const formatRole = (role: string) => {
    return role
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance by User Role
      </h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {formatRole(item.role)}
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.users} users
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Avg Score:
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {item.avgScore.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Completion:
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {item.completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No role performance data available
          </p>
        </div>
      )}
    </div>
  );
}
