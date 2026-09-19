import { CapgeminiQuestion } from "./types";

export const FUNDAMENTALS_QUESTIONS: CapgeminiQuestion[] = [
  {
    id: "capg-fund-01",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Operator Precedence & Evaluation",
    difficulty: "Easy",
    type: "output-prediction",
    title: "Prefix vs Postfix Increment Sequence",
    question: "Predict the exact console output of the following C/C++ code snippet:",
    language: "cpp",
    codeSnippet: `#include <stdio.h>

int main() {
    int a = 5, b = 10;
    int c = ++a + b--;
    printf("%d %d %d\\n", a, b, c);
    return 0;
}`,
    options: [
      { id: "A", text: "5 9 15" },
      { id: "B", text: "6 9 16" },
      { id: "C", text: "6 10 16" },
      { id: "D", text: "5 10 15" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "++a is pre-increment, so 'a' becomes 6 immediately and evaluates to 6. b-- is post-decrement, so it evaluates to 10 in the addition and decrements to 9 afterwards. c = 6 + 10 = 16. Final values: a=6, b=9, c=16.",
      concept: "Pre-increment modifies the variable before yielding value; post-decrement yields current value in the expression and decrements thereafter.",
      takeaway: "In campus technical rounds, prefix and postfix chains frequently appear in evaluation expressions. Trace values step-by-step.",
      wrongOptionsAnalysis: "Option A forgets pre-increment; Option C forgets that b decrements before the printf call.",
    },
    tags: ["Operators", "Increment", "Prefix", "Postfix"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-fund-02",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Parameter Passing Mechanisms",
    difficulty: "Medium",
    type: "output-prediction",
    title: "Pass-by-Value vs Pointer Reference",
    question: "What will be printed by the following code when executed?",
    language: "cpp",
    codeSnippet: `#include <stdio.h>

void modify(int x, int *y) {
    x = x + 10;
    *y = *y + 20;
}

int main() {
    int p = 15, q = 25;
    modify(p, &q);
    printf("p = %d, q = %d\\n", p, q);
    return 0;
}`,
    options: [
      { id: "A", text: "p = 25, q = 45" },
      { id: "B", text: "p = 15, q = 25" },
      { id: "C", text: "p = 15, q = 45" },
      { id: "D", text: "p = 25, q = 25" },
    ],
    correctAnswer: "C",
    explanation: {
      correctReason: "'p' is passed by value, so 'modify' receives a copy and changes to 'x' do not affect 'p' in main. 'q' is passed by address (&q); dereferencing '*y = *y + 20' directly updates the memory address of 'q', changing it from 25 to 45.",
      concept: "Pass-by-value copies the operand onto the activation record stack frame; pass-by-pointer/reference provides direct address mutation.",
      takeaway: "Always check whether an ampersand (&) or pointer (*) is used in the function signature to determine if the caller variable is mutated.",
      wrongOptionsAnalysis: "Option A mistakenly assumes p was passed by reference; Option B ignores pointer dereference modification.",
    },
    tags: ["Functions", "Pointers", "Pass-by-value", "Memory"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-fund-03",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Recursion & Base Cases",
    difficulty: "Medium",
    type: "debugging",
    title: "Recursive Power Function Stack Overflow Bug",
    question: "The following recursive function is intended to compute x^n for non-negative integers n, but causes a runtime crash for n = 0. Identify the root cause and required fix.",
    language: "python",
    codeSnippet: `def power(x, n):
    if n == 1:
        return x
    return x * power(x, n - 1)`,
    options: [
      { id: "A", text: "Change loop to return x * power(x, n)" },
      { id: "B", text: "Missing base case: if n == 0 return 1; if n == 1 return x" },
      { id: "C", text: "Recursion depth is too small; increase sys.setrecursionlimit" },
      { id: "D", text: "The power function must always take floats" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "When n = 0 is supplied, the check 'n == 1' is false, so it calls power(x, -1), power(x, -2) indefinitely until RecursionError (stack overflow) occurs. Any number to the 0th power is 1, so the correct base case is 'if n == 0: return 1'.",
      concept: "Every recursive function requires a base condition that covers the minimum valid domain input (here n = 0) and prevents infinite recursion.",
      takeaway: "In debugging interviews, always test n = 0, n = 1, and negative bounds first against the base conditions.",
      wrongOptionsAnalysis: "Option A creates infinite recursion immediately; Option C treats the symptom without fixing the broken base case.",
    },
    tags: ["Recursion", "Debugging", "Base Case", "Stack Overflow"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-fund-04",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    type: "mcq",
    title: "Check If an Integer Is a Power of Two",
    question: "Which of the following bitwise expressions correctly checks whether a positive integer n is a power of 2 in O(1) time?",
    options: [
      { id: "A", text: "(n | (n - 1)) == 0" },
      { id: "B", text: "(n & (n - 1)) == 0" },
      { id: "C", text: "(n ^ (n - 1)) == 0" },
      { id: "D", text: "(n & (n + 1)) == 0" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "A power of 2 has exactly one set bit (e.g., 8 = 1000 in binary). Subtracting 1 flips that bit and sets all lower bits (7 = 0111). Performing bitwise AND (n & (n - 1)) yields 0000. Hence, for positive n, (n & (n - 1)) == 0 verifies power of 2.",
      concept: "Subtracting 1 from an integer flips the lowest set bit and all bits below it. ANDing n with n-1 clears that lowest set bit.",
      takeaway: "Bitwise tricks like n & (n - 1) and n & (-n) are common in technical screening rounds.",
      wrongOptionsAnalysis: "Option A tests for all bits zero which is impossible for positive n; Option C checks if n and n-1 are identical.",
    },
    tags: ["Bit Manipulation", "Binary", "Efficiency", "Math"],
    estimatedTimeMinutes: 1,
  },
  {
    id: "capg-fund-05",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Memory Management: Stack vs Heap",
    difficulty: "Medium",
    type: "scenario",
    title: "Memory Allocation Lifetime Scenario",
    question: "A developer allocates an integer array inside a function using 'int arr[100];' and returns 'arr' from the function to caller code. What will happen at runtime in C/C++?",
    options: [
      { id: "A", text: "The array persists safely because arrays in C are always placed on the heap" },
      { id: "B", text: "Undefined behavior / dangling pointer, because 'arr' is allocated on the stack and deallocated upon function return" },
      { id: "C", text: "A compilation error will always be triggered because C prohibits returning pointers" },
      { id: "D", text: "The operating system automatically moves 'arr' to the data segment" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Local automatic variables declared as 'int arr[100]' are allocated on the call stack. Once the function returns, its stack frame is popped and invalidated. Returning a pointer to that memory creates a dangling pointer; accessing it causes undefined behavior.",
      concept: "Stack memory is scoped strictly to the function activation lifetime. Dynamically allocated memory (via malloc/calloc/new) lives on the heap until explicitly freed.",
      takeaway: "To return an array from a C function, either allocate dynamically with malloc() or pass a buffer allocated by the caller.",
      wrongOptionsAnalysis: "Option A is false (local arrays are on stack); Option C is false (C compilers issue a warning, but can emit code); Option D is fabricated.",
    },
    tags: ["Memory", "Stack", "Heap", "Dangling Pointer"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-fund-06",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Loop Termination & Boundary Errors",
    difficulty: "Easy",
    type: "debugging",
    title: "Off-by-One Loop Array Bounds Violation",
    question: "Find the critical bug in the following C snippet that sums elements of an array of size N:",
    language: "cpp",
    codeSnippet: `int sumElements(int arr[], int n) {
    int total = 0;
    for (int i = 0; i <= n; i++) {
        total += arr[i];
    }
    return total;
}`,
    options: [
      { id: "A", text: "total should be initialized to 1 instead of 0" },
      { id: "B", text: "The loop condition 'i <= n' iterates n+1 times, accessing arr[n] which is out-of-bounds" },
      { id: "C", text: "The return statement must use pointer syntax: return *total" },
      { id: "D", text: "Arrays in C cannot be passed to functions without size template" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "In 0-indexed arrays of size n, valid indices are 0 to n-1. The condition 'i <= n' executes when i = n, accessing arr[n]. This reads unallocated memory, causing garbage values or segmentation faults. The condition must be 'i < n'.",
      concept: "0-indexed collections have bounds [0, n - 1]. Loop conditions over arrays should strictly use 'i < n'.",
      takeaway: "The classic off-by-one error (Fencepost error) is the most common bug in enterprise debugging assessments.",
      wrongOptionsAnalysis: "Option A ruins summation; Option C is invalid syntax; Option D is false.",
    },
    tags: ["Loop", "Array", "Off-by-One", "Debugging"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-fund-07",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Time Complexity Analysis",
    difficulty: "Medium",
    type: "mcq",
    title: "Geometric Loop Time Complexity",
    question: "What is the worst-case time complexity of the following nested loop structure?",
    language: "cpp",
    codeSnippet: `void solve(int n) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j *= 2) {
            count++;
        }
    }
}`,
    options: [
      { id: "A", text: "O(n^2)" },
      { id: "B", text: "O(n log n)" },
      { id: "C", text: "O(log n)" },
      { id: "D", text: "O(n)" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "The outer loop runs n times (i from 1 to n with step 1). The inner loop starts at j = 1 and doubles j each iteration (j *= 2) until j > n, executing log2(n) times. The total operations are n * log2(n), giving O(n log n).",
      concept: "When an index is multiplied or divided by a constant factor in each loop step, it runs in logarithmic time O(log n).",
      takeaway: "Look at the increment operation: addition means linear, multiplication/division means logarithmic.",
      wrongOptionsAnalysis: "Option A assumes the inner loop increments by 1; Option C ignores the outer loop; Option D is an underestimate.",
    },
    tags: ["Complexity", "Big-O", "Loops", "Algorithm Analysis"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-fund-08",
    category: "fundamentals",
    categoryLabel: "Programming Fundamentals",
    topic: "Pointer Arithmetic & Array Addressing",
    difficulty: "Medium",
    type: "output-prediction",
    title: "Array Pointer Arithmetic Traversal",
    question: "What will be printed by this C program?",
    language: "cpp",
    codeSnippet: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    ptr += 2;
    printf("%d %d\\n", *ptr, *(ptr + 1));
    return 0;
}`,
    options: [
      { id: "A", text: "20 30" },
      { id: "B", text: "30 40" },
      { id: "C", text: "12 13" },
      { id: "D", text: "30 50" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "'arr' points to index 0 (value 10). 'ptr += 2' advances the pointer by 2 * sizeof(int) bytes to index 2 (value 30). '*ptr' evaluates to 30. '*(ptr + 1)' evaluates to index 3 (value 40). Output: 30 40.",
      concept: "Pointer arithmetic in C automatically multiplies the added offset by the size of the referenced datatype.",
      takeaway: "Pointer offset addition *(ptr + k) is mathematically equivalent to ptr[k] and arr[initial_index + k].",
      wrongOptionsAnalysis: "Option A is off-by-one; Option C mistakenly treats pointer arithmetic as byte increment.",
    },
    tags: ["Pointers", "Arrays", "Arithmetic", "C"],
    estimatedTimeMinutes: 2,
  },
];
