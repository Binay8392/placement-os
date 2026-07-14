export type CodeWarRoomDifficulty = 'Easy' | 'Medium' | 'Hard';
export type CodeWarRoomVisibility = 'public' | 'private';

export interface CodeWarRoomTestCase {
  id: string;
  name: string;
  visibility: CodeWarRoomVisibility;
  input: string;
  output: string;
}

export interface CodeWarRoomProblem {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  order: number;
  difficulty: CodeWarRoomDifficulty;
  functionName: string;
  parameters: string[];
  prompt: string;
  constraints: string[];
  tags: string[];
  companyTags: string[];
  starterCode: string;
  publicTestCases: CodeWarRoomTestCase[];
  privateTestCases: CodeWarRoomTestCase[];
}

export interface CodeWarRoomCategory {
  id: string;
  title: string;
  description: string;
  questions: CodeWarRoomProblem[];
}

export interface CodeWarRoomCompany {
  id: string;
  label: string;
  description: string;
}

interface RawQuestion {
  title: string;
  difficulty: CodeWarRoomDifficulty;
  publicInput: string;
  publicOutput: string;
  privateInput: string;
  privateOutput: string;
}

interface RawCategory {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  questions: RawQuestion[];
}

const q = (
  title: string,
  difficulty: CodeWarRoomDifficulty,
  publicInput: string,
  publicOutput: string,
  privateInput: string,
  privateOutput: string,
): RawQuestion => ({
  title,
  difficulty,
  publicInput,
  publicOutput,
  privateInput,
  privateOutput,
});

export const CODE_WAR_ROOM_COMPANIES: CodeWarRoomCompany[] = [
  { id: 'infosys', label: 'Infosys PYQ', description: 'Infosys previous year coding practice set' },
  { id: 'tcs', label: 'TCS NQT PYQ', description: 'TCS NQT previous year coding practice set' },
  { id: 'wipro', label: 'Wipro PYQ', description: 'Wipro previous year coding practice set' },
  { id: 'accenture', label: 'Accenture PYQ', description: 'Accenture previous year coding practice set' },
  { id: 'cognizant', label: 'Cognizant PYQ', description: 'Cognizant previous year coding practice set' },
  { id: 'capgemini', label: 'Capgemini PYQ', description: 'Capgemini previous year coding practice set' },
  { id: 'ibm', label: 'IBM PYQ', description: 'IBM previous year coding practice set' },
  { id: 'hcl', label: 'HCL PYQ', description: 'HCL previous year coding practice set' },
  { id: 'tech-mahindra', label: 'Tech Mahindra PYQ', description: 'Tech Mahindra previous year coding practice set' },
  { id: 'deloitte', label: 'Deloitte PYQ', description: 'Deloitte previous year coding practice set' },
];

const categoryCompanyOffsets: Record<string, number> = {
  arrays: 0,
  strings: 1,
  'number-theory': 2,
  'searching-sorting': 3,
  'linked-list': 4,
  'stack-queue': 5,
  trees: 6,
  graphs: 7,
  'dynamic-programming': 8,
  'recursion-backtracking': 9,
  'bit-manipulation': 0,
  matrix: 1,
};

const buildCompanyTags = (categoryId: string, difficulty: CodeWarRoomDifficulty, order: number) => {
  const offset = categoryCompanyOffsets[categoryId] ?? 0;
  const primaryIndex = (order + offset - 1) % CODE_WAR_ROOM_COMPANIES.length;
  const tags = [CODE_WAR_ROOM_COMPANIES[primaryIndex].label];

  if (difficulty !== 'Easy') {
    tags.push(CODE_WAR_ROOM_COMPANIES[(primaryIndex + 3) % CODE_WAR_ROOM_COMPANIES.length].label);
  }

  if (order % 5 === 0) {
    tags.push(CODE_WAR_ROOM_COMPANIES[(primaryIndex + 6) % CODE_WAR_ROOM_COMPANIES.length].label);
  }

  return [...new Set(tags)];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toFunctionName = (title: string) => {
  const words = title
    .replace(/0\/1/g, 'zero one')
    .replace(/strstr/g, 'str str')
    .match(/[a-zA-Z0-9]+/g) || ['solve'];

  return words
    .map((word, index) => {
      const clean = word.toLowerCase();
      return index === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
    })
    .join('');
};

const splitTopLevel = (value: string) => {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | null = null;
  let escaping = false;

  for (const char of value) {
    if (quote) {
      current += char;
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '[' || char === '{' || char === '(') depth += 1;
    if (char === ']' || char === '}' || char === ')') depth = Math.max(0, depth - 1);

    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const toParameterNames = (input: string) => {
  const names = splitTopLevel(input)
    .map((part) => part.match(/^\s*([A-Za-z_$][\w$]*)\s*=/)?.[1])
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names : ['input'];
};

const buildStarterCode = (functionName: string, parameters: string[]) => {
  const signature = parameters.join(', ');

  return `function ${functionName}(${signature}) {
  // Write your solution here
  return null;
}`;
};

const rawCategories: RawCategory[] = [
  {
    id: 'arrays',
    title: 'Arrays',
    description: 'Indexing, windows, prefix logic, two pointers, and in-place updates.',
    constraints: [
      'Prefer O(n) or O(n log n) solutions unless the brute-force version is intentional.',
      'Handle empty arrays, duplicates, negative numbers, and boundary values.',
      'Keep extra space low when the problem asks for in-place mutation.',
    ],
    questions: [
      q('Two Sum', 'Easy', `nums = [2, 7, 11, 15], target = 9`, `[0, 1]`, `nums = [3, 3], target = 6`, `[0, 1]`),
      q('Maximum Subarray (Kadane\'s Algorithm)', 'Medium', `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`, `6`, `nums = [-8, -3, -6, -2, -5]`, `-2`),
      q('Best Time to Buy and Sell Stock', 'Easy', `prices = [7, 1, 5, 3, 6, 4]`, `5`, `prices = [7, 6, 4, 3, 1]`, `0`),
      q('Rotate Array', 'Medium', `nums = [1, 2, 3, 4, 5, 6, 7], k = 3`, `[5, 6, 7, 1, 2, 3, 4]`, `nums = [1, 2], k = 3`, `[2, 1]`),
      q('Move Zeroes', 'Easy', `nums = [0, 1, 0, 3, 12]`, `[1, 3, 12, 0, 0]`, `nums = [0, 0, 1]`, `[1, 0, 0]`),
      q('Remove Duplicates from Sorted Array', 'Easy', `nums = [1, 1, 2]`, `length = 2, nums prefix = [1, 2]`, `nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`, `length = 5, nums prefix = [0, 1, 2, 3, 4]`),
      q('Merge Sorted Arrays', 'Easy', `nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3`, `[1, 2, 2, 3, 5, 6]`, `nums1 = [0], m = 0, nums2 = [1], n = 1`, `[1]`),
      q('Product of Array Except Self', 'Medium', `nums = [1, 2, 3, 4]`, `[24, 12, 8, 6]`, `nums = [-1, 1, 0, -3, 3]`, `[0, 0, 9, 0, 0]`),
      q('Majority Element', 'Easy', `nums = [3, 2, 3]`, `3`, `nums = [2, 2, 1, 1, 1, 2, 2]`, `2`),
      q('Missing Number', 'Easy', `nums = [3, 0, 1]`, `2`, `nums = [0, 1]`, `2`),
      q('Find Duplicate Number', 'Medium', `nums = [1, 3, 4, 2, 2]`, `2`, `nums = [3, 1, 3, 4, 2]`, `3`),
      q('Leaders in Array', 'Easy', `arr = [16, 17, 4, 3, 5, 2]`, `[17, 5, 2]`, `arr = [5, 4, 3, 2, 1]`, `[5, 4, 3, 2, 1]`),
      q('Rearrange Array Alternately', 'Medium', `arr = [1, 2, 3, 4, 5, 6]`, `[6, 1, 5, 2, 4, 3]`, `arr = [10, 20, 30, 40, 50]`, `[50, 10, 40, 20, 30]`),
      q('Maximum Product Subarray', 'Medium', `nums = [2, 3, -2, 4]`, `6`, `nums = [-2, 0, -1]`, `0`),
      q('Trapping Rain Water', 'Hard', `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`, `6`, `height = [4, 2, 0, 3, 2, 5]`, `9`),
      q('Container With Most Water', 'Medium', `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`, `49`, `height = [1, 1]`, `1`),
      q('Maximum Consecutive Ones', 'Easy', `nums = [1, 1, 0, 1, 1, 1]`, `3`, `nums = [0, 0, 0]`, `0`),
      q('Longest Consecutive Sequence', 'Medium', `nums = [100, 4, 200, 1, 3, 2]`, `4`, `nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]`, `9`),
      q('Chocolate Distribution', 'Easy', `packets = [7, 3, 2, 4, 9, 12, 56], students = 3`, `2`, `packets = [3, 4, 1, 9, 56, 7, 9, 12], students = 5`, `6`),
      q('Minimum Platforms', 'Medium', `arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]`, `3`, `arr = [900, 1100, 1235], dep = [1000, 1200, 1240]`, `1`),
      q('Subarray Sum Equals K', 'Medium', `nums = [1, 1, 1], k = 2`, `2`, `nums = [1, 2, 3], k = 3`, `2`),
      q('Equilibrium Index', 'Easy', `arr = [-7, 1, 5, 2, -4, 3, 0]`, `3`, `arr = [1, 2, 3]`, `-1`),
      q('Pair Sum', 'Easy', `arr = [8, 7, 2, 5, 3, 1], target = 10`, `[(8, 2), (7, 3)]`, `arr = [5, 5, 5], target = 10`, `[(5, 5)]`),
      q('Three Sum', 'Medium', `nums = [-1, 0, 1, 2, -1, -4]`, `[[-1, -1, 2], [-1, 0, 1]]`, `nums = [0, 0, 0, 0]`, `[[0, 0, 0]]`),
      q('Four Sum', 'Hard', `nums = [1, 0, -1, 0, -2, 2], target = 0`, `[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]`, `nums = [2, 2, 2, 2, 2], target = 8`, `[[2, 2, 2, 2]]`),
    ],
  },
  {
    id: 'strings',
    title: 'Strings',
    description: 'Parsing, hashing, windows, palindromes, encodings, and transformations.',
    constraints: [
      'Treat uppercase, lowercase, spacing, and punctuation exactly as the statement requires.',
      'Avoid quadratic scans when a map, set, or sliding window gives linear behavior.',
      'Cover empty strings and single-character strings.',
    ],
    questions: [
      q('Reverse String', 'Easy', `s = ["h", "e", "l", "l", "o"]`, `["o", "l", "l", "e", "h"]`, `s = []`, `[]`),
      q('Reverse Words', 'Easy', `s = "the sky is blue"`, `"blue is sky the"`, `s = "  hello world  "`, `"world hello"`),
      q('Palindrome String', 'Easy', `s = "madam"`, `true`, `s = "hello"`, `false`),
      q('Valid Palindrome', 'Easy', `s = "A man, a plan, a canal: Panama"`, `true`, `s = "race a car"`, `false`),
      q('Anagram Check', 'Easy', `s = "anagram", t = "nagaram"`, `true`, `s = "rat", t = "car"`, `false`),
      q('Group Anagrams', 'Medium', `strs = ["eat", "tea", "tan", "ate", "nat", "bat"]`, `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]`, `strs = [""]`, `[[""]]`),
      q('Longest Common Prefix', 'Easy', `strs = ["flower", "flow", "flight"]`, `"fl"`, `strs = ["dog", "racecar", "car"]`, `""`),
      q('Longest Substring Without Repeating Characters', 'Medium', `s = "abcabcbb"`, `3`, `s = "bbbbb"`, `1`),
      q('Longest Palindromic Substring', 'Medium', `s = "babad"`, `"bab" or "aba"`, `s = "cbbd"`, `"bb"`),
      q('Count Vowels', 'Easy', `s = "Placement OS"`, `4`, `s = "rhythm"`, `0`),
      q('Count Words', 'Easy', `s = "code every day"`, `3`, `s = "  one   two  "`, `2`),
      q('Remove Duplicates', 'Easy', `s = "programming"`, `"progamin"`, `s = "aaaa"`, `"a"`),
      q('String Compression', 'Medium', `chars = ["a", "a", "b", "b", "c", "c", "c"]`, `length = 6, chars prefix = ["a", "2", "b", "2", "c", "3"]`, `chars = ["a"]`, `length = 1, chars prefix = ["a"]`),
      q('Implement strstr()', 'Easy', `haystack = "sadbutsad", needle = "sad"`, `0`, `haystack = "leetcode", needle = "leeto"`, `-1`),
      q('Integer to Roman', 'Medium', `num = 1994`, `"MCMXCIV"`, `num = 58`, `"LVIII"`),
      q('Roman to Integer', 'Easy', `s = "MCMXCIV"`, `1994`, `s = "LVIII"`, `58`),
      q('Valid Parentheses', 'Easy', `s = "()[]{}"`, `true`, `s = "([)]"`, `false`),
      q('Minimum Window Substring', 'Hard', `s = "ADOBECODEBANC", t = "ABC"`, `"BANC"`, `s = "a", t = "aa"`, `""`),
      q('Zigzag Conversion', 'Medium', `s = "PAYPALISHIRING", numRows = 3`, `"PAHNAPLSIIGYIR"`, `s = "A", numRows = 1`, `"A"`),
      q('Isomorphic Strings', 'Easy', `s = "egg", t = "add"`, `true`, `s = "foo", t = "bar"`, `false`),
      q('Decode String', 'Medium', `s = "3[a]2[bc]"`, `"aaabcbc"`, `s = "3[a2[c]]"`, `"accaccacc"`),
      q('Multiply Strings', 'Medium', `num1 = "123", num2 = "456"`, `"56088"`, `num1 = "0", num2 = "999"`, `"0"`),
      q('Add Binary', 'Easy', `a = "11", b = "1"`, `"100"`, `a = "1010", b = "1011"`, `"10101"`),
      q('Compare Version Numbers', 'Medium', `version1 = "1.01", version2 = "1.001"`, `0`, `version1 = "1.0", version2 = "1.0.0"`, `0`),
      q('Repeated String Match', 'Medium', `a = "abcd", b = "cdabcdab"`, `3`, `a = "a", b = "aa"`, `2`),
    ],
  },
  {
    id: 'number-theory',
    title: 'Number Theory',
    description: 'Primes, divisibility, powers, digit math, and base conversion.',
    constraints: [
      'Consider n = 0, n = 1, negative values where meaningful, and large values.',
      'Prefer integer arithmetic over string conversion when the problem asks for numeric reasoning.',
      'Use modulo and division carefully to avoid overflow in fixed-width languages.',
    ],
    questions: [
      q('Prime Number', 'Easy', `n = 29`, `true`, `n = 1`, `false`),
      q('Prime Numbers in Range', 'Easy', `left = 10, right = 20`, `[11, 13, 17, 19]`, `left = 1, right = 2`, `[2]`),
      q('Sieve of Eratosthenes', 'Medium', `n = 10`, `[2, 3, 5, 7]`, `n = 1`, `[]`),
      q('GCD', 'Easy', `a = 48, b = 18`, `6`, `a = 0, b = 5`, `5`),
      q('LCM', 'Easy', `a = 12, b = 18`, `36`, `a = 0, b = 7`, `0`),
      q('Armstrong Number', 'Easy', `n = 153`, `true`, `n = 9474`, `true`),
      q('Strong Number', 'Easy', `n = 145`, `true`, `n = 123`, `false`),
      q('Perfect Number', 'Easy', `n = 28`, `true`, `n = 12`, `false`),
      q('Happy Number', 'Easy', `n = 19`, `true`, `n = 2`, `false`),
      q('Palindrome Number', 'Easy', `n = 121`, `true`, `n = -121`, `false`),
      q('Reverse Integer', 'Medium', `x = 123`, `321`, `x = 1534236469`, `0`),
      q('Factorial', 'Easy', `n = 5`, `120`, `n = 0`, `1`),
      q('Trailing Zeroes', 'Medium', `n = 25`, `6`, `n = 3`, `0`),
      q('Fibonacci', 'Easy', `n = 6`, `8`, `n = 0`, `0`),
      q('Power Function', 'Medium', `x = 2, n = 10`, `1024`, `x = 2, n = -2`, `0.25`),
      q('Power of Two', 'Easy', `n = 16`, `true`, `n = 18`, `false`),
      q('Count Digits', 'Easy', `n = 12345`, `5`, `n = 0`, `1`),
      q('Sum of Digits', 'Easy', `n = 987`, `24`, `n = 0`, `0`),
      q('Decimal to Binary', 'Easy', `n = 13`, `"1101"`, `n = 0`, `"0"`),
      q('Binary to Decimal', 'Easy', `binary = "1011"`, `11`, `binary = "0"`, `0`),
    ],
  },
  {
    id: 'searching-sorting',
    title: 'Searching & Sorting',
    description: 'Binary search variants, classic sorting, partitioning, and interval ordering.',
    constraints: [
      'State whether the input is sorted before applying binary search.',
      'For sorting, preserve duplicates and negative values.',
      'Watch for off-by-one boundaries in low, high, and mid calculations.',
    ],
    questions: [
      q('Binary Search', 'Easy', `nums = [-1, 0, 3, 5, 9, 12], target = 9`, `4`, `nums = [-1, 0, 3, 5, 9, 12], target = 2`, `-1`),
      q('First & Last Position', 'Medium', `nums = [5, 7, 7, 8, 8, 10], target = 8`, `[3, 4]`, `nums = [5, 7, 7, 8, 8, 10], target = 6`, `[-1, -1]`),
      q('Search Insert Position', 'Easy', `nums = [1, 3, 5, 6], target = 5`, `2`, `nums = [1, 3, 5, 6], target = 2`, `1`),
      q('Search in Rotated Array', 'Medium', `nums = [4, 5, 6, 7, 0, 1, 2], target = 0`, `4`, `nums = [1], target = 0`, `-1`),
      q('Peak Element', 'Medium', `nums = [1, 2, 3, 1]`, `2`, `nums = [1, 2, 1, 3, 5, 6, 4]`, `1 or 5`),
      q('Square Root', 'Easy', `x = 8`, `2`, `x = 1`, `1`),
      q('Bubble Sort', 'Easy', `arr = [5, 1, 4, 2, 8]`, `[1, 2, 4, 5, 8]`, `arr = [1, 1, 0]`, `[0, 1, 1]`),
      q('Selection Sort', 'Easy', `arr = [64, 25, 12, 22, 11]`, `[11, 12, 22, 25, 64]`, `arr = [-1, 5, 0]`, `[-1, 0, 5]`),
      q('Insertion Sort', 'Easy', `arr = [12, 11, 13, 5, 6]`, `[5, 6, 11, 12, 13]`, `arr = [1]`, `[1]`),
      q('Merge Sort', 'Medium', `arr = [38, 27, 43, 3, 9, 82, 10]`, `[3, 9, 10, 27, 38, 43, 82]`, `arr = [5, 5, 4]`, `[4, 5, 5]`),
      q('Quick Sort', 'Medium', `arr = [10, 7, 8, 9, 1, 5]`, `[1, 5, 7, 8, 9, 10]`, `arr = [3, -1, 0, 3]`, `[-1, 0, 3, 3]`),
      q('Heap Sort', 'Medium', `arr = [4, 10, 3, 5, 1]`, `[1, 3, 4, 5, 10]`, `arr = [2, 2, 1]`, `[1, 2, 2]`),
      q('Counting Sort', 'Medium', `arr = [4, 2, 2, 8, 3, 3, 1]`, `[1, 2, 2, 3, 3, 4, 8]`, `arr = [0, 0, 2, 1]`, `[0, 0, 1, 2]`),
      q('Radix Sort', 'Medium', `arr = [170, 45, 75, 90, 802, 24, 2, 66]`, `[2, 24, 45, 66, 75, 90, 170, 802]`, `arr = [5, 50, 500]`, `[5, 50, 500]`),
      q('Merge Intervals', 'Medium', `intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]`, `[[1, 6], [8, 10], [15, 18]]`, `intervals = [[1, 4], [4, 5]]`, `[[1, 5]]`),
      q('Sort Colors', 'Medium', `nums = [2, 0, 2, 1, 1, 0]`, `[0, 0, 1, 1, 2, 2]`, `nums = [2, 0, 1]`, `[0, 1, 2]`),
      q('Kth Largest Element', 'Medium', `nums = [3, 2, 1, 5, 6, 4], k = 2`, `5`, `nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4`, `4`),
      q('K Closest Elements', 'Medium', `arr = [1, 2, 3, 4, 5], k = 4, x = 3`, `[1, 2, 3, 4]`, `arr = [1, 2, 3, 4, 5], k = 4, x = -1`, `[1, 2, 3, 4]`),
      q('Median of Two Sorted Arrays', 'Hard', `nums1 = [1, 3], nums2 = [2]`, `2`, `nums1 = [1, 2], nums2 = [3, 4]`, `2.5`),
      q('Count Inversions', 'Hard', `arr = [8, 4, 2, 1]`, `6`, `arr = [1, 20, 6, 4, 5]`, `5`),
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Pointer movement, dummy nodes, cycle checks, and list rewiring.',
    constraints: [
      'Use arrays only as display notation; implement with linked-list nodes in solutions.',
      'Handle empty lists, single-node lists, and carry/borrow edge cases.',
      'Avoid losing references when reversing or deleting nodes.',
    ],
    questions: [
      q('Reverse Linked List', 'Easy', `head = [1, 2, 3, 4, 5]`, `[5, 4, 3, 2, 1]`, `head = []`, `[]`),
      q('Middle Node', 'Easy', `head = [1, 2, 3, 4, 5]`, `node with value 3`, `head = [1, 2, 3, 4, 5, 6]`, `node with value 4`),
      q('Detect Cycle', 'Easy', `head = [3, 2, 0, -4], pos = 1`, `true`, `head = [1], pos = -1`, `false`),
      q('Merge Two Sorted Lists', 'Easy', `list1 = [1, 2, 4], list2 = [1, 3, 4]`, `[1, 1, 2, 3, 4, 4]`, `list1 = [], list2 = [0]`, `[0]`),
      q('Remove Nth Node', 'Medium', `head = [1, 2, 3, 4, 5], n = 2`, `[1, 2, 3, 5]`, `head = [1], n = 1`, `[]`),
      q('Delete Node', 'Medium', `head = [4, 5, 1, 9], node = 5`, `[4, 1, 9]`, `head = [4, 5, 1, 9], node = 1`, `[4, 5, 9]`),
      q('Reverse in K Groups', 'Hard', `head = [1, 2, 3, 4, 5], k = 2`, `[2, 1, 4, 3, 5]`, `head = [1, 2, 3, 4, 5], k = 3`, `[3, 2, 1, 4, 5]`),
      q('Intersection of Lists', 'Easy', `listA = [4, 1, 8, 4, 5], listB = [5, 6, 1, 8, 4, 5], intersectVal = 8`, `node with value 8`, `listA = [2, 6, 4], listB = [1, 5]`, `null`),
      q('Palindrome Linked List', 'Easy', `head = [1, 2, 2, 1]`, `true`, `head = [1, 2]`, `false`),
      q('Rotate List', 'Medium', `head = [1, 2, 3, 4, 5], k = 2`, `[4, 5, 1, 2, 3]`, `head = [0, 1, 2], k = 4`, `[2, 0, 1]`),
      q('Add Two Numbers', 'Medium', `l1 = [2, 4, 3], l2 = [5, 6, 4]`, `[7, 0, 8]`, `l1 = [9, 9, 9, 9], l2 = [9, 9, 9]`, `[8, 9, 9, 0, 1]`),
      q('Odd Even Linked List', 'Medium', `head = [1, 2, 3, 4, 5]`, `[1, 3, 5, 2, 4]`, `head = [2, 1, 3, 5, 6, 4, 7]`, `[2, 3, 6, 7, 1, 5, 4]`),
      q('Flatten Linked List', 'Hard', `list = [[5, 7, 8, 30], [10, 20], [19, 22, 50], [28, 35, 40, 45]]`, `[5, 7, 8, 10, 19, 20, 22, 28, 30, 35, 40, 45, 50]`, `list = [[1], [2], [3]]`, `[1, 2, 3]`),
      q('Copy List with Random Pointer', 'Medium', `nodes = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]`, `deep copy with same next and random links`, `nodes = []`, `[]`),
      q('Sort Linked List', 'Medium', `head = [4, 2, 1, 3]`, `[1, 2, 3, 4]`, `head = [-1, 5, 3, 4, 0]`, `[-1, 0, 3, 4, 5]`),
    ],
  },
  {
    id: 'stack-queue',
    title: 'Stack & Queue',
    description: 'Monotonic stacks, expression parsing, queue simulation, and window deques.',
    constraints: [
      'Use LIFO/FIFO invariants explicitly.',
      'For monotonic structures, store indices when distance or width is needed.',
      'Cover empty input and duplicate values.',
    ],
    questions: [
      q('Valid Parentheses', 'Easy', `s = "()[]{}"`, `true`, `s = "([)]"`, `false`),
      q('Min Stack', 'Medium', `ops = ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], values = [[], [-2], [0], [-3], [], [], [], []]`, `[null, null, null, null, -3, null, 0, -2]`, `ops = ["MinStack", "push", "push", "getMin"], values = [[], [1], [1], []]`, `[null, null, null, 1]`),
      q('Next Greater Element', 'Easy', `nums = [4, 5, 2, 25]`, `[5, 25, 25, -1]`, `nums = [13, 7, 6, 12]`, `[-1, 12, 12, -1]`),
      q('Next Smaller Element', 'Easy', `nums = [4, 8, 5, 2, 25]`, `[2, 5, 2, -1, -1]`, `nums = [1, 2, 3]`, `[-1, -1, -1]`),
      q('Stock Span', 'Medium', `prices = [100, 80, 60, 70, 60, 75, 85]`, `[1, 1, 1, 2, 1, 4, 6]`, `prices = [10, 20, 30]`, `[1, 2, 3]`),
      q('Largest Rectangle in Histogram', 'Hard', `heights = [2, 1, 5, 6, 2, 3]`, `10`, `heights = [2, 4]`, `4`),
      q('Queue Using Stacks', 'Easy', `ops = ["push", "push", "peek", "pop", "empty"], values = [[1], [2], [], [], []]`, `[null, null, 1, 1, false]`, `ops = ["push", "pop", "empty"], values = [[9], [], []]`, `[null, 9, true]`),
      q('Stack Using Queues', 'Easy', `ops = ["push", "push", "top", "pop", "empty"], values = [[1], [2], [], [], []]`, `[null, null, 2, 2, false]`, `ops = ["push", "pop", "empty"], values = [[5], [], []]`, `[null, 5, true]`),
      q('Circular Queue', 'Medium', `ops = ["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"], values = [[3], [1], [2], [3], [4], [], [], [], [4], []]`, `[null, true, true, true, false, 3, true, true, true, 4]`, `ops = ["MyCircularQueue", "isEmpty"], values = [[1], []]`, `[null, true]`),
      q('Sliding Window Maximum', 'Hard', `nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3`, `[3, 3, 5, 5, 6, 7]`, `nums = [1], k = 1`, `[1]`),
      q('Daily Temperatures', 'Medium', `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`, `[1, 1, 4, 2, 1, 1, 0, 0]`, `temperatures = [30, 40, 50, 60]`, `[1, 1, 1, 0]`),
      q('Evaluate Postfix', 'Medium', `tokens = ["2", "1", "+", "3", "*"]`, `9`, `tokens = ["4", "13", "5", "/", "+"]`, `6`),
      q('Infix to Postfix', 'Medium', `expression = "a+b*(c^d-e)^(f+g*h)-i"`, `"abcd^e-fgh*+^*+i-"`, `expression = "(A+B)*C"`, `"AB+C*"`),
      q('Balanced Brackets', 'Easy', `s = "{[()]}"`, `true`, `s = "{[(])}"`, `false`),
      q('Celebrity Problem', 'Medium', `matrix = [[0, 1, 0], [0, 0, 0], [0, 1, 0]]`, `1`, `matrix = [[0, 1], [1, 0]]`, `-1`),
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    description: 'Traversal, recursion, views, path checks, BST rules, and serialization.',
    constraints: [
      'Use level-order arrays with nulls as display notation.',
      'Handle empty roots and skewed trees.',
      'For BST problems, validate using ranges, not only local child comparisons.',
    ],
    questions: [
      q('Inorder Traversal', 'Easy', `root = [1, null, 2, 3]`, `[1, 3, 2]`, `root = []`, `[]`),
      q('Preorder Traversal', 'Easy', `root = [1, null, 2, 3]`, `[1, 2, 3]`, `root = []`, `[]`),
      q('Postorder Traversal', 'Easy', `root = [1, null, 2, 3]`, `[3, 2, 1]`, `root = []`, `[]`),
      q('Level Order Traversal', 'Medium', `root = [3, 9, 20, null, null, 15, 7]`, `[[3], [9, 20], [15, 7]]`, `root = []`, `[]`),
      q('Height of Tree', 'Easy', `root = [1, 2, 3, 4, 5]`, `3`, `root = []`, `0`),
      q('Diameter of Tree', 'Easy', `root = [1, 2, 3, 4, 5]`, `3`, `root = [1, 2]`, `1`),
      q('Maximum Depth', 'Easy', `root = [3, 9, 20, null, null, 15, 7]`, `3`, `root = []`, `0`),
      q('Balanced Binary Tree', 'Easy', `root = [3, 9, 20, null, null, 15, 7]`, `true`, `root = [1, 2, 2, 3, 3, null, null, 4, 4]`, `false`),
      q('Symmetric Tree', 'Easy', `root = [1, 2, 2, 3, 4, 4, 3]`, `true`, `root = [1, 2, 2, null, 3, null, 3]`, `false`),
      q('Lowest Common Ancestor', 'Medium', `root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1`, `3`, `root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 4`, `5`),
      q('Validate BST', 'Medium', `root = [2, 1, 3]`, `true`, `root = [5, 1, 4, null, null, 3, 6]`, `false`),
      q('Kth Smallest in BST', 'Medium', `root = [3, 1, 4, null, 2], k = 1`, `1`, `root = [5, 3, 6, 2, 4, null, null, 1], k = 3`, `3`),
      q('Right View', 'Medium', `root = [1, 2, 3, null, 5, null, 4]`, `[1, 3, 4]`, `root = [1]`, `[1]`),
      q('Left View', 'Medium', `root = [1, 2, 3, 4, null, null, 5]`, `[1, 2, 4]`, `root = []`, `[]`),
      q('Boundary Traversal', 'Hard', `root = [1, 2, 3, 4, 5, 6, 7]`, `[1, 2, 4, 5, 6, 7, 3]`, `root = [1]`, `[1]`),
      q('Zigzag Traversal', 'Medium', `root = [3, 9, 20, null, null, 15, 7]`, `[[3], [20, 9], [15, 7]]`, `root = [1]`, `[[1]]`),
      q('Vertical Order Traversal', 'Hard', `root = [3, 9, 20, null, null, 15, 7]`, `[[9], [3, 15], [20], [7]]`, `root = [1, 2, 3, 4, 5, 6, 7]`, `[[4], [2], [1, 5, 6], [3], [7]]`),
      q('Path Sum', 'Easy', `root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], targetSum = 22`, `true`, `root = [1, 2, 3], targetSum = 5`, `false`),
      q('Same Tree', 'Easy', `p = [1, 2, 3], q = [1, 2, 3]`, `true`, `p = [1, 2], q = [1, null, 2]`, `false`),
      q('Serialize and Deserialize Tree', 'Hard', `root = [1, 2, 3, null, null, 4, 5]`, `deserialize(serialize(root)) equals original tree`, `root = []`, `[]`),
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Traversal, connectivity, shortest paths, MSTs, grids, and dependency ordering.',
    constraints: [
      'Define whether the graph is directed, undirected, weighted, or unweighted.',
      'Track visited nodes to avoid infinite traversal.',
      'Handle disconnected components.',
    ],
    questions: [
      q('BFS', 'Easy', `graph = {0: [1, 2], 1: [2], 2: [0, 3], 3: [3]}, start = 2`, `[2, 0, 3, 1]`, `graph = {0: []}, start = 0`, `[0]`),
      q('DFS', 'Easy', `graph = {0: [1, 2], 1: [2], 2: [3], 3: []}, start = 0`, `[0, 1, 2, 3]`, `graph = {0: [1], 1: [0]}, start = 0`, `[0, 1]`),
      q('Number of Islands', 'Medium', `grid = [["1", "1", "0"], ["1", "0", "0"], ["0", "0", "1"]]`, `2`, `grid = [["0", "0"], ["0", "0"]]`, `0`),
      q('Flood Fill', 'Easy', `image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2`, `[[2,2,2],[2,2,0],[2,0,1]]`, `image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0`, `[[0,0,0],[0,0,0]]`),
      q('Detect Cycle (Undirected)', 'Medium', `n = 5, edges = [[0,1],[1,2],[2,3],[3,4],[4,1]]`, `true`, `n = 3, edges = [[0,1],[1,2]]`, `false`),
      q('Detect Cycle (Directed)', 'Medium', `n = 4, edges = [[0,1],[1,2],[2,0],[2,3]]`, `true`, `n = 4, edges = [[0,1],[1,2],[2,3]]`, `false`),
      q('Topological Sort', 'Medium', `n = 6, edges = [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]`, `[5, 4, 2, 3, 1, 0] or any valid order`, `n = 2, edges = [[0,1],[1,0]]`, `[]`),
      q('Dijkstra Algorithm', 'Medium', `source = 0, graph = [[[1,4],[2,1]], [[3,1]], [[1,2],[3,5]], []]`, `[0, 3, 1, 4]`, `source = 0, graph = [[[1,7]], [], [[0,2]]]`, `[0, 7, Infinity]`),
      q('Bellman-Ford', 'Medium', `n = 5, source = 0, edges = [[0,1,-1],[0,2,4],[1,2,3],[1,3,2],[1,4,2],[3,2,5],[3,1,1],[4,3,-3]]`, `[0, -1, 2, -2, 1]`, `n = 3, source = 0, edges = [[0,1,1],[1,2,-1],[2,0,-1]]`, `negative cycle detected`),
      q('Floyd-Warshall', 'Medium', `matrix = [[0,5,Infinity,10],[Infinity,0,3,Infinity],[Infinity,Infinity,0,1],[Infinity,Infinity,Infinity,0]]`, `[[0,5,8,9],[Infinity,0,3,4],[Infinity,Infinity,0,1],[Infinity,Infinity,Infinity,0]]`, `matrix = [[0,1],[Infinity,0]]`, `[[0,1],[Infinity,0]]`),
      q('Prim\'s MST', 'Medium', `n = 5, edges = [[0,1,2],[0,3,6],[1,2,3],[1,3,8],[1,4,5],[2,4,7],[3,4,9]]`, `16`, `n = 1, edges = []`, `0`),
      q('Kruskal\'s MST', 'Medium', `n = 4, edges = [[0,1,10],[0,2,6],[0,3,5],[1,3,15],[2,3,4]]`, `19`, `n = 2, edges = [[0,1,7]]`, `7`),
      q('Rotten Oranges', 'Medium', `grid = [[2,1,1],[1,1,0],[0,1,1]]`, `4`, `grid = [[2,1,1],[0,1,1],[1,0,1]]`, `-1`),
      q('Clone Graph', 'Medium', `adjList = [[2,4],[1,3],[2,4],[1,3]]`, `deep copy preserving adjacency`, `adjList = []`, `[]`),
      q('Course Schedule', 'Medium', `numCourses = 2, prerequisites = [[1,0]]`, `true`, `numCourses = 2, prerequisites = [[1,0],[0,1]]`, `false`),
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Memoization, tabulation, subsequences, grids, partitions, and optimization.',
    constraints: [
      'Identify the state, transition, base case, and final answer.',
      'Use memoization for overlapping recursion before optimizing space.',
      'Watch for impossible states and sentinel values.',
    ],
    questions: [
      q('Fibonacci DP', 'Easy', `n = 6`, `8`, `n = 0`, `0`),
      q('Climbing Stairs', 'Easy', `n = 3`, `3`, `n = 1`, `1`),
      q('House Robber', 'Medium', `nums = [1, 2, 3, 1]`, `4`, `nums = [2, 7, 9, 3, 1]`, `12`),
      q('Coin Change', 'Medium', `coins = [1, 2, 5], amount = 11`, `3`, `coins = [2], amount = 3`, `-1`),
      q('0/1 Knapsack', 'Medium', `weights = [1, 3, 4, 5], values = [1, 4, 5, 7], capacity = 7`, `9`, `weights = [4, 5], values = [10, 20], capacity = 3`, `0`),
      q('Unbounded Knapsack', 'Medium', `weights = [2, 3, 4], values = [40, 50, 60], capacity = 5`, `90`, `weights = [5], values = [10], capacity = 14`, `20`),
      q('Longest Increasing Subsequence', 'Medium', `nums = [10, 9, 2, 5, 3, 7, 101, 18]`, `4`, `nums = [7, 7, 7, 7]`, `1`),
      q('Longest Common Subsequence', 'Medium', `text1 = "abcde", text2 = "ace"`, `3`, `text1 = "abc", text2 = "def"`, `0`),
      q('Edit Distance', 'Hard', `word1 = "horse", word2 = "ros"`, `3`, `word1 = "intention", word2 = "execution"`, `5`),
      q('Matrix Chain Multiplication', 'Hard', `dims = [40, 20, 30, 10, 30]`, `26000`, `dims = [10, 20, 30]`, `6000`),
      q('Partition Equal Subset Sum', 'Medium', `nums = [1, 5, 11, 5]`, `true`, `nums = [1, 2, 3, 5]`, `false`),
      q('Minimum Path Sum', 'Medium', `grid = [[1,3,1],[1,5,1],[4,2,1]]`, `7`, `grid = [[1,2,3],[4,5,6]]`, `12`),
      q('Unique Paths', 'Medium', `m = 3, n = 7`, `28`, `m = 1, n = 10`, `1`),
      q('Decode Ways', 'Medium', `s = "226"`, `3`, `s = "06"`, `0`),
      q('Word Break', 'Medium', `s = "leetcode", wordDict = ["leet", "code"]`, `true`, `s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]`, `false`),
      q('Rod Cutting', 'Medium', `prices = [1, 5, 8, 9, 10, 17, 17, 20], length = 8`, `22`, `prices = [2, 5, 7], length = 0`, `0`),
      q('Egg Dropping', 'Hard', `eggs = 2, floors = 10`, `4`, `eggs = 1, floors = 5`, `5`),
      q('Burst Balloons', 'Hard', `nums = [3, 1, 5, 8]`, `167`, `nums = [1, 5]`, `10`),
      q('Maximum Sum Increasing Subsequence', 'Medium', `nums = [1, 101, 2, 3, 100, 4, 5]`, `106`, `nums = [10, 5, 4, 3]`, `10`),
      q('Palindrome Partitioning', 'Medium', `s = "aab"`, `[["a", "a", "b"], ["aa", "b"]]`, `s = "a"`, `[["a"]]`),
    ],
  },
  {
    id: 'recursion-backtracking',
    title: 'Recursion & Backtracking',
    description: 'Decision trees, pruning, permutations, boards, paths, and partitions.',
    constraints: [
      'Define the choice, constraint, and undo step for each recursive frame.',
      'Return all valid configurations in lexicographic or natural order when specified.',
      'Prune invalid partial states early.',
    ],
    questions: [
      q('Permutations', 'Medium', `nums = [1, 2, 3]`, `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`, `nums = [1]`, `[[1]]`),
      q('Subsets', 'Medium', `nums = [1, 2, 3]`, `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`, `nums = []`, `[[]]`),
      q('Combination Sum', 'Medium', `candidates = [2, 3, 6, 7], target = 7`, `[[2, 2, 3], [7]]`, `candidates = [2], target = 1`, `[]`),
      q('Generate Parentheses', 'Medium', `n = 3`, `["((()))", "(()())", "(())()", "()(())", "()()()"]`, `n = 1`, `["()"]`),
      q('N-Queens', 'Hard', `n = 4`, `2 solutions`, `n = 1`, `1 solution`),
      q('Sudoku Solver', 'Hard', `board = standard solvable 9x9 puzzle`, `completed valid Sudoku board`, `board = already solved valid board`, `same board`),
      q('Rat in a Maze', 'Medium', `maze = [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]`, `["DDRDRR", "DRDDRR"]`, `maze = [[0]]`, `[]`),
      q('Word Search', 'Medium', `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"`, `true`, `board = [["a"]], word = "aa"`, `false`),
      q('Letter Combinations of Phone Number', 'Medium', `digits = "23"`, `["ad","ae","af","bd","be","bf","cd","ce","cf"]`, `digits = ""`, `[]`),
      q('Palindrome Partitioning', 'Medium', `s = "aab"`, `[["a", "a", "b"], ["aa", "b"]]`, `s = "efe"`, `[["e", "f", "e"], ["efe"]]`),
    ],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    description: 'XOR, masks, set bits, shifts, numeric tricks, and subset encoding.',
    constraints: [
      'Clarify signed versus unsigned behavior for bit shifts.',
      'Use XOR identity rules where duplicates cancel out.',
      'Check zero and negative edge cases when powers are involved.',
    ],
    questions: [
      q('Single Number', 'Easy', `nums = [2, 2, 1]`, `1`, `nums = [4, 1, 2, 1, 2]`, `4`),
      q('Missing Number', 'Easy', `nums = [3, 0, 1]`, `2`, `nums = [9,6,4,2,3,5,7,0,1]`, `8`),
      q('Count Set Bits', 'Easy', `n = 13`, `3`, `n = 0`, `0`),
      q('Power of Two', 'Easy', `n = 16`, `true`, `n = 0`, `false`),
      q('XOR of Two Numbers', 'Easy', `a = 5, b = 3`, `6`, `a = 0, b = 7`, `7`),
      q('Reverse Bits', 'Medium', `n = 00000010100101000001111010011100`, `964176192`, `n = 11111111111111111111111111111101`, `3221225471`),
      q('Bit Difference', 'Easy', `a = 10, b = 20`, `4`, `a = 7, b = 7`, `0`),
      q('Swap Without Temp', 'Easy', `a = 5, b = 9`, `a = 9, b = 5`, `a = 0, b = 4`, `a = 4, b = 0`),
      q('Divide Without Operators', 'Medium', `dividend = 10, divisor = 3`, `3`, `dividend = -2147483648, divisor = -1`, `2147483647`),
      q('Subsets Using Bitmask', 'Medium', `nums = [1, 2, 3]`, `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`, `nums = []`, `[[]]`),
    ],
  },
  {
    id: 'matrix',
    title: 'Matrix',
    description: '2D traversal, in-place transforms, grids, simulation, and row-column checks.',
    constraints: [
      'Validate row and column boundaries before reading neighbors.',
      'Use in-place markers carefully when the original values matter.',
      'Cover one-row, one-column, and empty matrix cases.',
    ],
    questions: [
      q('Spiral Matrix', 'Medium', `matrix = [[1,2,3],[4,5,6],[7,8,9]]`, `[1,2,3,6,9,8,7,4,5]`, `matrix = [[1,2,3,4]]`, `[1,2,3,4]`),
      q('Rotate Matrix', 'Medium', `matrix = [[1,2,3],[4,5,6],[7,8,9]]`, `[[7,4,1],[8,5,2],[9,6,3]]`, `matrix = [[1]]`, `[[1]]`),
      q('Set Matrix Zeroes', 'Medium', `matrix = [[1,1,1],[1,0,1],[1,1,1]]`, `[[1,0,1],[0,0,0],[1,0,1]]`, `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]`, `[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`),
      q('Search 2D Matrix', 'Medium', `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3`, `true`, `matrix = [[1]], target = 2`, `false`),
      q('Diagonal Traversal', 'Medium', `matrix = [[1,2,3],[4,5,6],[7,8,9]]`, `[1,2,4,7,5,3,6,8,9]`, `matrix = [[1,2],[3,4]]`, `[1,2,3,4]`),
      q('Toeplitz Matrix', 'Easy', `matrix = [[1,2,3,4],[5,1,2,3],[9,5,1,2]]`, `true`, `matrix = [[1,2],[2,2]]`, `false`),
      q('Game of Life', 'Medium', `board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]`, `[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]`, `board = [[1,1],[1,0]]`, `[[1,1],[1,1]]`),
      q('Island Perimeter', 'Easy', `grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]`, `16`, `grid = [[1]]`, `4`),
      q('Matrix Reshape', 'Easy', `mat = [[1,2],[3,4]], r = 1, c = 4`, `[[1,2,3,4]]`, `mat = [[1,2],[3,4]], r = 3, c = 2`, `[[1,2],[3,4]]`),
      q('Lucky Numbers in Matrix', 'Easy', `matrix = [[3,7,8],[9,11,13],[15,16,17]]`, `[15]`, `matrix = [[1,10,4,2],[9,3,8,7],[15,16,17,12]]`, `[12]`),
    ],
  },
];

export const CODE_WAR_ROOM_CATEGORIES: CodeWarRoomCategory[] = rawCategories.map((category) => ({
  id: category.id,
  title: category.title,
  description: category.description,
  questions: category.questions.map((question, questionIndex) => {
    const order = questionIndex + 1;
    const problemId = `${category.id}-${slugify(question.title)}`;
    const functionName = toFunctionName(question.title);
    const parameters = toParameterNames(question.publicInput);

    return {
      id: problemId,
      title: question.title,
      categoryId: category.id,
      categoryTitle: category.title,
      order,
      difficulty: question.difficulty,
      functionName,
      parameters,
      prompt: `Solve ${question.title} for the given input contract. Return exactly the requested output and account for edge cases before optimizing.`,
      constraints: category.constraints,
      tags: [category.title, question.difficulty, question.title.split(' ')[0]],
      companyTags: buildCompanyTags(category.id, question.difficulty, order),
      starterCode: buildStarterCode(functionName, parameters),
      publicTestCases: [
        {
          id: `${problemId}-public-1`,
          name: 'Public Case 1',
          visibility: 'public',
          input: question.publicInput,
          output: question.publicOutput,
        },
      ],
      privateTestCases: [
        {
          id: `${problemId}-private-1`,
          name: 'Private Case 1',
          visibility: 'private',
          input: question.privateInput,
          output: question.privateOutput,
        },
      ],
    };
  }),
}));

export const CODE_WAR_ROOM_PROBLEMS = CODE_WAR_ROOM_CATEGORIES.flatMap((category) => category.questions);

export const CODE_WAR_ROOM_TOTALS = {
  categories: CODE_WAR_ROOM_CATEGORIES.length,
  questions: CODE_WAR_ROOM_PROBLEMS.length,
  companies: CODE_WAR_ROOM_COMPANIES.length,
  publicCases: CODE_WAR_ROOM_PROBLEMS.reduce((total, problem) => total + problem.publicTestCases.length, 0),
  privateCases: CODE_WAR_ROOM_PROBLEMS.reduce((total, problem) => total + problem.privateTestCases.length, 0),
};
