import { DebuggingProblem } from "../../types";

export const LINKED_LISTS_PROBLEMS: DebuggingProblem[] = [
  {
    id: "med-dsa-12",
    title: "Add Two Numbers Final Carry Digit Dropping",
    difficulty: "Medium",
    language: "python",
    category: "linked-list",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as a linked list. The code terminates when both input lists reach None, forgetting to append a new node when a non-zero carry remains.",
    expectedBehavior:
      "Sum corresponding nodes and carry. Append carry if carry > 0 even after both l1 and l2 are null.",
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "Lists do not contain leading zeroes except for 0 itself",
    ],
    buggyCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    
    # BUG: Loop terminates when both l1 and l2 are None, dropping remaining carry!
    # Example: [5] + [5] = [0] instead of [0, 1]!
    while l1 or l2:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        curr.next = ListNode(total % 10)
        curr = curr.next
        
        if l1: l1 = l1.next
        if l2: l2 = l2.next
        
    return dummy.next`,
    solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        curr.next = ListNode(total % 10)
        curr = curr.next
        
        if l1: l1 = l1.next
        if l2: l2 = l2.next
        
    return dummy.next`,
    hints: [
      "What if l1 = [5] and l2 = [5]? Total is 10. The digits should be 0 followed by 1.",
      "Include `carry` in the while loop condition: `while l1 or l2 or carry:`.",
    ],
    tags: ["Linked List", "Math", "Recursion", "LeetCode Medium"],
    timeComplexity: "O(max(m, n))",
    spaceComplexity: "O(max(m, n))",
    aiPromptTemplate: `Task: Solve LeetCode 2: Add Two Numbers in Python.
Requirements:
1. Handle lists of unequal lengths cleanly.
2. Emphasize why the while loop condition must check 'while l1 or l2 or carry:'.
3. Maintain O(max(N, M)) time and space.`,
    promptEngineeringTips: [
      "Ask the model: 'What is the critical edge case when the most significant digit produces a carry overflow?'",
    ],
    publicTests: [
      {
        id: "tc-med-12-1",
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        expectedOutput: "[7,0,8]",
        explanation: "342 + 465 = 807 -> [7,0,8]",
      },
      {
        id: "tc-med-12-2",
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        expectedOutput: "[8,9,9,9,0,0,0,1]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-13",
    title: "Remove Nth Node From End Dummy Head Offset Bug",
    difficulty: "Medium",
    language: "java",
    category: "linked-list",
    description:
      "Given the head of a linked list, remove the nth node from the end of the list and return its head. The code omits a dummy sentinel node, causing a NullPointerException or failure to remove the list head when n == length.",
    expectedBehavior:
      "Use two pointers with a sentinel dummy node to remove the nth node in a single pass O(L) time and O(1) space.",
    constraints: [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz",
    ],
    buggyCode: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode fast = head;
        ListNode slow = head;
        
        for (int i = 0; i < n; i++) {
            fast = fast.next;
        }
        
        // BUG: If fast is null, the node to remove is the head!
        // Calling slow.next = slow.next.next without dummy or head check skips handling head deletion!
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return head;
    }
}`,
    solutionCode: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy;
        ListNode slow = dummy;
        
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }
        
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
    hints: [
      "Using a sentinel dummy node before head prevents special casing the removal of the first node.",
      "Advance fast pointer n + 1 steps from dummy so slow stops immediately before the target node.",
    ],
    tags: ["Linked List", "Two Pointers", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write a single-pass Java solution for LeetCode 19: Remove Nth Node From End of List.
Enforce:
- Sentinel dummy node pattern.
- Explain why moving fast n+1 steps places slow right before the node to be removed.`,
    promptEngineeringTips: [
      "Instruct the AI: 'Never traverse the list twice to find length first; implement single-pass two-pointer offset.'",
    ],
    publicTests: [
      {
        id: "tc-med-13-1",
        input: "head = [1,2,3,4,5], n = 2",
        expectedOutput: "[1,2,3,5]",
      },
      {
        id: "tc-med-13-2",
        input: "head = [1], n = 1",
        expectedOutput: "[]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-14",
    title: "Reorder List Second Half Cycle & Disconnection Bug",
    difficulty: "Medium",
    language: "python",
    category: "linked-list",
    description:
      "You are given the head of a singly linked-list: L0 -> L1 -> ... -> Ln-1 -> Ln. Reorder it to: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... In the implementation, the first half is not disconnected from the second half before reversing, resulting in an infinite cyclic loop.",
    expectedBehavior:
      "Find middle with slow/fast, sever first half with prev.next = None, reverse second half, and interleave in O(n) time and O(1) space.",
    constraints: [
      "The number of nodes in the list is in the range [1, 5 * 10^4]",
      "1 <= Node.val <= 1000",
    ],
    buggyCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head: ListNode) -> None:
    if not head or not head.next:
        return
        
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    # BUG: Forgot to sever first half (e.g. slow.next = None)!
    # Reversing directly from slow or slow.next creates a cycle between halves!
    prev = None
    curr = slow
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # Interleave
    first, second = head, prev
    while second.next:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
    solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head: ListNode) -> None:
    if not head or not head.next:
        return
        
    # 1. Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
        
    # 2. Sever first half from second half
    second = slow.next
    slow.next = None
    
    # 3. Reverse second half
    prev = None
    curr = second
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # 4. Merge halves
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
    hints: [
      "Always set `slow.next = None` to terminate the first half.",
      "Without severing, nodes in the first half will still point to nodes in the second half, creating an infinite cycle during traversal.",
    ],
    tags: ["Linked List", "Two Pointers", "Stack", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Implement LeetCode 143: Reorder List in Python without extra space (O(1) auxiliary space).
Outline the 3 distinct phases:
1. Fast and slow pointers to locate the midpoint.
2. Severing the list and reversing the second half in-place.
3. Merging the two halves alternatingly.`,
    promptEngineeringTips: [
      "Prompt specifically for: 'Avoid recursion or stack; enforce O(1) in-place pointer manipulation.'",
    ],
    publicTests: [
      {
        id: "tc-med-14-1",
        input: "head = [1,2,3,4]",
        expectedOutput: "[1,4,2,3]",
      },
      {
        id: "tc-med-14-2",
        input: "head = [1,2,3,4,5]",
        expectedOutput: "[1,5,2,4,3]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-15",
    title: "Copy List with Random Pointer Deep Copy Mapping Bug",
    difficulty: "Medium",
    language: "cpp",
    category: "linked-list",
    description:
      "A linked list of length n is given such that each node contains an additional random pointer. Construct a deep copy of the list. The implementation incorrectly assigns random pointers to original nodes instead of cloned nodes.",
    expectedBehavior:
      "Clone all nodes and random pointers using a hash map or 3-pass interleaving in O(n) time.",
    constraints: [
      "0 <= n <= 1000",
      "-10^4 <= Node.val <= 10^4",
      "Node.random is null or is pointing to some node in the linked list",
    ],
    buggyCode: `#include <unordered_map>
using namespace std;

class Node {
public:
    int val;
    Node* next;
    Node* random;
    Node(int _val) : val(_val), next(nullptr), random(nullptr) {}
};

Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    unordered_map<Node*, Node*> cloneMap;
    Node* curr = head;
    while (curr) {
        cloneMap[curr] = new Node(curr->val);
        curr = curr->next;
    }
    
    curr = head;
    while (curr) {
        cloneMap[curr]->next = cloneMap[curr->next];
        // BUG: Assigning original node's random instead of the mapped clone!
        cloneMap[curr]->random = curr->random; 
        curr = curr->next;
    }
    return cloneMap[head];
}`,
    solutionCode: `#include <unordered_map>
using namespace std;

class Node {
public:
    int val;
    Node* next;
    Node* random;
    Node(int _val) : val(_val), next(nullptr), random(nullptr) {}
};

Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    unordered_map<Node*, Node*> cloneMap;
    Node* curr = head;
    while (curr) {
        cloneMap[curr] = new Node(curr->val);
        curr = curr->next;
    }
    
    curr = head;
    while (curr) {
        cloneMap[curr]->next = cloneMap[curr->next];
        cloneMap[curr]->random = cloneMap[curr->random];
        curr = curr->next;
    }
    return cloneMap[head];
}`,
    hints: [
      "Every pointer in the cloned list must point to another cloned node, never back to the original list.",
      "Assign `cloneMap[curr]->random = cloneMap[curr->random]`.",
    ],
    tags: ["Linked List", "Hash Table", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    aiPromptTemplate: `Task: Solve LeetCode 138: Copy List with Random Pointer in C++.
Explain:
1. Hash map approach O(N) space.
2. Interleaving node approach O(1) auxiliary space.
3. Why assigning curr->random directly breaks deep copy isolation.`,
    promptEngineeringTips: [
      "Ask the model: 'How can you verify that mutating cloned nodes does not mutate any nodes in the original list?'",
    ],
    publicTests: [
      {
        id: "tc-med-15-1",
        input: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
        expectedOutput: "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
      },
      {
        id: "tc-med-15-2",
        input: "head = [[1,1],[2,1]]",
        expectedOutput: "[[1,1],[2,1]]",
      },
    ],
    hiddenTestCount: 3,
  },
  {
    id: "med-dsa-16",
    title: "Swap Nodes in Pairs Preceding Pointer Link Failure",
    difficulty: "Medium",
    language: "python",
    category: "linked-list",
    description:
      "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed). The code below forgets to update the previous pair's connection to point to the newly swapped head.",
    expectedBehavior:
      "Correctly swap adjacent pairs and rewire previous node next pointer in O(n) time and O(1) space.",
    constraints: [
      "The number of nodes in the list is in the range [0, 100]",
      "0 <= Node.val <= 100",
    ],
    buggyCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def swap_pairs(head: ListNode) -> ListNode:
    dummy = ListNode(0, head)
    prev = dummy
    curr = head
    
    while curr and curr.next:
        first = curr
        second = curr.next
        
        # BUG: Swapping first and second without linking prev.next to second!
        first.next = second.next
        second.next = first
        # prev.next is still pointing to first, leaving list in inconsistent state!
        
        prev = first
        curr = first.next
        
    return dummy.next`,
    solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def swap_pairs(head: ListNode) -> ListNode:
    dummy = ListNode(0, head)
    prev = dummy
    curr = head
    
    while curr and curr.next:
        first = curr
        second = curr.next
        
        # Link previous pair to second node
        prev.next = second
        first.next = second.next
        second.next = first
        
        prev = first
        curr = first.next
        
    return dummy.next`,
    hints: [
      "Before the swap, prev points to first. After swapping, prev must point to second.",
      "Add `prev.next = second` before rewiring the internal pair pointers.",
    ],
    tags: ["Linked List", "Recursion", "LeetCode Medium"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    aiPromptTemplate: `Task: Write an iterative Python solution for LeetCode 24: Swap Nodes in Pairs.
Requirements:
1. Do not swap node values; swap pointers.
2. Use a dummy node.
3. Draw the pointer redirection steps before and after the swap.`,
    promptEngineeringTips: [
      "Ask the model to enumerate the 4 pointer rewires needed in every pair swap step.",
    ],
    publicTests: [
      {
        id: "tc-med-16-1",
        input: "head = [1,2,3,4]",
        expectedOutput: "[2,1,4,3]",
      },
      {
        id: "tc-med-16-2",
        input: "head = []",
        expectedOutput: "[]",
      },
    ],
    hiddenTestCount: 3,
  },
];
