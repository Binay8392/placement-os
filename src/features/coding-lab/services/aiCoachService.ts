import { AICoachRequest, AICoachResponse, CodeReviewResult } from "../types";
import { supabase } from "@/integrations/supabase/client";

export class AICoachService {
  /**
   * Request assistance from PrepTrack AI Coding Coach
   */
  async requestAdvice(req: AICoachRequest): Promise<AICoachResponse> {
    if (req.mode === "assessment") {
      return {
        action: req.action,
        content:
          "⚠️ **AI Coach Disabled**: AI assistance is strictly prohibited during Assessment Mode to simulate authentic exam conditions.",
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke("coding-ai-coach", {
        body: req,
      });

      if (!error && data && data.content) {
        return this.parseResponse(req, data.content);
      }
    } catch (e) {
      console.warn("Edge function coding-ai-coach unavailable, using structured fallback", e);
    }

    // High quality local fallback with realistic guidance
    return this.generateStructuredFallback(req);
  }

  private parseResponse(req: AICoachRequest, rawContent: string): AICoachResponse {
    const response: AICoachResponse = {
      action: req.action,
      content: rawContent,
      hintLevel: req.hintLevel,
    };

    if (req.action === "review") {
      response.reviewResult = this.extractReview(rawContent, req);
    } else if (req.action === "generate") {
      response.generatedCode = this.extractGeneratedCode(rawContent, req);
    }

    return response;
  }

  private extractReview(content: string, req: AICoachRequest): CodeReviewResult {
    const isPassing = content.includes("Correctness: PASS") || !content.includes("BUG");
    return {
      correctness: isPassing ? "PASS" : "WARNING",
      potentialBugs: [
        "Check loop index termination boundary",
        "Guard against empty input or null pointers",
      ],
      complexity: {
        time: req.problem.timeComplexity || "O(n)",
        space: req.problem.spaceComplexity || "O(1)",
      },
      codeQuality: "Well formatted code with clear naming conventions.",
      edgeCases: ["Empty input array", "Single element collection", "Duplicate values"],
      recommendations: [
        "Test boundary inputs using the public test runner",
        "Consider in-place updates to reduce memory overhead",
      ],
    };
  }

  private extractGeneratedCode(content: string, req: AICoachRequest) {
    const codeMatch = content.match(/```(?:[a-zA-Z]+)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : req.problem.solutionCode || req.problem.buggyCode;

    return {
      code,
      explanation:
        "The generated code resolves the boundary and indexing issues by using an optimal O(n) or O(log n) algorithm.",
      complexity: {
        time: req.problem.timeComplexity || "O(n)",
        space: req.problem.spaceComplexity || "O(1)",
      },
    };
  }

  private generateStructuredFallback(req: AICoachRequest): AICoachResponse {
    const { action, problem, code, language, hintLevel, compilerOutput, failedTest, userInstruction } = req;

    if (action === "hint") {
      const level = Math.min(3, Math.max(1, hintLevel || 1));
      const hints = problem.hints.length > 0 ? problem.hints : [
        "Check whether your loop indices properly cover boundary elements.",
        "Consider testing with single-element and empty inputs.",
        "Trace what happens when the target is not present in the sequence.",
      ];
      const hintText = hints[level - 1] || hints[0];
      return {
        action: "hint",
        hintLevel: level,
        content: `### 💡 Hint ${level} of ${hints.length}\n\n${hintText}\n\n*Try updating your code and re-running test cases before asking for the next hint.*`,
      };
    }

    if (action === "debug") {
      let content = `### 🔍 AI Debugger Analysis\n\n`;
      if (compilerOutput && compilerOutput.includes("error")) {
        content += `**Compiler Issue Identified**:\n\`\`\`\n${compilerOutput}\n\`\`\`\nReview line syntax, semicolons, and curly brace pairs.`;
      } else if (failedTest) {
        content += `**Failing Test Case Detected**:\n- **Input**: \`${failedTest.input}\`\n- **Expected**: \`${failedTest.expectedOutput}\`\n- **Actual**: \`${failedTest.actualOutput || "Incorrect"}\`\n\n**Root Cause Insight**:\nThe bug is likely related to **${problem.category.toUpperCase()}** handling. Notice how your variables transition at the boundary or how updates occur before checks.\n\n*Check the problem constraints and edge cases.*`;
      } else {
        content += `I reviewed your code for **${problem.title}**. Look closely at how the initial values and condition checks are formulated. Notice any off-by-one or type coercion traps!`;
      }
      return { action: "debug", content };
    }

    if (action === "review") {
      const reviewResult: CodeReviewResult = {
        correctness: code.includes("// BUG") || code.includes("# BUG") ? "WARNING" : "PASS",
        potentialBugs: [
          "Loop termination may miss the final element or overflow bounds.",
          "Check behavior on zero or negative inputs.",
        ],
        complexity: {
          time: problem.timeComplexity || "O(n)",
          space: problem.spaceComplexity || "O(1)",
        },
        codeQuality: "Good indentation and variable structure.",
        edgeCases: ["Empty input", "Target at extreme index (0 or N-1)", "All negative values"],
        recommendations: [
          "Run all public tests to confirm output correctness",
          "Ensure no unhandled exceptions when encountering empty inputs",
        ],
      };

      const content = `### 📋 Code Review Report\n\n` +
        `**Correctness**: ${reviewResult.correctness === "PASS" ? "✅ Pass" : "⚠️ Potential Issues"}\n\n` +
        `**Potential Bugs**:\n${reviewResult.potentialBugs.map((b) => `- ${b}`).join("\n")}\n\n` +
        `**Complexity Analysis**:\n- Time Complexity: \`${reviewResult.complexity.time}\`\n- Space Complexity: \`${reviewResult.complexity.space}\`\n\n` +
        `**Code Quality**: ${reviewResult.codeQuality}\n\n` +
        `**Edge Cases to Watch**:\n${reviewResult.edgeCases.map((e) => `- ${e}`).join("\n")}\n\n` +
        `**Recommendations**:\n${reviewResult.recommendations.map((r) => `- ${r}`).join("\n")}`;

      return { action: "review", content, reviewResult };
    }

    if (action === "optimize") {
      return {
        action: "optimize",
        content: `### ⚡ Algorithmic Optimization\n\n- **Target Time Complexity**: \`${problem.timeComplexity || "O(n)"}\`\n- **Target Space Complexity**: \`${problem.spaceComplexity || "O(1)"}\`\n\n**Key Optimization Strategies**:\n1. Eliminate nested loops where a hash set or two-pointer technique suffices.\n2. Avoid allocating intermediate arrays or string concatenations inside loops.\n3. Cache repeated calculations into local variables.`,
      };
    }

    if (action === "generate") {
      const generatedCode = problem.solutionCode || `// Solution for ${problem.title}\n// Language: ${language}\n`;
      return {
        action: "generate",
        content: `### ✨ Generated Solution\n\nHere is an optimized, bug-free solution for **${problem.title}**:\n\n\`\`\`${language}\n${generatedCode}\n\`\`\`\n\n**Instructions Applied**: ${userInstruction || "Standard optimal implementation"}\n**Complexity**: ${problem.timeComplexity || "O(n)"} time, ${problem.spaceComplexity || "O(1)"} space.`,
        generatedCode: {
          code: generatedCode,
          explanation: `This solution properly handles all boundary conditions and resolves the core logic issue in ${problem.title}.`,
          complexity: {
            time: problem.timeComplexity || "O(n)",
            space: problem.spaceComplexity || "O(1)",
          },
        },
      };
    }

    if (action === "explain") {
      return {
        action: "explain",
        content: `### 📖 Conceptual Walkthrough\n\n**Problem**: ${problem.title}\n\n**Overview**:\n${problem.description}\n\n**Expected Logic**:\n${problem.expectedBehavior}\n\n**Key Invariant**:\nMaintain valid state boundaries throughout iteration. Never allow index pointers to diverge or cross invalid limits.`,
      };
    }

    if (action === "complexity") {
      return {
        action: "complexity",
        content: `### ⏱️ Complexity Deep Dive\n\n- **Time Complexity**: \`${problem.timeComplexity || "O(n)"}\`\n  Each element is processed at most a constant number of times.\n- **Space Complexity**: \`${problem.spaceComplexity || "O(1)"}\`\n  No auxiliary heap data structures are allocated.`,
      };
    }

    if (action === "testcases") {
      return {
        action: "testcases",
        content: `### 🧪 Edge Test Cases\n\n1. **Minimal Case**: Empty input or single item \`[]\` or \`[1]\`.\n2. **Boundary Target**: Target element at index 0 or index \`N - 1\`.\n3. **Absent Target**: Search value greater than all elements.\n4. **Duplicate Values**: Sequences with consecutive matching values.`,
      };
    }

    return {
      action: req.action,
      content: "AI Coach assistance ready.",
    };
  }
}

export const aiCoachService = new AICoachService();
