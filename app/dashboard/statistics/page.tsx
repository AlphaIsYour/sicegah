/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import StatisticsFilters from "./components/StatisticsFilters";
import KeyMetrics from "./components/KeyMetrics";
import TestPerformance from "./components/TestPerformance";
import RolePerformance from "./components/RolePerformance";
import QuestionAnalysis from "./components/QuestionAnalysis";
import ResearchInsights from "./components/ResearchInsights";
import DemographicsAnalysis from "./components/DemographicsAnalysis";
import LearningPatterns from "./components/LearningPatterns";

interface StatisticsData {
  keyMetrics: {
    totalParticipants: number;
    averageScore: number;
    completionRate: number;
    passRate: number;
    // Enhanced metrics
    totalTestAttempts?: number;
    totalVideoViews?: number;
    averageTimeSpent?: number;
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
    // Enhanced fields
    totalAttempts?: number;
    completedAttempts?: number;
    passRate?: number;
    avgTimeSpent?: number;
  }>;
  questionAnalysis: Array<{
    id: string;
    questionText: string;
    correctAnswers: number;
    incorrectAnswers: number;
    difficulty: string;
    testTitle: string;
    // Enhanced fields
    category?: string;
    avgResponseTime?: number;
    commonWrongAnswers?: Array<{ answer: string; count: number }>;
    totalAttempts?: number;
  }>;
  // Updated to match API structure
  demographicAnalysis: {
    roleDistribution?: Array<{
      role: string;
      users: number;
      avgScore: number;
      completionRate: number;
      passRate?: number;
      avgTimeSpent?: number;
    }>;
    geographicDistribution?: Array<{
      province: string;
      city?: string;
      users: number;
      avgScore: number;
      completionRate: number;
      passRate?: number;
    }>;
    childDemographics?: {
      ageGroups: Array<{
        ageRange: string;
        count: number;
        avgParentScore: number;
        completionRate?: number;
      }>;
      genderDistribution?: {
        male: { count: number; avgParentScore: number };
        female: { count: number; avgParentScore: number };
      };
      prematureAnalysis?: {
        premature: { count: number; avgParentScore: number };
        normal: { count: number; avgParentScore: number };
      };
      birthWeightImpact?: Array<{
        weightRange: string;
        count: number;
        avgParentScore: number;
      }>;
    };
  };
  learningPatterns: {
    videoToTestCorrelation?: Array<{
      category: string;
      videoCompletionRate: number;
      testPassRate: number;
      correlation?: number;
      videoCount?: number;
      testCount?: number;
    }>;
    learningCurve?: Array<{
      attemptNumber: number;
      avgScore: number;
      count: number;
      improvementRate?: number;
    }>;
    timeBasedPerformance?: Array<{
      hour: number;
      avgScore: number;
      attempts: number;
      completionRate?: number;
    }>;
    dropoffAnalysis?: Array<{
      stage: string;
      dropoffRate: number;
      count: number;
      recoveryRate?: number;
    }>;
    retentionPatterns?: {
      dailyRetention: Array<{
        day: number;
        retentionRate: number;
        activeUsers: number;
      }>;
      weeklyPattern: Array<{
        dayOfWeek: string;
        avgScore: number;
        activeUsers: number;
      }>;
    };
  };
  researchInsights: {
    // Updated to match ResearchInsights component requirements
    keyFindings: Array<{
      title: string;
      description: string;
      impact: "High" | "Medium" | "Low";
      category: string;
      confidence?: number;
      sampleSize?: number;
    }>;
    recommendations: Array<{
      title: string;
      description: string;
      priority: "High" | "Medium" | "Low";
      targetAudience: string;
      expectedImprovement?: string;
      implementationComplexity?: "Easy" | "Medium" | "Hard";
    }>;
    // Additional research fields
    statisticalSignificance?: Array<{
      hypothesis: string;
      pValue: number;
      confidenceInterval: string;
      significant: boolean;
      effectSize?: number;
      sampleSize?: number;
    }>;
    behavioralPatterns?: Array<{
      pattern: string;
      description: string;
      frequency: number;
      correlation?: number;
    }>;
    predictiveModels?: Array<{
      model: string;
      accuracy: number;
      variables: string[];
      prediction: string;
    }>;
    // Backward compatibility
    enhancedFindings?: Array<{
      title: string;
      description: string;
      impact: "High" | "Medium" | "Low";
      category: string;
    }>;
    enhancedRecommendations?: Array<{
      title: string;
      description: string;
      priority: "High" | "Medium" | "Low";
      targetAudience: string;
    }>;
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

        // Transform data to match expected structure
        const transformedData: StatisticsData = {
          ...statisticsData,
          researchInsights: {
            // Handle both old and new format
            keyFindings:
              statisticsData.researchInsights?.enhancedFindings?.map(
                (finding: any) => ({
                  title: finding.title,
                  description: finding.description,
                  impact: finding.impact,
                  category: finding.category,
                  confidence: 85, // Default confidence
                  sampleSize: 1000, // Default sample size
                })
              ) ||
              statisticsData.researchInsights?.keyFindings?.map(
                (finding: string, index: number) => ({
                  title: `Finding ${index + 1}`,
                  description: finding,
                  impact: "Medium" as const,
                  category: "General",
                  confidence: 75,
                  sampleSize: 500,
                })
              ) ||
              [],
            recommendations:
              statisticsData.researchInsights?.enhancedRecommendations?.map(
                (rec: any) => ({
                  title: rec.title,
                  description: rec.description,
                  priority: rec.priority,
                  targetAudience: rec.targetAudience,
                  expectedImprovement: "10-15% improvement",
                  implementationComplexity: "Medium" as const,
                })
              ) ||
              statisticsData.researchInsights?.recommendations?.map(
                (rec: string, index: number) => ({
                  title: `Recommendation ${index + 1}`,
                  description: rec,
                  priority: "Medium" as const,
                  targetAudience: "All Users",
                  expectedImprovement: "5-10% improvement",
                  implementationComplexity: "Medium" as const,
                })
              ) ||
              [],
            statisticalSignificance:
              statisticsData.researchInsights?.statisticalSignificance || [],
            behavioralPatterns:
              statisticsData.researchInsights?.behavioralPatterns || [],
            predictiveModels:
              statisticsData.researchInsights?.predictiveModels || [],
            enhancedFindings:
              statisticsData.researchInsights?.enhancedFindings || [],
            enhancedRecommendations:
              statisticsData.researchInsights?.enhancedRecommendations || [],
          },
        };

        setData(transformedData);
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
      <DemographicsAnalysis data={data.demographicAnalysis} />
      <LearningPatterns data={data.learningPatterns} />

      <ResearchInsights data={data.researchInsights} />
    </div>
  );
}
