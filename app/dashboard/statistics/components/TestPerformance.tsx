import React from "react";

interface TestPerformanceData {
  category: string;
  avgScore: number;
  attempts: number;
  passRate: number;
}

interface TestPerformanceProps {
  data: TestPerformanceData[];
}

export default function TestPerformance({ data }: TestPerformanceProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Test Performance by Category
      </h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-600 dark:border-blue-500 pl-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.category}
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.attempts} attempts
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Avg Score:{" "}
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {item.avgScore.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Pass Rate:{" "}
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {item.passRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No test performance data available
          </p>
        </div>
      )}
    </div>
  );
}
