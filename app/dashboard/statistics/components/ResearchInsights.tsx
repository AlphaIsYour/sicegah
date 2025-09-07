import React from "react";

interface InsightsData {
  keyFindings: string[];
  recommendations: string[];
}

interface ResearchInsightsProps {
  data: InsightsData;
}

export default function ResearchInsights({ data }: ResearchInsightsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Research Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-200">
            Key Findings
          </h3>
          {data.keyFindings.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {data.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {finding}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No findings available yet
            </p>
          )}
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-200">
            Recommendations
          </h3>
          {data.recommendations.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>{" "}
                  {/* Changed to blue for consistency */}
                  {recommendation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recommendations available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
