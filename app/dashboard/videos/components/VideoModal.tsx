/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Users } from "@phosphor-icons/react";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  targetRole: string[];
  minAge?: number;
  maxAge?: number;
  categoryId: string;
}

interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingVideo?: Video | null;
  categories: VideoCategory[];
}

export default function VideoModal({
  isOpen,
  onClose,
  onSubmit,
  editingVideo,
  categories,
}: VideoModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
    categoryId: "",
    minAge: 0,
    maxAge: 24,
    targetRole: [] as string[],
  });

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title,
        description: editingVideo.description || "",
        youtubeId: editingVideo.youtubeId,
        categoryId: editingVideo.categoryId,
        minAge: editingVideo.minAge || 0,
        maxAge: editingVideo.maxAge || 24,
        targetRole: editingVideo.targetRole,
      });
    } else {
      resetForm();
    }
  }, [editingVideo]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtubeId: "",
      categoryId: "",
      minAge: 0,
      maxAge: 24,
      targetRole: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingVideo ? "Edit Video" : "Add New Video"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Video Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Enter video description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              YouTube Video ID
            </label>
            <input
              type="text"
              required
              value={formData.youtubeId}
              onChange={(e) =>
                setFormData({ ...formData, youtubeId: e.target.value })
              }
              className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="dQw4w9WgXcQ (from youtube.com/watch?v=dQw4w9WgXcQ)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Age (months)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minAge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minAge: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Age (months)
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxAge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAge: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="24"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Roles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "IBU",
                "AYAH",
                "PENGASUH",
                "KADER",
                "TENAGA_KESEHATAN",
                "BIDAN",
              ].map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.targetRole.includes(role)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...formData.targetRole, role]
                        : formData.targetRole.filter((r) => r !== role);
                      setFormData({ ...formData, targetRole: newRoles });
                    }}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Users size={12} className="mr-1" />
                    {role.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {editingVideo ? "Update Video" : "Add Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
