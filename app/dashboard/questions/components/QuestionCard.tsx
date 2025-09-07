"use client";

import {
  PencilSimple as Edit,
  Trash as Trash2,
  Check,
} from "@phosphor-icons/react";

interface Question {
  id: string;
  questionText: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  options: string[] | null;
  correctAnswer: string;
  explanation?: string | null;
  points: number;
  order: number;
  testId: string;
  test: {
    title: string;
    video?: {
      title: string;
    };
  };
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export default function QuestionCard({
  question,
  index,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  const getOptions = () => {
    if (question.type === "TRUE_FALSE") {
      return ["True", "False"]; // Changed to English for consistency if the app is English
    }
    return question.options || [];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
              {question.type === "MULTIPLE_CHOICE"
                ? "Multiple Choice"
                : "True/False"}
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full font-medium">
              {question.points} pts
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Test: {question.test.title}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            {index + 1}. {question.questionText}
          </h3>

          <div className="space-y-2 mb-3">
            {getOptions().map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-center p-3 rounded-lg border text-gray-900 dark:text-white ${
                  option === question.correctAnswer
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                    option === question.correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + optIndex)}
                </span>
                <span className="flex-1">{option}</span>
                {option === question.correctAnswer && (
                  <Check
                    size={20}
                    weight="bold"
                    className="ml-auto text-green-600 dark:text-green-400"
                  />
                )}
              </div>
            ))}
          </div>

          {question.explanation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-3 mt-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
          <button
            onClick={() => onEdit(question)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
