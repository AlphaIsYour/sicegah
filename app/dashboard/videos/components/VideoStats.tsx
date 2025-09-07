"use client";

interface VideoStats {
  totalVideos: number;
  activeVideos: number;
  totalViews: number;
  videosWithTests: number;
}

interface VideoStatsProps {
  stats: VideoStats;
}

export default function VideoStats({ stats }: VideoStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Videos
        </h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {stats.totalVideos}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Active Videos
        </h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
          {stats.activeVideos}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Views
        </h3>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
          {stats.totalViews.toLocaleString()}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          With Tests
        </h3>
        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
          {stats.videosWithTests}
        </p>
      </div>
    </div>
  );
}
