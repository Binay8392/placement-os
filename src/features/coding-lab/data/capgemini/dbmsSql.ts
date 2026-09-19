import { CapgeminiQuestion } from "./types";

export const DBMS_SQL_QUESTIONS: CapgeminiQuestion[] = [
  // 1. SQL Writing: Second Highest Salary
  {
    id: "capg-dbms-01",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "Aggregate & Window Functions",
    difficulty: "Medium",
    type: "sql",
    title: "Find Nth / Second Highest Salary",
    question: "Write an SQL query to find the second highest distinct salary from the 'Employee' table. If there is no second highest salary, return NULL.",
    codeSnippet: `-- Schema:
-- Employee (id INT PRIMARY KEY, salary INT)`,
    correctAnswer: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
    explanation: {
      correctReason: "Using 'WHERE salary < (SELECT MAX(salary) FROM Employee)' filters out the top salary. Applying MAX() on the remaining subset naturally produces the second highest distinct salary. Crucially, if only one salary exists or the table is empty, MAX() evaluates to NULL without throwing runtime errors.",
      concept: "Subquery filtering with MAX() safely handles single-element tables and duplicates without vendor-specific dialect constraints.",
      takeaway: "Alternatively, use window functions: 'SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) t WHERE rnk = 2;'.",
      wrongOptionsAnalysis: "Using 'OFFSET 1 LIMIT 1' returns an empty result set instead of NULL if only 1 distinct salary exists.",
    },
    tags: ["SQL", "Aggregate", "Subquery", "Window Functions"],
    estimatedTimeMinutes: 5,
  },

  // 2. SQL Writing: Self Join
  {
    id: "capg-dbms-02",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "Self Joins",
    difficulty: "Easy",
    type: "sql",
    title: "Employees Earning More Than Their Managers",
    question: "Given the Employee table with columns (id, name, salary, managerId), write an SQL query to find the names of all employees who earn more than their direct managers.",
    codeSnippet: `-- Schema:
-- Employee (id INT, name VARCHAR(50), salary INT, managerId INT)`,
    correctAnswer: `SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
    explanation: {
      correctReason: "A self-join links the table to itself using two alias instances: 'e' for employee and 'm' for manager, joined ON 'e.managerId = m.id'. The WHERE clause 'e.salary > m.salary' filters for employees out-earning their manager.",
      concept: "Self-joins represent hierarchical or recursive relationships (e.g., employee-manager, category-parent) stored within a single table.",
      takeaway: "Always use meaningful table aliases (e, m) to keep self-joins unambiguous.",
    },
    tags: ["SQL", "Self Join", "Hierarchical Query"],
    estimatedTimeMinutes: 4,
  },

  // 3. SQL Writing: GROUP BY & HAVING
  {
    id: "capg-dbms-03",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "GROUP BY & HAVING Clauses",
    difficulty: "Medium",
    type: "sql",
    title: "Departments with Average Salary Above Threshold",
    question: "Write an SQL query to list all department names and their average salaries (rounded to 2 decimals) where the department has at least 5 employees and the average salary exceeds 60,000.",
    codeSnippet: `-- Schema:
-- Department (id INT, name VARCHAR(50))
-- Employee (id INT, name VARCHAR(50), salary INT, departmentId INT)`,
    correctAnswer: `SELECT d.name AS DepartmentName, ROUND(AVG(e.salary), 2) AS AvgSalary
FROM Department d
JOIN Employee e ON d.id = e.departmentId
GROUP BY d.id, d.name
HAVING COUNT(e.id) >= 5 AND AVG(e.salary) > 60000;`,
    explanation: {
      correctReason: "Aggregate filters cannot be placed in the WHERE clause (which operates before grouping). The HAVING clause evaluates conditions on grouped aggregated data. 'HAVING COUNT(e.id) >= 5 AND AVG(e.salary) > 60000' correctly filters the calculated aggregates.",
      concept: "WHERE filters rows before aggregation; HAVING filters groups after aggregation.",
      takeaway: "In SQL interviews, placing AVG() or COUNT() in WHERE is a critical disqualifier error. Always use HAVING for aggregates.",
    },
    tags: ["SQL", "GROUP BY", "HAVING", "Aggregates"],
    estimatedTimeMinutes: 5,
  },

  // 4. SQL Writing: Identifying Duplicates
  {
    id: "capg-dbms-04",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "Duplicate Records",
    difficulty: "Easy",
    type: "sql",
    title: "Find Duplicate Emails",
    question: "Write an SQL query to report all duplicate emails in a table named 'Person'.",
    codeSnippet: `-- Schema:
-- Person (id INT, email VARCHAR(100))`,
    correctAnswer: `SELECT email
FROM Person
GROUP BY email
HAVING COUNT(email) > 1;`,
    explanation: {
      correctReason: "Grouping by 'email' bundles identical email records together. 'HAVING COUNT(email) > 1' ensures only emails appearing more than once in the dataset are returned.",
      concept: "Finding duplicates in relational databases is achieved via GROUP BY combined with HAVING COUNT(*) > 1.",
      takeaway: "Very common in entry-level screening tests at Capgemini and Accenture.",
    },
    tags: ["SQL", "Duplicates", "GROUP BY", "HAVING"],
    estimatedTimeMinutes: 3,
  },

  // 5. SQL Writing: Outer Join / Anti-Join
  {
    id: "capg-dbms-05",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "LEFT JOIN & Anti-Join Patterns",
    difficulty: "Easy",
    type: "sql",
    title: "Customers Who Never Placed Orders",
    question: "Write an SQL query to find all customers who never placed any orders.",
    codeSnippet: `-- Schema:
-- Customers (id INT, name VARCHAR(50))
-- Orders (id INT, customerId INT)`,
    correctAnswer: `SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.customerId IS NULL;`,
    explanation: {
      correctReason: "A LEFT JOIN preserves every row from Customers regardless of whether a matching row exists in Orders. For customers without orders, all columns from Orders evaluate to NULL. 'WHERE o.customerId IS NULL' filters for exactly those non-ordering customers (anti-join pattern).",
      concept: "Left outer join combined with 'WHERE right_key IS NULL' is often more optimizer-friendly than 'WHERE id NOT IN (SELECT customerId FROM Orders)' when null values exist.",
      takeaway: "Beware of 'NOT IN' with nullable subqueries in SQL: if the subquery contains a single NULL, NOT IN evaluates to UNKNOWN and returns 0 rows.",
    },
    tags: ["SQL", "LEFT JOIN", "Anti-Join", "NULL Handling"],
    estimatedTimeMinutes: 4,
  },

  // 6. DBMS Conceptual: ACID Properties
  {
    id: "capg-dbms-06",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "ACID Properties & Transactions",
    difficulty: "Medium",
    type: "mcq",
    title: "Database Isolation Level Phenomena",
    question: "Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads in standard ANSI SQL?",
    options: [
      { id: "A", text: "Read Uncommitted" },
      { id: "B", text: "Read Committed" },
      { id: "C", text: "Repeatable Read" },
      { id: "D", text: "Serializable" },
    ],
    correctAnswer: "C",
    explanation: {
      correctReason: "Under ANSI SQL standards: Repeatable Read guarantees that any row read during a transaction will return identical values if re-read, preventing Dirty Reads and Non-Repeatable Reads. However, range queries may still observe newly inserted rows from concurrent transactions (Phantom Reads). Serializable is the only isolation level that prevents Phantom Reads.",
      concept: "Four ANSI isolation levels in order of strictness: Read Uncommitted (permits all) -> Read Committed (prevents dirty reads) -> Repeatable Read (prevents non-repeatable reads) -> Serializable (prevents phantom reads).",
      takeaway: "Memorize the 3 phenomena (Dirty Read, Non-Repeatable Read, Phantom Read) across the 4 isolation levels.",
      wrongOptionsAnalysis: "Option A permits dirty reads; Option B permits non-repeatable reads; Option D prevents phantom reads.",
    },
    tags: ["DBMS", "ACID", "Transactions", "Isolation Levels"],
    estimatedTimeMinutes: 2,
  },

  // 7. DBMS Conceptual: Normalization
  {
    id: "capg-dbms-07",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "Database Normalization (1NF to BCNF)",
    difficulty: "Medium",
    type: "mcq",
    title: "Third Normal Form (3NF) Requirements",
    question: "A relational database table is in Third Normal Form (3NF) if and only if:",
    options: [
      { id: "A", text: "It is in 1NF and contains no multi-valued attributes" },
      { id: "B", text: "It is in 2NF and has no transitive functional dependencies for non-prime attributes" },
      { id: "C", text: "Every determinant is a candidate key" },
      { id: "D", text: "It contains no foreign key relationships" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "A relation is in 3NF if it is in 2NF (no partial dependency of non-prime attributes on a candidate key) and contains no transitive dependencies (where a non-prime attribute depends on another non-prime attribute). Option C describes BCNF (Boyce-Codd Normal Form).",
      concept: "1NF = Atomic values. 2NF = 1NF + No partial dependencies. 3NF = 2NF + No transitive dependencies. BCNF = 3NF + Every determinant X in X -> Y is a candidate key.",
      takeaway: "Normalization minimizes redundancy and eliminates insertion, update, and deletion anomalies.",
      wrongOptionsAnalysis: "Option A is 1NF; Option C is Boyce-Codd Normal Form (BCNF); Option D is false.",
    },
    tags: ["DBMS", "Normalization", "3NF", "Functional Dependency"],
    estimatedTimeMinutes: 2,
  },

  // 8. DBMS Debugging: DELETE vs TRUNCATE vs DROP
  {
    id: "capg-dbms-08",
    category: "dbms-sql",
    categoryLabel: "DBMS & SQL",
    topic: "DDL vs DML Commands",
    difficulty: "Easy",
    type: "debugging",
    title: "Rollback Behavior: TRUNCATE vs DELETE",
    question: "A DBA executes a command inside a transaction block to remove all records from a table, but discovers they cannot rollback the operation in Oracle/MySQL. What command was mistakenly used instead of DELETE?",
    options: [
      { id: "A", text: "UPDATE table SET id = NULL" },
      { id: "B", text: "TRUNCATE TABLE" },
      { id: "C", text: "SELECT * FROM table FOR UPDATE" },
      { id: "D", text: "ALTER TABLE table READ ONLY" },
    ],
    correctAnswer: "B",
    explanation: {
      correctReason: "TRUNCATE is a DDL (Data Definition Language) command that deallocates data pages. In most engines (including Oracle and MySQL without specific storage engines), DDL commands issue an implicit COMMIT, meaning TRUNCATE cannot be rolled back. DELETE is a DML command that records individual row deletions in the transaction log and can be safely rolled back.",
      concept: "TRUNCATE: DDL, resets identity counter, cannot filter with WHERE, faster, commits implicitly. DELETE: DML, logs per-row, allows WHERE clause, can be rolled back.",
      takeaway: "Never use TRUNCATE when you need transactional rollback capability.",
      wrongOptionsAnalysis: "Option A, C, and D do not clear the table records.",
    },
    tags: ["DBMS", "SQL", "DDL", "DML", "Truncate", "Delete"],
    estimatedTimeMinutes: 2,
  },
];
