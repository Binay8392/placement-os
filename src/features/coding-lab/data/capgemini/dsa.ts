import { CapgeminiQuestion } from "./types";

export const DSA_QUESTIONS: CapgeminiQuestion[] = [
  // 1. Coding (Easy) - Two Pointers
  {
    id: "capg-dsa-01",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Two Pointers",
    difficulty: "Easy",
    type: "coding",
    title: "Sorted Pair Target Sum",
    question: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers [index1, index2] (1 <= index1 < index2 <= numbers.length). You must use O(1) additional space.",
    correctAnswer: "Two-pointer approach from both ends converging inward in O(n) time and O(1) space.",
    explanation: {
      correctReason: "Because the array is sorted, initialize left = 0, right = n - 1. If numbers[left] + numbers[right] == target, return [left + 1, right + 1]. If sum < target, increment left to increase sum. If sum > target, decrement right to decrease sum.",
      concept: "Two-pointer convergence on sorted arrays eliminates the need for hash maps, achieving optimal O(1) auxiliary space.",
      takeaway: "Whenever an array is sorted and you need a pair sum or difference, immediately think of Two Pointers.",
    },
    codingDetails: {
      constraints: [
        "2 <= numbers.length <= 3 * 10^4",
        "-1000 <= numbers[i] <= 1000",
        "numbers is sorted in non-decreasing order",
        "Exactly one solution exists",
      ],
      examples: [
        {
          input: "numbers = [2, 7, 11, 15], target = 9",
          output: "[1, 2]",
          explanation: "2 + 7 = 9. Indices are 1 and 2.",
        },
        {
          input: "numbers = [2, 3, 4], target = 6",
          output: "[1, 3]",
          explanation: "2 + 4 = 6. Indices are 1 and 3.",
        },
      ],
      expectedApproach: "Maintain two pointers at the start and end of the sorted array, moving inward based on the current sum relative to the target.",
      expectedComplexity: {
        time: "O(n)",
        space: "O(1)",
      },
      publicTests: [
        {
          id: "dsa-01-t1",
          input: "numbers = [2, 7, 11, 15], target = 9",
          expectedOutput: "[1, 2]",
        },
        {
          id: "dsa-01-t2",
          input: "numbers = [-1, 0], target = -1",
          expectedOutput: "[1, 2]",
        },
      ],
      starterCode: {
        cpp: `vector<int> twoSum(vector<int>& numbers, int target) {\n    // Implement O(n) two-pointer solution\n}`,
        java: `public int[] twoSum(int[] numbers, int target) {\n    // Implement O(n) two-pointer solution\n}`,
        python: `def two_sum(numbers: list[int], target: int) -> list[int]:\n    # Implement O(n) two-pointer solution\n    pass`,
        javascript: `function twoSum(numbers, target) {\n    // Implement O(n) two-pointer solution\n}`,
      },
    },
    tags: ["Arrays", "Two Pointers", "Binary Search", "Easy"],
    estimatedTimeMinutes: 10,
  },

  // 2. Coding (Easy) - Strings & Frequency
  {
    id: "capg-dsa-02",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Strings & Frequency Arrays",
    difficulty: "Easy",
    type: "coding",
    title: "Valid Anagram Verification",
    question: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is formed by rearranging the letters of another string, using all original letters exactly once.",
    correctAnswer: "Frequency counter comparison using a fixed 26-element array in O(n) time and O(1) space.",
    explanation: {
      correctReason: "If lengths differ, return false immediately. Use a fixed integer array of size 26 for English letters. Increment counts for string s and decrement for string t. If all counts remain 0, return true.",
      concept: "Character frequency counting with fixed alphabet size (26) requires O(1) auxiliary space.",
      takeaway: "Sorting takes O(n log n). A frequency array solves anagram verification in linear O(n) time.",
    },
    codingDetails: {
      constraints: [
        "1 <= s.length, t.length <= 5 * 10^4",
        "s and t consist of lowercase English letters",
      ],
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: "true" },
        { input: 's = "rat", t = "car"', output: "false" },
      ],
      expectedApproach: "Count character frequencies using a 26-element integer array. Increment for s, decrement for t, and check that all counts are zero.",
      expectedComplexity: {
        time: "O(n)",
        space: "O(1)",
      },
      publicTests: [
        { id: "dsa-02-t1", input: 's = "listen", t = "silent"', expectedOutput: "true" },
        { id: "dsa-02-t2", input: 's = "hello", t = "world"', expectedOutput: "false" },
      ],
      starterCode: {
        cpp: `bool isAnagram(string s, string t) {\n    // O(n) time, O(1) space\n}`,
        java: `public boolean isAnagram(String s, String t) {\n    // O(n) time, O(1) space\n}`,
        python: `def is_anagram(s: str, t: str) -> bool:\n    pass`,
        javascript: `function isAnagram(s, t) {\n    // O(n) time, O(1) space\n}`,
      },
    },
    tags: ["Strings", "Hashing", "Frequency Array", "Easy"],
    estimatedTimeMinutes: 10,
  },

  // 3. Coding (Easy) - Dutch National Flag / Partitioning
  {
    id: "capg-dsa-03",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Array Partitioning",
    difficulty: "Easy",
    type: "coding",
    title: "Segregate Binary 0s and 1s",
    question: "Given an array containing only 0s and 1s, sort the array in-place so that all 0s appear before all 1s. Do not use built-in sort functions. Solve in O(n) time and O(1) space with a single pass.",
    correctAnswer: "Two-pointer swap or Dutch National Flag partition in one pass.",
    explanation: {
      correctReason: "Maintain a pointer 'left' at index 0. Iterate through the array with index 'i'. Whenever arr[i] == 0, swap arr[i] with arr[left] and increment left. All zeros are compacted to the left side in O(n) time.",
      concept: "Two-pointer partitioning (Hoare partition / Dutch National Flag) groups elements in place without allocating auxiliary memory.",
      takeaway: "Capgemini and TCS heavily favor in-place single-pass partitioning questions.",
    },
    codingDetails: {
      constraints: ["1 <= arr.length <= 10^5", "arr[i] is either 0 or 1"],
      examples: [
        { input: "arr = [0, 1, 0, 1, 1, 0]", output: "[0, 0, 0, 1, 1, 1]" },
        { input: "arr = [1, 1, 0]", output: "[0, 1, 1]" },
      ],
      expectedApproach: "Single pass two-pointer swap moving 0s to the front.",
      expectedComplexity: { time: "O(n)", space: "O(1)" },
      publicTests: [
        { id: "dsa-03-t1", input: "arr = [0, 1, 1, 0, 1, 0]", expectedOutput: "[0, 0, 0, 1, 1, 1]" },
        { id: "dsa-03-t2", input: "arr = [1, 0]", expectedOutput: "[0, 1]" },
      ],
      starterCode: {
        cpp: `void segregate0and1(vector<int>& arr) {\n    // In-place single pass\n}`,
        java: `public void segregate0and1(int[] arr) {\n    // In-place single pass\n}`,
        python: `def segregate_0_and_1(arr: list[int]) -> None:\n    pass`,
        javascript: `function segregate0and1(arr) {\n    // In-place single pass\n}`,
      },
    },
    tags: ["Arrays", "Two Pointers", "Sorting", "Easy"],
    estimatedTimeMinutes: 10,
  },

  // 4. Coding (Easy) - Binary Search
  {
    id: "capg-dsa-04",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Binary Search",
    difficulty: "Easy",
    type: "coding",
    title: "Find First and Last Position of Element in Sorted Array",
    question: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If target is not found in the array, return `[-1, -1]`. You must write an algorithm with `O(log n)` runtime complexity.",
    correctAnswer: "Two separate binary searches: one finding the lower bound (first occurrence) and one finding the upper bound (last occurrence).",
    explanation: {
      correctReason: "Run binary search to find the leftmost index where nums[mid] == target (continue searching left when match found). Run a second binary search for the rightmost index (continue searching right). Both searches run in O(log n) time.",
      concept: "Binary search boundary modifications locate the exact edge of consecutive duplicates.",
      takeaway: "Never scan linearly with while-loops after a binary search match; that degrades worst-case to O(n). Always use two pure O(log n) searches.",
    },
    codingDetails: {
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "nums is non-decreasing"],
      examples: [
        { input: "nums = [5, 7, 7, 8, 8, 10], target = 8", output: "[3, 4]" },
        { input: "nums = [5, 7, 7, 8, 8, 10], target = 6", output: "[-1, -1]" },
      ],
      expectedApproach: "Perform two modified binary search passes: one to find first index and another for last index.",
      expectedComplexity: { time: "O(log n)", space: "O(1)" },
      publicTests: [
        { id: "dsa-04-t1", input: "nums = [5, 7, 7, 8, 8, 10], target = 8", expectedOutput: "[3, 4]" },
        { id: "dsa-04-t2", input: "nums = [], target = 0", expectedOutput: "[-1, -1]" },
      ],
      starterCode: {
        cpp: `vector<int> searchRange(vector<int>& nums, int target) {\n    // O(log n) binary search\n}`,
        java: `public int[] searchRange(int[] nums, int target) {\n    // O(log n) binary search\n}`,
        python: `def search_range(nums: list[int], target: int) -> list[int]:\n    pass`,
        javascript: `function searchRange(nums, target) {\n    // O(log n) binary search\n}`,
      },
    },
    tags: ["Binary Search", "Arrays", "Easy"],
    estimatedTimeMinutes: 12,
  },

  // 5. Coding (Medium) - Sliding Window
  {
    id: "capg-dsa-05",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Sliding Window",
    difficulty: "Medium",
    type: "coding",
    title: "Maximum Sum Subarray of Size K",
    question: "Given an array of integers `nums` and an integer `k`, find the maximum sum of any contiguous subarray of size `k`. If `nums.length < k`, return 0.",
    correctAnswer: "Fixed-size sliding window maintaining the sum in O(n) time and O(1) space.",
    explanation: {
      correctReason: "Calculate the sum of the first k elements as the initial window. Then slide the window by 1 element at a time from index k to n-1, adding the new incoming element nums[i] and subtracting the outgoing element nums[i - k]. Update the maximum sum at each step.",
      concept: "Sliding window avoids recomputing the sum of k elements from scratch (which would take O(n*k)), reducing time to O(n).",
      takeaway: "Fixed window size k means add nums[i] and remove nums[i-k].",
    },
    codingDetails: {
      constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [2, 1, 5, 1, 3, 2], k = 3", output: "9", explanation: "Subarray [5, 1, 3] gives max sum 9." },
        { input: "nums = [2, 3, 4, 1, 5], k = 2", output: "7", explanation: "Subarray [3, 4] gives 7." },
      ],
      expectedApproach: "Compute sum of first k elements, then slide window adding nums[i] and subtracting nums[i - k].",
      expectedComplexity: { time: "O(n)", space: "O(1)" },
      publicTests: [
        { id: "dsa-05-t1", input: "nums = [2, 1, 5, 1, 3, 2], k = 3", expectedOutput: "9" },
        { id: "dsa-05-t2", input: "nums = [-1, -2, -3, -4], k = 2", expectedOutput: "-3" },
      ],
      starterCode: {
        cpp: `int maxSubarraySum(vector<int>& nums, int k) {\n    // O(n) sliding window\n}`,
        java: `public int maxSubarraySum(int[] nums, int k) {\n    // O(n) sliding window\n}`,
        python: `def max_subarray_sum(nums: list[int], k: int) -> int:\n    pass`,
        javascript: `function maxSubarraySum(nums, k) {\n    // O(n) sliding window\n}`,
      },
    },
    tags: ["Sliding Window", "Arrays", "Medium"],
    estimatedTimeMinutes: 12,
  },

  // 6. Coding (Medium) - Hash Map / Two Pointers
  {
    id: "capg-dsa-06",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Hash Table & Variable Sliding Window",
    difficulty: "Medium",
    type: "coding",
    title: "Longest Substring Without Repeating Characters",
    question: "Given a string `s`, find the length of the longest substring without repeating characters.",
    correctAnswer: "Dynamic sliding window with hash map storing the most recent index of each character in O(n) time.",
    explanation: {
      correctReason: "Maintain a sliding window [left, right]. Store the last seen index of each character in a hash map. As right pointer advances, if s[right] was seen at or after 'left', move 'left = map[s[right]] + 1'. The max length is max(maxLen, right - left + 1).",
      concept: "A variable-size sliding window with hash table indexing achieves linear time string parsing without redundant backtracks.",
      takeaway: "Always check 'map[char] >= left' when updating the left pointer to avoid jumping backward.",
    },
    codingDetails: {
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: "Answer is 'abc', length 3." },
        { input: 's = "bbbbb"', output: "1", explanation: "Answer is 'b', length 1." },
        { input: 's = "pwwkew"', output: "3", explanation: "Answer is 'wke', length 3." },
      ],
      expectedApproach: "Use a sliding window [left, right] with a hash map recording each character's latest position.",
      expectedComplexity: { time: "O(n)", space: "O(min(n, m)) where m is alphabet size" },
      publicTests: [
        { id: "dsa-06-t1", input: 's = "abcabcbb"', expectedOutput: "3" },
        { id: "dsa-06-t2", input: 's = ""', expectedOutput: "0" },
      ],
      starterCode: {
        cpp: `int lengthOfLongestSubstring(string s) {\n    // O(n) sliding window\n}`,
        java: `public int lengthOfLongestSubstring(String s) {\n    // O(n) sliding window\n}`,
        python: `def length_of_longest_substring(s: str) -> int:\n    pass`,
        javascript: `function lengthOfLongestSubstring(s) {\n    // O(n) sliding window\n}`,
      },
    },
    tags: ["Strings", "Sliding Window", "Hash Table", "Medium"],
    estimatedTimeMinutes: 15,
  },

  // 7. Coding (Medium) - Linked List
  {
    id: "capg-dsa-07",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Linked List Cycle Detection",
    difficulty: "Medium",
    type: "coding",
    title: "Linked List Cycle Start Node",
    question: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Solve with O(1) memory using Floyd's Tortoise and Hare algorithm.",
    correctAnswer: "Floyd's cycle-finding algorithm: detect meeting point, then reset one pointer to head and move both at speed 1 until they meet at cycle origin.",
    explanation: {
      correctReason: "Move slow by 1 step, fast by 2 steps. If fast or fast.next is null, no cycle exists. If slow and fast meet, distance from head to cycle entrance equals distance from meeting point to cycle entrance modulo cycle length. Reset slow to head, advance both 1 step at a time; their collision point is the cycle origin.",
      concept: "Floyd's Cycle Algorithm proves mathematically that (L1 = k * C - L2), allowing exact cycle node recovery in O(n) time and O(1) space.",
      takeaway: "Floyd's Cycle Detection is asked in almost every product and service company interview round.",
    },
    codingDetails: {
      constraints: ["The number of nodes in the list is in the range [0, 10^4]", "-10^5 <= Node.val <= 10^5"],
      examples: [
        { input: "head = [3, 2, 0, -4], pos = 1", output: "tail connects to node index 1" },
        { input: "head = [1, 2], pos = 0", output: "tail connects to node index 0" },
      ],
      expectedApproach: "Phase 1: Detect cycle with slow and fast pointers. Phase 2: Reset slow to head and advance both by 1 step to find entry.",
      expectedComplexity: { time: "O(n)", space: "O(1)" },
      publicTests: [
        { id: "dsa-07-t1", input: "head = [3, 2, 0, -4], pos = 1", expectedOutput: "node with val 2" },
        { id: "dsa-07-t2", input: "head = [1], pos = -1", expectedOutput: "null" },
      ],
      starterCode: {
        cpp: `ListNode *detectCycle(ListNode *head) {\n    // Floyd's Cycle Algorithm O(1) space\n}`,
        java: `public ListNode detectCycle(ListNode head) {\n    // Floyd's Cycle Algorithm O(1) space\n}`,
        python: `def detect_cycle(head: Optional[ListNode]) -> Optional[ListNode]:\n    pass`,
        javascript: `function detectCycle(head) {\n    // Floyd's Cycle Algorithm O(1) space\n}`,
      },
    },
    tags: ["Linked List", "Two Pointers", "Floyd's Algorithm", "Medium"],
    estimatedTimeMinutes: 15,
  },

  // 8. Coding (Medium) - Monotonic Stack
  {
    id: "capg-dsa-08",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Monotonic Stack",
    difficulty: "Medium",
    type: "coding",
    title: "Next Greater Element to the Right",
    question: "Given an array `nums` of n integers, find the Next Greater Element (NGE) for every element. The next greater element of a number x is the first greater number to its right in the array. If no greater element exists, output -1 for that number.",
    correctAnswer: "Monotonic decreasing stack traversed from right to left in O(n) total time.",
    explanation: {
      correctReason: "Traverse from right to left (index n-1 down to 0). Maintain a stack of elements. While the stack is not empty and stack.top() <= nums[i], pop elements because they can never be the next greater element for any number to the left. If stack is empty, answer is -1; otherwise, answer is stack.top(). Push nums[i] onto stack.",
      concept: "Monotonic stack maintains elements in sorted order, processing each element at most twice (one push, one pop), achieving linear O(n) time.",
      takeaway: "Whenever a problem asks for 'nearest greater/smaller element on left/right', use a Monotonic Stack.",
    },
    codingDetails: {
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        { input: "nums = [4, 5, 2, 25]", output: "[5, 25, 25, -1]" },
        { input: "nums = [13, 7, 6, 12]", output: "[-1, 12, 12, -1]" },
      ],
      expectedApproach: "Iterate from right to left using a monotonic stack to find the first strictly greater element.",
      expectedComplexity: { time: "O(n)", space: "O(n)" },
      publicTests: [
        { id: "dsa-08-t1", input: "nums = [4, 5, 2, 25]", expectedOutput: "[5, 25, 25, -1]" },
        { id: "dsa-08-t2", input: "nums = [5, 4, 3, 2, 1]", expectedOutput: "[-1, -1, -1, -1, -1]" },
      ],
      starterCode: {
        cpp: `vector<long long> nextLargerElement(vector<long long>& nums) {\n    // Monotonic stack O(n)\n}`,
        java: `public long[] nextLargerElement(long[] nums) {\n    // Monotonic stack O(n)\n}`,
        python: `def next_larger_element(nums: list[int]) -> list[int]:\n    pass`,
        javascript: `function nextLargerElement(nums) {\n    // Monotonic stack O(n)\n}`,
      },
    },
    tags: ["Stack", "Monotonic Stack", "Arrays", "Medium"],
    estimatedTimeMinutes: 15,
  },

  // 9. Coding (Hard) - Dynamic Programming
  {
    id: "capg-dsa-09",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    type: "coding",
    title: "Length of Longest Increasing Subsequence (LIS)",
    question: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence. A subsequence is derived from an array by deleting some or no elements without changing the order of the remaining elements. Solve in O(n log n) time.",
    correctAnswer: "Patience sorting / binary search on tails array in O(n log n) time.",
    explanation: {
      correctReason: "Maintain a dynamic array 'tails' where tails[i] stores the smallest tail of all increasing subsequences of length i + 1. For each number in nums, use binary search (std::lower_bound) to find its insertion position in tails. If it's larger than all elements, append it; otherwise overwrite the found position. The length of tails is the LIS length.",
      concept: "O(n^2) DP uses dp[i] = max(dp[j] + 1). O(n log n) uses binary search (patience sorting) to keep tails as small as possible.",
      takeaway: "Capgemini hard tier and MNC technical assessments frequently test LIS optimization from O(n^2) to O(n log n).",
    },
    codingDetails: {
      constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        { input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]", output: "4", explanation: "LIS is [2, 3, 7, 101], length 4." },
        { input: "nums = [0, 1, 0, 3, 2, 3]", output: "4", explanation: "LIS is [0, 1, 2, 3], length 4." },
      ],
      expectedApproach: "Maintain tails array with binary search (std::lower_bound) to achieve O(n log n) runtime.",
      expectedComplexity: { time: "O(n log n)", space: "O(n)" },
      publicTests: [
        { id: "dsa-09-t1", input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]", expectedOutput: "4" },
        { id: "dsa-09-t2", input: "nums = [7, 7, 7, 7, 7]", expectedOutput: "1" },
      ],
      starterCode: {
        cpp: `int lengthOfLIS(vector<int>& nums) {\n    // O(n log n) patience sort\n}`,
        java: `public int lengthOfLIS(int[] nums) {\n    // O(n log n) patience sort\n}`,
        python: `def length_of_lis(nums: list[int]) -> int:\n    pass`,
        javascript: `function lengthOfLIS(nums) {\n    // O(n log n) patience sort\n}`,
      },
    },
    tags: ["Dynamic Programming", "Binary Search", "Patience Sort", "Hard"],
    estimatedTimeMinutes: 20,
  },

  // 10. Coding (Hard) - Graph BFS
  {
    id: "capg-dsa-10",
    category: "dsa",
    categoryLabel: "Data Structures & Algorithms",
    topic: "Graphs & Shortest Path",
    difficulty: "Hard",
    type: "coding",
    title: "Shortest Path in Binary Matrix Grid",
    question: "Given an n x n binary matrix `grid`, return the length of the shortest clear path in the matrix from top-left (0, 0) to bottom-right (n-1, n-1). If no path exists, return -1. A clear path consists of cells with value 0, and you can move in 8 directions (horizontal, vertical, diagonal). Length is the number of visited cells.",
    correctAnswer: "Breadth-First Search (BFS) in 8 directions maintaining distance levels.",
    explanation: {
      correctReason: "BFS explores layer by layer, guaranteeing the shortest path in an unweighted grid graph. If grid[0][0] != 0 or grid[n-1][n-1] != 0, return -1 immediately. Use a queue initialized with (0, 0, 1). Mark visited cells in-place to prevent queue explosion. Return distance as soon as (n-1, n-1) is reached.",
      concept: "Breadth-First Search is optimal for unweighted shortest paths. DFS does not guarantee shortest path and can trigger stack overflow on large grids.",
      takeaway: "In grid graph questions, 8-directional exploration requires direction arrays: dx = [-1,-1,-1,0,0,1,1,1] and dy = [-1,0,1,-1,1,-1,0,1].",
    },
    codingDetails: {
      constraints: ["n == grid.length == grid[i].length", "1 <= n <= 100", "grid[i][j] is 0 or 1"],
      examples: [
        { input: "grid = [[0, 1], [1, 0]]", output: "2", explanation: "(0,0) -> (1,1) diagonal path, length 2." },
        { input: "grid = [[0, 0, 0], [1, 1, 0], [1, 1, 0]]", output: "4" },
        { input: "grid = [[1, 0, 0], [1, 1, 0], [1, 1, 0]]", output: "-1" },
      ],
      expectedApproach: "Use Queue-based Breadth-First Search with an 8-direction delta vector and in-place visited marking.",
      expectedComplexity: { time: "O(n^2)", space: "O(n^2)" },
      publicTests: [
        { id: "dsa-10-t1", input: "grid = [[0, 1], [1, 0]]", expectedOutput: "2" },
        { id: "dsa-10-t2", input: "grid = [[1, 0], [0, 0]]", expectedOutput: "-1" },
      ],
      starterCode: {
        cpp: `int shortestPathBinaryMatrix(vector<vector<int>>& grid) {\n    // 8-directional BFS\n}`,
        java: `public int shortestPathBinaryMatrix(int[][] grid) {\n    // 8-directional BFS\n}`,
        python: `def shortest_path_binary_matrix(grid: list[list[int]]) -> int:\n    pass`,
        javascript: `function shortestPathBinaryMatrix(grid) {\n    // 8-directional BFS\n}`,
      },
    },
    tags: ["Graphs", "BFS", "Matrix", "Shortest Path", "Hard"],
    estimatedTimeMinutes: 20,
  },
];
