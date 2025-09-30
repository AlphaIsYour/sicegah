"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  VideoCamera,
  Exam,
  CheckCircle,
  TrendUp,
  Plus,
  ArrowUpRight,
  Clock,
  Eye,
  ChartBar,
  BookOpen,
  Student,
  // Activity, // Removed because not exported
} from "@phosphor-icons/react";

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalTests: number;
  completedTests: number;
  usersByRole: {
    role: string;
    count: number;
    percentage: number;
  }[];
  recentActivities: {
    user: string;
    action: string;
    time: string;
    type: "user" | "video" | "test" | "system";
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Fallback to static data for demo
        setStats({
          totalUsers: 1247,
          totalVideos: 89,
          totalTests: 156,
          completedTests: 2341,
          usersByRole: [
            { role: "Student", count: 980, percentage: 78.6 },
            { role: "Instructor", count: 156, percentage: 12.5 },
            { role: "Admin", count: 67, percentage: 5.4 },
            { role: "Guest", count: 44, percentage: 3.5 },
          ],
          recentActivities: [
            {
              user: "Dr. Sarah Johnson",
              action: "uploaded a new video lecture",
              time: "2 minutes ago",
              type: "video",
            },
            {
              user: "Prof. Michael Chen",
              action: "created a new test for Advanced Biology",
              time: "15 minutes ago",
              type: "test",
            },
            {
              user: "Emma Rodriguez",
              action: "completed the Chemistry Basics test",
              time: "1 hour ago",
              type: "user",
            },
            {
              user: "System",
              action: "generated monthly analytics report",
              time: "2 hours ago",
              type: "system",
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Add New Video",
      description: "Upload educational content",
      icon: VideoCamera,
      href: "/dashboard/videos",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "Create Test",
      description: "Design new assessments",
      icon: Exam,
      href: "/dashboard/tests",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: ChartBar,
      href: "/dashboard/statistics",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Manage Users",
      description: "Handle user accounts",
      icon: Users,
      href: "/dashboard/users",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalUsers || 0,
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Video Lectures",
      value: stats?.totalVideos || 0,
      change: "+8.2%",
      changeType: "increase" as const,
      icon: VideoCamera,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Active Tests",
      value: stats?.totalTests || 0,
      change: "+15.7%",
      changeType: "increase" as const,
      icon: Exam,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Test Completions",
      value: stats?.completedTests || 0,
      change: "+23.1%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "video":
        return VideoCamera;
      case "test":
        return Exam;
      case "user":
        return Users;
      case "system":
        return ChartBar;
      default:
        return ChartBar;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "test":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "user":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "system":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s an overview of your education platform&apos;s
            performance today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Eye size={16} className="mr-2" />
            View Report
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} className="mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent
                    size={24}
                    weight="duotone"
                    className={stat.textColor}
                  />
                </div>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendUp size={16} className="mr-1" />
                  {stat.change}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  vs last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Role Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Distribution
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Breakdown by user roles
              </p>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {stats?.usersByRole && stats.usersByRole.length > 0 ? (
              stats.usersByRole.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Student
                  size={48}
                  className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No user data available yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest platform updates
              </p>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div
                      className={`p-2 rounded-lg ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {activity.action}
                        </span>
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock
                          size={12}
                          className="text-gray-400 dark:text-gray-500 mr-1"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <ChartBar
                  size={48}
                  className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Commonly used administrative tasks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group p-6 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 text-center"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                >
                  <IconComponent
                    size={28}
                    weight="duotone"
                    className="text-white"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {action.description}
                </p>
                <div className="flex items-center justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Engagement
            </h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendUp
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Video Views
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                12.4K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Test Attempts
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                3.2K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Score
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                87%
              </span>
            </div>
          </div>
        </div>

        {/* Content Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Content
            </h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                24
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Questions
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                1,847
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hours of Video
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                156h
              </span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              System
            </h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <ChartBar
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Uptime
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                99.9%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Load Time
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                1.2s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Storage
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                68% used
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
