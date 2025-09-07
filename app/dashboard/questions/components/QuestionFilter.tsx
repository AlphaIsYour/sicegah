"use client";

import { FunnelSimple as Filter } from "@phosphor-icons/react";

interface Test {
  id: string;
  title: string;
  video?: {
    title: string;
  };
}

interface QuestionFilterProps {
  tests: Test[];
  filter: {
    test: string;
    type: string;
  };
  onFilterChange: (filter: { test: string; type: string }) => void;
}

export default function QuestionFilter({
  tests,
  filter,
  onFilterChange,
}: QuestionFilterProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Filter Title */}
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Filter
            size={18}
            weight="bold"
            className="text-blue-600 dark:text-blue-400"
          />
          <span className="text-base font-semibold">Filter Pertanyaan</span>
        </div>

        {/* Filter by Test */}
        <div className="flex-1 min-w-[180px]">
          {" "}
          {/* Added min-width for better spacing */}
          <label
            htmlFor="filter-test"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Filter Berdasarkan Tes
          </label>
          <select
            id="filter-test"
            value={filter.test}
            onChange={(e) =>
              onFilterChange({ ...filter, test: e.target.value })
            }
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">Semua Tes</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Type */}
        <div className="flex-1 min-w-[180px]">
          {" "}
          {/* Added min-width for better spacing */}
          <label
            htmlFor="filter-type"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Filter Berdasarkan Tipe
          </label>
          <select
            id="filter-type"
            value={filter.type}
            onChange={(e) =>
              onFilterChange({ ...filter, type: e.target.value })
            }
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">Semua Tipe</option>
            <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
            <option value="TRUE_FALSE">Benar/Salah</option>
          </select>
        </div>
      </div>
    </div>
  );
}
