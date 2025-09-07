/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus } from "@phosphor-icons/react";
import VideoCard from "./components/VideoCard";
import VideoModal from "./components/VideoModal";
import CategoryManager from "./components/CategoryManager";
import VideoFilter from "./components/VideoFilter";
import VideoStats from "./components/VideoStats";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration?: number;
  targetRole: string[];
  minAge?: number;
  maxAge?: number;
  viewCount: number;
  isActive: boolean;
  categoryId: string;
  category: {
    name: string;
    color?: string;
  };
  test?: {
    id: string;
  } | null;
  createdAt: string;
}

interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  videoCount?: number;
  totalViews?: number;
}

interface VideoStats {
  totalVideos: number;
  activeVideos: number;
  totalViews: number;
  videosWithTests: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [stats, setStats] = useState<VideoStats>({
    totalVideos: 0,
    activeVideos: 0,
    totalViews: 0,
    videosWithTests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "categories">("videos");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchVideos(), fetchCategories(), fetchStats()]);
    setLoading(false);
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/video-categories/stats");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/videos/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleVideoSubmit = async (formData: any) => {
    const url = editingVideo ? `/api/videos/${editingVideo.id}` : "/api/videos";
    const method = editingVideo ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAllData();
        setShowVideoModal(false);
        setEditingVideo(null);
      }
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const handleVideoDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleVideoEdit = (video: Video) => {
    setEditingVideo(video);
    setShowVideoModal(true);
  };

  const filteredVideos = videos.filter(
    (video) => categoryFilter === "ALL" || video.categoryId === categoryFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Videos Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage educational videos and categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVideo(null);
            setShowVideoModal(true);
          }}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Video</span>
        </button>
      </div>

      {/* Stats */}
      <VideoStats stats={stats} />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "videos"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "categories"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Categories ({categories.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "videos" ? (
        <div className="space-y-6">
          <VideoFilter
            categories={categories}
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onEdit={handleVideoEdit}
                onDelete={handleVideoDelete}
              />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎥</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {categoryFilter === "ALL"
                  ? "Start by adding your first video"
                  : "No videos found in this category"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <CategoryManager categories={categories} onRefresh={fetchCategories} />
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => {
          setShowVideoModal(false);
          setEditingVideo(null);
        }}
        onSubmit={handleVideoSubmit}
        editingVideo={editingVideo}
        categories={categories.filter((cat) => cat.isActive)}
      />
    </div>
  );
}
