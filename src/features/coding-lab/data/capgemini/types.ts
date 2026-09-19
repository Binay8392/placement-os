import { Language, TestCase } from "../../types";

export type CapgeminiCategory =
  | "fundamentals"
  | "cpp"
  | "java-oop"
  | "python"
  | "dsa"
  | "dbms-sql"
  | "os"
  | "networks"
  | "co"
  | "se-web"
  | "ai-genai";

export type CapgeminiQuestionType =
  | "mcq"
  | "output-prediction"
  | "debugging"
  | "coding"
  | "sql"
  | "scenario";

export interface CapgeminiOption {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface CapgeminiCodingDetails {
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  expectedApproach: string;
  expectedComplexity: {
    time: string;
    space: string;
  };
  publicTests: TestCase[];
  starterCode?: Partial<Record<Language, string>>;
}

export interface CapgeminiQuestion {
  id: string;
  category: CapgeminiCategory;
  categoryLabel: string;
  topic: string;
  subtopic?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: CapgeminiQuestionType;
  title: string;
  question: string;
  codeSnippet?: string;
  language?: Language;
  options?: CapgeminiOption[];
  correctAnswer: string; // Option id or exact string / query
  explanation: {
    correctReason: string;
    concept: string;
    takeaway: string;
    wrongOptionsAnalysis?: string;
  };
  codingDetails?: CapgeminiCodingDetails;
  tags: string[];
  estimatedTimeMinutes: number;
}
