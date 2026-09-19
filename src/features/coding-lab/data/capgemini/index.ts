import { CapgeminiQuestion, CapgeminiCategory } from "./types";
import { FUNDAMENTALS_QUESTIONS } from "./fundamentals";
import { CPP_QUESTIONS } from "./cpp";
import { JAVA_OOP_QUESTIONS } from "./javaOop";
import { PYTHON_QUESTIONS } from "./python";
import { DSA_QUESTIONS } from "./dsa";
import { DBMS_SQL_QUESTIONS } from "./dbmsSql";
import { CORE_CS_QUESTIONS } from "./coreCS";
import { AI_GENAI_QUESTIONS } from "./aiGenai";
import { DEBUGGING_EXTRA_QUESTIONS } from "./debuggingExtras";

export * from "./types";

export const CAPGEMINI_QUESTION_PACK: CapgeminiQuestion[] = [
  ...FUNDAMENTALS_QUESTIONS,
  ...CPP_QUESTIONS,
  ...JAVA_OOP_QUESTIONS,
  ...PYTHON_QUESTIONS,
  ...DSA_QUESTIONS,
  ...DBMS_SQL_QUESTIONS,
  ...CORE_CS_QUESTIONS,
  ...AI_GENAI_QUESTIONS,
  ...DEBUGGING_EXTRA_QUESTIONS,
];

export const CAPGEMINI_CATEGORIES: { id: CapgeminiCategory | "all"; label: string; count: number }[] = [
  { id: "all", label: "All Questions", count: CAPGEMINI_QUESTION_PACK.length },
  { id: "fundamentals", label: "Programming Fundamentals", count: FUNDAMENTALS_QUESTIONS.length },
  { id: "cpp", label: "C / C++", count: CPP_QUESTIONS.length + 1 },
  { id: "java-oop", label: "Java / OOP", count: JAVA_OOP_QUESTIONS.length },
  { id: "python", label: "Python", count: PYTHON_QUESTIONS.length },
  { id: "dsa", label: "Data Structures & Algorithms", count: DSA_QUESTIONS.length },
  { id: "dbms-sql", label: "DBMS & SQL", count: DBMS_SQL_QUESTIONS.length },
  { id: "os", label: "Operating Systems", count: 5 },
  { id: "networks", label: "Computer Networks", count: 4 },
  { id: "co", label: "Computer Organization", count: 3 },
  { id: "se-web", label: "Software Engineering & Web", count: 5 },
  { id: "ai-genai", label: "AI & GenAI", count: AI_GENAI_QUESTIONS.length },
];

export function getCapgeminiQuestionById(id: string): CapgeminiQuestion | undefined {
  return CAPGEMINI_QUESTION_PACK.find((q) => q.id === id);
}

export function getCapgeminiQuestionsByCategory(category: CapgeminiCategory): CapgeminiQuestion[] {
  return CAPGEMINI_QUESTION_PACK.filter((q) => q.category === category);
}

export const CAPGEMINI_PACK_STATS = {
  totalQuestions: CAPGEMINI_QUESTION_PACK.length,
  debuggingCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.type === "debugging").length,
  outputPredictionCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.type === "output-prediction").length,
  codingCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.type === "coding").length,
  sqlCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.type === "sql").length,
  mcqScenarioCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.type === "mcq" || q.type === "scenario").length,
  aiGenaiCount: CAPGEMINI_QUESTION_PACK.filter((q) => q.category === "ai-genai").length,
};
