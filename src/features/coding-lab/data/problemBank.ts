import { DebuggingProblem } from "../types";

export const PROBLEM_BANK: DebuggingProblem[] = [
  // 1. BOUNDARY & SEARCH - Binary Search Off-by-One (C++)
  {
    id: "debug-cpp-01",
    title: "Binary Search Boundary Flaw",
    difficulty: "Medium",
    language: "cpp",
    category: "boundary",
    description:
      "The following function `binarySearch` is intended to return the 0-based index of `target` in a sorted integer array `nums`, or -1 if `target` is not found. However, it fails on boundary elements and enters an infinite loop or wrong search range when the target is at the far right.",
    expectedBehavior:
      "Correctly find target indices across all valid ranges including first, last, and absent elements in O(log n) time.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i], target <= 10^4",
      "nums is sorted in ascending order with distinct values",
    ],
    buggyCode: `#include <vector>
#include <iostream>
using namespace std;

int binarySearch(const vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size(); // BUG: Boundary issue
    
    while (low < high) { // BUG: Excludes high when low == high
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid; // BUG: Should be mid + 1, causes infinite loop
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
    solutionCode: `#include <vector>
#include <iostream>
using namespace std;

int binarySearch(const vector<int>& nums, int target) {
    int low = 0;
    int high = (int)nums.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
    hints: [
      "Check how high is initialized: nums.size() vs nums.size() - 1.",
      "Notice low = mid. If low + 1 == high and nums[mid] < target, mid will not advance!",
      "Change high to nums.size() - 1, loop condition to low <= high, and low = mid + 1.",
    ],
    tags: ["Binary Search", "Off-by-One", "Boundary", "Array"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-01-1",
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        expectedOutput: "4",
        explanation: "9 exists in nums and its index is 4",
      },
      {
        id: "tc-01-2",
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        expectedOutput: "-1",
        explanation: "2 does not exist in nums so return -1",
      },
      {
        id: "tc-01-3",
        input: "nums = [5], target = 5",
        expectedOutput: "0",
        explanation: "Single element array containing target",
      },
    ],
    hiddenTestCount: 3,
  },

  // 2. ARRAY & LOOP - Two Sum Bug (Python)
  {
    id: "debug-py-02",
    title: "Two Sum Hash Map Key Bug",
    difficulty: "Easy",
    language: "python",
    category: "array",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. The developer tried using a dictionary for O(n) lookup, but mistakenly returns duplicate indices or incorrect complementary indices.",
    expectedBehavior:
      "Return the exact 2 indices [i, j] (where i != j) that sum to target.",
    constraints: [
      "2 <= len(nums) <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Exactly one valid answer exists",
    ],
    buggyCode: `def two_sum(nums, target):
    seen = {}
    for i in range(len(nums)):
        # BUG: Populates dictionary before checking complement
        seen[nums[i]] = i
        complement = target - nums[i]
        if complement in seen:
            return [seen[complement], i] # BUG: Can return [i, i] if target is 2 * nums[i]
    return []`,
    solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    hints: [
      "What happens if target is 6 and nums contains [3, 2, 4]? When checking 3, complement 3 is found in seen because you added it before checking!",
      "You cannot use the same element twice.",
      "Check if complement is in seen BEFORE adding the current number to seen.",
    ],
    tags: ["Hash Map", "Array", "Two Pointers"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    publicTests: [
      {
        id: "tc-02-1",
        input: "nums = [2, 7, 11, 15], target = 9",
        expectedOutput: "[0, 1]",
      },
      {
        id: "tc-02-2",
        input: "nums = [3, 2, 4], target = 6",
        expectedOutput: "[1, 2]",
      },
      {
        id: "tc-02-3",
        input: "nums = [3, 3], target = 6",
        expectedOutput: "[0, 1]",
      },
    ],
    hiddenTestCount: 3,
  },

  // 3. STRING & LOGIC - Valid Palindrome Special Character Filter (JavaScript)
  {
    id: "debug-js-03",
    title: "Palindrome Alphanumeric Sanitization Bug",
    difficulty: "Easy",
    language: "javascript",
    category: "string",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. The implementation fails to properly sanitize punctuation or comparison cases.",
    expectedBehavior:
      "Return true if the string is a valid palindrome ignoring non-alphanumeric characters and case, false otherwise.",
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters"],
    buggyCode: `function isPalindrome(s) {
    // BUG: Regex only strips whitespace, not punctuation
    let clean = s.toLowerCase().replace(/\\s+/g, "");
    
    let left = 0;
    let right = clean.length - 1;
    
    // BUG: Off-by-one or improper comparison
    while (left <= right) {
        if (clean[left] !== clean[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
    solutionCode: `function isPalindrome(s) {
    let clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    let left = 0;
    let right = clean.length - 1;
    
    while (left < right) {
        if (clean[left] !== clean[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
    hints: [
      "Review the regular expression `replace(/\\s+/g, '')`. Does it strip commas, colons, and question marks?",
      "Use `replace(/[^a-z0-9]/g, '')` to strip any character that is not alphanumeric.",
      "Also check the loop termination condition: `left < right` is sufficient.",
    ],
    tags: ["String", "Two Pointers", "Regex"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    publicTests: [
      {
        id: "tc-03-1",
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: "true",
      },
      {
        id: "tc-03-2",
        input: 's = "race a car"',
        expectedOutput: "false",
      },
      {
        id: "tc-03-3",
        input: 's = " "',
        expectedOutput: "true",
      },
    ],
    hiddenTestCount: 2,
  },

  // 4. STACK / QUEUE - Valid Parentheses (Java)
  {
    id: "debug-java-04",
    title: "Bracket Sequence Underflow Bug",
    difficulty: "Medium",
    language: "java",
    category: "stack-queue",
    description:
      "Determine if an input string composed of '(', ')', '{', '}', '[' and ']' is valid. The current solution crashes with `EmptyStackException` when an opening bracket is missing, or fails to check if all brackets were closed.",
    expectedBehavior:
      "Safely evaluate brackets without stack underflow and ensure the stack is completely empty at completion.",
    constraints: [
      "1 <= s.length() <= 10^4",
      "s consists of parentheses only '()[]{}'",
    ],
    buggyCode: `import java.util.Stack;

public class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                // BUG: Crashes with EmptyStackException if stack is empty!
                char top = stack.pop(); 
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        // BUG: Always returns true even if open brackets remain in stack!
        return true; 
    }
}`,
    solutionCode: `import java.util.Stack;

public class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`,
    hints: [
      "What happens if s starts with a closing bracket like ')'? `stack.pop()` throws EmptyStackException!",
      "Check `if (stack.isEmpty()) return false;` before calling pop().",
      "At the end of the method, make sure no unclosed opening brackets remain: `return stack.isEmpty();`.",
    ],
    tags: ["Stack", "Data Structure", "Boundary"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    publicTests: [
      {
        id: "tc-04-1",
        input: 's = "()"',
        expectedOutput: "true",
      },
      {
        id: "tc-04-2",
        input: 's = "()[]{}"',
        expectedOutput: "true",
      },
      {
        id: "tc-04-3",
        input: 's = "(]"',
        expectedOutput: "false",
      },
    ],
    hiddenTestCount: 2,
  },

  // 5. RECURSION - Fibonacci & Base Case (Python)
  {
    id: "debug-py-05",
    title: "Fibonacci Base Case & Recursion Overflow",
    difficulty: "Easy",
    language: "python",
    category: "recursion",
    description:
      "Compute the n-th Fibonacci number. The implementation has a broken base case that results in `RecursionError: maximum recursion depth exceeded` when n = 0, and calculates incorrect indices.",
    expectedBehavior:
      "fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2). Return correct value efficiently.",
    constraints: ["0 <= n <= 30"],
    buggyCode: `def fib(n):
    # BUG: Faulty base case does not handle n == 0
    if n <= 1:
        return 1 # BUG: fib(0) should be 0, not 1
    
    # BUG: Missing memoization or wrong recursive step
    return fib(n - 1) + fib(n - 2)`,
    solutionCode: `def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
    hints: [
      "Check what fib(0) returns. The definition states fib(0) = 0, but the code returns 1.",
      "For n <= 1: if n == 0 return 0, if n == 1 return 1.",
      "Consider using an iterative or memoized approach to prevent exponential recursion call stack.",
    ],
    tags: ["Recursion", "Dynamic Programming", "Math"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-05-1",
        input: "n = 2",
        expectedOutput: "1",
      },
      {
        id: "tc-05-2",
        input: "n = 3",
        expectedOutput: "2",
      },
      {
        id: "tc-05-3",
        input: "n = 4",
        expectedOutput: "3",
      },
    ],
    hiddenTestCount: 3,
  },

  // 6. LINKED LIST - Reverse Linked List Pointer Bug (C++)
  {
    id: "debug-cpp-06",
    title: "Linked List Reversal Cycle Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "linked-list",
    description:
      "Given the head of a singly linked list, reverse the list and return the reversed list. The current implementation creates an infinite cycle because it updates `curr->next` before preserving the rest of the list, losing the reference or producing an endless loop.",
    expectedBehavior:
      "Reverse pointers correctly so the old tail becomes the new head, terminating with nullptr.",
    constraints: ["The number of nodes in the list is in the range [0, 5000]", "-5000 <= Node.val <= 5000"],
    buggyCode: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        // BUG: Mutates curr->next before caching next node!
        curr->next = prev;
        prev = curr;
        curr = curr->next; // BUG: Points back to prev!
    }
    return prev;
}`,
    solutionCode: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    hints: [
      "Notice `curr = curr->next` right after you set `curr->next = prev`!",
      "Save `curr->next` into a temporary variable `nextTemp` before modifying `curr->next`.",
      "Advance `curr` using `nextTemp` instead of `curr->next`.",
    ],
    tags: ["Linked List", "Pointers", "Cycle"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-06-1",
        input: "head = [1, 2, 3, 4, 5]",
        expectedOutput: "[5, 4, 3, 2, 1]",
      },
      {
        id: "tc-06-2",
        input: "head = [1, 2]",
        expectedOutput: "[2, 1]",
      },
      {
        id: "tc-06-3",
        input: "head = []",
        expectedOutput: "[]",
      },
    ],
    hiddenTestCount: 1,
  },

  // 7. RUNTIME - Integer Division & Zero Check (JavaScript)
  {
    id: "debug-js-07",
    title: "Safe Average Calculation & Divide-by-Zero",
    difficulty: "Easy",
    language: "javascript",
    category: "runtime",
    description:
      "A utility function `calculateAverageRating` calculates the average rating of reviews. When an item has no reviews or filtered positive reviews is empty, it returns `NaN` or crashes downstream math operations.",
    expectedBehavior:
      "Return rounded average to 2 decimal places, or 0.0 when review array is empty.",
    constraints: ["0 <= reviews.length <= 1000", "0 <= rating <= 5"],
    buggyCode: `function calculateAverageRating(reviews) {
    // BUG: Missing check for empty array returns NaN
    let sum = 0;
    for (let i = 0; i <= reviews.length; i++) { // BUG: off-by-one reviews.length
        sum += reviews[i].rating;
    }
    return Number((sum / reviews.length).toFixed(2));
}`,
    solutionCode: `function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0.0;
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
        sum += reviews[i].rating;
    }
    return Number((sum / reviews.length).toFixed(2));
}`,
    hints: [
      "Check `reviews.length === 0`. Division by zero in JS results in NaN.",
      "Check the loop condition `i <= reviews.length`. On the last iteration, `reviews[reviews.length]` is undefined, causing `undefined.rating` TypeError!",
      "Change condition to `i < reviews.length` and guard against empty list at the top.",
    ],
    tags: ["Runtime", "TypeError", "Boundary", "Array"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-07-1",
        input: "reviews = [{rating: 4}, {rating: 5}]",
        expectedOutput: "4.5",
      },
      {
        id: "tc-07-2",
        input: "reviews = []",
        expectedOutput: "0",
      },
    ],
    hiddenTestCount: 1,
  },

  // 8. SEARCH / SORT - Custom Comparator Bug (Java)
  {
    id: "debug-java-08",
    title: "Comparator Contract Violation & Integer Overflow",
    difficulty: "Hard",
    language: "java",
    category: "search-sort",
    description:
      "Sort an array of points based on their distance from the origin. The comparator subtracts two values directly `(a.dist - b.dist)` instead of using `Integer.compare`, causing integer underflow/overflow bugs when coordinates have large negative numbers.",
    expectedBehavior:
      "Sort stably without overflow bugs under all coordinate values.",
    constraints: ["1 <= points.length <= 10^5", "-10^9 <= x, y <= 10^9"],
    buggyCode: `import java.util.Arrays;

public class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // BUG: Direct subtraction causes integer overflow when squared distances exceed Integer.MAX_VALUE
        Arrays.sort(points, (a, b) -> {
            int distA = a[0] * a[0] + a[1] * a[1];
            int distB = b[0] * b[0] + b[1] * b[1];
            return distA - distB; // BUG: Underflow / Overflow can invert sort order
        });
        return Arrays.copyOfRange(points, 0, k);
    }
}`,
    solutionCode: `import java.util.Arrays;

public class Solution {
    public int[][] kClosest(int[][] points, int k) {
        Arrays.sort(points, (a, b) -> {
            long distA = (long) a[0] * a[0] + (long) a[1] * a[1];
            long distB = (long) b[0] * b[0] + (long) b[1] * b[1];
            return Long.compare(distA, distB);
        });
        return Arrays.copyOfRange(points, 0, k);
    }
}`,
    hints: [
      "Calculate what happens if x = 100,000. x * x is 10^10, which overflows 32-bit signed integer (max 2 * 10^9)!",
      "Cast to `long` before squaring: `(long) a[0] * a[0] + (long) a[1] * a[1]`.",
      "Never subtract distances directly in comparator; use `Long.compare(distA, distB)`.",
    ],
    tags: ["Sorting", "Comparator", "Overflow", "Boundary"],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-08-1",
        input: "points = [[1,3],[-2,2]], k = 1",
        expectedOutput: "[[-2, 2]]",
      },
      {
        id: "tc-08-2",
        input: "points = [[3,3],[5,-1],[-2,4]], k = 2",
        expectedOutput: "[[3, 3], [-2, 4]]",
      },
    ],
    hiddenTestCount: 1,
  },

  // 9. LOOP - Maximum Subarray (Kadane's) Initialization Bug (C++)
  {
    id: "debug-cpp-09",
    title: "Maximum Subarray All-Negative Elements Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "loop",
    description:
      "Find the contiguous subarray with the largest sum and return its sum. The engineer initialized `maxSum` to 0, causing the function to return 0 when all elements in the input array are negative.",
    expectedBehavior:
      "Return the maximum subarray sum even when every number is negative.",
    constraints: ["1 <= nums.size() <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    buggyCode: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(const vector<int>& nums) {
    int maxSum = 0; // BUG: Fails when all elements are negative!
    int currentSum = 0;
    
    for (int x : nums) {
        currentSum += x;
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
        if (currentSum < 0) {
            currentSum = 0;
        }
    }
    return maxSum;
}`,
    solutionCode: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(const vector<int>& nums) {
    if (nums.empty()) return 0;
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (size_t i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
    hints: [
      "What should `maxSubArray([-5, -2, -8])` return? The answer is `-2`.",
      "Because `maxSum` is initialized to 0, `currentSum > maxSum` is never true for negative numbers.",
      "Initialize both `maxSum` and `currentSum` to `nums[0]`, and iterate starting from index 1.",
    ],
    tags: ["Kadane's Algorithm", "Array", "Loop", "Logic"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-09-1",
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        expectedOutput: "6",
        explanation: "[4, -1, 2, 1] has the largest sum = 6",
      },
      {
        id: "tc-09-2",
        input: "nums = [1]",
        expectedOutput: "1",
      },
      {
        id: "tc-09-3",
        input: "nums = [5, 4, -1, 7, 8]",
        expectedOutput: "23",
      },
    ],
    hiddenTestCount: 2,
  },

  // 10. SYNTAX & LOGIC - String Anagram Frequency Counter (Python)
  {
    id: "debug-py-10",
    title: "Anagram Character Frequency Equality Bug",
    difficulty: "Easy",
    language: "python",
    category: "syntax",
    description:
      "Given two strings `s` and `t`, return `True` if `t` is an anagram of `s`, and `False` otherwise. The code contains an indentation/syntax flaw and dictionary comparison oversight.",
    expectedBehavior:
      "Return True if character counts match identically, handling all edge cases.",
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
    buggyCode: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
        
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
        
    for ch in t:
        if ch not in counts:
            return False
        counts[ch] -= 1
        # BUG: Syntax/Logic check placed inside loop with premature positive return
        if counts[ch] < 0:
            return False
    return True`,
    solutionCode: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
        
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
        
    for ch in t:
        if ch not in counts or counts[ch] == 0:
            return False
        counts[ch] -= 1
        
    return True`,
    hints: [
      "Check length comparison first.",
      "If a character in t appears more times than in s, `counts[ch]` will be 0 before decrementing or negative after.",
      "Ensure all characters match frequency before returning.",
    ],
    tags: ["String", "Hash Table", "Logic"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    publicTests: [
      {
        id: "tc-10-1",
        input: 's = "anagram", t = "nagaram"',
        expectedOutput: "True",
      },
      {
        id: "tc-10-2",
        input: 's = "rat", t = "car"',
        expectedOutput: "False",
      },
    ],
    hiddenTestCount: 1,
  },
];
