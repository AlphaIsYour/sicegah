"use client";

import { FunnelSimple as Filter } from "@phosphor-icons/react";

interface VideoCategory {
  id: string;
  name: string;
  color?: string;
}

interface VideoFilterProps {
  categories: VideoCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function VideoFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: VideoFilterProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Filter size={20} className="text-gray-600 dark:text-gray-400" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by Category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
        >
          <option value="ALL">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
