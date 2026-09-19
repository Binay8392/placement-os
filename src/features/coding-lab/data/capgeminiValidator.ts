import { CAPGEMINI_QUESTION_PACK, CAPGEMINI_PACK_STATS } from "./capgemini";

export interface ValidationReport {
  isValid: boolean;
  totalQuestions: number;
  errors: string[];
  stats: typeof CAPGEMINI_PACK_STATS;
}

export function validateCapgeminiPack(): ValidationReport {
  const errors: string[] = [];
  const idSet = new Set<string>();
  const titleSet = new Set<string>();

  if (CAPGEMINI_QUESTION_PACK.length < 70) {
    errors.push(`Expected at least 70 questions, found ${CAPGEMINI_QUESTION_PACK.length}`);
  }

  CAPGEMINI_QUESTION_PACK.forEach((q, index) => {
    // 1. Check ID uniqueness
    if (idSet.has(q.id)) {
      errors.push(`Duplicate question ID detected: "${q.id}" at index ${index}`);
    }
    idSet.add(q.id);

    // 2. Check Title uniqueness
    if (titleSet.has(q.title)) {
      errors.push(`Duplicate question title detected: "${q.title}" at ID ${q.id}`);
    }
    titleSet.add(q.title);

    // 3. Check answer presence
    if (!q.correctAnswer || q.correctAnswer.trim() === "") {
      errors.push(`Question "${q.id}" is missing a correctAnswer`);
    }

    // 4. Check options validity for MCQ/options-based questions
    if (q.options) {
      if (q.options.length < 2) {
        errors.push(`Question "${q.id}" has fewer than 2 options`);
      }
      if (q.type === "mcq" || q.type === "output-prediction" || (q.type === "debugging" && q.options)) {
        const hasMatchingOption = q.options.some((opt) => opt.id === q.correctAnswer);
        if (!hasMatchingOption) {
          errors.push(`Question "${q.id}" correctAnswer "${q.correctAnswer}" does not match any option ID`);
        }
      }
    }

    // 5. Check explanation presence
    if (!q.explanation || !q.explanation.correctReason || !q.explanation.concept || !q.explanation.takeaway) {
      errors.push(`Question "${q.id}" is missing required explanation sections`);
    }

    // 6. Validate Coding details
    if (q.type === "coding") {
      if (!q.codingDetails) {
        errors.push(`Coding question "${q.id}" is missing codingDetails`);
      } else {
        if (!q.codingDetails.examples || q.codingDetails.examples.length === 0) {
          errors.push(`Coding question "${q.id}" is missing examples`);
        }
        if (!q.codingDetails.constraints || q.codingDetails.constraints.length === 0) {
          errors.push(`Coding question "${q.id}" is missing constraints`);
        }
        if (!q.codingDetails.publicTests || q.codingDetails.publicTests.length === 0) {
          errors.push(`Coding question "${q.id}" is missing publicTests`);
        }
      }
    }
  });

  // Verify specific counts
  if (CAPGEMINI_PACK_STATS.debuggingCount < 10) {
    errors.push(`Expected at least 10 debugging questions, found ${CAPGEMINI_PACK_STATS.debuggingCount}`);
  }
  if (CAPGEMINI_PACK_STATS.outputPredictionCount < 10) {
    errors.push(`Expected at least 10 output-prediction questions, found ${CAPGEMINI_PACK_STATS.outputPredictionCount}`);
  }
  if (CAPGEMINI_PACK_STATS.codingCount < 10) {
    errors.push(`Expected at least 10 coding questions, found ${CAPGEMINI_PACK_STATS.codingCount}`);
  }
  if (CAPGEMINI_PACK_STATS.aiGenaiCount < 7) {
    errors.push(`Expected at least 7 AI/GenAI questions, found ${CAPGEMINI_PACK_STATS.aiGenaiCount}`);
  }
  if (CAPGEMINI_PACK_STATS.sqlCount < 5) {
    errors.push(`Expected at least 5 SQL writing questions, found ${CAPGEMINI_PACK_STATS.sqlCount}`);
  }

  return {
    isValid: errors.length === 0,
    stats: CAPGEMINI_PACK_STATS,
    totalQuestions: CAPGEMINI_QUESTION_PACK.length,
    errors,
  };
}

// Auto-run if executed directly
if (typeof process !== "undefined" && process.argv[1]?.includes("capgeminiValidator")) {
  const result = validateCapgeminiPack();
  console.log("=== CAPGEMINI QUESTION PACK VALIDATION ===");
  console.log(`Total questions: ${result.totalQuestions}`);
  console.log(`Valid: ${result.isValid}`);
  console.log("Stats summary:", result.stats);
  console.log(`Debugging: ${result.stats.debuggingCount}`);
  console.log(`Output Prediction: ${result.stats.outputPredictionCount}`);
  console.log(`Coding: ${result.stats.codingCount}`);
  console.log(`SQL: ${result.stats.sqlCount}`);
  console.log(`AI/GenAI: ${result.stats.aiGenaiCount}`);
  if (result.errors.length > 0) {
    console.error("ERRORS:", result.errors);
    process.exit(1);
  } else {
    console.log("ALL CHECKS PASSED: 0 errors detected!");
  }
}

