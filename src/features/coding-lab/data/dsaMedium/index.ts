import { DebuggingProblem } from "../../types";
import { ARRAYS_POINTERS_PROBLEMS } from "./arraysPointers";
import { STRINGS_SLIDING_WINDOW_PROBLEMS } from "./stringsSlidingWindow";
import { LINKED_LISTS_PROBLEMS } from "./linkedLists";
import { BINARY_SEARCH_PROBLEMS } from "./binarySearch";
import { TREES_AND_BST_PROBLEMS } from "./treesAndBST";
import { GRAPHS_BFS_DFS_PROBLEMS } from "./graphsBFSDFS";
import { DYNAMIC_PROGRAMMING_PROBLEMS } from "./dynamicProgramming";
import { HEAP_AND_GREEDY_PROBLEMS } from "./heapAndGreedy";
import { MONOTONIC_STACK_PROBLEMS } from "./monotonicStack";
import { BACKTRACKING_PROBLEMS } from "./backtracking";
import { INTERVALS_AND_MATRIX_PROBLEMS } from "./intervalsAndMatrix";

export const DSA_MEDIUM_PROBLEM_BANK: DebuggingProblem[] = [
  ...ARRAYS_POINTERS_PROBLEMS,
  ...STRINGS_SLIDING_WINDOW_PROBLEMS,
  ...LINKED_LISTS_PROBLEMS,
  ...BINARY_SEARCH_PROBLEMS,
  ...TREES_AND_BST_PROBLEMS,
  ...GRAPHS_BFS_DFS_PROBLEMS,
  ...DYNAMIC_PROGRAMMING_PROBLEMS,
  ...HEAP_AND_GREEDY_PROBLEMS,
  ...MONOTONIC_STACK_PROBLEMS,
  ...BACKTRACKING_PROBLEMS,
  ...INTERVALS_AND_MATRIX_PROBLEMS,
];

export const DSA_MEDIUM_STATS = {
  totalCount: DSA_MEDIUM_PROBLEM_BANK.length,
  arraysAndPointers: ARRAYS_POINTERS_PROBLEMS.length,
  stringsAndSlidingWindow: STRINGS_SLIDING_WINDOW_PROBLEMS.length,
  linkedLists: LINKED_LISTS_PROBLEMS.length,
  binarySearch: BINARY_SEARCH_PROBLEMS.length,
  treesAndBST: TREES_AND_BST_PROBLEMS.length,
  graphs: GRAPHS_BFS_DFS_PROBLEMS.length,
  dynamicProgramming: DYNAMIC_PROGRAMMING_PROBLEMS.length,
  heapAndGreedy: HEAP_AND_GREEDY_PROBLEMS.length,
  monotonicStack: MONOTONIC_STACK_PROBLEMS.length,
  backtracking: BACKTRACKING_PROBLEMS.length,
  intervalsAndMatrix: INTERVALS_AND_MATRIX_PROBLEMS.length,
};
