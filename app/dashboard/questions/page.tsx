/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import QuestionCard from "./components/QuestionCard";
import QuestionModal from "./components/QuestionModal";
import QuestionFilter from "./components/QuestionFilter";
import {
  Plus,
  Hash,
  ListNumbers,
  CheckCircle,
  XCircle,
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
  createdAt?: string;
  updatedAt?: string;
}

interface Test {
  id: string;
  title: string;
  video?: {
    title: string;
  };
  _count?: {
    questions: number;
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [filter, setFilter] = useState({
    test: "all",
    type: "all",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchQuestions(), fetchTests()]);
    setLoading(false);
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/tests");
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleSubmit = async (formData: any) => {
    const url = editingQuestion
      ? `/api/questions/${editingQuestion.id}`
      : "/api/questions";
    const method = editingQuestion ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchQuestions();
        setShowModal(false);
        setEditingQuestion(null);
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchQuestions();
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter.test !== "all" && q.testId !== filter.test) return false;
    if (filter.type !== "all" && q.type !== filter.type) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your question bank for quizzes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Add Question
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Questions
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {questions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Multiple Choice
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {questions.filter((q) => q.type === "MULTIPLE_CHOICE").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">True/False</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {questions.filter((q) => q.type === "TRUE_FALSE").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Points
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {questions.reduce((sum, q) => sum + q.points, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <QuestionFilter
        tests={tests}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question: Question, index: number) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4 flex justify-center">
            <ListNumbers size={64} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No questions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter.test !== "all" || filter.type !== "all"
              ? "No questions match the selected filters"
              : "Start by adding your first question"}
          </p>
        </div>
      )}

      {/* Modal */}
      <QuestionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingQuestion(null);
        }}
        onSubmit={handleSubmit}
        editingQuestion={editingQuestion}
        tests={tests}
      />
    </div>
  );
}
