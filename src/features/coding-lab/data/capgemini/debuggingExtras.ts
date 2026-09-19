import { CapgeminiQuestion } from "./types";

export const DEBUGGING_EXTRA_QUESTIONS: CapgeminiQuestion[] = [
  {
    id: "capg-debug-js-01",
    category: "se-web",
    categoryLabel: "Software Engineering & Web",
    topic: "JavaScript Event Loop & Closures",
    difficulty: "Medium",
    type: "debugging",
    title: "Var Scoping in Asynchronous SetTimeout Loop",
    question: "A developer writes the following JavaScript function expecting it to print 0, 1, 2 after 100ms delays. Instead, it prints '3 3 3'. What is the bug and how is it resolved?",
    language: "javascript",
    codeSnippet: `function printNumbers() {
    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            console.log(i);
        }, 100);
    }
}
printNumbers();`,
    options: [
      { id: "A", text: "setTimeout cannot take callback functions" },
      { id: "B", text: "'var' has function/global scope, so all callbacks share the single mutated variable 'i' which equals 3 when timers fire. Fix by using block-scoped 'let i = 0'" },
      { id: "C", text: "console.log is asynchronous and cannot run inside setTimeout" },
      { id: "D", text: "100ms is too short for the JavaScript event loop" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "'var' declarations are hoisted to function scope. By the time the JavaScript event loop dequeues the setTimeout callbacks from the macrotask queue (after ~100ms), the synchronous loop has completely finished and 'i' has reached 3. Every callback references the same outer variable 'i', printing 3 three times. Replacing 'var' with 'let' creates a new lexical scope binding for each iteration.",
      concept: "Block scoping with 'let' or 'const' creates a fresh binding for each loop iteration, safely captured in closures.",
      takeaway: "The 'var in setTimeout loop' is the single most tested JavaScript closure interview trap.",
      wrongOptionsAnalysis: "Option A, C, and D are factually false.",
    },
    tags: ["JavaScript", "Event Loop", "Closures", "Var vs Let", "Debugging"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-debug-js-02",
    category: "se-web",
    categoryLabel: "Software Engineering & Web",
    topic: "Asynchronous JavaScript & Promises",
    difficulty: "Medium",
    type: "debugging",
    title: "Promise.all Fail-Fast Rejection Trap",
    question: "A frontend engineer uses Promise.all to fetch profile, settings, and notifications. If the notifications endpoint fails with a 500 error, the entire page crashes and displays nothing, even though profile and settings succeeded. What causes this and what is the robust fix?",
    language: "javascript",
    codeSnippet: `async function loadDashboardData() {
    const [profile, settings, notifs] = await Promise.all([
        fetchProfile(),
        fetchSettings(),
        fetchNotifications()
    ]);
    renderPage(profile, settings, notifs);
}`,
    options: [
      { id: "A", text: "Promise.all is deprecated in modern ECMAScript" },
      { id: "B", text: "Promise.all is fail-fast and immediately rejects if any single promise rejects. Fix: use Promise.allSettled() and handle individual rejected status objects" },
      { id: "C", text: "JavaScript does not allow array destructuring on asynchronous calls" },
      { id: "D", text: "Fetch requests must always be run sequentially using await in separate lines" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Promise.all() adheres to a fail-fast contract: as soon as one promise rejects, the returned promise immediately rejects with that reason, ignoring all other pending or fulfilled results. For non-critical parallel components (like notifications), use Promise.allSettled(), which waits for all promises to settle and returns an array of { status, value/reason }, allowing graceful partial UI rendering.",
      concept: "Promise.all: All-or-nothing (fail fast). Promise.allSettled: Resilient aggregation (inspect each result).",
      takeaway: "Use Promise.all when all sub-tasks are strictly required. Use Promise.allSettled when sub-tasks can fail independently.",
      wrongOptionsAnalysis: "Option A is false; Option C is standard ES6; Option D causes unnecessary sequential network latency.",
    },
    tags: ["JavaScript", "Promises", "Async/Await", "Promise.all", "Debugging"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-debug-cpp-01",
    category: "cpp",
    categoryLabel: "C / C++",
    topic: "Memory Deallocation",
    difficulty: "Hard",
    type: "debugging",
    title: "Double-Free Vulnerability with Shallow Copy",
    question: "The following C++ class causes a runtime crash with 'free(): double free detected in tcache 2' when passing 'StringHolder' by value to a helper function. Identify the root architectural bug:",
    language: "cpp",
    codeSnippet: `class StringHolder {
    char* data;
public:
    StringHolder(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }
    ~StringHolder() {
        delete[] data;
    }
};

void display(StringHolder holder) {
    // Some read operations...
}`,
    options: [
      { id: "A", text: "delete[] cannot be called inside a destructor" },
      { id: "B", text: "Missing custom Copy Constructor (Rule of Three violation): pass-by-value makes a shallow copy of pointer 'data'. When 'holder' in display() exits, delete[] runs; when the original object in main exits, delete[] runs again on the same address" },
      { id: "C", text: "strlen does not count the null terminator" },
      { id: "D", text: "The class constructor must be declared private" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Because StringHolder manages dynamic memory but does not define a custom copy constructor, the compiler generates a default copy constructor that performs a member-wise shallow copy. Passing 'holder' by value to display() copies the raw pointer address 'data'. When display() finishes, the copy's destructor calls 'delete[] data'. When the caller's object subsequently destructs, it calls 'delete[] data' on the already-freed pointer, triggering a critical double-free crash. Fix: implement the Rule of Three (custom copy constructor & copy assignment operator) or use std::string.",
      concept: "The Rule of Three: If a class requires a custom destructor to release resources, it almost certainly requires a custom copy constructor and copy assignment operator to prevent shallow pointer duplication.",
      takeaway: "In modern C++, prefer smart pointers (std::unique_ptr) or RAII containers (std::string) to eliminate manual memory management bugs.",
      wrongOptionsAnalysis: "Option A is false; Option C is true but already addressed by '+ 1'; Option D breaks object instantiation.",
    },
    tags: ["C++", "Rule of Three", "Double Free", "Memory Management", "Debugging"],
    estimatedTimeMinutes: 3,
  },
];
