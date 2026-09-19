import { DebuggingProblem } from "../../types";

export const STRINGS_SLIDING_WINDOW_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-07",
    title: "Longest Substring Without Repeating Characters Left Pointer Regress",
    difficulty: "Medium",
    language: "python",
    category: "string",
    description:
      "Given a string s, find the length of the longest substring without duplicate characters. The solution below updates the left window pointer directly to the last seen position + 1 without checking if that position is behind the current left boundary.",
    expectedBehavior:
      "Compute the length of the longest substring with unique characters in O(n) time using sliding window.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces",
    ],
    buggyCode: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char = s[right]
        if char in last_seen:
            # BUG: Unconditionally setting left = last_seen[char] + 1!
            # If char was seen earlier, before the current left boundary, left regresses backward!
            left = last_seen[char] + 1
            
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char = s[right]
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
            
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
    hints: [
      "Test with string 'abba'. When you see the second 'a' at index 3, where does left jump if you don't check last_seen['a'] >= left?",
      "Ensure the left pointer never moves backward: use max(left, last_seen[char] + 1).",
    ],
    tags: ["String", "Sliding Window", "Hash Table", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m, n))",
    aiPromptTemplate: `Task: Solve LeetCode 3: Longest Substring Without Repeating Characters in Python.
Target:
- O(n) one-pass sliding window with hash map.
- Explain why 'left = max(left, char_map[c] + 1)' is mandatory.
- Walk through the dry run on string 'abba'.`,
    promptEngineeringTips: [
      "Ask the model to explain how the left pointer could jump backward if unconditional assignment is used.",
    ],
    publicTests: [
      {
        id: "tc-med-07-1",
        input: 's = "abcabcbb"',
        expectedOutput: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        id: "tc-med-07-2",
        input: 's = "abba"',
        expectedOutput: "2",
        explanation: 'The answer is "ab" or "ba", length 2.',
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-08",
    title: "Longest Repeating Character Replacement Window Valid Condition",
    difficulty: "Medium",
    language: "cpp",
    category: "string",
    description:
      "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter. The code incorrectly shrinks the window based on string length rather than window length.",
    expectedBehavior:
      "Maintain a frequency map and max frequency count; shrink window whenever (window_length - max_freq) > k.",
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of only uppercase English letters",
      "0 <= k <= s.length",
    ],
    buggyCode: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int maxFreq = 0;
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        count[s[right] - 'A']++;
        maxFreq = max(maxFreq, count[s[right] - 'A']);
        
        // BUG: Checking right - left > k instead of (right - left + 1) - maxFreq > k
        if (right - left > k) {
            count[s[left] - 'A']--;
            left++;
        }
        maxLength = max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
    solutionCode: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int maxFreq = 0;
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        count[s[right] - 'A']++;
        maxFreq = max(maxFreq, count[s[right] - 'A']);
        
        while ((right - left + 1) - maxFreq > k) {
            count[s[left] - 'A']--;
            left++;
        }
        maxLength = max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
    hints: [
      "The number of characters we need to replace in window [left..right] is (window_length - max_freq).",
      "If that number exceeds k, the window is invalid and must be shrunk from the left.",
    ],
    tags: ["String", "Sliding Window", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) (26 uppercase chars)",
    aiPromptTemplate: `Task: Implement LeetCode 424: Longest Repeating Character Replacement in C++.
Enforce:
- Time: O(n), Space: O(1) auxiliary.
- Clarify why maxFreq does NOT need to be strictly decremented when the window shrinks.`,
    promptEngineeringTips: [
      "Challenge the model: 'Does maxFreq need to be recalculated when left moves? Why or why not?'",
    ],
    publicTests: [
      {
        id: "tc-med-08-1",
        input: 's = "ABAB", k = 2',
        expectedOutput: "4",
      },
      {
        id: "tc-med-08-2",
        input: 's = "AABABBA", k = 1',
        expectedOutput: "4",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-09",
    title: "Permutation in String Fixed Window Frequency Array Shift",
    difficulty: "Medium",
    language: "java",
    category: "string",
    description:
      "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. The sliding window code below removes the wrong character from the left boundary when shifting the fixed-size window.",
    expectedBehavior:
      "Compare frequency arrays for window of size s1.length() in s2 in O(n) time.",
    constraints: [
      "1 <= s1.length, s2.length <= 10^4",
      "s1 and s2 consist of lowercase English letters",
    ],
    buggyCode: `import java.util.Arrays;

public class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        int[] count1 = new int[26];
        int[] count2 = new int[26];
        int len1 = s1.length();
        
        for (int i = 0; i < len1; i++) {
            count1[s1.charAt(i) - 'a']++;
            count2[s2.charAt(i) - 'a']++;
        }
        
        if (Arrays.equals(count1, count2)) return true;
        
        for (int i = len1; i < s2.length(); i++) {
            count2[s2.charAt(i) - 'a']++;
            // BUG: Evicting character at index i instead of (i - len1)
            count2[s2.charAt(i) - 'a']--; 
            
            if (Arrays.equals(count1, count2)) return true;
        }
        return false;
    }
}`,
    solutionCode: `import java.util.Arrays;

public class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        int[] count1 = new int[26];
        int[] count2 = new int[26];
        int len1 = s1.length();
        
        for (int i = 0; i < len1; i++) {
            count1[s1.charAt(i) - 'a']++;
            count2[s2.charAt(i) - 'a']++;
        }
        
        if (Arrays.equals(count1, count2)) return true;
        
        for (int i = len1; i < s2.length(); i++) {
            count2[s2.charAt(i) - 'a']++;
            count2[s2.charAt(i - len1) - 'a']--;
            
            if (Arrays.equals(count1, count2)) return true;
        }
        return false;
    }
}`,
    hints: [
      "When sliding the window by 1 position to the right, you include char at index i.",
      "The character that exits the window on the left is at index (i - len1).",
    ],
    tags: ["String", "Sliding Window", "Hash Table", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write a Java solution for LeetCode 567: Permutation in String.
Requirements:
- Window size equals s1.length().
- Slide the window across s2 with O(1) space and O(26 * n) runtime.
- Emphasize proper sliding window addition/eviction indices.`,
    promptEngineeringTips: [
      "Ask the model to specify the exact index of the entering and leaving character in the sliding window step.",
    ],
    publicTests: [
      {
        id: "tc-med-09-1",
        input: 's1 = "ab", s2 = "eidbaooo"',
        expectedOutput: "true",
      },
      {
        id: "tc-med-09-2",
        input: 's1 = "ab", s2 = "eidboaoo"',
        expectedOutput: "false",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-10",
    title: "Group Anagrams Hash Key Tuple Collision",
    difficulty: "Medium",
    language: "python",
    category: "string",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order. The code attempts to group by character sum which generates false collisions (e.g. 'ac' and 'bb' sum to identical integer values).",
    expectedBehavior:
      "Group strings by canonical key (sorted string or 26-element character count tuple) in O(n * k log k) or O(n * k) time.",
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters",
    ],
    buggyCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    
    for s in strs:
        # BUG: Using ASCII sum as key!
        # "ac" has sum 97 + 99 = 196. "bb" has sum 98 + 98 = 196.
        # They are NOT anagrams but will be erroneously grouped together!
        key = sum(ord(c) for c in s)
        groups[key].append(s)
        
    return list(groups.values())`,
    solutionCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
        
    return list(groups.values())`,
    hints: [
      "Sum of characters is not unique for anagrams (pigeonhole collisions).",
      "Use either the sorted string `tuple(sorted(s))` or a 26-tuple of character counts as the dictionary key.",
    ],
    tags: ["String", "Hash Table", "Sorting", "LeetCode Medium"],
    timeComplexity: "O(n * k log k)",
    spaceComplexity: "O(n * k)",
    aiPromptTemplate: `Task: Implement LeetCode 49: Group Anagrams in Python.
Requirements:
1. Explain why hashing character ASCII sums or product of primes can fail or cause collisions/overflow.
2. Implement using canonical sorted tuple or 26-element frequency tuple.
3. Analyze Time and Space complexity.`,
    promptEngineeringTips: [
      "Instruct the model: 'Provide counter-examples of false positive collisions when naive hash heuristics are used.'",
    ],
    publicTests: [
      {
        id: "tc-med-10-1",
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        id: "tc-med-10-2",
        input: 'strs = [""]',
        expectedOutput: '[[""]]',
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-11",
    title: "Minimum Size Subarray Sum Window Contraction Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "boundary",
    description:
      "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead. The implementation uses an if statement instead of while for contraction, missing shorter valid subarrays.",
    expectedBehavior:
      "Expand right to meet target, then shrink left with while loop to minimize length in O(n) time.",
    constraints: [
      "1 <= target <= 10^9",
      "1 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^4",
    ],
    buggyCode: `#include <vector>
#include <algorithm>
using namespace std;

int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0;
    int currentSum = 0;
    int minLength = INT_MAX;
    
    for (int right = 0; right < nums.size(); right++) {
        currentSum += nums[right];
        
        // BUG: 'if' instead of 'while'!
        // When currentSum >= target, left could potentially be contracted multiple times!
        if (currentSum >= target) {
            minLength = min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    return minLength == INT_MAX ? 0 : minLength;
}`,
    solutionCode: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0;
    int currentSum = 0;
    int minLength = INT_MAX;
    
    for (int right = 0; right < nums.size(); right++) {
        currentSum += nums[right];
        
        while (currentSum >= target) {
            minLength = min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    return minLength == INT_MAX ? 0 : minLength;
}`,
    hints: [
      "A newly added element might be large enough that multiple elements from the left can be dropped while still maintaining sum >= target.",
      "Replace `if (currentSum >= target)` with `while (currentSum >= target)`.",
    ],
    tags: ["Array", "Sliding Window", "Binary Search", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write an optimal C++ solution for LeetCode 209: Minimum Size Subarray Sum.
Include:
- Two-pointer dynamic sliding window.
- Detail why each element is added and removed at most once, proving O(n) amortized time.`,
    promptEngineeringTips: [
      "Ask the model: 'Explain why a nested while loop inside a for loop does not mean O(n^2) runtime.'",
    ],
    publicTests: [
      {
        id: "tc-med-11-1",
        input: "target = 7, nums = [2,3,1,2,4,3]",
        expectedOutput: "2",
      },
      {
        id: "tc-med-11-2",
        input: "target = 4, nums = [1,4,4]",
        expectedOutput: "1",
      },
    ],
    hiddenTestCount: 3,
  },
];
