import React from "react";
import {
  ChartLineUp,
  Target,
  Info,
  Warning,
  CheckCircle,
  XCircle,
  Download,
  TrendUp,
  Brain,
  Users,
  Clock,
} from "@phosphor-icons/react";

interface ResearchInsightsData {
  keyFindings?: Array<{
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    category: string;
    confidence?: number; // 0-100
    sampleSize?: number;
  }>;

  recommendations?: Array<{
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    targetAudience: string;
    expectedImprovement?: string;
    implementationComplexity?: "Easy" | "Medium" | "Hard";
  }>;

  statisticalSignificance?: Array<{
    hypothesis: string;
    pValue: number;
    confidenceInterval: string;
    significant: boolean;
    effectSize?: number;
    sampleSize?: number;
  }>;

  // Enhanced insights
  behavioralPatterns?: Array<{
    pattern: string;
    description: string;
    frequency: number; // percentage
    correlation?: number;
  }>;

  predictiveModels?: Array<{
    model: string;
    accuracy: number;
    variables: string[];
    prediction: string;
  }>;
}

interface ResearchInsightsProps {
  data: ResearchInsightsData;
}

export default function ResearchInsights({ data }: ResearchInsightsProps) {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "easy":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "hard":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const exportInsights = () => {
    const sections = [];

    // Key Findings
    if (data.keyFindings) {
      sections.push(["KEY FINDINGS"]);
      sections.push([
        "Title",
        "Description",
        "Impact",
        "Category",
        "Confidence (%)",
        "Sample Size",
      ]);
      data.keyFindings.forEach((finding) => {
        sections.push([
          finding.title,
          finding.description,
          finding.impact,
          finding.category,
          (finding.confidence || 0).toString(),
          (finding.sampleSize || 0).toString(),
        ]);
      });
      sections.push([""]); // Empty row
    }

    // Recommendations
    if (data.recommendations) {
      sections.push(["RECOMMENDATIONS"]);
      sections.push([
        "Title",
        "Description",
        "Priority",
        "Target Audience",
        "Expected Improvement",
        "Complexity",
      ]);
      data.recommendations.forEach((rec) => {
        sections.push([
          rec.title,
          rec.description,
          rec.priority,
          rec.targetAudience,
          rec.expectedImprovement || "N/A",
          rec.implementationComplexity || "N/A",
        ]);
      });
      sections.push([""]); // Empty row
    }

    // Statistical Significance
    if (data.statisticalSignificance) {
      sections.push(["STATISTICAL SIGNIFICANCE"]);
      sections.push([
        "Hypothesis",
        "P-Value",
        "Confidence Interval",
        "Significant",
        "Effect Size",
        "Sample Size",
      ]);
      data.statisticalSignificance.forEach((stat) => {
        sections.push([
          stat.hypothesis,
          stat.pValue.toString(),
          stat.confidenceInterval,
          stat.significant.toString(),
          (stat.effectSize || 0).toString(),
          (stat.sampleSize || 0).toString(),
        ]);
      });
    }

    const csv = sections
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `research_insights_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Research Insights & Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Data-driven findings and evidence-based recommendations
          </p>
        </div>

        <button
          onClick={exportInsights}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Download size={16} className="mr-2" />
          Export All Insights
        </button>
      </div>

      {/* Key Findings & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Key Findings */}
        {data.keyFindings && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Info size={20} className="mr-2 text-blue-600" />
              Key Research Findings
            </h3>

            <div className="space-y-4">
              {data.keyFindings
                .sort((a, b) => {
                  const impactOrder = { High: 3, Medium: 2, Low: 1 };
                  return impactOrder[b.impact] - impactOrder[a.impact];
                })
                .map((finding, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg ${getImpactColor(
                      finding.impact
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white pr-2">
                        {finding.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                            finding.impact
                          )}`}
                        >
                          {finding.impact} Impact
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {finding.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                        {finding.category}
                      </span>
                      <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                        {finding.confidence && (
                          <span>Confidence: {finding.confidence}%</span>
                        )}
                        {finding.sampleSize && (
                          <span>n = {finding.sampleSize.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Enhanced Recommendations */}
        {data.recommendations && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target size={20} className="mr-2 text-green-600" />
              Actionable Recommendations
            </h3>

            <div className="space-y-4">
              {data.recommendations
                .sort((a, b) => {
                  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white pr-2">
                        {rec.title}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                        Target: {rec.targetAudience}
                      </span>
                      <div className="flex items-center space-x-3">
                        {rec.expectedImprovement && (
                          <span className="text-blue-600 dark:text-blue-400">
                            <TrendUp size={12} className="inline mr-1" />
                            {rec.expectedImprovement}
                          </span>
                        )}
                        {rec.implementationComplexity && (
                          <span
                            className={getComplexityColor(
                              rec.implementationComplexity
                            )}
                          >
                            {rec.implementationComplexity} to implement
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistical Significance Testing */}
      {data.statisticalSignificance && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartLineUp size={20} className="mr-2 text-purple-600" />
            Statistical Significance Testing
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Hypothesis
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    P-Value
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Confidence Interval
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Effect Size
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Sample Size
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.statisticalSignificance.map((stat, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white max-w-xs">
                      {stat.hypothesis}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-bold ${
                          stat.pValue < 0.05 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.pValue.toFixed(4)}
                      </span>
                      {stat.pValue < 0.001 && (
                        <div className="text-xs text-green-600">***</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      {stat.confidenceInterval}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {stat.effectSize ? (
                        <span
                          className={`font-medium ${
                            Math.abs(stat.effectSize) > 0.8
                              ? "text-red-600"
                              : Math.abs(stat.effectSize) > 0.5
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {stat.effectSize.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                      {stat.sampleSize
                        ? stat.sampleSize.toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          stat.significant
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {stat.significant ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                            Significant
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="mr-1" />
                            Not Significant
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistical Summary */}
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">
              Statistical Summary:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800 dark:text-purple-300">
              <div>
                <strong>Significant Results:</strong>{" "}
                {
                  data.statisticalSignificance.filter((s) => s.significant)
                    .length
                }{" "}
                / {data.statisticalSignificance.length}
              </div>
              <div>
                <strong>Average P-value:</strong>{" "}
                {(
                  data.statisticalSignificance.reduce(
                    (sum, s) => sum + s.pValue,
                    0
                  ) / data.statisticalSignificance.length
                ).toFixed(4)}
              </div>
              <div>
                <strong>Strong Effects:</strong>{" "}
                {
                  data.statisticalSignificance.filter(
                    (s) => s.effectSize && Math.abs(s.effectSize) > 0.8
                  ).length
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavioral Patterns */}
      {data.behavioralPatterns && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Brain size={20} className="mr-2 text-indigo-600" />
            Identified Behavioral Patterns
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.behavioralPatterns
              .sort((a, b) => b.frequency - a.frequency)
              .map((pattern, index) => (
                <div
                  key={index}
                  className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-indigo-900 dark:text-indigo-200">
                      {pattern.pattern}
                    </h4>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {pattern.frequency.toFixed(1)}%
                    </span>
                  </div>

                  <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-3">
                    {pattern.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="w-full bg-indigo-200 dark:bg-indigo-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${pattern.frequency}%` }}
                      ></div>
                    </div>
                    {pattern.correlation && (
                      <span
                        className={`text-xs font-medium ${
                          Math.abs(pattern.correlation) > 0.5
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        r = {pattern.correlation.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Predictive Models */}
      {data.predictiveModels && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartLineUp size={20} className="mr-2 text-emerald-600" />
            Predictive Model Performance
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.predictiveModels.map((model, index) => (
              <div
                key={index}
                className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-emerald-900 dark:text-emerald-200">
                    {model.model}
                  </h4>
                  <div className="flex items-center">
                    <span
                      className={`text-lg font-bold ${
                        model.accuracy > 85
                          ? "text-green-600"
                          : model.accuracy > 75
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {model.accuracy.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">accuracy</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-emerald-200 dark:bg-emerald-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        model.accuracy > 85
                          ? "bg-green-500"
                          : model.accuracy > 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${model.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-emerald-900 dark:text-emerald-200">
                      Variables:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.variables.map((variable, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 rounded text-xs"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-emerald-900 dark:text-emerald-200">
                      Prediction:
                    </span>
                    <p className="text-emerald-800 dark:text-emerald-300 mt-1">
                      {model.prediction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Methodology & Notes */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
          <Warning size={20} className="mr-2" />
          Research Methodology & Considerations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3">
              Statistical Methods:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Chi-square tests for categorical variables
              </li>
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-green-600" />
                T-tests for continuous variables
              </li>
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Pearson correlation analysis
              </li>
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Multiple regression modeling
              </li>
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Machine learning prediction models
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3">
              Quality Assurance:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-center">
                <Users size={14} className="mr-2 text-blue-600" />
                Minimum sample sizes validated
              </li>
              <li className="flex items-center">
                <Target size={14} className="mr-2 text-blue-600" />
                95% confidence intervals reported
              </li>
              <li className="flex items-center">
                <Brain size={14} className="mr-2 text-blue-600" />
                Multiple hypothesis correction applied
              </li>
              <li className="flex items-center">
                <Clock size={14} className="mr-2 text-blue-600" />
                Time-series analysis for trends
              </li>
              <li className="flex items-center">
                <CheckCircle size={14} className="mr-2 text-blue-600" />
                Cross-validation for predictive models
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300 dark:border-blue-600">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Ethical Considerations:</strong> All analyses follow ethical
            research standards. Personal identifiable information is anonymized
            and aggregated. Results should be interpreted within the context of
            the specific learning platform, user demographics, and time period
            analyzed. Causation should not be inferred from correlation without
            additional experimental validation.
          </p>
        </div>
      </div>

      {/* No Data State */}
      {!data.keyFindings &&
        !data.recommendations &&
        !data.statisticalSignificance &&
        !data.behavioralPatterns &&
        !data.predictiveModels && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ChartLineUp size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No research insights available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Research insights and statistical analysis will appear here once
              sufficient data is collected
            </p>
          </div>
        )}
    </div>
  );
}
