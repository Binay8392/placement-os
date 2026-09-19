import { DebuggingProblem } from "../../types";

export const INTERVALS_AND_MATRIX_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-53",
    title: "Merge Intervals Overlapping End Boundary Extension",
    difficulty: "Medium",
    language: "python",
    category: "boundary",
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input. In the code below, when two intervals overlap, the merged interval's end is directly set to the current interval's end instead of taking the maximum of both ends.",
    expectedBehavior:
      "Sort intervals by start time; if current start <= merged end, merged[-1][1] = max(merged[-1][1], current end) in O(n log n) time.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4",
    ],
    buggyCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # BUG: Directly setting merged[-1][1] = interval[1]!
            # If interval [1, 5] is followed by [2, 4], merged[-1][1] becomes 4 instead of staying 5!
            merged[-1][1] = interval[1]
            
    return merged`,
    solutionCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    return merged`,
    hints: [
      "Consider intervals [1, 4] and [2, 3]. Interval 2 is completely contained inside interval 1.",
      "Always take `max(merged[-1][1], interval[1])` to avoid shrinking an already longer end boundary.",
    ],
    tags: ["Array", "Sorting", "Intervals", "LeetCode Medium"],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 56: Merge Intervals in Python.
Requirements:
1. Explain sorting intervals by start point.
2. Clearly explain why max(merged[-1][1], interval[1]) is required for engulfed intervals.
3. State Time and Space complexity.`,
    promptEngineeringTips: [
      "Ask the model: 'What happens when interval B is completely subsumed inside interval A?'",
    ],
    publicTests: [
      {
        id: "tc-med-53-1",
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
      },
      {
        id: "tc-med-53-2",
        input: "intervals = [[1,4],[4,5]]",
        expectedOutput: "[[1,5]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-54",
    title: "Non-overlapping Intervals Greedy Criterion Inversion",
    difficulty: "Medium",
    language: "cpp",
    category: "algorithm",
    description:
      "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping. The implementation sorts intervals by start time instead of end time and picks the later ending interval, causing suboptimal removals.",
    expectedBehavior:
      "Sort intervals by end time; greedily keep intervals that finish earliest to leave maximum room for future intervals in O(n log n) time.",
    constraints: [
      "1 <= intervals.length <= 10^5",
      "intervals[i].length == 2",
      "-5 * 10^4 <= starti < endi <= 5 * 10^4",
    ],
    buggyCode: `#include <vector>
#include <algorithm>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    // BUG: Sorting by start time and picking the longer ending interval!
    // Greedy interval scheduling must sort by END time to maximize room for subsequent intervals!
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[0] < b[0];
    });
    
    int removals = 0;
    int prevEnd = intervals[0][1];
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < prevEnd) {
            removals++;
            // BUG: Keeps the longer interval instead of the one finishing earlier!
            prevEnd = max(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    return removals;
}`,
    solutionCode: `#include <vector>
#include <algorithm>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1]; // Sort by end time
    });
    
    int removals = 0;
    int prevEnd = intervals[0][1];
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < prevEnd) {
            removals++;
        } else {
            prevEnd = intervals[i][1];
        }
    }
    return removals;
}`,
    hints: [
      "Interval scheduling theorem: The optimal greedy choice is to always pick the interval that finishes earliest (smallest end time).",
      "Sort by `a[1] < b[1]` and update `prevEnd = intervals[i][1]` only when no overlap occurs.",
    ],
    tags: ["Array", "Dynamic Programming", "Greedy", "Sorting", "LeetCode Medium"],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 435: Non-overlapping Intervals in C++.
Provide:
1. Proof of the greedy-choice property using earliest finish time (sorting by end time).
2. Contrast with sorting by start time.
3. Time: O(N log N), Space: O(1).`,
    promptEngineeringTips: [
      "Instruct the model: 'State the interval scheduling theorem and explain why earliest end time leaves maximum remaining time.'",
    ],
    publicTests: [
      {
        id: "tc-med-54-1",
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        expectedOutput: "1",
        explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping.",
      },
      {
        id: "tc-med-54-2",
        input: "intervals = [[1,2],[1,2],[1,2]]",
        expectedOutput: "2",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-55",
    title: "Set Matrix Zeroes In-Place Marker Row 0 Cross-Contamination",
    difficulty: "Medium",
    language: "java",
    category: "boundary",
    description:
      "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place with O(1) extra space. The code below uses row 0 and col 0 as flags, but fails to use separate boolean variables for row 0 and col 0 themselves, causing matrix[0][0] to overwrite both dimensions.",
    expectedBehavior:
      "Use first row and column as indicator arrays; record whether original row 0 and col 0 contained zeroes using boolean flags in O(m * n) time and O(1) space.",
    constraints: [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 <= m, n <= 200",
      "-2^31 <= matrix[i][j] <= 2^31 - 1",
    ],
    buggyCode: `public class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        
        // BUG: Using matrix[0][0] for BOTH row 0 and col 0!
        // If a zero is in row 0, it zeroes matrix[0][0], which then mistakenly causes the ENTIRE column 0 to be set to 0!
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (matrix[r][c] == 0) {
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }
        
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                    matrix[r][c] = 0;
                }
            }
        }
        
        if (matrix[0][0] == 0) {
            for (int c = 0; c < n; c++) matrix[0][c] = 0;
            for (int r = 0; r < m; r++) matrix[r][0] = 0;
        }
    }
}`,
    solutionCode: `public class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        boolean firstRowZero = false;
        boolean firstColZero = false;
        
        for (int r = 0; r < m; r++) {
            if (matrix[r][0] == 0) firstColZero = true;
        }
        for (int c = 0; c < n; c++) {
            if (matrix[0][c] == 0) firstRowZero = true;
        }
        
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                if (matrix[r][c] == 0) {
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }
        
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                    matrix[r][c] = 0;
                }
            }
        }
        
        if (firstRowZero) {
            for (int c = 0; c < n; c++) matrix[0][c] = 0;
        }
        if (firstColZero) {
            for (int r = 0; r < m; r++) matrix[r][0] = 0;
        }
    }
}`,
    hints: [
      "Row 0 and Col 0 intersect at cell (0, 0). One cell cannot independently store two boolean flags.",
      "Store whether row 0 has any zero in a dedicated boolean variable, and whether col 0 has any zero in another.",
    ],
    tags: ["Array", "Hash Table", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Solve LeetCode 73: Set Matrix Zeroes in Java.
Constraints:
- Must be strict O(1) auxiliary space (modify matrix in-place).
- Address how to prevent the intersection at matrix[0][0] from cross-contaminating row 0 and column 0.`,
    promptEngineeringTips: [
      "Ask the model: 'Explain why using row 0 and column 0 as markers requires handling matrix[0][0] with extra boolean flags.'",
    ],
    publicTests: [
      {
        id: "tc-med-55-1",
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        expectedOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
      },
      {
        id: "tc-med-55-2",
        input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        expectedOutput: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-56",
    title: "Rotate Image In-Place Transpose Diagonal Double-Flip",
    difficulty: "Medium",
    language: "python",
    category: "boundary",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. In the code below, the transpose loop runs across all elements instead of the upper triangle (j > i), swapping elements twice and reverting the matrix back to its original layout.",
    expectedBehavior:
      "Transpose along main diagonal (j > i), then reverse each row horizontally in O(n^2) time and O(1) space.",
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000",
    ],
    buggyCode: `def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)
    
    # Transpose matrix
    for i in range(n):
        # BUG: j runs from 0 to n!
        # Swapping (i, j) with (j, i) twice swaps them and then immediately swaps them back!
        # Must run j from i + 1 to n (upper triangle only)!
        for j in range(n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
            
    # Reverse each row
    for r in range(n):
        matrix[r].reverse()`,
    solutionCode: `def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)
    
    # 1. Transpose upper triangle only
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
            
    # 2. Reverse each row horizontally
    for r in range(n):
        matrix[r].reverse()`,
    hints: [
      "Rotating 90 degrees clockwise is equivalent to: (1) Transpose matrix, (2) Reverse each row.",
      "In the transpose step, only iterate over the upper triangle (`range(i + 1, n)`) to prevent double swapping.",
    ],
    tags: ["Array", "Math", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Solve LeetCode 48: Rotate Image in Python in-place without allocating another 2D matrix.
Explain:
1. Mathematical composition: 90 deg clockwise = Transpose + Horizontal Reflection.
2. Why the transpose inner loop must start at i + 1.
3. Compare with direct 4-way cyclical element rotation.`,
    promptEngineeringTips: [
      "Ask the model: 'Explain the 4-way cyclic swap formula vs Transpose + Reverse.'",
    ],
    publicTests: [
      {
        id: "tc-med-56-1",
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
      },
      {
        id: "tc-med-56-2",
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      },
    ],
    hiddenTestCount: 3,
  },
];
