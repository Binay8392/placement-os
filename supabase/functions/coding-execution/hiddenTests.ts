/**
 * Server-only evaluation test bank.
 * NEVER import this file into client-side code (src/...)!
 */

export interface ServerTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: true;
}

export const SERVER_HIDDEN_TESTS: Record<string, ServerTestCase[]> = {
  "debug-cpp-01": [
    {
      id: "tc-01-h1",
      input: "nums = [1, 2, 3, 4, 5, 6], target = 6",
      expectedOutput: "5",
      isHidden: true,
    },
    {
      id: "tc-01-h2",
      input: "nums = [1, 2, 3, 4, 5, 6], target = 1",
      expectedOutput: "0",
      isHidden: true,
    },
    {
      id: "tc-01-h3",
      input: "nums = [10, 20, 30], target = 5",
      expectedOutput: "-1",
      isHidden: true,
    },
  ],
  "debug-py-02": [
    {
      id: "tc-02-h1",
      input: "nums = [3, 2, 4], target = 6",
      expectedOutput: "[1, 2]",
      isHidden: true,
    },
    {
      id: "tc-02-h2",
      input: "nums = [3, 3], target = 6",
      expectedOutput: "[0, 1]",
      isHidden: true,
    },
    {
      id: "tc-02-h3",
      input: "nums = [-1, -2, -3, -4, -5], target = -8",
      expectedOutput: "[2, 4]",
      isHidden: true,
    },
  ],
  "debug-js-03": [
    {
      id: "tc-03-h1",
      input: 's = "0P"',
      expectedOutput: "false",
      isHidden: true,
    },
    {
      id: "tc-03-h2",
      input: 's = "ab_a"',
      expectedOutput: "true",
      isHidden: true,
    },
  ],
  "debug-java-04": [
    {
      id: "tc-04-h1",
      input: 's = "]"',
      expectedOutput: "false",
      isHidden: true,
    },
    {
      id: "tc-04-h2",
      input: 's = "(("',
      expectedOutput: "false",
      isHidden: true,
    },
  ],
  "debug-py-05": [
    {
      id: "tc-05-h1",
      input: "n = 0",
      expectedOutput: "0",
      isHidden: true,
    },
    {
      id: "tc-05-h2",
      input: "n = 1",
      expectedOutput: "1",
      isHidden: true,
    },
    {
      id: "tc-05-h3",
      input: "n = 10",
      expectedOutput: "55",
      isHidden: true,
    },
  ],
  "debug-cpp-06": [
    {
      id: "tc-06-h1",
      input: "head = [1]",
      expectedOutput: "[1]",
      isHidden: true,
    },
  ],
  "debug-js-07": [
    {
      id: "tc-07-h1",
      input: "reviews = [{rating: 5}]",
      expectedOutput: "5",
      isHidden: true,
    },
  ],
  "debug-java-08": [
    {
      id: "tc-08-h1",
      input: "points = [[100000, 100000], [1, 1]], k = 1",
      expectedOutput: "[[1, 1]]",
      isHidden: true,
    },
  ],
  "debug-cpp-09": [
    {
      id: "tc-09-h1",
      input: "nums = [-5, -2, -9, -1]",
      expectedOutput: "-1",
      isHidden: true,
    },
    {
      id: "tc-09-h2",
      input: "nums = [-100]",
      expectedOutput: "-100",
      isHidden: true,
    },
  ],
  "debug-py-10": [
    {
      id: "tc-10-h1",
      input: 's = "aacc", t = "ccac"',
      expectedOutput: "False",
      isHidden: true,
    },
  ],
};
