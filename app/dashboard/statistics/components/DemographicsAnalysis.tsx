/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Users,
  MapPin,
  Baby,
  Clock,
  Download,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react";

interface DemographicData {
  // Role-based analysis
  roleDistribution?: Array<{
    role: string;
    users: number;
    avgScore: number;
    completionRate: number;
    passRate?: number;
    avgTimeSpent?: number; // in minutes
  }>;

  // Geographic analysis
  geographicDistribution?: Array<{
    province: string;
    city?: string;
    users: number;
    avgScore: number;
    completionRate: number;
    passRate?: number;
  }>;

  // Child demographics impact
  childDemographics?: {
    ageGroups: Array<{
      ageRange: string;
      count: number;
      avgParentScore: number;
      completionRate?: number;
    }>;
    genderDistribution?: {
      male: { count: number; avgParentScore: number };
      female: { count: number; avgParentScore: number };
    };
    prematureAnalysis?: {
      premature: { count: number; avgParentScore: number };
      normal: { count: number; avgParentScore: number };
    };
    birthWeightImpact?: Array<{
      weightRange: string;
      count: number;
      avgParentScore: number;
    }>;
  };
}

interface DemographicsAnalysisProps {
  data: DemographicData;
}

export default function DemographicsAnalysis({
  data,
}: DemographicsAnalysisProps) {
  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const exportData = (section: string) => {
    let csvContent: string[][] = [];
    let filename = "";

    switch (section) {
      case "roles":
        if (data.roleDistribution) {
          csvContent = [
            [
              "Role",
              "Users",
              "Avg Score (%)",
              "Completion Rate (%)",
              "Pass Rate (%)",
              "Avg Time Spent (min)",
            ],
            ...data.roleDistribution.map((item) => [
              formatRole(item.role),
              item.users.toString(),
              item.avgScore.toFixed(1),
              item.completionRate.toFixed(1),
              (item.passRate || 0).toFixed(1),
              (item.avgTimeSpent || 0).toFixed(1),
            ]),
          ];
          filename = "role_performance_analysis";
        }
        break;
      case "geographic":
        if (data.geographicDistribution) {
          csvContent = [
            [
              "Province",
              "City",
              "Users",
              "Avg Score (%)",
              "Completion Rate (%)",
              "Pass Rate (%)",
            ],
            ...data.geographicDistribution.map((item) => [
              item.province,
              item.city || "All Cities",
              item.users.toString(),
              item.avgScore.toFixed(1),
              item.completionRate.toFixed(1),
              (item.passRate || 0).toFixed(1),
            ]),
          ];
          filename = "geographic_analysis";
        }
        break;
      case "demographics":
        if (data.childDemographics) {
          csvContent = [
            ["Category", "Subcategory", "Count", "Avg Parent Score (%)"],
            ...data.childDemographics.ageGroups.map((item) => [
              "Age Group",
              item.ageRange,
              item.count.toString(),
              item.avgParentScore.toFixed(1),
            ]),
          ];
          filename = "child_demographics_analysis";
        }
        break;
    }

    if (csvContent.length > 0) {
      const csv = csvContent
        .map((row) =>
          row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 85) return "text-emerald-600 dark:text-emerald-400";
    if (rate >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Role-based Performance Analysis */}
      {data.roleDistribution && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Users size={20} className="mr-2 text-blue-600" />
              Performance by User Role
            </h2>
            <button
              onClick={() => exportData("roles")}
              className="flex items-center px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Role
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Users
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Avg Score
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Completion
                  </th>
                  {data.roleDistribution.some(
                    (role) => role.passRate !== undefined
                  ) && (
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Pass Rate
                    </th>
                  )}
                  {data.roleDistribution.some(
                    (role) => role.avgTimeSpent !== undefined
                  ) && (
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Avg Time
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.roleDistribution
                  .sort((a, b) => b.avgScore - a.avgScore)
                  .map((role, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        {formatRole(role.role)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                          {role.users.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-bold text-lg ${getPerformanceColor(
                            role.avgScore
                          )}`}
                        >
                          {role.avgScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                role.completionRate >= 85
                                  ? "bg-green-500"
                                  : role.completionRate >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${role.completionRate}%` }}
                            ></div>
                          </div>
                          <span
                            className={`font-medium ${getCompletionColor(
                              role.completionRate
                            )}`}
                          >
                            {role.completionRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      {role.passRate !== undefined && (
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`font-medium ${getPerformanceColor(
                              role.passRate
                            )}`}
                          >
                            {role.passRate.toFixed(1)}%
                          </span>
                        </td>
                      )}
                      {role.avgTimeSpent !== undefined && (
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {role.avgTimeSpent.toFixed(1)}m
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Role Performance Insights */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Role-based Insights:
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              {data.roleDistribution.length > 0 && (
                <>
                  <p>
                    • Best performing role:{" "}
                    <strong>
                      {formatRole(
                        data.roleDistribution.sort(
                          (a, b) => b.avgScore - a.avgScore
                        )[0].role
                      )}
                    </strong>{" "}
                    with{" "}
                    {data.roleDistribution
                      .sort((a, b) => b.avgScore - a.avgScore)[0]
                      .avgScore.toFixed(1)}
                    % average score
                  </p>
                  <p>
                    • Total users analyzed:{" "}
                    <strong>
                      {data.roleDistribution
                        .reduce((sum, role) => sum + role.users, 0)
                        .toLocaleString()}
                    </strong>
                  </p>
                  <p>
                    • Average completion rate:{" "}
                    <strong>
                      {(
                        data.roleDistribution.reduce(
                          (sum, role) => sum + role.completionRate,
                          0
                        ) / data.roleDistribution.length
                      ).toFixed(1)}
                      %
                    </strong>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Geographic Distribution */}
      {data.geographicDistribution && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MapPin size={20} className="mr-2 text-green-600" />
                Geographic Distribution
              </h3>
              <button
                onClick={() => exportData("geographic")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Export
              </button>
            </div>

            <div className="space-y-3">
              {data.geographicDistribution
                .sort((a, b) => b.users - a.users)
                .slice(0, 10)
                .map((geo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {geo.province}
                      </div>
                      {geo.city && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {geo.city}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {geo.users.toLocaleString()} users
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {geo.avgScore.toFixed(1)}% avg •{" "}
                        {geo.completionRate.toFixed(1)}% completion
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Child Demographics Impact */}
          {data.childDemographics && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Baby size={20} className="mr-2 text-pink-600" />
                  Child Demographics Impact
                </h3>
                <button
                  onClick={() => exportData("demographics")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Export
                </button>
              </div>

              <div className="space-y-6">
                {/* Age Groups */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Performance by Child Age
                  </h4>
                  <div className="space-y-2">
                    {data.childDemographics.ageGroups.map((age, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-pink-50 dark:bg-pink-900/20 rounded"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {age.ageRange}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-pink-600 dark:text-pink-400">
                            {age.avgParentScore.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {age.count} children
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                {data.childDemographics.genderDistribution && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Gender Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {data.childDemographics.genderDistribution.male.avgParentScore.toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Male (
                          {data.childDemographics.genderDistribution.male.count}
                          )
                        </div>
                      </div>
                      <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-center">
                        <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                          {data.childDemographics.genderDistribution.female.avgParentScore.toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Female (
                          {
                            data.childDemographics.genderDistribution.female
                              .count
                          }
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Birth Condition Impact */}
                {data.childDemographics.prematureAnalysis && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Birth Condition Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Premature Birth
                        </div>
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {data.childDemographics.prematureAnalysis.premature.avgParentScore.toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {
                            data.childDemographics.prematureAnalysis.premature
                              .count
                          }{" "}
                          cases
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Normal Birth
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {data.childDemographics.prematureAnalysis.normal.avgParentScore.toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {
                            data.childDemographics.prematureAnalysis.normal
                              .count
                          }{" "}
                          cases
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!data.roleDistribution &&
        !data.geographicDistribution &&
        !data.childDemographics && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No demographic data available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Demographic analysis will appear here once user data is collected
            </p>
          </div>
        )}
    </div>
  );
}
