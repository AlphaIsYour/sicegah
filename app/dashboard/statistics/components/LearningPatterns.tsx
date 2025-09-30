import {
  Brain,
  Clock,
  ChartLineUp,
  Eye,
  TrendUp,
  Download,
  Target,
} from "@phosphor-icons/react";

interface LearningPatternsData {
  // Video to test correlation
  videoToTestCorrelation?: Array<{
    category: string;
    videoCompletionRate: number;
    testPassRate: number;
    correlation?: number;
    videoCount?: number;
    testCount?: number;
  }>;

  // Learning improvement over attempts
  learningCurve?: Array<{
    attemptNumber: number;
    avgScore: number;
    count: number;
    improvementRate?: number;
  }>;

  // Time-based performance patterns
  timeBasedPerformance?: Array<{
    hour: number;
    avgScore: number;
    attempts: number;
    completionRate?: number;
  }>;

  // Drop-off analysis
  dropoffAnalysis?: Array<{
    stage: string;
    dropoffRate: number;
    count: number;
    recoveryRate?: number;
  }>;

  // Retention patterns
  retentionPatterns?: {
    dailyRetention: Array<{
      day: number;
      retentionRate: number;
      activeUsers: number;
    }>;
    weeklyPattern: Array<{
      dayOfWeek: string;
      avgScore: number;
      activeUsers: number;
    }>;
  };
}

interface LearningPatternsProps {
  data: LearningPatternsData;
}

export default function LearningPatterns({ data }: LearningPatternsProps) {
  const exportData = (section: string) => {
    let csvContent: string[][] = [];
    let filename = "";

    switch (section) {
      case "correlation":
        if (data.videoToTestCorrelation) {
          csvContent = [
            [
              "Category",
              "Video Completion Rate (%)",
              "Test Pass Rate (%)",
              "Correlation",
              "Video Count",
              "Test Count",
            ],
            ...data.videoToTestCorrelation.map((item) => [
              item.category,
              item.videoCompletionRate.toFixed(1),
              item.testPassRate.toFixed(1),
              (item.correlation || 0).toFixed(3),
              (item.videoCount || 0).toString(),
              (item.testCount || 0).toString(),
            ]),
          ];
          filename = "video_test_correlation_analysis";
        }
        break;
      case "learning-curve":
        if (data.learningCurve) {
          csvContent = [
            [
              "Attempt Number",
              "Average Score (%)",
              "User Count",
              "Improvement Rate (%)",
            ],
            ...data.learningCurve.map((item) => [
              item.attemptNumber.toString(),
              item.avgScore.toFixed(1),
              item.count.toString(),
              (item.improvementRate || 0).toFixed(1),
            ]),
          ];
          filename = "learning_curve_analysis";
        }
        break;
      case "time-patterns":
        if (data.timeBasedPerformance) {
          csvContent = [
            ["Hour", "Average Score (%)", "Attempts", "Completion Rate (%)"],
            ...data.timeBasedPerformance.map((item) => [
              item.hour.toString(),
              item.avgScore.toFixed(1),
              item.attempts.toString(),
              (item.completionRate || 0).toFixed(1),
            ]),
          ];
          filename = "time_based_performance_analysis";
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

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return { strength: "Strong", color: "text-green-600" };
    if (abs >= 0.5) return { strength: "Moderate", color: "text-yellow-600" };
    if (abs >= 0.3) return { strength: "Weak", color: "text-orange-600" };
    return { strength: "Very Weak", color: "text-red-600" };
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="space-y-6">
      {/* Video-Test Correlation Analysis */}
      {data.videoToTestCorrelation && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Brain size={20} className="mr-2 text-purple-600" />
              Video-Test Performance Correlation
            </h2>
            <button
              onClick={() => exportData("correlation")}
              className="flex items-center px-3 py-1 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.videoToTestCorrelation.map((item, index) => {
              const correlationInfo = item.correlation
                ? getCorrelationStrength(item.correlation)
                : null;
              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-700"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {item.category}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Video Completion:
                      </span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {item.videoCompletionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Test Pass Rate:
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {item.testPassRate.toFixed(1)}%
                      </span>
                    </div>
                    {correlationInfo && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Correlation:
                        </span>
                        <div className="text-right">
                          <span
                            className={`font-bold ${correlationInfo.color}`}
                          >
                            {item.correlation!.toFixed(2)}
                          </span>
                          <div className={`text-xs ${correlationInfo.color}`}>
                            {correlationInfo.strength}
                          </div>
                        </div>
                      </div>
                    )}
                    {(item.videoCount || item.testCount) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                        {item.videoCount && `${item.videoCount} videos`}
                        {item.videoCount && item.testCount && " • "}
                        {item.testCount && `${item.testCount} tests`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correlation Insights */}
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">
              Correlation Insights:
            </h4>
            <div className="text-sm text-purple-800 dark:text-purple-300">
              {data.videoToTestCorrelation.length > 0 && (
                <>
                  <p>
                    • Strongest correlation:{" "}
                    <strong>
                      {data.videoToTestCorrelation
                        .filter((item) => item.correlation)
                        .sort(
                          (a, b) =>
                            Math.abs(b.correlation!) - Math.abs(a.correlation!)
                        )[0]?.category || "N/A"}
                    </strong>{" "}
                    (
                    {data.videoToTestCorrelation
                      .filter((item) => item.correlation)
                      .sort(
                        (a, b) =>
                          Math.abs(b.correlation!) - Math.abs(a.correlation!)
                      )[0]
                      ?.correlation?.toFixed(2) || "N/A"}
                    )
                  </p>
                  <p>
                    • Average video completion:{" "}
                    <strong>
                      {(
                        data.videoToTestCorrelation.reduce(
                          (sum, item) => sum + item.videoCompletionRate,
                          0
                        ) / data.videoToTestCorrelation.length
                      ).toFixed(1)}
                      %
                    </strong>
                  </p>
                  <p>
                    • Average test pass rate:{" "}
                    <strong>
                      {(
                        data.videoToTestCorrelation.reduce(
                          (sum, item) => sum + item.testPassRate,
                          0
                        ) / data.videoToTestCorrelation.length
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

      {/* Learning Curve & Time-based Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Improvement Curve */}
        {data.learningCurve && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <ChartLineUp size={20} className="mr-2 text-green-600" />
                Learning Improvement Curve
              </h3>
              <button
                onClick={() => exportData("learning-curve")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Export
              </button>
            </div>

            <div className="space-y-4">
              {data.learningCurve.map((curve, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Attempt {curve.attemptNumber}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-bold ${getPerformanceColor(
                          curve.avgScore
                        )}`}
                      >
                        {curve.avgScore.toFixed(1)}%
                      </span>
                      {curve.improvementRate !== undefined &&
                        curve.improvementRate > 0 && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <TrendUp size={14} className="mr-1" />
                            <span className="text-sm font-medium">
                              +{curve.improvementRate.toFixed(1)}%
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${curve.avgScore}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {curve.count}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {curve.count.toLocaleString()} users completed this attempt
                    {index > 0 && data.learningCurve && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        (+
                        {(
                          curve.avgScore -
                          data.learningCurve[index - 1].avgScore
                        ).toFixed(1)}
                        % from previous)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Curve Summary */}
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-800 dark:text-green-300">
                <strong>Learning Progress:</strong> Users show{" "}
                {data.learningCurve.length > 1 &&
                  `${(
                    data.learningCurve[data.learningCurve.length - 1].avgScore -
                    data.learningCurve[0].avgScore
                  ).toFixed(1)}% improvement`}{" "}
                from first to final attempt.
              </div>
            </div>
          </div>
        )}

        {/* Time-based Performance */}
        {data.timeBasedPerformance && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                Performance by Time of Day
              </h3>
              <button
                onClick={() => exportData("time-patterns")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Export
              </button>
            </div>

            <div className="space-y-3">
              {data.timeBasedPerformance
                .sort((a, b) => b.avgScore - a.avgScore)
                .map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-16 text-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatHour(time.hour)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 flex-1 justify-end">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {time.attempts.toLocaleString()} attempts
                      </span>

                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              time.avgScore >= 80
                                ? "bg-green-500"
                                : time.avgScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${time.avgScore}%` }}
                          ></div>
                        </div>
                        <span
                          className={`font-medium ${getPerformanceColor(
                            time.avgScore
                          )}`}
                        >
                          {time.avgScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Peak Performance Time */}
            {data.timeBasedPerformance.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Peak Performance:</strong>{" "}
                  {formatHour(
                    data.timeBasedPerformance.sort(
                      (a, b) => b.avgScore - a.avgScore
                    )[0].hour
                  )}{" "}
                  with{" "}
                  {data.timeBasedPerformance
                    .sort((a, b) => b.avgScore - a.avgScore)[0]
                    .avgScore.toFixed(1)}
                  % average score
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drop-off Analysis & Retention Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drop-off Analysis */}
        {data.dropoffAnalysis && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target size={20} className="mr-2 text-orange-600" />
              User Drop-off Analysis
            </h3>

            <div className="space-y-3">
              {data.dropoffAnalysis
                .sort((a, b) => b.dropoffRate - a.dropoffRate)
                .map((stage, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stage.stage}
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          stage.dropoffRate > 20
                            ? "text-red-600"
                            : stage.dropoffRate > 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {stage.dropoffRate.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          stage.dropoffRate > 20
                            ? "bg-red-500"
                            : stage.dropoffRate > 10
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(stage.dropoffRate, 100)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{stage.count.toLocaleString()} users affected</span>
                      {stage.recoveryRate && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {stage.recoveryRate.toFixed(1)}% recovery rate
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Drop-off Insights */}
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-sm text-orange-800 dark:text-orange-300">
                <strong>Critical Drop-off Point:</strong>{" "}
                {data.dropoffAnalysis.length > 0 &&
                  `${
                    data.dropoffAnalysis.sort(
                      (a, b) => b.dropoffRate - a.dropoffRate
                    )[0].stage
                  } (${data.dropoffAnalysis
                    .sort((a, b) => b.dropoffRate - a.dropoffRate)[0]
                    .dropoffRate.toFixed(1)}%)`}
              </div>
            </div>
          </div>
        )}

        {/* Retention Patterns */}
        {data.retentionPatterns && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye size={20} className="mr-2 text-teal-600" />
              User Retention Patterns
            </h3>

            {/* Daily Retention */}
            {data.retentionPatterns.dailyRetention && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Daily Retention Rate
                </h4>
                <div className="space-y-2">
                  {data.retentionPatterns.dailyRetention
                    .slice(0, 7)
                    .map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Day {day.day}
                        </span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                            <div
                              className="bg-teal-500 h-2 rounded-full"
                              style={{ width: `${day.retentionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-teal-600 dark:text-teal-400 w-12">
                            {day.retentionRate.toFixed(0)}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({day.activeUsers})
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Weekly Pattern */}
            {data.retentionPatterns.weeklyPattern && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Weekly Activity Pattern
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {data.retentionPatterns.weeklyPattern.map((day, index) => (
                    <div
                      key={index}
                      className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-center"
                    >
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {day.dayOfWeek}
                      </div>
                      <div className="font-medium text-teal-600 dark:text-teal-400">
                        {day.avgScore.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {day.activeUsers} users
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* No Data State */}
      {!data.videoToTestCorrelation &&
        !data.learningCurve &&
        !data.timeBasedPerformance &&
        !data.dropoffAnalysis &&
        !data.retentionPatterns && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Brain size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No learning pattern data available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Learning analytics will appear here once user interaction data is
              collected
            </p>
          </div>
        )}
    </div>
  );
}
