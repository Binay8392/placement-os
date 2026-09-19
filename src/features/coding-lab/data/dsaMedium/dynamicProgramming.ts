import { DebuggingProblem } from "../../types";

export const DYNAMIC_PROGRAMMING_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-32",
    title: "Coin Change Unreachable Sentinel Initialization Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "dynamic-programming",
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. In the solution below, INT_MAX is used for initialization without handling overflow on +1.",
    expectedBehavior:
      "Initialize DP array with amount + 1; update dp[i] = min(dp[i], 1 + dp[i - c]) in O(amount * n) time and O(amount) space.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    buggyCode: `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // BUG: Initializing with INT_MAX causes integer overflow (INT_MAX + 1 = INT_MIN)
    // when doing 1 + dp[i - c]!
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i - c >= 0) {
                // Integer overflow occurs here when dp[i - c] == INT_MAX!
                dp[i] = min(dp[i], 1 + dp[i - c]);
            }
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
    solutionCode: `#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Safe sentinel: amount + 1 (since maximum coins needed cannot exceed amount)
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i - c >= 0) {
                dp[i] = min(dp[i], 1 + dp[i - c]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    hints: [
      "If a subproblem is unreachable, adding 1 to `INT_MAX` overflows into negative numbers in 32-bit signed integers.",
      "The maximum possible answer is `amount` (using 1-value coins), so `amount + 1` is an ideal, overflow-safe sentinel value.",
    ],
    tags: ["Dynamic Programming", "Knapsack", "LeetCode Medium"],
    timeComplexity: "O(amount * len(coins))",
    spaceComplexity: "O(amount)",
    aiPromptTemplate: `Task: Implement LeetCode 322: Coin Change in C++.
Focus:
1. Explain unbounded knapsack bottom-up DP formulation.
2. Address integer overflow prevention when choosing sentinel infinity values.
3. Contrast with top-down memoization.`,
    promptEngineeringTips: [
      "Ask the model: 'Why is `amount + 1` chosen as infinity instead of `INT_MAX`?'",
    ],
    publicTests: [
      {
        id: "tc-med-32-1",
        input: "coins = [1,2,5], amount = 11",
        expectedOutput: "3",
        explanation: "11 = 5 + 5 + 1",
      },
      {
        id: "tc-med-32-2",
        input: "coins = [2], amount = 3",
        expectedOutput: "-1",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-33",
    title: "Longest Increasing Subsequence DP Base Invariant",
    difficulty: "Medium",
    language: "python",
    category: "dynamic-programming",
    description:
      "Given an integer array nums, return the length of the longest strictly increasing subsequence. The implementation initializes dp values to 0 instead of 1, failing to recognize that every single isolated element is a valid increasing subsequence of length 1.",
    expectedBehavior:
      "Compute LIS length via DP (O(n^2)) or Patience Sorting with binary search (O(n log n)).",
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4",
    ],
    buggyCode: `def length_of_lis(nums: list[int]) -> int:
    if not nums:
        return 0
        
    n = len(nums)
    # BUG: Initializing dp array to 0!
    # A single element subsequence has length 1.
    dp = [0] * n 
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
                
    return max(dp)`,
    solutionCode: `def length_of_lis(nums: list[int]) -> int:
    if not nums:
        return 0
        
    n = len(nums)
    dp = [1] * n
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
                
    return max(dp)`,
    hints: [
      "If nums is strictly decreasing like [5, 4, 3, 2, 1], what is the length of the longest increasing subsequence?",
      "The answer is 1, but initializing with 0 returns 0!",
    ],
    tags: ["Array", "Dynamic Programming", "Binary Search", "LeetCode Medium"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 300: Longest Increasing Subsequence in Python.
Compare:
1. O(n^2) Dynamic Programming solution.
2. O(n log n) Patience Sorting / Binary Search (bisect_left) solution.
3. Explicitly explain why dp[i] must be initialized to 1.`,
    promptEngineeringTips: [
      "Direct the prompt to demonstrate both the quadratic DP approach and the logarithmic tail-array patience sorting method.",
    ],
    publicTests: [
      {
        id: "tc-med-33-1",
        input: "nums = [10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
        explanation: "The longest increasing subsequence is [2,3,7,101], length 4.",
      },
      {
        id: "tc-med-33-2",
        input: "nums = [7,7,7,7,7,7,7]",
        expectedOutput: "1",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-34",
    title: "House Robber II Circular Array Single Element Edge Case",
    difficulty: "Medium",
    language: "java",
    category: "dynamic-programming",
    description:
      "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. The code decomposes into two linear House Robber runs [0..n-2] and [1..n-1], but crashes with ArrayIndexOutOfBoundsException on single-house arrays.",
    expectedBehavior:
      "Handle n == 1 base case; then return max(robLinear(nums[0..n-2]), robLinear(nums[1..n-1])) in O(n) time and O(1) space.",
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 1000",
    ],
    buggyCode: `public class Solution {
    public int rob(int[] nums) {
        // BUG: Missing n == 1 check!
        // For nums of length 1, nums[0] should be returned, but slicing [0..n-2] produces an empty or invalid range!
        int n = nums.length;
        
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }
    
    private int robLinear(int[] nums, int start, int end) {
        int prev1 = 0, prev2 = 0;
        for (int i = start; i <= end; i++) {
            int temp = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = temp;
        }
        return prev1;
    }
}`,
    solutionCode: `public class Solution {
    public int rob(int[] nums) {
        if (nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];
        
        int n = nums.length;
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }
    
    private int robLinear(int[] nums, int start, int end) {
        int prev1 = 0, prev2 = 0;
        for (int i = start; i <= end; i++) {
            int temp = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = temp;
        }
        return prev1;
    }
}`,
    hints: [
      "When `nums.length == 1`, `n - 2 == -1`, so `start=0, end=-1` yields 0 instead of `nums[0]`.",
      "Add `if (nums.length == 1) return nums[0];` before invoking the circular decomposition.",
    ],
    tags: ["Array", "Dynamic Programming", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 213: House Robber II in Java.
Enforce:
- Breaking the circular dependency into two linear subproblems.
- O(1) space optimization for linear robber using two accumulator variables.
- Explicit guarding of single-house edge case.`,
    promptEngineeringTips: [
      "Prompt the model: 'Explain why circular adjacency means house 0 and house n-1 cannot be robbed together.'",
    ],
    publicTests: [
      {
        id: "tc-med-34-1",
        input: "nums = [2,3,2]",
        expectedOutput: "3",
      },
      {
        id: "tc-med-34-2",
        input: "nums = [1,2,3,1]",
        expectedOutput: "4",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-35",
    title: "Word Break 1D DP Substring Slicing End Index",
    difficulty: "Medium",
    language: "python",
    category: "dynamic-programming",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. The implementation below contains an off-by-one error in string slicing s[j:i] and DP array sizing.",
    expectedBehavior:
      "Use 1D boolean DP where dp[i] indicates whether s[0:i] can be segmented in O(n^2 * m) time.",
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters",
    ],
    buggyCode: `def word_break(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    
    # BUG: Array sized to n instead of n + 1!
    # dp[0] cannot represent the empty string prefix if sized to n!
    dp = [False] * n
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            # Out of bounds when i == n
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
                
    return dp[n - 1]`,
    solutionCode: `def word_break(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    
    dp = [False] * (n + 1)
    dp[0] = True  # Empty prefix is always valid
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
                
    return dp[n]`,
    hints: [
      "dp[i] represents whether prefix s[0:i] can be formed by words.",
      "The length of prefixes ranges from 0 to n, which requires an array of size `n + 1`.",
    ],
    tags: ["String", "Dynamic Programming", "Hash Table", "Trie", "LeetCode Medium"],
    timeComplexity: "O(n^2 * k)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 139: Word Break in Python.
Requirements:
1. Define state dp[i] as: can s[0..i] be segmented into dictionary words?
2. Explain the base case dp[0] = True.
3. Optimize dictionary lookup with set / max word length pruning.`,
    promptEngineeringTips: [
      "Instruct the model: 'Prune the inner loop so j only goes back as far as the maximum word length in wordDict.'",
    ],
    publicTests: [
      {
        id: "tc-med-35-1",
        input: 's = "leetcode", wordDict = ["leet","code"]',
        expectedOutput: "true",
      },
      {
        id: "tc-med-35-2",
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        expectedOutput: "true",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-36",
    title: "Unique Paths 2D Grid DP Boundary Overwrite",
    difficulty: "Medium",
    language: "cpp",
    category: "dynamic-programming",
    description:
      "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. Return the number of possible unique paths. The implementation below starts both row and column loops from 0, overwriting boundary base cases.",
    expectedBehavior:
      "dp[i][j] = dp[i-1][j] + dp[i][j-1] with first row and column initialized to 1 in O(m * n) time and O(n) space.",
    constraints: [
      "1 <= m, n <= 100",
    ],
    buggyCode: `#include <vector>
using namespace std;

int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    
    // BUG: Starting from i = 0 and j = 0 causes out-of-bounds access
    // or overwriting row 0 / col 0 cells which should strictly stay 1!
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
    solutionCode: `#include <vector>
using namespace std;

int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}`,
    hints: [
      "There is only 1 way to reach any cell in the first row (keep going right) and the first column (keep going down).",
      "Start row and column iterations from index 1, or compress to a 1D vector of size n.",
    ],
    tags: ["Math", "Dynamic Programming", "Combinatorics", "LeetCode Medium"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Write LeetCode 62: Unique Paths in C++.
Provide:
1. 2D DP formulation.
2. Space-optimized 1D rolling array formulation (O(n) space).
3. Combinatorial formula (m+n-2 choose m-1).`,
    promptEngineeringTips: [
      "Ask the model: 'How can you transition the 2D matrix DP into a single 1D array of size n?'",
    ],
    publicTests: [
      {
        id: "tc-med-36-1",
        input: "m = 3, n = 7",
        expectedOutput: "28",
      },
      {
        id: "tc-med-36-2",
        input: "m = 3, n = 2",
        expectedOutput: "3",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-37",
    title: "Partition Equal Subset Sum 0/1 Knapsack Forward Loop Reuse",
    difficulty: "Medium",
    language: "python",
    category: "dynamic-programming",
    description:
      "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal. The 1D DP code iterates forward through capacity, reusing the same element multiple times (unbounded knapsack instead of 0/1 knapsack).",
    expectedBehavior:
      "Check total sum is even; target = total / 2; iterate capacity backward from target down to num in O(n * sum) time.",
    constraints: [
      "1 <= nums.length <= 200",
      "1 <= nums[i] <= 100",
    ],
    buggyCode: `def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
        
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # BUG: Forward iteration (num to target + 1)!
        # Iterating forward reuses the current 'num' multiple times in the same step,
        # treating this as Unbounded Knapsack rather than 0/1 Knapsack!
        for i in range(num, target + 1):
            if dp[i - num]:
                dp[i] = True
                
    return dp[target]`,
    solutionCode: `def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
        
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # Backward iteration guarantees each element is used at most once
        for i in range(target, num - 1, -1):
            if dp[i - num]:
                dp[i] = True
                
    return dp[target]`,
    hints: [
      "If you iterate forward, dp[i - num] might have been set to True using the current num in this very same outer iteration!",
      "Iterating backward from `target` down to `num` ensures you only read state from previous elements.",
    ],
    tags: ["Array", "Dynamic Programming", "LeetCode Medium"],
    timeComplexity: "O(n * sum)",
    spaceComplexity: "O(sum)",
    aiPromptTemplate: `Task: Implement LeetCode 416: Partition Equal Subset Sum in Python.
Requirements:
1. Explain reduction to the 0/1 Knapsack subset sum problem.
2. Clearly prove why backward iteration is strictly required when compressing 2D DP to 1D DP.`,
    promptEngineeringTips: [
      "Ask the model: 'What goes wrong if we iterate forward in 1D array 0/1 knapsack?'",
    ],
    publicTests: [
      {
        id: "tc-med-37-1",
        input: "nums = [1,5,11,5]",
        expectedOutput: "true",
        explanation: "The array can be partitioned as [1, 5, 5] and [11].",
      },
      {
        id: "tc-med-37-2",
        input: "nums = [1,2,3,5]",
        expectedOutput: "false",
      },
    ],
    hiddenTestCount: 3,
  },
];
