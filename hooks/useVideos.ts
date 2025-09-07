/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useVideos.ts
import { useState, useEffect } from "react";
import { Video, VideoCategory, VideoStats } from "@/types/video";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [stats, setStats] = useState<VideoStats>({
    totalVideos: 0,
    activeVideos: 0,
    totalViews: 0,
    videosWithTests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
      console.error("Error fetching videos:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/video-categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      console.error("Error fetching categories:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/videos/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (videoData: any) => {
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) throw new Error("Failed to create video");

      await fetchVideos();
      await fetchStats();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
      throw err;
    }
  };

  const updateVideo = async (id: string, videoData: any) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) throw new Error("Failed to update video");

      await fetchVideos();
      await fetchStats();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update video");
      throw err;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete video");

      await fetchVideos();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
      throw err;
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCategories();
    fetchStats();
  }, []);

  return {
    videos,
    categories,
    stats,
    loading,
    error,
    createVideo,
    updateVideo,
    deleteVideo,
    refetch: () => {
      fetchVideos();
      fetchCategories();
      fetchStats();
    },
  };
}
