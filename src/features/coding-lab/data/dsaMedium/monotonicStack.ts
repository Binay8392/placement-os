import { DebuggingProblem } from "../../types";

export const MONOTONIC_STACK_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-43",
    title: "Daily Temperatures Monotonic Stack Value vs Index Storage",
    difficulty: "Medium",
    language: "python",
    category: "stack-queue",
    description:
      "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0. In the stack implementation, temperature values are stored in the stack instead of indices, making it impossible to compute the day delta.",
    expectedBehavior:
      "Store indices on monotonic decreasing stack; when temperatures[i] > temperatures[stack[-1]], answer[prev] = i - prev in O(n) time.",
    constraints: [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100",
    ],
    buggyCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    stack = [] # BUG: Storing temperature values instead of indices!
    
    for i in range(n):
        curr = temperatures[i]
        # Since stack contains values, i - prev_temp evaluates day index minus temperature value!
        while stack and curr > stack[-1]:
            prev_temp = stack.pop()
            # res[prev_index] cannot be set because prev_index is lost!
            
        stack.append(curr)
        
    return res`,
    solutionCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    stack = [] # Monotonic decreasing stack storing indices
    
    for i in range(n):
        curr = temperatures[i]
        while stack and curr > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = i - prev_idx
            
        stack.append(i)
        
    return res`,
    hints: [
      "The result asks for 'how many days to wait', which is a difference between indices (`i - prev_idx`).",
      "Store indices on the stack. You can always retrieve the temperature using `temperatures[stack[-1]]`.",
    ],
    tags: ["Array", "Stack", "Monotonic Stack", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 739: Daily Temperatures in Python.
Requirements:
1. Monotonic decreasing stack storing indices.
2. Explain why each index is pushed and popped at most once, resulting in O(n) total time.`,
    promptEngineeringTips: [
      "Direct the model: 'Explicitly explain why storing indices rather than values is essential for index-distance problems.'",
    ],
    publicTests: [
      {
        id: "tc-med-43-1",
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        expectedOutput: "[1,1,4,2,1,1,0,0]",
      },
      {
        id: "tc-med-43-2",
        input: "temperatures = [30,40,50,60]",
        expectedOutput: "[1,1,1,0]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-44",
    title: "Online Stock Span Weight Accumulation Reset Bug",
    difficulty: "Medium",
    language: "java",
    category: "stack-queue",
    description:
      "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the stock's price in one day is the maximum number of consecutive days (starting today and going backward) for which the stock price was less than or equal to the price of that day. In the implementation below, the span counter is not accumulated when popping consecutive smaller quotes from the stack.",
    expectedBehavior:
      "Maintain monotonic stack of pairs (price, span); accumulate span += prev.span when price >= prev.price in O(1) amortized time.",
    constraints: [
      "1 <= price <= 10^5",
      "At most 10^4 calls will be made to next",
    ],
    buggyCode: `import java.util.Stack;

class StockSpanner {
    // Stack of [price, span]
    private Stack<int[]> stack;

    public StockSpanner() {
        stack = new Stack<>();
    }
    
    public int next(int price) {
        int span = 1;
        // BUG: span is simply incremented by 1 instead of accumulating prev[1]!
        // If a previously collapsed quote had span 5, popping it must add 5 to the current span!
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            int[] prev = stack.pop();
            span += 1; // Should be span += prev[1]!
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`,
    solutionCode: `import java.util.Stack;

class StockSpanner {
    private Stack<int[]> stack;

    public StockSpanner() {
        stack = new Stack<>();
    }
    
    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            int[] prev = stack.pop();
            span += prev[1];
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`,
    hints: [
      "Each popped stock price already compressed all consecutive days before it into its own `span`.",
      "You must add the popped element's full span (`span += prev[1]`).",
    ],
    tags: ["Stack", "Design", "Monotonic Stack", "Data Stream", "LeetCode Medium"],
    timeComplexity: "O(1) amortized per call",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Implement LeetCode 901: Online Stock Span in Java.
Provide:
1. Monotonic decreasing stack storing (price, span) pairs.
2. Proof that any sequence of N calls to next() takes O(N) time total (O(1) amortized).`,
    promptEngineeringTips: [
      "Ask the model: 'How does storing accumulated span in the stack avoid traversing the entire historical stream on each query?'",
    ],
    publicTests: [
      {
        id: "tc-med-44-1",
        input: 'calls: next(100), next(80), next(60), next(70), next(60), next(75), next(85)',
        expectedOutput: "[1, 1, 1, 2, 1, 4, 6]",
      },
      {
        id: "tc-med-44-2",
        input: 'calls: next(31), next(41), next(48), next(59), next(79)',
        expectedOutput: "[1, 2, 3, 4, 5]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-45",
    title: "Asteroid Collision Equal Magnitude Mutual Annihilation",
    difficulty: "Medium",
    language: "python",
    category: "stack-queue",
    description:
      "We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Find out the state of the asteroids after all collisions. When two asteroids of equal magnitude collide, BOTH must explode. The implementation below only destroys one.",
    expectedBehavior:
      "Simulate collisions using a stack; if stack top and incoming asteroid have equal magnitude with opposite directions, both explode.",
    constraints: [
      "2 <= asteroids.length <= 10^4",
      "-1000 <= asteroids[i] <= 1000",
      "asteroids[i] != 0",
    ],
    buggyCode: `def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []
    
    for a in asteroids:
        alive = True
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop() # Top exploded, continue checking
            elif stack[-1] == -a:
                # BUG: Only popped stack top without marking incoming asteroid as destroyed!
                # Both asteroids should be destroyed!
                stack.pop()
                # alive is still True, so 'a' gets pushed onto stack below!
            else:
                alive = False
                
        if alive:
            stack.append(a)
            
    return stack`,
    solutionCode: `def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []
    
    for a in asteroids:
        alive = True
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop()
            elif stack[-1] == -a:
                stack.pop()
                alive = False # Mutual destruction!
            else:
                alive = False
                
        if alive:
            stack.append(a)
            
    return stack`,
    hints: [
      "If the top of the stack is 5 and the incoming asteroid is -5, both are destroyed.",
      "Make sure to set `alive = False` when `stack[-1] == -a` so the incoming asteroid is not pushed.",
    ],
    tags: ["Array", "Stack", "Simulation", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 735: Asteroid Collision in Python.
Identify all collision cases:
1. Right meets right (+, +) -> No collision.
2. Left meets right (-, +) -> Moving away from each other, no collision.
3. Right meets left (+, -) -> Collision! Handle top < abs(a), top == abs(a), top > abs(a).`,
    promptEngineeringTips: [
      "Ask the model: 'Under what exact condition do two adjacent asteroids collide in a 1D line?'",
    ],
    publicTests: [
      {
        id: "tc-med-45-1",
        input: "asteroids = [5,10,-5]",
        expectedOutput: "[5,10]",
      },
      {
        id: "tc-med-45-2",
        input: "asteroids = [8,-8]",
        expectedOutput: "[]",
        explanation: "The 8 and -8 collide exploding each other.",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-46",
    title: "Evaluate Reverse Polish Notation Operand Order Inversion",
    difficulty: "Medium",
    language: "cpp",
    category: "stack-queue",
    description:
      "You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation (postfix). Evaluate the expression. Valid operators are '+', '-', '*', and '/'. In the code below, when an operator is encountered, operands are popped in reverse order for non-commutative operations (- and /), causing inverted calculations.",
    expectedBehavior:
      "First popped is the right operand (b), second popped is the left operand (a); evaluate a - b and a / b truncated toward zero in O(n) time.",
    constraints: [
      "1 <= tokens.length <= 10^4",
      "tokens[i] is either an operator or an integer in range [-200, 200]",
    ],
    buggyCode: `#include <vector>
#include <string>
#include <stack>
using namespace std;

int evalRPN(vector<string>& tokens) {
    stack<int> st;
    
    for (const string& s : tokens) {
        if (s == "+" || s == "-" || s == "*" || s == "/") {
            // BUG: Popping order inverted!
            // In postfix "4 2 -", 4 was pushed first, then 2.
            // When popping: first pop is 2 (b), second pop is 4 (a).
            // The code assigns a = 2, b = 4, computing 2 - 4 = -2 instead of 4 - 2 = 2!
            int a = st.top(); st.pop();
            int b = st.top(); st.pop();
            
            if (s == "+") st.push(a + b);
            else if (s == "-") st.push(a - b);
            else if (s == "*") st.push(a * b);
            else if (s == "/") st.push(a / b);
        } else {
            st.push(stoi(s));
        }
    }
    return st.top();
}`,
    solutionCode: `#include <vector>
#include <string>
#include <stack>
using namespace std;

int evalRPN(vector<string>& tokens) {
    stack<int> st;
    
    for (const string& s : tokens) {
        if (s == "+" || s == "-" || s == "*" || s == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            
            if (s == "+") st.push(a + b);
            else if (s == "-") st.push(a - b);
            else if (s == "*") st.push(a * b);
            else if (s == "/") st.push(a / b);
        } else {
            st.push(stoi(s));
        }
    }
    return st.top();
}`,
    hints: [
      "Stack is LIFO (Last-In, First-Out).",
      "The top of the stack is the second operand (`b`). The element below it is the first operand (`a`). Evaluate `a - b` and `a / b`.",
    ],
    tags: ["Array", "Math", "Stack", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Write a C++ solution for LeetCode 150: Evaluate Reverse Polish Notation.
Highlight:
1. Exact pop order of operands for non-commutative subtraction and division.
2. Division integer truncation toward zero (C++11 standard behavior).
3. Space and time complexity.`,
    promptEngineeringTips: [
      "Instruct the AI: 'Explicitly trace tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"] with the stack after each token.'",
    ],
    publicTests: [
      {
        id: "tc-med-46-1",
        input: 'tokens = ["2","1","+","3","*"]',
        expectedOutput: "9",
        explanation: "((2 + 1) * 3) = 9",
      },
      {
        id: "tc-med-46-2",
        input: 'tokens = ["4","13","5","/","+"]',
        expectedOutput: "6",
        explanation: "(4 + (13 / 5)) = 6",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-47",
    title: "Next Greater Element II Circular Array Modulo Traversal",
    difficulty: "Medium",
    language: "python",
    category: "stack-queue",
    description:
      "Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element. The code iterates 2 * n times but forgets to modulo index access on nums[i % n], raising IndexError.",
    expectedBehavior:
      "Simulate circular traversal with 2 * n iterations using i % n to query values in O(n) time.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
    ],
    buggyCode: `def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []
    
    # Iterate twice to simulate circular traversal
    for i in range(2 * n):
        # BUG: Accessing nums[i] directly!
        # When i >= n, nums[i] raises IndexError! Must use nums[i % n].
        while stack and nums[stack[-1]] < nums[i]:
            res[stack.pop()] = nums[i]
            
        if i < n:
            stack.append(i)
            
    return res`,
    solutionCode: `def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []
    
    for i in range(2 * n):
        curr = nums[i % n]
        while stack and nums[stack[-1]] < curr:
            res[stack.pop()] = curr
            
        if i < n:
            stack.append(i)
            
    return res`,
    hints: [
      "To simulate circular traversal without doubling the memory, iterate from 0 to `2 * n - 1`.",
      "Access the elements via `nums[i % n]`.",
    ],
    tags: ["Array", "Stack", "Monotonic Stack", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 503: Next Greater Element II in Python.
Explain:
1. How virtual concatenation (looping up to 2 * n with modulo) handles circularity without doubling array memory.
2. Why we only push indices when i < n.`,
    promptEngineeringTips: [
      "Ask the model: 'Why do we only push indices to the stack in the first pass (i < n)?'",
    ],
    publicTests: [
      {
        id: "tc-med-47-1",
        input: "nums = [1,2,1]",
        expectedOutput: "[2,-1,2]",
      },
      {
        id: "tc-med-47-2",
        input: "nums = [1,2,3,4,3]",
        expectedOutput: "[2,3,4,-1,4]",
      },
    ],
    hiddenTestCount: 3,
  },
];
