/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus } from "@phosphor-icons/react";

interface Video {
  id: string;
  title: string;
}

interface Test {
  id: string;
  title: string;
  description?: string | null;
  timeLimit?: number | null;
  passingScore: number;
  maxAttempts: number;
  videoId: string;
}

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingTest?: Test | null;
  videos: Video[];
}

export default function TestModal({
  isOpen,
  onClose,
  onSubmit,
  editingTest,
  videos,
}: TestModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    timeLimit: 15,
    passingScore: 60,
    maxAttempts: 3,
  });

  useEffect(() => {
    if (editingTest) {
      setFormData({
        title: editingTest.title,
        description: editingTest.description || "",
        videoId: editingTest.videoId,
        timeLimit: editingTest.timeLimit || 15,
        passingScore: editingTest.passingScore,
        maxAttempts: editingTest.maxAttempts,
      });
    } else {
      resetForm();
    }
  }, [editingTest]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoId: "",
      timeLimit: 15,
      passingScore: 60,
      maxAttempts: 3,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      timeLimit: formData.timeLimit === 0 ? null : formData.timeLimit,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingTest ? "Edit Test" : "Create New Test"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Test Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Video
            </label>
            <select
              value={formData.videoId}
              onChange={(e) =>
                setFormData({ ...formData, videoId: e.target.value })
              }
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-800 dark:text-gray-300">
                Choose a video
              </option>
              {videos.map((video) => (
                <option
                  key={video.id}
                  value={video.id}
                  className="text-gray-800 dark:text-gray-300"
                >
                  {video.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0 = no limit"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                0 = no time limit
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScore: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max="100"
                required
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Attempts
              </label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAttempts: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                required
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingTest ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
