import { CapgeminiQuestion } from "./types";

export const PYTHON_QUESTIONS: CapgeminiQuestion[] = [
  {
    id: "capg-py-01",
    category: "python",
    categoryLabel: "Python",
    topic: "Default Arguments & Mutability",
    difficulty: "Medium",
    type: "debugging",
    title: "Mutable Default Argument Bug",
    question: "What is printed by calling append_to(10) followed by append_to(20), and why does this common trap occur?",
    language: "python",
    codeSnippet: `def append_to(val, target_list=[]):
    target_list.append(val)
    return target_list

print(append_to(10))
print(append_to(20))`,
    options: [
      { id: "A", text: "[10] followed by [20]" },
      { id: "B", text: "[10] followed by [10, 20]" },
      { id: "C", text: "[10] followed by [20, 10]" },
      { id: "D", text: "RuntimeError: Cannot mutate default parameter" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Default parameter values in Python are evaluated once when the function is defined, NOT each time the function is invoked. Because 'target_list=[]' creates a single mutable list instance attached to the function object, subsequent calls without a second argument mutate and share the exact same list. Result: [10] then [10, 20]. Fix: use 'target_list=None' and initialize 'if target_list is None: target_list = []'.",
      concept: "Never use mutable objects (lists, dicts, sets) as default arguments in Python. Use None as a sentinel value.",
      takeaway: "This is hands-down the most asked Python bug question in tech assessment interviews.",
      wrongOptionsAnalysis: "Option A assumes a new list is instantiated on each call; Option D is false as Python permits mutable default objects.",
    },
    tags: ["Python", "Default Arguments", "Mutability", "Debugging"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-py-02",
    category: "python",
    categoryLabel: "Python",
    topic: "Closure Late Binding",
    difficulty: "Hard",
    type: "output-prediction",
    title: "Late Binding in Lambda Closures",
    question: "What will be printed by the following Python snippet?",
    language: "python",
    codeSnippet: `multipliers = [lambda x: i * x for i in range(4)]
results = [m(2) for m in multipliers]
print(results)`,
    options: [
      { id: "A", text: "[0, 2, 4, 6]" },
      { id: "B", text: "[6, 6, 6, 6]" },
      { id: "C", text: "[0, 0, 0, 0]" },
      { id: "D", text: "[2, 4, 6, 8]" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Python closures bind variables late by name, not by value at creation time. By the time the lambdas are executed in the second list comprehension, the loop over 'range(4)' has completed, leaving 'i' with the final value 3. Therefore, every lambda multiplies its argument x by 3: 3 * 2 = 6, yielding [6, 6, 6, 6]. Fix: bind early via default argument 'lambda x, i=i: i * x'.",
      concept: "Functions created in a loop look up the variable in the enclosing scope at execution time, observing the final iteration state unless captured via default argument.",
      takeaway: "To bind loop variables immediately in lambdas, write: 'lambda x, i=i: i * x'.",
      wrongOptionsAnalysis: "Option A assumes early value capture; Option C and D are incorrect mathematical evaluations.",
    },
    tags: ["Python", "Closures", "Lambda", "Late Binding"],
    estimatedTimeMinutes: 3,
  },
  {
    id: "capg-py-03",
    category: "python",
    categoryLabel: "Python",
    topic: "Slicing & Step Reversal",
    difficulty: "Easy",
    type: "output-prediction",
    title: "Extended Slicing with Negative Steps",
    question: "Predict the output of the following slicing operations in Python:",
    language: "python",
    codeSnippet: `nums = [10, 20, 30, 40, 50, 60]
print(nums[4:1:-1])`,
    options: [
      { id: "A", text: "[50, 40, 30]" },
      { id: "B", text: "[50, 40, 30, 20]" },
      { id: "C", text: "[20, 30, 40]" },
      { id: "D", text: "[]" },
    ],
    correctAnswer: "A",
    explanation: {
      correctReason: "Slicing syntax is list[start:stop:step]. With start=4, stop=1, and step=-1, iteration starts at index 4 (value 50), moves backwards to index 3 (value 40), and index 2 (value 30). The stop index 1 is exclusive, so index 1 (value 20) is omitted. Result: [50, 40, 30].",
      concept: "Negative step moves from right to left. The stop index is always exclusive.",
      takeaway: "Index arithmetic with negative steps frequently appears in string and list parsing questions.",
      wrongOptionsAnalysis: "Option B includes the stop index; Option C runs forward; Option D assumes start > stop produces an empty list, which only occurs for positive step.",
    },
    tags: ["Python", "Slicing", "Lists"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-py-04",
    category: "python",
    categoryLabel: "Python",
    topic: "Mutability & Dictionary Keys",
    difficulty: "Medium",
    type: "mcq",
    title: "Valid Dictionary Key Types in Python",
    question: "Which of the following objects can be used as a valid key in a Python dictionary?",
    options: [
      { id: "A", text: "[1, 2, 3] (list)" },
      { id: "B", text: "(1, [2, 3]) (tuple containing a list)" },
      { id: "C", text: "{\"key\": \"val\"} (dict)" },
      { id: "D", text: "(1, 2, \"apple\") (tuple of immutable elements)" },
    ],
    correctAnswer: "D",
    explanation: {
      correctReason: "Dictionary keys in Python must be hashable. An object is hashable if it has a hash value that never changes during its lifetime (i.e. immutable) and can be compared to other objects. A tuple whose elements are all immutable (integers and string) is hashable. Lists, dicts, and tuples containing mutable objects (like Option B) raise 'TypeError: unhashable type'.",
      concept: "To be hashable, all sub-elements of a compound object must also be hashable. Even a tuple becomes unhashable if it contains a list or dictionary.",
      takeaway: "Remember: Immutable + all sub-elements immutable = hashable key.",
      wrongOptionsAnalysis: "Options A and C are mutable collections; Option B is a tuple containing a mutable list, making the tuple unhashable.",
    },
    tags: ["Python", "Hashable", "Dictionaries", "Tuples"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-py-05",
    category: "python",
    categoryLabel: "Python",
    topic: "Generators & Memory Efficiency",
    difficulty: "Medium",
    type: "scenario",
    title: "Large Dataset Processing: Generators vs Lists",
    question: "You need to process 10 million rows of data line by line on a server with limited RAM (512MB). Which approach avoids Out-Of-Memory (OOM) errors in Python?",
    options: [
      { id: "A", text: "Use list comprehension: [process(row) for row in data]" },
      { id: "B", text: "Use a generator expression or function with 'yield': (process(row) for row in data)" },
      { id: "C", text: "Load all rows into a nested dictionary" },
      { id: "D", text: "Sort the list first to compress memory footprint" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "Generator expressions and generator functions produce values on-demand using lazy evaluation ('yield'). They hold only a single item in memory at any time (O(1) auxiliary memory), preventing memory spikes and OOM exceptions across massive datasets. List comprehensions build the entire 10-million element list in RAM at once.",
      concept: "Generators implement the iterator protocol lazily, calculating the next item only when requested by 'next()' or a loop.",
      takeaway: "In backend data processing and Python engineering interviews, generators are the standard tool for streaming large payloads.",
      wrongOptionsAnalysis: "Options A, C, and D consume massive RAM by eagerly instantiating collections in memory.",
    },
    tags: ["Python", "Generators", "Memory", "Lazy Evaluation", "Yield"],
    estimatedTimeMinutes: 2,
  },
  {
    id: "capg-py-06",
    category: "python",
    categoryLabel: "Python",
    topic: "Try-Except-Else-Finally Control Flow",
    difficulty: "Easy",
    type: "output-prediction",
    title: "Execution of the 'else' Clause in Python Try Blocks",
    question: "What is printed by the following code snippet?",
    language: "python",
    codeSnippet: `try:
    x = 10 / 2
except ZeroDivisionError:
    print("Zero")
else:
    print("Success")
finally:
    print("Done")`,
    options: [
      { id: "A", text: "Success followed by Done" },
      { id: "B", text: "Done" },
      { id: "C", text: "Success" },
      { id: "D", text: "Zero followed by Done" },
    ],
    correctAnswer: "A",
    explanation: {
      correctReason: "In Python, the 'else' block of a try-except statement executes ONLY when no exception is raised in the try block. Since 10 / 2 executes cleanly without errors, the 'else' block runs, printing 'Success'. The 'finally' block always executes unconditionally, printing 'Done'. Output: 'Success' then 'Done'.",
      concept: "The 'else' clause in try-except isolates code that should execute only if the try block succeeded, avoiding accidental catches of exceptions raised outside the guarded operation.",
      takeaway: "Python is one of the few languages with an 'else' clause on try-except and for/while loops.",
      wrongOptionsAnalysis: "Option B forgets the else block; Option C forgets the finally block; Option D assumes an exception occurred.",
    },
    tags: ["Python", "Exceptions", "Control Flow", "Else"],
    estimatedTimeMinutes: 2,
  },
];
