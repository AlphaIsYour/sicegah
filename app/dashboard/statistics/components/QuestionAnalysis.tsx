import {
  Download,
  Clock,
  TrendUp,
  TrendDown,
  Eye,
  WaveTriangle,
} from "@phosphor-icons/react";

interface QuestionAnalysisData {
  id: string;
  questionText: string;
  correctAnswers: number;
  incorrectAnswers: number;
  difficulty: string;
  testTitle: string;
  // Enhanced fields (optional for backward compatibility)
  category?: string;
  avgResponseTime?: number; // in seconds
  commonWrongAnswers?: Array<{
    answer: string;
    count: number;
  }>;
  totalAttempts?: number;
  successTrend?: number; // percentage change in success rate
}

interface QuestionAnalysisProps {
  data: QuestionAnalysisData[];
}

export default function QuestionAnalysis({ data }: QuestionAnalysisProps) {
  // Calculate difficulty distribution
  const getDifficultyDistribution = () => {
    const distribution = {
      "Very Hard": 0, // <30%
      Hard: 0, // 30-50%
      Medium: 0, // 50-80%
      Easy: 0, // >80%
    };

    data.forEach((item) => {
      const total = item.correctAnswers + item.incorrectAnswers;
      const successRate = total > 0 ? (item.correctAnswers / total) * 100 : 0;

      if (successRate >= 80) distribution.Easy++;
      else if (successRate >= 50) distribution.Medium++;
      else if (successRate >= 30) distribution.Hard++;
      else distribution["Very Hard"]++;
    });

    return distribution;
  };

  const difficultyDistribution = getDifficultyDistribution();

  const exportData = () => {
    const csvContent = [
      [
        "Question ID",
        "Question Text",
        "Test Title",
        "Category",
        "Correct Answers",
        "Incorrect Answers",
        "Success Rate (%)",
        "Difficulty Level",
        "Avg Response Time (s)",
        "Total Attempts",
        "Success Trend (%)",
        "Most Common Wrong Answer",
        "Wrong Answer Count",
      ],
      ...data.map((item) => {
        const total = item.correctAnswers + item.incorrectAnswers;
        const successRate =
          total > 0 ? Math.round((item.correctAnswers / total) * 100) : 0;
        const mostCommonWrong = item.commonWrongAnswers?.[0];

        return [
          item.id,
          item.questionText.replace(/"/g, '""'),
          item.testTitle.replace(/"/g, '""'),
          item.category || "N/A",
          item.correctAnswers.toString(),
          item.incorrectAnswers.toString(),
          successRate.toString(),
          getDifficultyLevel(successRate),
          item.avgResponseTime?.toFixed(1) || "N/A",
          item.totalAttempts?.toString() || total.toString(),
          item.successTrend?.toFixed(1) || "N/A",
          mostCommonWrong?.answer?.replace(/"/g, '""') || "N/A",
          mostCommonWrong?.count?.toString() || "N/A",
        ];
      }),
    ];

    const csv = csvContent
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `enhanced_question_analysis_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const getDifficultyLevel = (successRate: number): string => {
    if (successRate >= 80) return "Easy";
    if (successRate >= 50) return "Medium";
    if (successRate >= 30) return "Hard";
    return "Very Hard";
  };

  const getDifficultyColor = (difficulty: string) => {
    const level =
      typeof difficulty === "string"
        ? difficulty.toLowerCase()
        : getDifficultyLevel(difficulty).toLowerCase();

    switch (level) {
      case "easy":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      case "hard":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300";
      case "very hard":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getTrendIcon = (trend: number | undefined) => {
    if (!trend) return null;
    return trend >= 0 ? (
      <TrendUp size={14} className="text-green-500" />
    ) : (
      <TrendDown size={14} className="text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Difficulty Distribution Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Question Difficulty Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(difficultyDistribution).map(([difficulty, count]) => {
            const percentage =
              data.length > 0 ? (count / data.length) * 100 : 0;
            return (
              <div
                key={difficulty}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div
                  className={`text-2xl font-bold ${
                    difficulty === "Easy"
                      ? "text-green-600"
                      : difficulty === "Medium"
                      ? "text-yellow-600"
                      : difficulty === "Hard"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {difficulty}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}% of total
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Question Analysis Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Question Analysis
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Download size={16} className="mr-2" />
              Export Enhanced Data
            </button>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Question & Test
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Performance
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Difficulty
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Response Time
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Common Mistakes
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const total = item.correctAnswers + item.incorrectAnswers;
                  const successRate =
                    total > 0
                      ? Math.round((item.correctAnswers / total) * 100)
                      : 0;
                  const difficultyLevel = getDifficultyLevel(successRate);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div
                            className="text-sm text-gray-900 dark:text-white font-medium truncate"
                            title={item.questionText}
                          >
                            {item.questionText}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.testTitle}
                            {item.category && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="space-y-1">
                          <div
                            className={`text-lg font-bold ${
                              successRate >= 80
                                ? "text-green-600"
                                : successRate >= 50
                                ? "text-yellow-600"
                                : successRate >= 30
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {successRate}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-green-600">
                              {item.correctAnswers}✓
                            </span>
                            <span className="mx-1">/</span>
                            <span className="text-red-600">
                              {item.incorrectAnswers}✗
                            </span>
                          </div>
                          {item.totalAttempts && (
                            <div className="text-xs text-gray-400">
                              {item.totalAttempts} total attempts
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            difficultyLevel
                          )}`}
                        >
                          {difficultyLevel}
                        </span>
                        {successRate < 30 && (
                          <div className="mt-1" title="Very low success rate">
                            <WaveTriangle
                              size={14}
                              className="text-red-500 mx-auto"
                            />
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {item.avgResponseTime ? (
                          <div className="flex items-center justify-center space-x-1">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.avgResponseTime.toFixed(1)}s
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {item.commonWrongAnswers &&
                        item.commonWrongAnswers.length > 0 ? (
                          <div className="space-y-1 max-w-xs">
                            {item.commonWrongAnswers
                              .slice(0, 2)
                              .map((wrong, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                                >
                                  <div
                                    className="truncate"
                                    title={wrong.answer}
                                  >
                                    {wrong.answer}
                                  </div>
                                  <div className="text-red-600 dark:text-red-400 font-medium">
                                    {wrong.count} users
                                  </div>
                                </div>
                              ))}
                            {item.commonWrongAnswers.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{item.commonWrongAnswers.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No data</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {item.successTrend !== undefined ? (
                          <div className="flex items-center justify-center space-x-1">
                            {getTrendIcon(item.successTrend)}
                            <span
                              className={`text-sm font-medium ${
                                item.successTrend >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.successTrend >= 0 ? "+" : ""}
                              {item.successTrend.toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              No question analysis data available
            </p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      {data.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-300">
                Most Challenging:
              </div>
              <div className="text-blue-700 dark:text-blue-400">
                {difficultyDistribution["Very Hard"] +
                  difficultyDistribution["Hard"]}{" "}
                questions need review
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-300">
                Average Success:
              </div>
              <div className="text-blue-700 dark:text-blue-400">
                {data.length > 0
                  ? Math.round(
                      data.reduce((acc, item) => {
                        const total =
                          item.correctAnswers + item.incorrectAnswers;
                        return (
                          acc +
                          (total > 0 ? (item.correctAnswers / total) * 100 : 0)
                        );
                      }, 0) / data.length
                    )
                  : 0}
                % across all questions
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-300">
                Response Time:
              </div>
              <div className="text-blue-700 dark:text-blue-400">
                {data.filter((item) => item.avgResponseTime).length > 0
                  ? Math.round(
                      data
                        .filter((item) => item.avgResponseTime)
                        .reduce(
                          (acc, item) => acc + (item.avgResponseTime || 0),
                          0
                        ) / data.filter((item) => item.avgResponseTime).length
                    )
                  : "N/A"}
                s average
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
