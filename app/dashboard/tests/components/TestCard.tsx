/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Clock,
  Target,
  ArrowsClockwise,
  Users,
  PencilSimple as Edit,
  Trash as Trash2,
  Eye,
  Question, // Changed QuestionMark to Question for consistency with other icons
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

interface Test {
  id: string;
  title: string;
  description?: string | null;
  timeLimit?: number | null;
  passingScore: number;
  maxAttempts: number;
  isActive: boolean;
  videoId: string; // Added missing videoId property
  video?: {
    title: string;
  };
  _count?: {
    questions: number;
    testAttempts: number;
  };
  createdAt: string;
}

interface TestCardProps {
  test: Test;
  onEdit: (test: Test) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onViewQuestions: (testId: string) => void;
}

export default function TestCard({
  test,
  onEdit,
  onDelete,
  onToggleActive,
  onViewQuestions,
}: TestCardProps) {
  const getPassRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 dark:text-green-400";
    if (rate >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {test.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {test.description || "No description"}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Video: {test.video?.title || "Not linked to video"}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(test)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            title="Edit"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => onViewQuestions(test.id)}
            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
            title="View Questions"
          >
            <Question size={20} />
          </button>
          <button
            onClick={() => onDelete(test.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <Question size={18} className="text-blue-500 dark:text-blue-400" />
          <span>{test._count?.questions || 0} questions</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <Users size={18} className="text-purple-500 dark:text-purple-400" />
          <span>{test._count?.testAttempts || 0} attempts</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock size={18} className="text-orange-500 dark:text-orange-400" />
          <span>{test.timeLimit ? `${test.timeLimit} mins` : "No limit"}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <ArrowsClockwise
            size={18}
            className="text-indigo-500 dark:text-indigo-400"
          />
          <span>{test.maxAttempts} attempts</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4 text-gray-700 dark:text-gray-300">
        <Target size={18} className="text-green-500 dark:text-green-400" />
        <span className="text-sm">Passing Score: {test.passingScore}%</span>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onToggleActive(test.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-colors ${
            test.isActive
              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          {test.isActive ? (
            <CheckCircle size={14} className="mr-1" />
          ) : (
            <XCircle size={14} className="mr-1" />
          )}
          {test.isActive ? "Active" : "Inactive"}
        </button>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          Created: {new Date(test.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
