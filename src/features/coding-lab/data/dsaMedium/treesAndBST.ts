import { DebuggingProblem } from "../../types";

export const TREES_AND_BST_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-22",
    title: "Validate Binary Search Tree Local Subtree Comparison Bug",
    difficulty: "Medium",
    language: "python",
    category: "trees",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST). The implementation only checks whether root.val > root.left.val and root.val < root.right.val locally, allowing ancestral BST violations (e.g. left child of right child smaller than grandparent root).",
    expectedBehavior:
      "Pass min and max allowable range bounds down through recursion to enforce global BST validity in O(n) time.",
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4]",
      "-2^31 <= Node.val <= 2^31 - 1",
    ],
    buggyCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode) -> bool:
    if not root:
        return True
        
    # BUG: Only checking direct children!
    # In tree: [5, 4, 6, null, null, 3, 7]
    # Node 3 is left child of 6 (3 < 6 is True), but 3 is in right subtree of 5 (3 > 5 is False)!
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False
        
    return is_valid_bst(root.left) and is_valid_bst(root.right)`,
    solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
            
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
        
    return validate(root)`,
    hints: [
      "A node in a BST must be greater than ALL nodes in its left subtree, not just its immediate left child.",
      "Carry `(low, high)` range bounds through the recursive calls.",
    ],
    tags: ["Tree", "Binary Search Tree", "DFS", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    aiPromptTemplate: `Task: Solve LeetCode 98: Validate Binary Search Tree in Python.
Requirements:
1. Explain the classic trap of only checking immediate children.
2. Implement recursive solution passing (low, high) bounds.
3. Mention how an Inorder Traversal can also validate strict monotonicity.`,
    promptEngineeringTips: [
      "Prompt the model: 'Show an explicit tree counter-example where local child checks return True but the tree is an invalid BST.'",
    ],
    publicTests: [
      {
        id: "tc-med-22-1",
        input: "root = [2,1,3]",
        expectedOutput: "true",
      },
      {
        id: "tc-med-22-2",
        input: "root = [5,1,4,null,null,3,6]",
        expectedOutput: "false",
        explanation: "Root's right child value is 4, which is less than 5.",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-23",
    title: "Lowest Common Ancestor of Binary Tree Null Propagation",
    difficulty: "Medium",
    language: "java",
    category: "trees",
    description:
      "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q. The code below returns null whenever one branch returns null, dropping the valid node found in the other branch.",
    expectedBehavior:
      "Bottom-up DFS: if both left and right return non-null, root is LCA; if only one branch returns non-null, bubble up that non-null node.",
    constraints: [
      "The number of nodes in the tree is in the range [2, 10^5]",
      "-10^9 <= Node.val <= 10^9",
      "All Node.val are unique",
      "p != q and both p and q exist in the tree",
    ],
    buggyCode: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        
        // BUG: Inverting logic when only one branch is non-null!
        if (left != null && right != null) {
            return root;
        }
        // Drops the discovered node by returning null!
        return null;
    }
}`,
    solutionCode: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        
        if (left != null && right != null) {
            return root;
        }
        return left != null ? left : right;
    }
}`,
    hints: [
      "If p and q are in separate subtrees, both left and right will be non-null, so current root is LCA.",
      "If both p and q are in the same subtree, only one of left or right will be non-null: return that non-null node.",
    ],
    tags: ["Tree", "DFS", "Binary Tree", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    aiPromptTemplate: `Task: Implement LeetCode 236: Lowest Common Ancestor of a Binary Tree in Java.
Explain:
- Post-order traversal logic.
- Base cases: root == null, root == p, root == q.
- Why bubbling (left != null ? left : right) correctly handles ancestor-child pairs.`,
    promptEngineeringTips: [
      "Ask the model: 'What happens if p is an ancestor of q? How does the algorithm avoid searching deeper than p?'",
    ],
    publicTests: [
      {
        id: "tc-med-23-1",
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        expectedOutput: "3",
      },
      {
        id: "tc-med-23-2",
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
        expectedOutput: "5",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-24",
    title: "Binary Tree Level Order Traversal Queue Length Mutation",
    difficulty: "Medium",
    language: "cpp",
    category: "trees",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level). In the BFS loop, the loop condition checks q.size() directly without freezing it per level, mixing nodes across different depths into the same level vector.",
    expectedBehavior:
      "Perform BFS snapshotting queue size before processing each depth level in O(n) time.",
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000]",
      "-1000 <= Node.val <= 1000",
    ],
    buggyCode: `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        vector<int> currentLevel;
        
        // BUG: i < q.size() re-evaluates q.size() as child nodes are pushed!
        // The level boundary is corrupted, lumping multiple depths into one vector.
        for (int i = 0; i < q.size(); i++) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(currentLevel);
    }
    return result;
}`,
    solutionCode: `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(currentLevel);
    }
    return result;
}`,
    hints: [
      "As you push child nodes into the queue, `q.size()` grows dynamically.",
      "Snapshot `int levelSize = q.size();` before the inner loop begins.",
    ],
    tags: ["Tree", "BFS", "Queue", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Write a C++ BFS level-order traversal for LeetCode 102.
Highlight:
- Why capturing queue size before processing the level is mandatory in BFS level grouping.
- Analyze time and space complexity with respect to the maximum tree width.`,
    promptEngineeringTips: [
      "Prompt the model: 'Explain the difference between simple queue BFS and level-partitioned BFS.'",
    ],
    publicTests: [
      {
        id: "tc-med-24-1",
        input: "root = [3,9,20,null,null,15,7]",
        expectedOutput: "[[3],[9,20],[15,7]]",
      },
      {
        id: "tc-med-24-2",
        input: "root = [1]",
        expectedOutput: "[[1]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-25",
    title: "Kth Smallest Element in a BST Inorder Traversal State",
    difficulty: "Medium",
    language: "python",
    category: "trees",
    description:
      "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree. The iterative stack implementation decrements k on the wrong traversal phase, returning the wrong element.",
    expectedBehavior:
      "Inorder traversal visits BST elements in strictly ascending order. Decrement k when popping from stack; return node.val when k == 0.",
    constraints: [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10^4",
      "0 <= Node.val <= 10^4",
    ],
    buggyCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kth_smallest(root: TreeNode, k: int) -> int:
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            # BUG: Decrementing k while pushing nodes down left spine!
            # Pushing does not equal visiting in Inorder traversal!
            k -= 1
            if k == 0:
                return curr.val
            stack.append(curr)
            curr = curr.left
            
        curr = stack.pop()
        curr = curr.right
        
    return -1`,
    solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kth_smallest(root: TreeNode, k: int) -> int:
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
            
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
            
        curr = curr.right
        
    return -1`,
    hints: [
      "Inorder traversal order is Left -> Node -> Right.",
      "The node is only 'visited' in sorted sequence when it is popped from the stack.",
    ],
    tags: ["Tree", "BST", "DFS", "Stack", "LeetCode Medium"],
    timeComplexity: "O(H + k)",
    spaceComplexity: "O(H)",
    aiPromptTemplate: `Task: Implement LeetCode 230: Kth Smallest Element in a BST in Python.
Requirements:
1. Iterative stack solution with early stopping when k reaches 0.
2. Space complexity must be O(H) (height of tree), not O(N) by building an entire list.`,
    promptEngineeringTips: [
      "Direct the prompt: 'Do not collect all elements into an array; abort immediately when the kth element is popped.'",
    ],
    publicTests: [
      {
        id: "tc-med-25-1",
        input: "root = [3,1,4,null,2], k = 1",
        expectedOutput: "1",
      },
      {
        id: "tc-med-25-2",
        input: "root = [5,3,6,2,4,null,null,1], k = 3",
        expectedOutput: "3",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-26",
    title: "Construct Binary Tree from Preorder and Inorder Slicing Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "trees",
    description:
      "Given two integer arrays preorder and inorder, construct and return the binary tree. The recursive indexing below incorrectly calculates the right child's preorder index range.",
    expectedBehavior:
      "Map root to preorder[0], find its index in inorder array, split left and right subtrees with exact index counts in O(n) time.",
    constraints: [
      "1 <= preorder.length <= 3000",
      "inorder.length == preorder.length",
      "-3000 <= preorder[i], inorder[i] <= 3000",
      "preorder and inorder consist of unique values",
    ],
    buggyCode: `#include <vector>
#include <unordered_map>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<int>& preorder, int preStart, int preEnd,
                int inStart, int inEnd, unordered_map<int, int>& inMap) {
    if (preStart > preEnd || inStart > inEnd) return nullptr;
    
    int rootVal = preorder[preStart];
    TreeNode* root = new TreeNode(rootVal);
    int inRoot = inMap[rootVal];
    int leftSize = inRoot - inStart;
    
    root->left = build(preorder, preStart + 1, preStart + leftSize,
                       inStart, inRoot - 1, inMap);
                       
    // BUG: preStart + leftSize instead of preStart + leftSize + 1 for right child preorder start!
    // Overlaps the last element of the left subtree with the start of the right subtree!
    root->right = build(preorder, preStart + leftSize, preEnd,
                        inRoot + 1, inEnd, inMap);
                        
    return root;
}`,
    solutionCode: `#include <vector>
#include <unordered_map>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* build(vector<int>& preorder, int preStart, int preEnd,
                int inStart, int inEnd, unordered_map<int, int>& inMap) {
    if (preStart > preEnd || inStart > inEnd) return nullptr;
    
    int rootVal = preorder[preStart];
    TreeNode* root = new TreeNode(rootVal);
    int inRoot = inMap[rootVal];
    int leftSize = inRoot - inStart;
    
    root->left = build(preorder, preStart + 1, preStart + leftSize,
                       inStart, inRoot - 1, inMap);
                       
    root->right = build(preorder, preStart + leftSize + 1, preEnd,
                        inRoot + 1, inEnd, inMap);
                        
    return root;
}`,
    hints: [
      "The left subtree in preorder occupies indices `[preStart + 1 ... preStart + leftSize]`.",
      "The right subtree in preorder starts immediately after: `preStart + leftSize + 1`.",
    ],
    tags: ["Tree", "Array", "Hash Table", "Divide and Conquer", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 105: Construct Binary Tree from Preorder and Inorder Traversal in C++.
Enforce:
- Pre-computing inorder indices with an unordered_map for O(1) lookups.
- Avoid array copies or slices; pass index bounds by reference.
- Total time O(n), total auxiliary space O(n).`,
    promptEngineeringTips: [
      "Ask the model: 'How do you derive the right child preorder boundaries using leftSize?'",
    ],
    publicTests: [
      {
        id: "tc-med-26-1",
        input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
        expectedOutput: "[3,9,20,null,null,15,7]",
      },
      {
        id: "tc-med-26-2",
        input: "preorder = [-1], inorder = [-1]",
        expectedOutput: "[-1]",
      },
    ],
    hiddenTestCount: 3,
  },
];
