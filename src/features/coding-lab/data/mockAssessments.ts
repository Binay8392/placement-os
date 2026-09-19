import { DebuggingProblem } from "../types";
import { PROBLEM_BANK } from "./problemBank";

export interface MockAssessmentPreset {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  totalQuestions: number;
  description: string;
  instructions: string[];
  rules: string[];
  problemIds: string[];
}

export const MOCK_ASSESSMENTS: MockAssessmentPreset[] = [
  {
    id: "preptrack-debugging-mock-01",
    title: "PrepTrack Technical Debugging Mock",
    subtitle: "Enterprise Technical Assessment Simulation",
    durationMinutes: 30,
    difficulty: "Mixed",
    totalQuestions: 5,
    description:
      "A timed 30-minute debugging assessment simulating standard industry placement tests (such as Capgemini and multinational technical rounds). Solve 5 buggy code scenarios across logic, boundaries, arrays, and algorithms.",
    instructions: [
      "You have 30 minutes to complete 5 debugging problems.",
      "You can switch between questions at any time using the Question Navigator on the left.",
      "Each problem contains pre-written code with one or more syntax, logical, or boundary bugs.",
      "Run your code against public test cases before submitting.",
      "When you click Submit, your solution will be validated against both public and hidden test cases.",
      "AI assistance is disabled during Assessment Mode to simulate realistic exam conditions.",
      "The assessment will auto-submit when the countdown timer reaches 00:00.",
    ],
    rules: [
      "Do not refresh or close your browser tab (your timer and drafted code will persist if an accidental refresh occurs).",
      "All submissions are evaluated based on correctness, execution time, and memory limits.",
      "A passing grade requires at least 70% accuracy across all test suites.",
    ],
    problemIds: [
      "debug-cpp-01", // Binary Search Boundary
      "debug-py-02",  // Two Sum Hash Map
      "debug-js-03",  // Palindrome Sanitization
      "debug-java-04", // Bracket Sequence Underflow
      "debug-cpp-09", // Maximum Subarray Negative
    ],
  },
  {
    id: "preptrack-quick-drill",
    title: "Rapid Syntax & Logic Drill",
    subtitle: "15-Minute Fast-Paced Warmup",
    durationMinutes: 15,
    difficulty: "Easy",
    totalQuestions: 3,
    description:
      "A quick 15-minute warmup focusing on rapid bug identification, off-by-one errors, and type coercion issues.",
    instructions: [
      "15 minutes to solve 3 core problems.",
      "Fast turnarounds with instant public test verification.",
    ],
    rules: ["Practice under realistic time pressure."],
    problemIds: ["debug-py-05", "debug-js-07", "debug-py-10"],
  },
  {
    id: "capgemini-technical-mock",
    title: "Capgemini Technical Assessment Simulation",
    subtitle: "Enterprise Recruitment Diagnostic Mock",
    durationMinutes: 45,
    difficulty: "Mixed",
    totalQuestions: 5,
    description:
      "A timed 45-minute enterprise assessment simulation modeled on Capgemini's technical test patterns. Covers multi-language debugging, algorithmic edge cases, and boundary correctness.",
    instructions: [
      "You have 45 minutes to diagnose and resolve 5 technical coding problems.",
      "Each problem contains pre-written code with logical or boundary bugs.",
      "Evaluate against public test cases, then submit for server-side evaluation.",
      "AI Coach is locked during this assessment to emulate actual exam conditions.",
    ],
    rules: [
      "Full-screen focus recommended.",
      "All submissions are auto-scored against hidden test cases upon final submission.",
      "A passing grade requires at least 75% test suite coverage.",
    ],
    problemIds: ["debug-cpp-01", "debug-py-02", "debug-java-04", "debug-cpp-06", "debug-java-08"],
  },
];

export function getMockAssessment(id: string): { preset: MockAssessmentPreset; problems: DebuggingProblem[] } | null {
  const preset = MOCK_ASSESSMENTS.find((m) => m.id === id) || MOCK_ASSESSMENTS[0];
  if (!preset) return null;
  const problems = preset.problemIds
    .map((pid) => PROBLEM_BANK.find((p) => p.id === pid))
    .filter((p): p is DebuggingProblem => Boolean(p));

  return { preset, problems };
}
