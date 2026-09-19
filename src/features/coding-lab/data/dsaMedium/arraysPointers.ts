import { DebuggingProblem } from "../../types";

export const ARRAYS_POINTERS_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-01",
    title: "3Sum Zero Triplet Duplication Flaw",
    difficulty: "Medium",
    language: "python",
    category: "array",
    description:
      "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The provided implementation contains duplicate handling and two-pointer increment flaws that lead to duplicated triplets or skipped valid triples.",
    expectedBehavior:
      "Return all distinct triplets without any duplicate combinations in O(n^2) time and O(1) auxiliary space (excluding output).",
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    buggyCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    
    for i in range(len(nums) - 2):
        # BUG: Missing duplicate skip for anchor element nums[i]
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                # BUG: Only advancing left pointer once without skipping identical values
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
                
    return res`,
    solutionCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
                
    return res`,
    hints: [
      "Sorting the array first lets you reduce 3Sum to Two Pointers.",
      "If nums[i] == nums[i - 1] (for i > 0), skip it to avoid identical triplet anchors.",
      "After finding a valid triplet, increment left and decrement right while skipping duplicate values.",
    ],
    tags: ["Array", "Two Pointers", "Sorting", "LeetCode Medium", "AI Prompt Coding"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `You are an expert algorithms engineer.
Task: Implement the optimal LeetCode Medium 3Sum solution in Python.
Requirements:
1. Return all unique triplets summing to 0 without duplicates.
2. Time complexity MUST be O(n^2) using sorting and two pointers.
3. Explicitly demonstrate deduplication for both the outer anchor and inner two pointers.
4. Explain the invariant that guarantees no duplicates are appended.`,
    promptEngineeringTips: [
      "Explicitly specify: 'Do not use a Set to filter duplicates post-hoc; handle deduplication during two-pointer traversal.'",
      "Ask the model to state the loop invariants for left and right pointer movements.",
    ],
    publicTests: [
      {
        id: "tc-med-01-1",
        input: "nums = [-1, 0, 1, 2, -1, -4]",
        expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]",
        explanation: "Distinct triplets summing to 0",
      },
      {
        id: "tc-med-01-2",
        input: "nums = [0, 1, 1]",
        expectedOutput: "[]",
        explanation: "No triplet sums to 0",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-02",
    title: "Container With Most Water Greedy Contraction",
    difficulty: "Medium",
    language: "cpp",
    category: "boundary",
    description:
      "Given an integer array height of length n, find two lines that together with the x-axis form a container such that the container contains the most water. The code below contains a greedy logic error where the wrong pointer is contracted.",
    expectedBehavior:
      "Maximize area = min(height[l], height[r]) * (r - l) in O(n) time and O(1) space.",
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    buggyCode: `#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    
    while (left < right) {
        int currentWater = min(height[left], height[right]) * (right - left);
        maxWater = max(maxWater, currentWater);
        
        // BUG: Inverting greedy choice: moving the taller line reduces possible area!
        if (height[left] > height[right]) {
            left++; // Should move the shorter line (right--)
        } else {
            right--; // Should move left++
        }
    }
    return maxWater;
}`,
    solutionCode: `#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    
    while (left < right) {
        int currentWater = min(height[left], height[right]) * (right - left);
        maxWater = max(maxWater, currentWater);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}`,
    hints: [
      "The width decreases at every step.",
      "The only hope to get a larger area is to find a taller line than the current limiting boundary.",
      "Always advance the pointer pointing to the smaller height.",
    ],
    tags: ["Array", "Two Pointers", "Greedy", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write a C++ solution for LeetCode Medium 'Container With Most Water'.
Enforce:
- Time Complexity: O(n) with 2-pointers.
- Space Complexity: O(1).
- Include mathematical proof of why advancing the shorter line is optimal.`,
    promptEngineeringTips: [
      "Request mathematical induction or proof by contradiction for the greedy step in your prompt.",
    ],
    publicTests: [
      {
        id: "tc-med-02-1",
        input: "height = [1,8,6,2,5,4,8,3,7]",
        expectedOutput: "49",
      },
      {
        id: "tc-med-02-2",
        input: "height = [1,1]",
        expectedOutput: "1",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-03",
    title: "Product of Array Except Self Zero Division & Suffix Bug",
    difficulty: "Medium",
    language: "java",
    category: "array",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The problem forbids using the division operation. The implementation below mishandles suffix prefix accumulator propagation.",
    expectedBehavior:
      "Compute left prefix products and right suffix products in O(n) time without division.",
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
    ],
    buggyCode: `public class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        
        // BUG: Initialized to 0 instead of 1, resulting in all zeroes
        result[0] = 0; 
        for (int i = 1; i < n; i++) {
            result[i] = result[i - 1] * nums[i - 1];
        }
        
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        return result;
    }
}`,
    solutionCode: `public class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        
        result[0] = 1;
        for (int i = 1; i < n; i++) {
            result[i] = result[i - 1] * nums[i - 1];
        }
        
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        return result;
    }
}`,
    hints: [
      "Prefix product of an empty prefix is 1 (multiplicative identity).",
      "Multiplying 0 causes every subsequent element to evaluate to 0.",
      "Initialize result[0] = 1.",
    ],
    tags: ["Array", "Prefix Sum", "Java", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) auxiliary",
    aiPromptTemplate: `Generate an optimal Java solution for 'Product of Array Except Self'.
Constraints:
- You must NOT use division.
- You must achieve O(n) time and O(1) auxiliary space (output array does not count toward space).`,
    promptEngineeringTips: [
      "Prompt the model to reuse the return array for left products, then sweep backward with a running product scalar.",
    ],
    publicTests: [
      {
        id: "tc-med-03-1",
        input: "nums = [1,2,3,4]",
        expectedOutput: "[24,12,8,6]",
      },
      {
        id: "tc-med-03-2",
        input: "nums = [-1,1,0,-3,3]",
        expectedOutput: "[0,0,9,0,0]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-04",
    title: "Subarray Sum Equals K Prefix Map Zero Offset",
    difficulty: "Medium",
    language: "python",
    category: "logic",
    description:
      "Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k. The code fails to count subarrays that start from index 0 because the base prefix sum count is missing.",
    expectedBehavior:
      "Correctly count all continuous subarrays summing to k using prefix sums and a hash map in O(n) time.",
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7",
    ],
    buggyCode: `def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = {}
    # BUG: Missing prefix_counts[0] = 1, omitting subarrays starting at index 0!
    curr_sum = 0
    count = 0
    
    for x in nums:
        curr_sum += x
        if (curr_sum - k) in prefix_counts:
            count += prefix_counts[curr_sum - k]
            
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
        
    return count`,
    solutionCode: `def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = {0: 1}
    curr_sum = 0
    count = 0
    
    for x in nums:
        curr_sum += x
        if (curr_sum - k) in prefix_counts:
            count += prefix_counts[curr_sum - k]
            
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
        
    return count`,
    hints: [
      "What happens when curr_sum == k? Then curr_sum - k == 0.",
      "If 0 is not in the hash map with frequency 1 initially, subarrays starting at index 0 will never be added to count!",
    ],
    tags: ["Array", "Hash Table", "Prefix Sum", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 560: Subarray Sum Equals K in Python.
Requirements:
1. Explain the invariant curr_sum - k.
2. Clearly explain why prefix_counts = {0: 1} is required as the base case.
3. Time: O(n), Space: O(n).`,
    promptEngineeringTips: [
      "Ask the model: 'What represents the empty prefix sum before iterating through any elements?'",
    ],
    publicTests: [
      {
        id: "tc-med-04-1",
        input: "nums = [1,1,1], k = 2",
        expectedOutput: "2",
      },
      {
        id: "tc-med-04-2",
        input: "nums = [1,2,3], k = 3",
        expectedOutput: "2",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-05",
    title: "Longest Consecutive Sequence Lookbehind O(n) Flaw",
    difficulty: "Medium",
    language: "cpp",
    category: "algorithm",
    description:
      "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. The algorithm must run in O(n) time. The provided solution initiates redundant sequence scans resulting in O(n^2) worst case.",
    expectedBehavior:
      "Check if (num - 1) is in the set. Only begin counting if num is the start of a sequence, ensuring strict O(n) linear time.",
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ],
    buggyCode: `#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        // BUG: Initiating count for every number in numSet regardless of whether it's a sequence start!
        // Causes O(n^2) degradation on sequences like [1,2,3,4,5...n].
        int currentNum = num;
        int currentStreak = 1;
        
        while (numSet.count(currentNum + 1)) {
            currentNum += 1;
            currentStreak += 1;
        }
        longest = max(longest, currentStreak);
    }
    return longest;
}`,
    solutionCode: `#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        // Only start counting if num is the start of a sequence (num - 1 is NOT present)
        if (!numSet.count(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;
            
            while (numSet.count(currentNum + 1)) {
                currentNum += 1;
                currentStreak += 1;
            }
            longest = max(longest, currentStreak);
        }
    }
    return longest;
}`,
    hints: [
      "If num - 1 exists in the set, then num is part of a sequence that has already been or will be counted from its true start.",
      "Adding `if (!numSet.count(num - 1))` guarantees each number is visited at most twice.",
    ],
    tags: ["Array", "Hash Table", "Union Find", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Write an O(n) solution for LeetCode Medium 128: Longest Consecutive Sequence in C++.
Specify:
- Why sorting is not acceptable (O(n log n)).
- The exact condition to prevent quadratic O(n^2) worst-case traversal when using unordered_set.`,
    promptEngineeringTips: [
      "Direct the prompt to address Time Complexity with proof that each element is processed at most twice in the while loop.",
    ],
    publicTests: [
      {
        id: "tc-med-05-1",
        input: "nums = [100,4,200,1,3,2]",
        expectedOutput: "4",
      },
      {
        id: "tc-med-05-2",
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        expectedOutput: "9",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-06",
    title: "Sort Colors Dutch National Flag Mid Pointer Advancement",
    difficulty: "Medium",
    language: "python",
    category: "boundary",
    description:
      "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2). In the implementation below, the mid pointer is incorrectly advanced after swapping with high.",
    expectedBehavior:
      "Sort the array in a single pass O(n) time and O(1) space without library sort functions.",
    constraints: [
      "n == nums.length",
      "1 <= n <= 300",
      "nums[i] is either 0, 1, or 2",
    ],
    buggyCode: `def sort_colors(nums: list[int]) -> None:
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else: # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # BUG: Advancing mid += 1 here!
            # The newly swapped element at nums[mid] has NOT been inspected yet and could be 0 or 2!
            mid += 1`,
    solutionCode: `def sort_colors(nums: list[int]) -> None:
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Do not advance mid; evaluate the new nums[mid] in next iteration`,
    hints: [
      "When swapping with high, nums[high] could have been 0 or 2.",
      "If you increment mid, you skip evaluating the value that was brought in from the right.",
    ],
    tags: ["Array", "Two Pointers", "Sorting", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement the Dutch National Flag algorithm (Sort Colors) in Python.
Requirements:
1. One pass O(n) runtime, O(1) space.
2. In-place swapping.
3. Detail why mid is NOT incremented when nums[mid] == 2 is swapped with high.`,
    promptEngineeringTips: [
      "Instruct the AI: 'Define the invariants: [0..low-1] are 0s, [low..mid-1] are 1s, [high+1..n-1] are 2s, and [mid..high] is unexamined.'",
    ],
    publicTests: [
      {
        id: "tc-med-06-1",
        input: "nums = [2,0,2,1,1,0]",
        expectedOutput: "[0,0,1,1,2,2]",
      },
      {
        id: "tc-med-06-2",
        input: "nums = [2,0,1]",
        expectedOutput: "[0,1,2]",
      },
    ],
    hiddenTestCount: 3,
  },
];
