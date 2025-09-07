import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface KeyMetricsData {
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  passRate: number;
  trends: {
    participants: number;
    score: number;
    completion: number;
    pass: number;
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

  const metrics = [
    {
      title: "Total Participants",
      value: data.totalParticipants.toLocaleString(),
      trend: formatTrend(data.trends.participants),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Average Score",
      value: `${data.averageScore.toFixed(1)}%`,
      trend: formatTrend(data.trends.score),
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Completion Rate",
      value: `${data.completionRate.toFixed(1)}%`,
      trend: formatTrend(data.trends.completion),
      color: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Pass Rate",
      value: `${data.passRate.toFixed(1)}%`,
      trend: formatTrend(data.trends.pass),
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const TrendIcon = metric.trend.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </h3>
            <p className={`text-3xl font-bold ${metric.color} mt-2`}>
              {metric.value}
            </p>
            <div
              className={`flex items-center mt-1 text-sm ${metric.trend.color}`}
            >
              <TrendIcon size={16} className="mr-1" />
              {metric.trend.value.toFixed(1)}% change
            </div>
          </div>
        );
      })}
    </div>
  );
}
