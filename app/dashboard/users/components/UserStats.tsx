interface User {
  id: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    children: number;
    testAttempts: number;
  };
}

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const calculateStats = () => {
    const activeUsers = users.filter((u) => u.isActive).length;
    const totalChildren = users.reduce(
      (sum, user) => sum + (user._count?.children || 0),
      0
    );
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth());
    const newThisMonth = users.filter((user) => {
      const userDate = new Date(user.createdAt);
      return (
        userDate.getMonth() === thisMonth.getMonth() &&
        userDate.getFullYear() === thisMonth.getFullYear()
      );
    }).length;

    return {
      total: users.length,
      active: activeUsers,
      newThisMonth,
      totalChildren,
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Users
        </h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {stats.total}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Active Users
        </h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
          {stats.active}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          New This Month
        </h3>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
          {stats.newThisMonth}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Children
        </h3>
        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
          {stats.totalChildren}
        </p>
      </div>
    </div>
  );
}
