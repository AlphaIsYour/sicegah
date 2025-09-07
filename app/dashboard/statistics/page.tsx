/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import StatisticsFilters from "./components/StatisticsFilters";
import KeyMetrics from "./components/KeyMetrics";
import TestPerformance from "./components/TestPerformance";
import RolePerformance from "./components/RolePerformance";
import QuestionAnalysis from "./components/QuestionAnalysis";
import ResearchInsights from "./components/ResearchInsights";

interface StatisticsData {
  keyMetrics: {
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
  };
  testPerformance: Array<{
    category: string;
    avgScore: number;
    attempts: number;
    passRate: number;
  }>;
  rolePerformance: Array<{
    role: string;
    users: number;
    avgScore: number;
    completionRate: number;
  }>;
  questionAnalysis: Array<{
    id: string;
    questionText: string;
    correctAnswers: number;
    incorrectAnswers: number;
    difficulty: string;
    testTitle: string;
  }>;
  insights: {
    keyFindings: string[];
    recommendations: string[];
  };
}

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod, selectedRole]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedRole !== "ALL" && { role: selectedRole }),
      });

      const response = await fetch(`/api/statistics?${params}`);
      if (response.ok) {
        const statisticsData = await response.json();
        setData(statisticsData);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load statistics
          </h3>
          <button
            onClick={fetchStatistics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statistics & Research Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive analytics for research and insights
          </p>
        </div>

        <StatisticsFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      </div>

      <KeyMetrics data={data.keyMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TestPerformance data={data.testPerformance} />
        <RolePerformance data={data.rolePerformance} />
      </div>

      <QuestionAnalysis data={data.questionAnalysis} />

      <ResearchInsights data={data.insights} />
    </div>
  );
}
