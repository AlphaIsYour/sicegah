/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Play,
  PencilSimple as Edit,
  Trash as Trash2,
  Eye,
  Clock,
  Users,
  CheckCircle,
  Warning as AlertCircle,
} from "@phosphor-icons/react";

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

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
}

export default function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      PARENT:
        "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
      HEALTH_WORKER:
        "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
      CAREGIVER:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300",
      CADRE:
        "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300",
    };
    return (
      colors[role as keyof typeof colors] ||
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    );
  };

  const getYoutubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
        <img
          src={video.thumbnailUrl || getYoutubeThumbnail(video.youtubeId)}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Play className="text-white w-6 h-6 ml-1" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
          <Clock size={12} />
          <span>{formatDuration(video.duration)}</span>
        </div>
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              video.isActive
                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
            }`}
          >
            {video.isActive ? (
              <>
                <CheckCircle size={12} className="mr-1" />
                Active
              </>
            ) : (
              <>
                <AlertCircle size={12} className="mr-1" />
                Inactive
              </>
            )}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {video.title}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(video)}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(video.id)}
              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Category:</span>
            <span
              className="font-medium px-2 py-1 rounded-full text-white text-xs"
              style={{
                backgroundColor: video.category.color || "#6B7280",
              }}
            >
              {video.category.name}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Age Range:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {video.minAge || 0}-{video.maxAge || 0} months
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Views:</span>
            <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
              <Eye size={12} />
              <span>{video.viewCount.toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Target Roles:
          </div>
          <div className="flex flex-wrap gap-1">
            {video.targetRole.map((role) => (
              <span
                key={role}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  role
                )}`}
              >
                <Users size={10} className="mr-1" />
                {role.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {video.test ? (
              <span className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center">
                <CheckCircle size={12} className="mr-1" />
                Has Test
              </span>
            ) : (
              <span className="text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center">
                <AlertCircle size={12} className="mr-1" />
                No Test
              </span>
            )}
          </div>
          <button className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-xs rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center space-x-1 transition-colors">
            <Eye size={12} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
