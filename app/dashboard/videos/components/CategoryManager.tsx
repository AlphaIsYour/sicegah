/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Plus,
  PencilSimple as Edit,
  Trash as Trash2,
  FolderOpen,
  Eye,
} from "@phosphor-icons/react";
import CategoryModal from "./CategoryModal";

interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  videoCount?: number;
  totalViews?: number;
}

interface CategoryManagerProps {
  categories: VideoCategory[];
  onRefresh: () => void;
}

export default function CategoryManager({
  categories,
  onRefresh,
}: CategoryManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VideoCategory | null>(
    null
  );

  const handleSubmit = async (formData: any) => {
    const url = editingCategory
      ? `/api/video-categories/${editingCategory.id}`
      : "/api/video-categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRefresh();
        setShowModal(false);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/video-categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category: VideoCategory) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Video Categories
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 text-sm flex items-center space-x-1 transition-colors"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-xl">{category.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <div
                    className="w-12 h-2 rounded-full mt-1"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {category.description || "No description"}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <FolderOpen
                  size={12}
                  className="text-blue-500 dark:text-blue-400"
                />
                <span className="text-gray-500 dark:text-gray-400">
                  Videos:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.videoCount || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye
                  size={12}
                  className="text-purple-500 dark:text-purple-400"
                />
                <span className="text-gray-500 dark:text-gray-400">Views:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(category.totalViews || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  category.isActive
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Order: {category.order}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
}
