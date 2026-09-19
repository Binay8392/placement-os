export type Language = "cpp" | "java" | "python" | "javascript";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemCategory =
  | "syntax"
  | "logic"
  | "boundary"
  | "loop"
  | "array"
  | "string"
  | "recursion"
  | "data-structure"
  | "algorithm"
  | "runtime"
  | "linked-list"
  | "stack-queue"
  | "search-sort";

export type AssessmentMode = "practice" | "interview" | "assessment";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface DebuggingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  language: Language;
  category: ProblemCategory;
  description: string;
  buggyCode: string;
  expectedBehavior: string;
  constraints: string[];
  publicTests: TestCase[];
  hiddenTestCount?: number;
  hints: string[];
  tags: string[];
  solutionCode?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export type ExecutionStatus =
  | "ACCEPTED"
  | "PARTIAL"
  | "WRONG_ANSWER"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIMEOUT"
  | "MEMORY_ERROR";

export type SubmissionStatus = ExecutionStatus;

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  executionTimeMs: number;
  isHidden?: boolean;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  executionTimeMs: number;
  memoryKb?: number;
  passedTests: number;
  totalTests: number;
  testResults: TestCaseResult[];
}

export interface ProblemAttempt {
  problemId: string;
  code: string;
  language: Language;
  status: ExecutionStatus;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  submittedAt: string;
  hintsUsed: number;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentTitle: string;
  mode: AssessmentMode;
  score: number; // 0 - 100
  totalProblems: number;
  passedProblems: number;
  accuracy: number; // percentage
  durationSeconds: number;
  timeRemainingSeconds: number;
  createdAt: string;
  completedAt: string;
  problemAttempts: Record<string, ProblemAttempt>;
  weakTopics: string[];
  strongTopics: string[];
  aiFeedback?: {
    strongestArea: string;
    mainWeakness: string;
    nextRecommendation: string;
    debuggingSkill: number; // 0-100
    algorithmSkill: number; // 0-100
    edgeCaseSkill: number; // 0-100
  };
}

export type AICoachAction =
  | "hint"
  | "explain"
  | "debug"
  | "review"
  | "optimize"
  | "generate"
  | "testcases"
  | "complexity";

export interface AICoachRequest {
  action: AICoachAction;
  problem: DebuggingProblem;
  code: string;
  language: Language;
  mode: AssessmentMode;
  hintLevel?: number; // 1, 2, or 3
  compilerOutput?: string;
  failedTest?: TestCaseResult;
  userInstruction?: string;
}

export interface CodeReviewResult {
  correctness: "PASS" | "WARNING" | "FAIL";
  potentialBugs: string[];
  complexity: {
    time: string;
    space: string;
  };
  codeQuality: string;
  edgeCases: string[];
  recommendations: string[];
}

export interface AICoachResponse {
  action: AICoachAction;
  content: string;
  hintLevel?: number;
  reviewResult?: CodeReviewResult;
  generatedCode?: {
    code: string;
    explanation: string;
    complexity: {
      time: string;
      space: string;
    };
  };
}

export interface CodingStats {
  problemsSolved: number;
  debuggingAccuracy: number;
  averageScore: number;
  averageTimeSeconds: number;
  currentStreak: number;
  compileErrorRate: number;
  runtimeErrorRate: number;
  topicAccuracy: Record<string, number>;
}
