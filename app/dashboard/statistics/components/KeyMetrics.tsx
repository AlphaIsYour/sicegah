import {
  TrendUp,
  TrendDown,
  Users,
  Target,
  CheckCircle,
  Clock,
  Eye,
  Brain,
} from "@phosphor-icons/react";

interface KeyMetricsData {
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  passRate: number;
  // Enhanced metrics
  totalTestAttempts?: number;
  totalVideoViews?: number;
  averageTimeSpent?: number; // in minutes
  retentionRate?: number;
  trends: {
    participants: number;
    score: number;
    completion: number;
    pass: number;
    // Enhanced trends
    timeSpent?: number;
    retention?: number;
  };
}

interface KeyMetricsProps {
  data: KeyMetricsData;
}

export default function KeyMetrics({ data }: KeyMetricsProps) {
  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    return {
      value: Math.abs(trend),
      isPositive,
      icon: isPositive ? TrendUp : TrendDown,
      color: isPositive
        ? "text-green-500 dark:text-green-400"
        : "text-red-500 dark:text-red-400",
    };
  };

  const primaryMetrics = [
    {
      title: "Total Participants",
      value: data.totalParticipants.toLocaleString(),
      trend: formatTrend(data.trends.participants),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      icon: Users,
    },
    {
      title: "Average Score",
      value: `${data.averageScore.toFixed(1)}%`,
      trend: formatTrend(data.trends.score),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      icon: Target,
    },
    {
      title: "Completion Rate",
      value: `${data.completionRate.toFixed(1)}%`,
      trend: formatTrend(data.trends.completion),
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      icon: CheckCircle,
    },
    {
      title: "Pass Rate",
      value: `${data.passRate.toFixed(1)}%`,
      trend: formatTrend(data.trends.pass),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      icon: Brain,
    },
  ];

  // Enhanced metrics (optional, only show if data exists)
  const enhancedMetrics = [
    ...(data.totalTestAttempts
      ? [
          {
            title: "Total Test Attempts",
            value: data.totalTestAttempts.toLocaleString(),
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            icon: Brain,
            subtitle: "Total attempts made",
          },
        ]
      : []),
    ...(data.totalVideoViews
      ? [
          {
            title: "Total Video Views",
            value: data.totalVideoViews.toLocaleString(),
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-50 dark:bg-pink-900/20",
            icon: Eye,
            subtitle: "Video engagement",
          },
        ]
      : []),
    ...(data.averageTimeSpent
      ? [
          {
            title: "Avg Time Spent",
            value: `${data.averageTimeSpent.toFixed(1)}m`,
            trend: data.trends.timeSpent
              ? formatTrend(data.trends.timeSpent)
              : undefined,
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
            icon: Clock,
            subtitle: "Per session",
          },
        ]
      : []),
    ...(data.retentionRate
      ? [
          {
            title: "Retention Rate",
            value: `${data.retentionRate.toFixed(1)}%`,
            trend: data.trends.retention
              ? formatTrend(data.trends.retention)
              : undefined,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: Users,
            subtitle: "7-day retention",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {primaryMetrics.map((metric, index) => {
          const TrendIcon = metric.trend.icon;
          const MetricIcon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <MetricIcon size={20} className={metric.color} />
                </div>
                <div
                  className={`flex items-center text-sm ${metric.trend.color}`}
                >
                  <TrendIcon size={14} className="mr-1" />
                  {metric.trend.value.toFixed(1)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Enhanced Metrics (if available) */}
      {enhancedMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enhancedMetrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                    <MetricIcon size={16} className={metric.color} />
                  </div>
                  {metric.trend && (
                    <div
                      className={`flex items-center text-xs ${metric.trend.color}`}
                    >
                      <metric.trend.icon size={12} className="mr-1" />
                      {metric.trend.value.toFixed(1)}%
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </h3>
                <p className={`text-xl font-bold ${metric.color} mb-1`}>
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {metric.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Indicators */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Performance Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                data.averageScore >= 80
                  ? "text-green-600"
                  : data.averageScore >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {data.averageScore >= 80
                ? "Excellent"
                : data.averageScore >= 60
                ? "Good"
                : "Needs Improvement"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Average Performance
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                data.completionRate >= 80
                  ? "text-green-600"
                  : data.completionRate >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {data.completionRate >= 80
                ? "High"
                : data.completionRate >= 60
                ? "Moderate"
                : "Low"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Engagement Level
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                data.passRate >= 75
                  ? "text-green-600"
                  : data.passRate >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {data.passRate >= 75
                ? "Strong"
                : data.passRate >= 50
                ? "Fair"
                : "Weak"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Success Rate
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-lg font-bold ${
                data.trends.score >= 5
                  ? "text-green-600"
                  : data.trends.score >= 0
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {data.trends.score >= 5
                ? "Growing"
                : data.trends.score >= 0
                ? "Stable"
                : "Declining"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Trend Direction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
