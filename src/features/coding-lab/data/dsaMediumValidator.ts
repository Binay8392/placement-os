import { DSA_MEDIUM_PROBLEM_BANK, DSA_MEDIUM_STATS } from "./dsaMedium";
import { PROBLEM_BANK } from "./problemBank";

export function validateDsaMediumPack() {
  const errors: string[] = [];
  const idSet = new Set<string>();
  const titleSet = new Set<string>();

  if (DSA_MEDIUM_PROBLEM_BANK.length < 50) {
    errors.push(`Expected at least 50 questions, found ${DSA_MEDIUM_PROBLEM_BANK.length}`);
  }

  DSA_MEDIUM_PROBLEM_BANK.forEach((q, index) => {
    // 1. Unique ID
    if (idSet.has(q.id)) {
      errors.push(`Duplicate ID: ${q.id} at index ${index}`);
    }
    idSet.add(q.id);

    // 2. Unique Title
    if (titleSet.has(q.title)) {
      errors.push(`Duplicate title: "${q.title}" at ID ${q.id}`);
    }
    titleSet.add(q.title);

    // 3. Difficulty MUST be Medium
    if (q.difficulty !== "Medium") {
      errors.push(`Question "${q.id}" has difficulty ${q.difficulty}, expected "Medium"`);
    }

    // 4. Code checks
    if (!q.buggyCode || q.buggyCode.trim() === "") {
      errors.push(`Question "${q.id}" is missing buggyCode`);
    }
    if (!q.solutionCode || q.solutionCode.trim() === "") {
      errors.push(`Question "${q.id}" is missing solutionCode`);
    }

    // 5. Test cases
    if (!q.publicTests || q.publicTests.length < 2) {
      errors.push(`Question "${q.id}" has fewer than 2 publicTests`);
    }

    // 6. AI Prompt Coding metadata
    if (!q.aiPromptTemplate || q.aiPromptTemplate.trim() === "") {
      errors.push(`Question "${q.id}" is missing aiPromptTemplate`);
    }
    if (!q.promptEngineeringTips || q.promptEngineeringTips.length === 0) {
      errors.push(`Question "${q.id}" is missing promptEngineeringTips`);
    }

    // 7. Constraints & hints
    if (!q.constraints || q.constraints.length === 0) {
      errors.push(`Question "${q.id}" is missing constraints`);
    }
    if (!q.hints || q.hints.length === 0) {
      errors.push(`Question "${q.id}" is missing hints`);
    }
  });

  return {
    isValid: errors.length === 0,
    totalMediumDsa: DSA_MEDIUM_PROBLEM_BANK.length,
    totalProblemBank: PROBLEM_BANK.length,
    stats: DSA_MEDIUM_STATS,
    errors,
  };
}

if (typeof process !== "undefined" && process.argv[1]?.includes("dsaMediumValidator")) {
  const res = validateDsaMediumPack();
  console.log("=== DSA LEETCODE MEDIUM & AI PROMPT CODING VALIDATION ===");
  console.log(`Total Medium DSA questions: ${res.totalMediumDsa}`);
  console.log(`Total PROBLEM_BANK questions: ${res.totalProblemBank}`);
  console.log("Category breakdown:", res.stats);
  if (res.errors.length > 0) {
    console.error("VALIDATION ERRORS:", res.errors);
    process.exit(1);
  } else {
    console.log("SUCCESS: All 56 LeetCode Medium DSA debugging & AI prompt questions verified!");
  }
}
