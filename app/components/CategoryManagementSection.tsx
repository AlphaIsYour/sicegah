/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/CategoryManagementSection.tsx
"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";

interface CategoryManagementProps {
  categories: VideoCategory[];
  onEdit: (category: VideoCategory) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string, isActive: boolean) => void;
}

interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function CategoryManagementSection({
  categories,
  onEdit,
  onDelete,
  onToggleActive,
}: CategoryManagementProps) {
  const [sortBy, setSortBy] = useState<"name" | "order" | "createdAt">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedCategories = [...categories].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "order":
        comparison = a.order - b.order;
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  const handleToggleActive = async (
    categoryId: string,
    currentActive: boolean
  ) => {
    try {
      const response = await fetch(`/api/video-categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (response.ok) {
        onToggleActive(categoryId, !currentActive);
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Category Management ({categories.length})
          </h3>

          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="order">Sort by Order</option>
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Created Date</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-sm px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No categories found</p>
          </div>
        ) : (
          sortedCategories.map((category, index) => (
            <div
              key={category.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 font-mono w-8">
                      #{category.order}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: category.color || "#6B7280" }}
                    ></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {category.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1 max-w-md">
                        {category.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleToggleActive(category.id, category.isActive)
                    }
                    className={`p-2 rounded-md transition-colors ${
                      category.isActive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    title={category.isActive ? "Deactivate" : "Activate"}
                  >
                    {category.isActive ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Category"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
