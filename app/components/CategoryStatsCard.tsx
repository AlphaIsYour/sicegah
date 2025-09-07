// components/CategoryStatsCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye, Video, BarChart3, TrendingUp } from "lucide-react";

interface CategoryStats {
  id: string;
  name: string;
  description?: string;
  color?: string;
  videoCount: number;
  totalViews: number;
  isActive: boolean;
  createdAt: string;
}

export default function CategoryStatsCard() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch("/api/video-categories/stats");
      if (response.ok) {
        const data = await response.json();
        setCategoryStats(data);
      }
    } catch (error) {
      console.error("Error fetching category stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 size={20} className="mr-2 text-blue-600" />
          Category Performance
        </h3>
        <button
          onClick={fetchCategoryStats}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {categoryStats.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories found</p>
        ) : (
          categoryStats.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color || "#6B7280" }}
                ></div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <Video size={14} className="mr-1" />
                    <span className="font-medium">{category.videoCount}</span>
                  </div>
                  <p className="text-xs text-gray-500">Videos</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye size={14} className="mr-1" />
                    <span className="font-medium">
                      {category.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Views</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp size={14} className="mr-1" />
                    <span className="font-medium">
                      {category.videoCount > 0
                        ? Math.round(category.totalViews / category.videoCount)
                        : 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Avg/Video</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {categoryStats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {categoryStats.length}
              </p>
              <p className="text-sm text-gray-600">Total Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {categoryStats.reduce((sum, cat) => sum + cat.videoCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Videos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {categoryStats
                  .reduce((sum, cat) => sum + cat.totalViews, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
