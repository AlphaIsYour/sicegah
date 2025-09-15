/* eslint-disable @typescript-eslint/no-explicit-any */
// types/api.ts - Type definitions untuk API responses

export interface TestResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string | null;
    timeLimit: number | null;
    passingScore: number;
    maxAttempts: number;
    video: {
      id: string;
      title: string;
      description: string | null;
      thumbnailUrl: string | null;
    };
    questions: {
      id: string;
      questionText: string;
      type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY";
      options: any;
      points: number;
      order: number;
      imageUrl: string | null;
    }[];
  };
}

export interface TestAttemptResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    testId: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number | null;
    isPassed: boolean;
    isCompleted: boolean;
    startedAt: Date;
    completedAt: Date | null;
    timeSpent: number | null;
  };
  message?: string;
}

export interface UserAnswerResponse {
  success: boolean;
  data: {
    userAnswer: {
      id: string;
      answer: string;
      isCorrect: boolean;
      points: number;
      answeredAt: Date;
    };
    isCorrect: boolean;
    points: number;
    explanation: string | null;
  };
}

export interface TestCompletionResponse {
  success: boolean;
  data: {
    attempt: any; // Full attempt data with relations
    summary: {
      score: number;
      isPassed: boolean;
      totalQuestions: number;
      correctAnswers: number;
      totalPointsEarned: number;
      totalMaxPoints: number;
      timeSpent: number;
      passingScore: number;
    };
  };
}
