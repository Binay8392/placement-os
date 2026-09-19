import { DebuggingProblem } from "../../types";

export const BACKTRACKING_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-48",
    title: "Combination Sum Start Index Advance Duplication Bug",
    difficulty: "Medium",
    language: "python",
    category: "recursion",
    description:
      "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times. The code advances the start index to i + 1, accidentally preventing elements from being reused.",
    expectedBehavior:
      "Allow same element reuse by recursing on start index i; backtrack by popping last element.",
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct",
      "1 <= target <= 40",
    ],
    buggyCode: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    
    def backtrack(remain, start, path):
        if remain == 0:
            res.append(list(path))
            return
        if remain < 0:
            return
            
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # BUG: Passing i + 1 instead of i!
            # The problem states the same number can be used an UNLIMITED number of times!
            # Passing i + 1 forbids reusing candidates[i], missing combinations like [2, 2, 3] for target 7!
            backtrack(remain - candidates[i], i + 1, path)
            path.pop()
            
    backtrack(target, 0, [])
    return res`,
    solutionCode: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    
    def backtrack(remain, start, path):
        if remain == 0:
            res.append(list(path))
            return
        if remain < 0:
            return
            
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Recurse with start = i to allow unlimited reuse of the same element
            backtrack(remain - candidates[i], i, path)
            path.pop()
            
    backtrack(target, 0, [])
    return res`,
    hints: [
      "If candidates = [2, 3, 6, 7] and target = 7, [2, 2, 3] is a valid solution.",
      "To allow reusing `candidates[i]`, pass `start = i` into the recursive backtrack call instead of `i + 1`.",
    ],
    tags: ["Array", "Backtracking", "Recursion", "LeetCode Medium"],
    timeComplexity: "O(2^target)",
    spaceComplexity: "O(target / min_candidate)",
    aiPromptTemplate: `Task: Solve LeetCode 39: Combination Sum in Python.
Explain:
1. Backtracking tree structure.
2. Why passing start=i allows unlimited reuse while preventing duplicate permutations like [2,3,2] and [3,2,2].
3. Base cases: remain == 0 and remain < 0.`,
    promptEngineeringTips: [
      "Ask the model: 'How does maintaining a start index i guarantee that permutations of the same combination are not generated?'",
    ],
    publicTests: [
      {
        id: "tc-med-48-1",
        input: "candidates = [2,3,6,7], target = 7",
        expectedOutput: "[[2,2,3],[7]]",
      },
      {
        id: "tc-med-48-2",
        input: "candidates = [2,3,5], target = 8",
        expectedOutput: "[[2,2,2,2],[2,3,3],[3,5]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-49",
    title: "Permutations Backtracking State Restoration Omission",
    difficulty: "Medium",
    language: "java",
    category: "recursion",
    description:
      "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order. The code below forgets to unmark the boolean visited array during the backtracking unwinding step, causing paths to exhaust available numbers prematurely.",
    expectedBehavior:
      "For each unused element, mark used[i] = true, recurse, then reset used[i] = false during unwinding in O(n * n!) time.",
    constraints: [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of nums are unique",
    ],
    buggyCode: `import java.util.*;

public class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used, new ArrayList<>(), res);
        return res;
    }
    
    private void backtrack(int[] nums, boolean[] used, List<Integer> curr, List<List<Integer>> res) {
        if (curr.size() == nums.length) {
            res.add(new ArrayList<>(curr));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                curr.add(nums[i]);
                backtrack(nums, used, curr, res);
                curr.remove(curr.size() - 1);
                // BUG: Forgot to reset used[i] = false!
                // During backtracking unwinding, used[i] remains true, permanently locking out that number!
            }
        }
    }
}`,
    solutionCode: `import java.util.*;

public class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used, new ArrayList<>(), res);
        return res;
    }
    
    private void backtrack(int[] nums, boolean[] used, List<Integer> curr, List<List<Integer>> res) {
        if (curr.size() == nums.length) {
            res.add(new ArrayList<>(curr));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                curr.add(nums[i]);
                backtrack(nums, used, curr, res);
                curr.remove(curr.size() - 1);
                used[i] = false; // Properly restore state
            }
        }
    }
}`,
    hints: [
      "Backtracking requires restoring the state of all data structures when returning from recursion.",
      "Remember to add `used[i] = false;` right after `curr.remove(curr.size() - 1);`.",
    ],
    tags: ["Array", "Backtracking", "Recursion", "LeetCode Medium"],
    timeComplexity: "O(n * n!)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Implement LeetCode 46: Permutations in Java.
Provide:
1. Used boolean array approach.
2. In-place swapping approach.
3. Analyze why total number of leaves in the decision tree is N!.`,
    promptEngineeringTips: [
      "Direct the prompt to highlight state cleanup in backtracking.",
    ],
    publicTests: [
      {
        id: "tc-med-49-1",
        input: "nums = [1,2,3]",
        expectedOutput: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      },
      {
        id: "tc-med-49-2",
        input: "nums = [0,1]",
        expectedOutput: "[[0,1],[1,0]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-50",
    title: "Subsets II Duplicate Elements Tree Pruning Condition",
    difficulty: "Medium",
    language: "python",
    category: "recursion",
    description:
      "Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets. In the solution below, duplicate skips check i > 0 instead of i > start, pruning distinct occurrences across deeper recursion depths.",
    expectedBehavior:
      "Sort array; skip duplicates at the same tree depth with `if i > start and nums[i] == nums[i - 1]: continue` in O(n * 2^n) time.",
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
    ],
    buggyCode: `def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    
    def backtrack(start, path):
        res.append(list(path))
        
        for i in range(start, len(nums)):
            # BUG: i > 0 instead of i > start!
            # If nums = [1, 2, 2], when i = 2 (the second 2) is evaluated as a child of the first 2,
            # i > 0 is True, so it skips the second 2 completely and fails to generate subset [1, 2, 2]!
            if i > 0 and nums[i] == nums[i - 1]:
                continue
                
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
            
    backtrack(0, [])
    return res`,
    solutionCode: `def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    
    def backtrack(start, path):
        res.append(list(path))
        
        for i in range(start, len(nums)):
            # Skip duplicates at the SAME decision level (i > start)
            if i > start and nums[i] == nums[i - 1]:
                continue
                
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
            
    backtrack(0, [])
    return res`,
    hints: [
      "At the same level of the recursion tree, duplicates must be skipped.",
      "Across different levels (vertical parent-child branch), identical elements are allowed.",
      "The correct condition is `if i > start and nums[i] == nums[i - 1]: continue`.",
    ],
    tags: ["Array", "Backtracking", "Bit Manipulation", "LeetCode Medium"],
    timeComplexity: "O(n * 2^n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 90: Subsets II in Python.
Explain:
1. The difference between 'i > 0' vs 'i > start' in backtracking duplicate pruning.
2. How sorting groups identical numbers.
3. Draw the decision tree for nums = [1, 2, 2].`,
    promptEngineeringTips: [
      "Ask the model: 'Why does i > start distinguish between horizontal sibling branches and vertical recursive steps?'",
    ],
    publicTests: [
      {
        id: "tc-med-50-1",
        input: "nums = [1,2,2]",
        expectedOutput: "[[],[1],[1,2],[1,2,2],[2],[2,2]]",
      },
      {
        id: "tc-med-50-2",
        input: "nums = [0]",
        expectedOutput: "[[],[0]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-51",
    title: "Letter Combinations of a Phone Number Empty Input Return",
    difficulty: "Medium",
    language: "cpp",
    category: "recursion",
    description:
      "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. The code initializes the result with an empty string, incorrectly returning [\"\"] instead of [] when digits is empty.",
    expectedBehavior:
      "Return empty vector if digits.empty(); otherwise run backtracking or BFS cartesian expansion in O(4^n * n) time.",
    constraints: [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9']",
    ],
    buggyCode: `#include <vector>
#include <string>
using namespace std;

vector<string> letterCombinations(string digits) {
    // BUG: Missing empty digits check!
    // Returning result initialized with "" will return an array of length 1 ([""])!
    // Expected output for empty input is []!
    vector<string> pad = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> result = {""};
    
    for (char d : digits) {
        vector<string> nextLevel;
        string letters = pad[d - '0'];
        for (const string& prefix : result) {
            for (char c : letters) {
                nextLevel.push_back(prefix + c);
            }
        }
        result = move(nextLevel);
    }
    return result;
}`,
    solutionCode: `#include <vector>
#include <string>
using namespace std;

vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    
    vector<string> pad = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> result = {""};
    
    for (char d : digits) {
        vector<string> nextLevel;
        string letters = pad[d - '0'];
        for (const string& prefix : result) {
            for (char c : letters) {
                nextLevel.push_back(prefix + c);
            }
        }
        result = move(nextLevel);
    }
    return result;
}`,
    hints: [
      "Check `if (digits.empty()) return {};` as the very first line.",
      "An empty string input should return an empty list of combinations.",
    ],
    tags: ["Hash Table", "String", "Backtracking", "LeetCode Medium"],
    timeComplexity: "O(4^n * n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Implement LeetCode 17: Letter Combinations of a Phone Number in C++.
Enforce:
- Handling of empty input digits = "" returning empty vector {}.
- Compare recursive backtracking vs iterative BFS cartesian product.`,
    promptEngineeringTips: [
      "Prompt the model: 'Ensure edge case of empty string input returns empty list, not list containing empty string.'",
    ],
    publicTests: [
      {
        id: "tc-med-51-1",
        input: 'digits = "23"',
        expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      },
      {
        id: "tc-med-51-2",
        input: 'digits = ""',
        expectedOutput: "[]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-52",
    title: "Generate Parentheses Close Count Guard Inversion",
    difficulty: "Medium",
    language: "python",
    category: "recursion",
    description:
      "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses. The code below allows adding closing parentheses whenever close < n instead of close < open, generating invalid expressions like ')('.",
    expectedBehavior:
      "Add '(' when open < n; add ')' only when close < open in O(4^n / sqrt(n)) Catalan time.",
    constraints: [
      "1 <= n <= 8",
    ],
    buggyCode: `def generate_parenthesis(n: int) -> list[str]:
    res = []
    
    def backtrack(open_count, close_count, curr):
        if len(curr) == 2 * n:
            res.append("".join(curr))
            return
            
        if open_count < n:
            curr.append("(")
            backtrack(open_count + 1, close_count, curr)
            curr.pop()
            
        # BUG: Condition close_count < n allows close_count > open_count!
        # This allows invalid prefixes like ")(" where close exceeds open!
        # A closing parenthesis can ONLY be added when close_count < open_count!
        if close_count < n:
            curr.append(")")
            backtrack(open_count, close_count + 1, curr)
            curr.pop()
            
    backtrack(0, 0, [])
    return res`,
    solutionCode: `def generate_parenthesis(n: int) -> list[str]:
    res = []
    
    def backtrack(open_count, close_count, curr):
        if len(curr) == 2 * n:
            res.append("".join(curr))
            return
            
        if open_count < n:
            curr.append("(")
            backtrack(open_count + 1, close_count, curr)
            curr.pop()
            
        # Can only add closing parenthesis if there is an unmatched open parenthesis
        if close_count < open_count:
            curr.append(")")
            backtrack(open_count, close_count + 1, curr)
            curr.pop()
            
    backtrack(0, 0, [])
    return res`,
    hints: [
      "A prefix of a valid parentheses string can NEVER have more closing parentheses than opening parentheses.",
      "Change `if close_count < n:` to `if close_count < open_count:`.",
    ],
    tags: ["String", "Dynamic Programming", "Backtracking", "LeetCode Medium"],
    timeComplexity: "O(4^n / sqrt(n)) (Catalan Number)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 22: Generate Parentheses in Python.
Requirements:
1. Explain the invariant of valid parentheses strings.
2. Clearly justify why close_count < open_count is mandatory.
3. State the Catalan number complexity formula.`,
    promptEngineeringTips: [
      "Ask the model: 'Explain the Catalan number recurrence relation for counting valid parentheses sequences.'",
    ],
    publicTests: [
      {
        id: "tc-med-52-1",
        input: "n = 3",
        expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]',
      },
      {
        id: "tc-med-52-2",
        input: "n = 1",
        expectedOutput: '["()"]',
      },
    ],
    hiddenTestCount: 3,
  },
];
