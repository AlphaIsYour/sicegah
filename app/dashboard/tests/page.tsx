/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestCard from "./components/TestCard";
import TestModal from "./components/TestModal";

interface Test {
  id: string;
  title: string;
  description?: string | null;
  timeLimit?: number | null;
  passingScore: number;
  maxAttempts: number;
  isActive: boolean;
  videoId: string;
  video?: {
    title: string;
  };
  _count?: {
    questions: number;
    testAttempts: number;
  };
  createdAt: string;
}

interface Video {
  id: string;
  title: string;
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchTests(), fetchVideos()]);
    setLoading(false);
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

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        const activeVideos = data
          .filter((video: any) => video.isActive)
          .map((video: any) => ({
            id: video.id,
            title: video.title,
          }));
        setVideos(activeVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSubmit = async (formData: any) => {
    const url = editingTest ? `/api/tests/${editingTest.id}` : "/api/tests";
    const method = editingTest ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTests();
        setShowModal(false);
        setEditingTest(null);
      }
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus test ini?")) return;

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTests();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleToggleActive = async (id: string) => {
    const test = tests.find((t) => t.id === id);
    if (!test) return;

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...test, isActive: !test.isActive }),
      });

      if (response.ok) {
        await fetchTests();
      }
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  const handleViewQuestions = (testId: string) => {
    router.push(`/dashboard/questions?test=${testId}`);
  };

  const calculateStats = () => {
    const totalAttempts = tests.reduce(
      (sum, test) => sum + (test._count?.testAttempts || 0),
      0
    );

    return {
      total: tests.length,
      active: tests.filter((t) => t.isActive).length,
      totalAttempts,
      avgPassingScore:
        tests.length > 0
          ? Math.round(
              tests.reduce((sum, t) => sum + t.passingScore, 0) / tests.length
            )
          : 0,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola kuis dan evaluasi
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTest(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Create Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Tests
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Tests
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.active}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Attempts
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalAttempts}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Passing Score
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.avgPassingScore}%
          </p>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onViewQuestions={handleViewQuestions}
          />
        ))}
      </div>

      {tests.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            📝
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tests found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first test to get started
          </p>
        </div>
      )}

      {/* Modal */}
      <TestModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTest(null);
        }}
        onSubmit={handleSubmit}
        editingTest={editingTest}
        videos={videos}
      />
    </div>
  );
}
