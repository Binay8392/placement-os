import { DebuggingProblem } from "../../types";

export const GRAPHS_BFS_DFS_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-27",
    title: "Number of Islands Visited Marking Delay Infinite Recursion",
    difficulty: "Medium",
    language: "python",
    category: "graphs",
    description:
      "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. In the DFS implementation below, the visited cell is marked as '0' after recursive calls instead of before, causing infinite recursive bouncing between adjacent cells and a RecursionError.",
    expectedBehavior:
      "Mark grid[r][c] = '0' (or in visited set) BEFORE expanding to adjacent neighbors in O(m * n) time.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'",
    ],
    buggyCode: `def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
        
    m, n = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
            
        # BUG: Recursing before marking grid[r][c] = '0'!
        # Neighbor (r+1, c) immediately recurses back to (r, c) because it is still '1', causing infinite recursion!
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        grid[r][c] = '0' # Marked too late!
        
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
                
    return count`,
    solutionCode: `def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
        
    m, n = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
            
        # Mark immediately before exploring neighbors
        grid[r][c] = '0'
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
                
    return count`,
    hints: [
      "When cell (r, c) visits neighbor (r + 1, c), what prevents (r + 1, c) from immediately visiting (r, c) again?",
      "Set `grid[r][c] = '0'` as the very first line after the base case checks.",
    ],
    tags: ["Graph", "DFS", "BFS", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    aiPromptTemplate: `Task: Solve LeetCode 200: Number of Islands in Python.
Requirements:
1. Explain both DFS (in-place sinking) and BFS (queue).
2. Clearly explain why visited cells must be sunk BEFORE queuing or recursing.
3. Time: O(M * N), Space: O(M * N) worst case recursion depth.`,
    promptEngineeringTips: [
      "Ask the model: 'What happens when two adjacent land cells repeatedly call each other if marking is placed at the end?'",
    ],
    publicTests: [
      {
        id: "tc-med-27-1",
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        expectedOutput: "1",
      },
      {
        id: "tc-med-27-2",
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        expectedOutput: "3",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-28",
    title: "Course Schedule Topological Sort 3-State Cycle Detection",
    difficulty: "Medium",
    language: "cpp",
    category: "graphs",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Some courses may have prerequisites. Return true if you can finish all courses. In the DFS implementation, visited states are boolean (true/false) rather than 3-state (unvisited, visiting, visited), which causes false positive cycle reports on DAGs with reconverging paths.",
    expectedBehavior:
      "Detect cycles in directed graph using Kahn's algorithm (indegrees) or 3-state DFS coloring in O(V + E) time.",
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "All the pairs prerequisites[i] are unique",
    ],
    buggyCode: `#include <vector>
using namespace std;

bool hasCycle(int node, vector<vector<int>>& adj, vector<bool>& visited) {
    // BUG: Using a single boolean visited array!
    // If a node was visited in a PREVIOUS completed search tree, it is marked true,
    // which this code incorrectly mistakes for an active back-edge cycle!
    if (visited[node]) return true;
    
    visited[node] = true;
    for (int next : adj[node]) {
        if (hasCycle(next, adj, visited)) return true;
    }
    return false;
}

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
    }
    
    vector<bool> visited(numCourses, false);
    for (int i = 0; i < numCourses; i++) {
        if (hasCycle(i, adj, visited)) return false;
    }
    return true;
}`,
    solutionCode: `#include <vector>
using namespace std;

// state: 0 = unvisited, 1 = visiting (on current recursion stack), 2 = completely visited
bool hasCycle(int node, vector<vector<int>>& adj, vector<int>& state) {
    if (state[node] == 1) return true; // Found cycle!
    if (state[node] == 2) return false; // Already verified safe
    
    state[node] = 1;
    for (int next : adj[node]) {
        if (hasCycle(next, adj, state)) return true;
    }
    state[node] = 2; // Finished processing node and all descendants
    return false;
}

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
    }
    
    vector<int> state(numCourses, 0);
    for (int i = 0; i < numCourses; i++) {
        if (state[i] == 0 && hasCycle(i, adj, state)) return false;
    }
    return true;
}`,
    hints: [
      "In a diamond DAG (A -> B -> D and A -> C -> D), D is reached twice, but there is NO cycle.",
      "Distinguish between nodes currently on the active recursion stack (state = 1) versus nodes that have completed DFS (state = 2).",
    ],
    tags: ["Graph", "DFS", "BFS", "Topological Sort", "LeetCode Medium"],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    aiPromptTemplate: `Task: Implement LeetCode 207: Course Schedule in C++.
Provide:
1. Kahn's Algorithm (BFS with In-degree count).
2. DFS cycle detection using 3-state coloring (White=0, Gray=1, Black=2).
3. Contrast why binary boolean visited fails on directed acyclic graphs with reconvergent paths.`,
    promptEngineeringTips: [
      "Instruct the AI: 'Draw the classic diamond DAG counterexample where a single boolean visited array returns a false cycle.'",
    ],
    publicTests: [
      {
        id: "tc-med-28-1",
        input: "numCourses = 2, prerequisites = [[1,0]]",
        expectedOutput: "true",
      },
      {
        id: "tc-med-28-2",
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        expectedOutput: "false",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-29",
    title: "Rotting Oranges Multi-Source BFS Initial State Count",
    difficulty: "Medium",
    language: "python",
    category: "graphs",
    description:
      "You are given an m x n grid where each cell has values 0 (empty), 1 (fresh), or 2 (rotten). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. The implementation below increments minutes even when no fresh oranges were infected in the step, producing off-by-one results.",
    expectedBehavior:
      "Multi-source BFS from all initially rotten oranges; track fresh orange count and increment minutes only when at least one fresh orange turns rotten.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 10",
      "grid[i][j] is 0, 1, or 2",
    ],
    buggyCode: `from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
                
    if fresh == 0:
        return 0
        
    minutes = 0
    # BUG: Incrementing minutes unconditionally every BFS level,
    # including the final empty iteration where no fresh oranges were infected!
    while q:
        minutes += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
                    
    return minutes if fresh == 0 else -1`,
    solutionCode: `from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
                
    if fresh == 0:
        return 0
        
    minutes = 0
    while q and fresh > 0:
        minutes += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
                    
    return minutes if fresh == 0 else -1`,
    hints: [
      "If there are no more fresh oranges left (`fresh == 0`), subsequent iterations should not increment the clock.",
      "Add `while q and fresh > 0:` to terminate BFS as soon as all fresh oranges are rotted.",
    ],
    tags: ["Graph", "BFS", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    aiPromptTemplate: `Task: Solve LeetCode 994: Rotting Oranges in Python.
Enforce:
- Multi-source BFS queuing all rotten oranges initially.
- Explanation of why single-source BFS or DFS cannot find the global minimum time.
- Handling of edge cases: 0 fresh oranges, unreachable fresh oranges.`,
    promptEngineeringTips: [
      "Instruct the prompt: 'Emphasize the condition `while q and fresh > 0:` to prevent overcounting the final minute.'",
    ],
    publicTests: [
      {
        id: "tc-med-29-1",
        input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        expectedOutput: "4",
      },
      {
        id: "tc-med-29-2",
        input: "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        expectedOutput: "-1",
        explanation: "The orange in the bottom left corner (row 2, col 0) is never rotted.",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-30",
    title: "Clone Graph Cyclic Neighbor Memoization Prematurity",
    difficulty: "Medium",
    language: "java",
    category: "graphs",
    description:
      "Given a reference of a node in a connected undirected graph, return a deep copy of the graph. In the recursive DFS clone implementation, the new clone is not recorded into the visited map before traversing its neighbors, causing infinite recursion on bidirectional edges.",
    expectedBehavior:
      "Map original node to clone in hash map BEFORE traversing adjacent neighbors in O(V + E) time.",
    constraints: [
      "The number of nodes in the graph is in the range [0, 100]",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node",
      "The graph is undirected and connected",
    ],
    buggyCode: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
}

public class Solution {
    private Map<Node, Node> visited = new HashMap<>();
    
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (visited.containsKey(node)) return visited.get(node);
        
        Node clone = new Node(node.val);
        // BUG: Traversing neighbors before inserting clone into visited map!
        // When neighbor recurses back to this node, visited.containsKey(node) is FALSE,
        // triggering infinite recursion and StackOverflowError!
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }
        visited.put(node, clone); // Inserted too late!
        
        return clone;
    }
}`,
    solutionCode: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
}

public class Solution {
    private Map<Node, Node> visited = new HashMap<>();
    
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (visited.containsKey(node)) return visited.get(node);
        
        Node clone = new Node(node.val);
        // Memoize clone immediately before expanding neighbors
        visited.put(node, clone);
        
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }
        
        return clone;
    }
}`,
    hints: [
      "Undirected graphs have cycles because edge (u, v) also means edge (v, u).",
      "Store `visited.put(node, clone)` immediately after instantiating `clone`.",
    ],
    tags: ["Graph", "DFS", "BFS", "Hash Table", "LeetCode Medium"],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    aiPromptTemplate: `Task: Implement LeetCode 133: Clone Graph in Java.
Requirements:
1. Explain both DFS recursion and BFS iterative approaches.
2. Demonstrate how memoizing the cloned node before recursing into neighbors prevents infinite recursion on undirected edges.`,
    promptEngineeringTips: [
      "Prompt: 'Highlight the cycle avoidance invariant when cloning cyclic graphs.'",
    ],
    publicTests: [
      {
        id: "tc-med-30-1",
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        expectedOutput: "[[2,4],[1,3],[2,4],[1,3]]",
      },
      {
        id: "tc-med-30-2",
        input: "adjList = [[]]",
        expectedOutput: "[[]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-31",
    title: "Pacific Atlantic Water Flow Reverse DFS Elevation Inversion",
    difficulty: "Medium",
    language: "python",
    category: "graphs",
    description:
      "There is an m x n rectangular island that borders both the Pacific and Atlantic Oceans. Return a 2D list of grid coordinates where water can flow to both oceans. The reverse search below accidentally checks for decreasing height instead of non-decreasing height when climbing from ocean shorelines.",
    expectedBehavior:
      "Reverse DFS/BFS starting from Pacific and Atlantic borders, moving to neighbors with heights[nr][nc] >= heights[r][c], then intersect reachable sets.",
    constraints: [
      "m == heights.length",
      "n == heights[r].length",
      "1 <= m, n <= 200",
      "0 <= heights[r][c] <= 10^5",
    ],
    buggyCode: `def pacific_atlantic(heights: list[list[int]]) -> list[list[int]]:
    if not heights:
        return []
        
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            # BUG: heights[nr][nc] <= heights[r][c]!
            # Since we are climbing UP from ocean boundaries inland,
            # water flows down from a higher/equal cell to a lower cell,
            # so the reverse path MUST satisfy heights[nr][nc] >= heights[r][c]!
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited:
                if heights[nr][nc] <= heights[r][c]:
                    dfs(nr, nc, visited)
                    
    for c in range(n):
        dfs(0, c, pacific)
        dfs(m - 1, c, atlantic)
    for r in range(m):
        dfs(r, 0, pacific)
        dfs(r, n - 1, atlantic)
        
    return [[r, c] for r, c in (pacific & atlantic)]`,
    solutionCode: `def pacific_atlantic(heights: list[list[int]]) -> list[list[int]]:
    if not heights:
        return []
        
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited:
                if heights[nr][nc] >= heights[r][c]:
                    dfs(nr, nc, visited)
                    
    for c in range(n):
        dfs(0, c, pacific)
        dfs(m - 1, c, atlantic)
    for r in range(m):
        dfs(r, 0, pacific)
        dfs(r, n - 1, atlantic)
        
    return [[r, c] for r, c in (pacific & atlantic)]`,
    hints: [
      "Instead of simulating water flowing down to oceans from every cell, start from ocean borders and climb upstream.",
      "Climbing upstream requires moving to cells of equal or greater elevation (`heights[nr][nc] >= heights[r][c]`).",
    ],
    tags: ["Graph", "DFS", "BFS", "Matrix", "LeetCode Medium"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    aiPromptTemplate: `Task: Solve LeetCode 417: Pacific Atlantic Water Flow in Python.
Explain:
1. Why starting DFS from every cell is O((M*N)^2) and results in TLE.
2. How the reverse ocean-inward approach reduces complexity to O(M * N).
3. Why the elevation predicate flips to >= when searching inward from ocean edges.`,
    promptEngineeringTips: [
      "Direct the model: 'Compare forward search from every cell vs reverse search from ocean borders.'",
    ],
    publicTests: [
      {
        id: "tc-med-31-1",
        input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        expectedOutput: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
      },
      {
        id: "tc-med-31-2",
        input: "heights = [[1]]",
        expectedOutput: "[[0,0]]",
      },
    ],
    hiddenTestCount: 3,
  },
];
