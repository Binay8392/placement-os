import { DebuggingProblem } from "../../types";

export const HEAP_AND_GREEDY_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-38",
    title: "Top K Frequent Elements Min-Heap Size Pruning Condition",
    difficulty: "Medium",
    language: "python",
    category: "data-structure",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements. In the heap-based implementation below, the heap pops before reaching size > k, pruning valid high-frequency candidates prematurely.",
    expectedBehavior:
      "Count frequencies in hash map; maintain min-heap of size k (or Bucket Sort in O(n)) in O(n log k) time.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array]",
      "It is guaranteed that the answer is unique",
    ],
    buggyCode: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    heap = [] # min-heap of (frequency, num)
    
    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))
        # BUG: Popping when len(heap) >= k instead of len(heap) > k!
        # Causes the heap to always hold at most k - 1 elements, popping prematurely!
        if len(heap) >= k:
            heapq.heappop(heap)
            
    return [num for freq, num in heap]`,
    solutionCode: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    heap = [] # min-heap of (frequency, num)
    
    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
            
    return [num for freq, num in heap]`,
    hints: [
      "A min-heap should retain the k highest frequencies.",
      "You only pop the smallest element when the heap exceeds size k (`len(heap) > k`).",
    ],
    tags: ["Array", "Hash Table", "Heap", "Bucket Sort", "LeetCode Medium"],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n + k)",
    aiPromptTemplate: `Task: Solve LeetCode 347: Top K Frequent Elements in Python.
Compare two optimal solutions:
1. Min-Heap of size k (O(N log K) time, O(N) space).
2. Bucket Sort based on frequency count (O(N) time and space).
Explain why popping when len > k leaves the largest k elements in a min-heap.`,
    promptEngineeringTips: [
      "Direct the prompt to detail Bucket Sort where index corresponds to frequency.",
    ],
    publicTests: [
      {
        id: "tc-med-38-1",
        input: "nums = [1,1,1,2,2,3], k = 2",
        expectedOutput: "[1,2]",
      },
      {
        id: "tc-med-38-2",
        input: "nums = [1], k = 1",
        expectedOutput: "[1]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-39",
    title: "Kth Largest Element Quickselect Pivot Index Mapping",
    difficulty: "Medium",
    language: "cpp",
    category: "algorithm",
    description:
      "Given an integer array nums and an integer k, return the kth largest element in the array. Notice that it is the kth largest element in sorted order, not the kth distinct element. The Quickselect implementation below maps the target index incorrectly, finding the kth smallest instead of kth largest.",
    expectedBehavior:
      "Target index in 0-indexed ascending array is nums.size() - k; run Quickselect in O(n) average time.",
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    buggyCode: `#include <vector>
#include <algorithm>
using namespace std;

int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];
    int pIndex = left;
    for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) {
            swap(nums[i], nums[pIndex]);
            pIndex++;
        }
    }
    swap(nums[pIndex], nums[right]);
    return pIndex;
}

int quickSelect(vector<int>& nums, int left, int right, int target) {
    if (left == right) return nums[left];
    
    int p = partition(nums, left, right);
    if (p == target) return nums[p];
    else if (p < target) return quickSelect(nums, p + 1, right, target);
    else return quickSelect(nums, left, p - 1, target);
}

int findKthLargest(vector<int>& nums, int k) {
    // BUG: target = k - 1 finds the kth SMALLEST element!
    // The kth LARGEST element in ascending order is at index nums.size() - k!
    int target = k - 1;
    return quickSelect(nums, 0, nums.size() - 1, target);
}`,
    solutionCode: `#include <vector>
#include <algorithm>
using namespace std;

int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];
    int pIndex = left;
    for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) {
            swap(nums[i], nums[pIndex]);
            pIndex++;
        }
    }
    swap(nums[pIndex], nums[right]);
    return pIndex;
}

int quickSelect(vector<int>& nums, int left, int right, int target) {
    if (left == right) return nums[left];
    
    int p = partition(nums, left, right);
    if (p == target) return nums[p];
    else if (p < target) return quickSelect(nums, p + 1, right, target);
    else return quickSelect(nums, left, p - 1, target);
}

int findKthLargest(vector<int>& nums, int k) {
    int target = nums.size() - k;
    return quickSelect(nums, 0, nums.size() - 1, target);
}`,
    hints: [
      "In a 0-indexed sorted array of length N, the 1st largest element is at index N - 1.",
      "The kth largest element is at index `N - k`.",
    ],
    tags: ["Array", "Divide and Conquer", "Quickselect", "Heap", "LeetCode Medium"],
    timeComplexity: "O(n) average, O(n^2) worst",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 215: Kth Largest Element in an Array in C++.
Provide:
1. Quickselect with randomized pivot selection to avoid O(N^2) worst case.
2. Derivation of average time complexity: N + N/2 + N/4 + ... = 2N = O(N).
3. Contrast with Min-Heap of size k.`,
    promptEngineeringTips: [
      "Ask the model: 'Why does random pivot selection ensure O(N) expected runtime on sorted arrays?'",
    ],
    publicTests: [
      {
        id: "tc-med-39-1",
        input: "nums = [3,2,1,5,6,4], k = 2",
        expectedOutput: "5",
      },
      {
        id: "tc-med-39-2",
        input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        expectedOutput: "4",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-40",
    title: "Task Scheduler Multiple Max Frequency Tasks Arithmetic",
    difficulty: "Medium",
    language: "python",
    category: "algorithm",
    description:
      "You are given an array of CPU tasks represented by letters A to Z and a cooling interval n. Each task takes 1 unit of time to execute. Between identical tasks, there must be at least n units of cooldown time. The mathematical formula below assumes only ONE task has the maximum frequency, undercounting total time when multiple tasks share the maximum frequency.",
    expectedBehavior:
      "Formula: max(len(tasks), (max_freq - 1) * (n + 1) + max_freq_task_count) in O(tasks) time and O(1) space.",
    constraints: [
      "1 <= tasks.length <= 10^4",
      "tasks[i] is an uppercase English letter",
      "0 <= n <= 100",
    ],
    buggyCode: `from collections import Counter

def least_interval(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_freq = max(counts.values())
    
    # BUG: Hardcoding + 1 at the end!
    # If multiple tasks share the maximum frequency (e.g. A:3, B:3),
    # the last execution chunk must hold ALL max-frequency tasks, not just 1!
    slots = (max_freq - 1) * (n + 1) + 1
    
    return max(len(tasks), slots)`,
    solutionCode: `from collections import Counter

def least_interval(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_count = sum(1 for count in counts.values() if count == max_freq)
    
    slots = (max_freq - 1) * (n + 1) + max_count
    
    return max(len(tasks), slots)`,
    hints: [
      "If tasks are ['A','A','A','B','B','B'] and n = 2, max_freq is 3 (for both A and B).",
      "The pattern is A B _ | A B _ | A B. The last block has 2 tasks (A and B), so add `max_count`.",
    ],
    tags: ["Array", "Hash Table", "Greedy", "Heap", "LeetCode Medium"],
    timeComplexity: "O(len(tasks))",
    spaceComplexity: "O(1) (at most 26 letters)",
    aiPromptTemplate: `Task: Solve LeetCode 621: Task Scheduler in Python.
Explain:
1. Greedy / idle-slot math formulation.
2. Why max(len(tasks), (max_freq - 1) * (n + 1) + count_max) holds.
3. Max-heap + queue simulation approach and why the math formula is faster.`,
    promptEngineeringTips: [
      "Instruct the model: 'Illustrate the grid visualization with frames and cooling slots.'",
    ],
    publicTests: [
      {
        id: "tc-med-40-1",
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        expectedOutput: "8",
        explanation: "A -> B -> idle -> A -> B -> idle -> A -> B",
      },
      {
        id: "tc-med-40-2",
        input: 'tasks = ["A","C","A","B","D","B"], n = 1',
        expectedOutput: "6",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-41",
    title: "Gas Station Circular Circuit Total Fuel Accounting",
    difficulty: "Medium",
    language: "java",
    category: "boundary",
    description:
      "There are n gas stations along a circular route. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. In the implementation below, the total gas deficit check is omitted, causing invalid start indices to be returned.",
    expectedBehavior:
      "Greedy one-pass: total_tank >= 0 guarantees a solution exists; reset start = i + 1 whenever curr_tank < 0 in O(n) time and O(1) space.",
    constraints: [
      "n == gas.length == cost.length",
      "1 <= n <= 10^5",
      "0 <= gas[i], cost[i] <= 10^4",
    ],
    buggyCode: `public class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int start = 0;
        int currTank = 0;
        
        // BUG: Forgot to check if total gas >= total cost!
        // If sum(gas) < sum(cost), it is mathematically impossible to complete the circuit,
        // but this loop will still return 'start' instead of -1!
        for (int i = 0; i < gas.length; i++) {
            currTank += gas[i] - cost[i];
            if (currTank < 0) {
                start = i + 1;
                currTank = 0;
            }
        }
        return start;
    }
}`,
    solutionCode: `public class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int totalTank = 0;
        int currTank = 0;
        int start = 0;
        
        for (int i = 0; i < gas.length; i++) {
            int net = gas[i] - cost[i];
            totalTank += net;
            currTank += net;
            
            if (currTank < 0) {
                start = i + 1;
                currTank = 0;
            }
        }
        return totalTank >= 0 ? start : -1;
    }
}`,
    hints: [
      "If the total amount of gas is strictly less than the total cost, no starting station can ever work.",
      "Track `totalTank` across all stations and return -1 if `totalTank < 0`.",
    ],
    tags: ["Array", "Greedy", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 134: Gas Station in Java.
Provide:
1. Proof that if total_gas >= total_cost, a unique starting index is guaranteed to exist.
2. Explain why if starting at A cannot reach B, no station between A and B can reach B either.`,
    promptEngineeringTips: [
      "Ask the model: 'Provide the formal mathematical proof that sum(gas) >= sum(cost) guarantees a valid cycle.'",
    ],
    publicTests: [
      {
        id: "tc-med-41-1",
        input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        expectedOutput: "3",
      },
      {
        id: "tc-med-41-2",
        input: "gas = [2,3,4], cost = [3,4,3]",
        expectedOutput: "-1",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-42",
    title: "Jump Game II Greedy BFS Boundary Increment",
    difficulty: "Medium",
    language: "python",
    category: "boundary",
    description:
      "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1]. In the code below, the loop runs up to n instead of n - 1, causing an extra jump to be added when already at the destination.",
    expectedBehavior:
      "Greedy BFS level jump: update current_end and increment jumps only up to index n - 2 in O(n) time.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 1000",
      "It's guaranteed that you can reach nums[n - 1]",
    ],
    buggyCode: `def jump(nums: list[int]) -> int:
    n = len(nums)
    if n <= 1:
        return 0
        
    jumps = 0
    curr_end = 0
    farthest = 0
    
    # BUG: Iterating up to n (range(n)) instead of range(n - 1)!
    # When i reaches n - 1 (the final target), it triggers i == curr_end and adds an unnecessary jump!
    for i in range(n):
        farthest = max(farthest, i + nums[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
            
    return jumps`,
    solutionCode: `def jump(nums: list[int]) -> int:
    n = len(nums)
    if n <= 1:
        return 0
        
    jumps = 0
    curr_end = 0
    farthest = 0
    
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
            if curr_end >= n - 1:
                break
                
    return jumps`,
    hints: [
      "Do not evaluate the last index `n - 1` because you don't need to jump anywhere once you have reached the destination.",
      "Iterate `for i in range(n - 1):`.",
    ],
    tags: ["Array", "Dynamic Programming", "Greedy", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Solve LeetCode 45: Jump Game II in Python.
Requirements:
1. Greedy interval/BFS approach in O(n) time and O(1) space.
2. Explain the difference between curr_end and farthest.
3. Why the loop bounds must terminate at n - 2.`,
    promptEngineeringTips: [
      "Instruct the model: 'Frame this as an implicit BFS where curr_end marks the current BFS level boundary.'",
    ],
    publicTests: [
      {
        id: "tc-med-42-1",
        input: "nums = [2,3,1,1,4]",
        expectedOutput: "2",
      },
      {
        id: "tc-med-42-2",
        input: "nums = [2,3,0,1,4]",
        expectedOutput: "2",
      },
    ],
    hiddenTestCount: 3,
  },
];
