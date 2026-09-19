import { DebuggingProblem } from "../../types";

export const BINARY_SEARCH_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-17",
    title: "Search in Rotated Sorted Array Half-Invariance Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "search-sort",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values), rotated at an unknown pivot index. Given the array nums and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. The implementation below mishandles which half is monotonically sorted.",
    expectedBehavior:
      "Achieve O(log n) time complexity by identifying which half is sorted, then checking if target lies within that half's boundaries.",
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique",
      "-10^4 <= target <= 10^4",
    ],
    buggyCode: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        
        // BUG: Inverted condition! Comparing nums[low] <= nums[high] instead of nums[low] <= nums[mid]!
        // When the array is rotated, the left half is sorted only if nums[low] <= nums[mid].
        if (nums[low] <= nums[high]) {
            if (target >= nums[low] && target < nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } else {
            if (target > nums[mid] && target <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    return -1;
}`,
    solutionCode: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        
        // Check if left half is sorted
        if (nums[low] <= nums[mid]) {
            if (target >= nums[low] && target < nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } else { // Right half is sorted
            if (target > nums[mid] && target <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    return -1;
}`,
    hints: [
      "In a rotated sorted array, at least one half (left [low..mid] or right [mid..high]) is guaranteed to be strictly sorted.",
      "Check `if (nums[low] <= nums[mid])` to test if the left half is the sorted portion.",
    ],
    tags: ["Array", "Binary Search", "LeetCode Medium"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write an optimal C++ solution for LeetCode 33: Search in Rotated Sorted Array.
Enforce:
- O(log n) time complexity.
- Clear breakdown of binary search cases depending on whether nums[low] <= nums[mid].
- Detailed justification of why comparing nums[low] <= nums[mid] accurately detects sortedness.`,
    promptEngineeringTips: [
      "Ask the model: 'Why does nums[low] <= nums[mid] guarantee the left half has no rotation pivot?'",
    ],
    publicTests: [
      {
        id: "tc-med-17-1",
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        expectedOutput: "4",
      },
      {
        id: "tc-med-17-2",
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        expectedOutput: "-1",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-18",
    title: "Find Minimum in Rotated Sorted Array Comparison Inversion",
    difficulty: "Medium",
    language: "python",
    category: "search-sort",
    description:
      "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Notice that rotating an array [a[0], a[1], ..., a[n-1]] 1 time results in [a[n-1], a[0], ..., a[n-2]]. Given the sorted rotated array nums of unique elements, return the minimum element of this array. The code below compares mid with low instead of high, causing it to discard the half containing the minimum.",
    expectedBehavior:
      "Find the minimum element in O(log n) time by comparing nums[mid] against nums[high].",
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique",
    ],
    buggyCode: `def find_min(nums: list[int]) -> int:
    low = 0
    high = len(nums) - 1
    
    while low < high:
        mid = low + (high - low) // 2
        
        # BUG: Comparing with nums[low] instead of nums[high]!
        # When nums = [4, 5, 6, 7, 0, 1, 2], nums[mid]=7 > nums[low]=4, but the min is on the right!
        # Comparing with nums[low] fails when the pivot is in the right half of an unrotated subsection.
        if nums[mid] > nums[low]:
            high = mid
        else:
            low = mid + 1
            
    return nums[low]`,
    solutionCode: `def find_min(nums: list[int]) -> int:
    low = 0
    high = len(nums) - 1
    
    while low < high:
        mid = low + (high - low) // 2
        
        if nums[mid] > nums[high]:
            low = mid + 1
        else:
            high = mid
            
    return nums[low]`,
    hints: [
      "Compare `nums[mid]` with `nums[high]`. If `nums[mid] > nums[high]`, the inflection point (minimum) MUST be strictly to the right of mid (`low = mid + 1`).",
      "If `nums[mid] <= nums[high]`, the minimum is either at mid or to the left of mid (`high = mid`).",
    ],
    tags: ["Array", "Binary Search", "LeetCode Medium"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 153: Find Minimum in Rotated Sorted Array in Python.
Requirements:
1. Explain why comparing nums[mid] with nums[high] is universally reliable whereas comparing with nums[low] fails on already-sorted arrays.
2. State the while loop termination condition (low < high vs low <= high).`,
    promptEngineeringTips: [
      "Instruct the AI: 'Provide a trace for nums = [3, 4, 5, 1, 2] and nums = [1, 2, 3, 4, 5] showing why high = mid retains the minimum.'",
    ],
    publicTests: [
      {
        id: "tc-med-18-1",
        input: "nums = [3,4,5,1,2]",
        expectedOutput: "1",
      },
      {
        id: "tc-med-18-2",
        input: "nums = [4,5,6,7,0,1,2]",
        expectedOutput: "0",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-19",
    title: "Koko Eating Bananas Integer Division Underestimation",
    difficulty: "Medium",
    language: "java",
    category: "search-sort",
    description:
      "Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Return the minimum integer k such that she can eat all the bananas within h hours. The implementation below uses standard integer truncation division instead of ceiling division, resulting in undercounting hours and an invalid speed.",
    expectedBehavior:
      "Binary search on speed k in range [1, max(piles)] with ceiling division (pile + k - 1) / k in O(n log(max)) time.",
    constraints: [
      "1 <= piles.length <= 10^4",
      "piles.length <= h <= 10^9",
      "1 <= piles[i] <= 10^9",
    ],
    buggyCode: `public class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int low = 1;
        int high = 0;
        for (int p : piles) high = Math.max(high, p);
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            int totalHours = 0;
            
            for (int p : piles) {
                // BUG: Integer truncation! e.g., 7 / 3 = 2 instead of ceil(7/3) = 3!
                totalHours += p / mid;
            }
            
            if (totalHours <= h) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}`,
    solutionCode: `public class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int low = 1;
        int high = 0;
        for (int p : piles) high = Math.max(high, p);
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            long totalHours = 0;
            
            for (int p : piles) {
                totalHours += (long)(p + mid - 1) / mid;
            }
            
            if (totalHours <= h) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}`,
    hints: [
      "If a pile has 7 bananas and Koko eats 3 per hour, she needs 3 hours (hours = (pile + k - 1) / k).",
      "Also watch out for integer overflow on totalHours when k is small; cast to long.",
    ],
    tags: ["Array", "Binary Search", "LeetCode Medium"],
    timeComplexity: "O(n log(max_pile))",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Solve LeetCode 875: Koko Eating Bananas in Java.
Requirements:
1. Formulate this as binary search on the answer space.
2. Formulate ceiling division without floating-point errors: (p + k - 1) / k.
3. Prevent 32-bit signed integer overflow when summing required hours.`,
    promptEngineeringTips: [
      "Ask the model to analyze possible integer overflow scenarios when piles has 10^4 elements and mid is 1.",
    ],
    publicTests: [
      {
        id: "tc-med-19-1",
        input: "piles = [3,6,7,11], h = 8",
        expectedOutput: "4",
      },
      {
        id: "tc-med-19-2",
        input: "piles = [30,11,23,4,20], h = 5",
        expectedOutput: "30",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-20",
    title: "Search a 2D Matrix Row Column Mapping Error",
    difficulty: "Medium",
    language: "python",
    category: "search-sort",
    description:
      "You are given an m x n integer matrix matrix with the following two properties: each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise. The code treats the matrix as a flattened array but swaps the row and column division/modulo formulas.",
    expectedBehavior:
      "Treat matrix as flattened array of size m * n; map index to (idx // n, idx % n) in O(log(m * n)) time.",
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 100",
      "-10^4 <= matrix[i][j], target <= 10^4",
    ],
    buggyCode: `def search_matrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
        
    m, n = len(matrix), len(matrix[0])
    low = 0
    high = m * n - 1
    
    while low <= high:
        mid = (low + high) // 2
        # BUG: Swapped row and column formula!
        # row should be mid // n, col should be mid % n!
        row = mid // m
        col = mid % m
        
        # Out of bounds when col >= n
        if row >= m or col >= n:
            return False
            
        val = matrix[row][col]
        if val == target:
            return True
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return False`,
    solutionCode: `def search_matrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
        
    m, n = len(matrix), len(matrix[0])
    low = 0
    high = m * n - 1
    
    while low <= high:
        mid = (low + high) // 2
        row = mid // n
        col = mid % n
        
        val = matrix[row][col]
        if val == target:
            return True
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return False`,
    hints: [
      "A 2D matrix of dimensions m x n has n elements in each row.",
      "To map a 1D index `mid` to 2D coordinates: `row = mid // n` and `col = mid % n`.",
    ],
    tags: ["Array", "Binary Search", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(log(m * n))",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 74: Search a 2D Matrix in Python.
Enforce:
- Virtual 1D array binary search in O(log(m * n)) time.
- Clearly derive the formula for translating 1D index to (row, col) using column count n.`,
    promptEngineeringTips: [
      "Request: 'Explicitly explain why division by n (column count) yields the row index.'",
    ],
    publicTests: [
      {
        id: "tc-med-20-1",
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        expectedOutput: "true",
      },
      {
        id: "tc-med-20-2",
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        expectedOutput: "false",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-21",
    title: "Capacity To Ship Packages Within D Days Lower Bound Omission",
    difficulty: "Medium",
    language: "cpp",
    category: "search-sort",
    description:
      "A conveyor belt has packages that must be shipped from one port to another within days days. The ith package on the conveyor belt has a weight of weights[i]. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days. The solution sets the lower search bound to 1 instead of the heaviest single package, causing invalid shipping schedules.",
    expectedBehavior:
      "Binary search capacity between max(weights) and sum(weights) with greedy simulation in O(n log(sum)) time.",
    constraints: [
      "1 <= days <= weights.length <= 5 * 10^4",
      "1 <= weights[i] <= 500",
    ],
    buggyCode: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int shipWithinDays(vector<int>& weights, int days) {
    // BUG: Setting low to 1 instead of max(weights)!
    // If a package weighs 10, the ship's capacity MUST be at least 10, otherwise that package can NEVER be loaded!
    int low = 1; 
    int high = accumulate(weights.begin(), weights.end(), 0);
    
    while (low < high) {
        int mid = low + (high - low) / 2;
        int daysNeeded = 1;
        int currentWeight = 0;
        
        for (int w : weights) {
            if (currentWeight + w > mid) {
                daysNeeded++;
                currentWeight = 0;
            }
            currentWeight += w;
        }
        
        if (daysNeeded <= days) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}`,
    solutionCode: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int shipWithinDays(vector<int>& weights, int days) {
    int maxW = 0;
    int sumW = 0;
    for (int w : weights) {
        maxW = max(maxW, w);
        sumW += w;
    }
    
    int low = maxW;
    int high = sumW;
    
    while (low < high) {
        int mid = low + (high - low) / 2;
        int daysNeeded = 1;
        int currentWeight = 0;
        
        for (int w : weights) {
            if (currentWeight + w > mid) {
                daysNeeded++;
                currentWeight = 0;
            }
            currentWeight += w;
        }
        
        if (daysNeeded <= days) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}`,
    hints: [
      "If the maximum single package weight is 500, a ship capacity of 499 can never carry that package.",
      "The search space lower bound must be `max(weights)`.",
    ],
    tags: ["Array", "Binary Search", "Greedy", "LeetCode Medium"],
    timeComplexity: "O(n log(sum - max))",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write a C++ solution for LeetCode 1011: Capacity To Ship Packages Within D Days.
Include:
- Feasibility check greedy function.
- Detailed explanation of lower bound = max(weights) and upper bound = sum(weights).
- Analysis of monotonicity that allows binary search.`,
    promptEngineeringTips: [
      "Ask the model: 'Why is the predicate canShip(capacity) monotonic with respect to capacity?'",
    ],
    publicTests: [
      {
        id: "tc-med-21-1",
        input: "weights = [1,2,3,4,5,6,7,8,9,10], days = 5",
        expectedOutput: "15",
      },
      {
        id: "tc-med-21-2",
        input: "weights = [3,2,2,4,1,4], days = 3",
        expectedOutput: "6",
      },
    ],
    hiddenTestCount: 3,
  },
];
