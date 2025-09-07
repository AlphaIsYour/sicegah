interface StatisticsFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export default function StatisticsFilters({
  selectedPeriod,
  setSelectedPeriod,
  selectedRole,
  setSelectedRole,
}: StatisticsFiltersProps) {
  return (
    <div className="flex space-x-4">
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="ALL">All Roles</option>
        <option value="PARENT">Parents</option>
        <option value="HEALTH_WORKER">Health Workers</option>
        <option value="CAREGIVER">Caregivers</option>
        <option value="CADRE">Cadres</option>
      </select>
    </div>
  );
}
