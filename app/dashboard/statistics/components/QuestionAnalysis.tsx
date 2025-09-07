import { Download } from "@phosphor-icons/react";

interface QuestionAnalysisData {
  id: string;
  questionText: string;
  correctAnswers: number;
  incorrectAnswers: number;
  difficulty: string;
  testTitle: string;
}

interface QuestionAnalysisProps {
  data: QuestionAnalysisData[];
}

export default function QuestionAnalysis({ data }: QuestionAnalysisProps) {
  const exportData = () => {
    const csvContent = [
      [
        "Question",
        "Test",
        "Correct",
        "Incorrect",
        "Success Rate",
        "Difficulty",
      ],
      ...data.map((item) => [
        item.questionText,
        item.testTitle,
        item.correctAnswers.toString(),
        item.incorrectAnswers.toString(),
        `${Math.round(
          (item.correctAnswers /
            (item.correctAnswers + item.incorrectAnswers)) *
            100
        )}%`,
        item.difficulty,
      ]),
    ];

    const csv = csvContent
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `question_analysis_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Question Analysis
        </h2>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download size={16} className="mr-2" />
          Export Data
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Question
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Test
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Correct
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Incorrect
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Success Rate
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Difficulty
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

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white max-w-xs">
                      <div className="truncate" title={item.questionText}>
                        {item.questionText}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.testTitle}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                        {item.correctAnswers}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                        {item.incorrectAnswers}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      {successRate}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No question analysis data available
          </p>
        </div>
      )}
    </div>
  );
}
