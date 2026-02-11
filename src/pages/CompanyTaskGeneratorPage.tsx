import { useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore, getTodayString, type TaskCategory, type TaskDifficulty, type TaskSource } from '@/lib/store';
import { toast } from 'sonner';

interface TaskTemplate {
  name: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  source: TaskSource;
}

const companyTasks: Record<string, TaskTemplate[]> = {
  'TCS': [
    // Coding
    { name: 'Two Sum Problem', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Reverse a String', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Find Maximum in Array', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Binary Search Implementation', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Bubble Sort Implementation', category: 'Coding', difficulty: 'Easy', source: 'Custom' },
    { name: 'Selection Sort Implementation', category: 'Coding', difficulty: 'Easy', source: 'Custom' },
    { name: 'Palindrome Check', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Anagram Detection', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Array Rotation', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Pattern Printing Programs', category: 'Coding', difficulty: 'Easy', source: 'Custom' },
    // Aptitude
    { name: 'Percentage Problems Practice', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Profit and Loss Questions', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Ratio and Proportion', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Time and Work Problems', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Speed, Time & Distance', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Number System Basics', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'OOPs Concepts - Inheritance & Polymorphism', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS - Normalization Forms', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'OS - Process vs Thread', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS - SQL Joins Practice', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'OS - Deadlock Conditions', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'HR Questions - Tell me about yourself', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
    { name: 'HR Questions - Strengths & Weaknesses', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
    { name: 'Project Explanation Practice', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
  ],
  'Infosys': [
    { name: 'Array Sum & Average', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'String Reversal Variants', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Recursion - Factorial & Fibonacci', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Matrix Multiplication', category: 'Coding', difficulty: 'Medium', source: 'HackerRank' },
    { name: 'Linked List Basics', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Stack Implementation', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'String Pattern Matching', category: 'Coding', difficulty: 'Medium', source: 'HackerRank' },
    { name: 'Prime Number Generator', category: 'Coding', difficulty: 'Easy', source: 'Custom' },
    // Aptitude
    { name: 'Logical Reasoning - Puzzles', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Probability Questions', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Data Interpretation Sets', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Coding-Decoding Problems', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Blood Relations Practice', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'DBMS - ER Diagrams & Relationships', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'OS - CPU Scheduling Algorithms', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'CN - OSI & TCP/IP Model', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS - Transactions & ACID Properties', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'Infosys HR Round Preparation', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
    { name: 'Technical Interview - DBMS Questions', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
  ],
  'Accenture': [
    { name: 'Array Manipulation Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'String Operations', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Sorting Algorithm Comparison', category: 'Coding', difficulty: 'Medium', source: 'Custom' },
    { name: 'HashMap Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Two Pointer Technique', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Sliding Window Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    // Aptitude
    { name: 'Logical Reasoning Set', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Analytical Ability Questions', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Verbal Ability Practice', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Quantitative Aptitude Mix', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'OOPs - Abstraction & Encapsulation', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS - SQL Queries Practice', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'Accenture HR & Behavioral Prep', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
    { name: 'Communication Assessment Prep', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
  ],
  'Wipro': [
    { name: 'Basic Array Problems', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'String Manipulation', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Linear Search & Binary Search', category: 'Coding', difficulty: 'Easy', source: 'Custom' },
    { name: 'Basic Recursion Problems', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'Number Theory Basics', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    // Aptitude
    { name: 'Wipro Aptitude - Quant Section', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Logical Reasoning Practice', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Verbal Ability & Reading', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'OOPs Concepts Revision', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS Basics & SQL', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'OS Basics - Memory Management', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'Wipro HR Questions Practice', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
  ],
  'Capgemini': [
    { name: 'Arrays - Prefix Sum', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Strings - Substring Search', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Linked List Operations', category: 'Coding', difficulty: 'Medium', source: 'HackerRank' },
    { name: 'Stack & Queue Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Recursion & Backtracking Intro', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    // Aptitude
    { name: 'Game-based Aptitude Practice', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Behavioral Competency Questions', category: 'Aptitude', difficulty: 'Easy', source: 'Custom' },
    // CS Fundamentals
    { name: 'DBMS - Indexing & Views', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'OS - Paging & Segmentation', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'Capgemini Technical Interview Prep', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
    { name: 'Project Discussion Practice', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
  ],
  'Cognizant': [
    { name: 'Array Sorting & Searching', category: 'Coding', difficulty: 'Easy', source: 'LeetCode' },
    { name: 'String Processing', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    { name: 'Basic Data Structures', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'SQL Query Writing', category: 'Coding', difficulty: 'Easy', source: 'HackerRank' },
    // Aptitude
    { name: 'Cognizant GenC Aptitude Set', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Logical Reasoning - Series', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    { name: 'Quantitative Practice', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'OOPs - Classes & Objects', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    { name: 'DBMS - Keys & Constraints', category: 'CS Fundamentals', difficulty: 'Easy', source: 'Custom' },
    // Interview
    { name: 'Cognizant HR Round Prep', category: 'Interview', difficulty: 'Easy', source: 'Custom' },
  ],
  'Deloitte': [
    { name: 'Arrays & Hashing Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'String Algorithms', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Tree Traversals', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Dynamic Programming Basics', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    // Aptitude
    { name: 'Deloitte Analytical Reasoning', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'Business Aptitude Questions', category: 'Aptitude', difficulty: 'Medium', source: 'Custom' },
    // CS Fundamentals
    { name: 'DBMS - Advanced SQL', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'CN - Networking Protocols', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'Deloitte Case Study Prep', category: 'Interview', difficulty: 'Hard', source: 'Custom' },
    { name: 'Group Discussion Practice', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
  ],
  'IBM': [
    { name: 'Arrays & Strings Combo', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Graph Basics - BFS & DFS', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Greedy Algorithm Problems', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'OOP Design Problems', category: 'Coding', difficulty: 'Medium', source: 'Custom' },
    // Aptitude
    { name: 'IBM Cognitive Ability Test Prep', category: 'Aptitude', difficulty: 'Medium', source: 'PrepInsta' },
    { name: 'English Language Practice', category: 'Aptitude', difficulty: 'Easy', source: 'PrepInsta' },
    // CS Fundamentals
    { name: 'OS - Virtual Memory & Paging', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'DBMS - Concurrency Control', category: 'CS Fundamentals', difficulty: 'Hard', source: 'Custom' },
    { name: 'CN - Subnetting Practice', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    // Interview
    { name: 'IBM Technical Interview Prep', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
  ],
  'Product Companies': [
    // Coding - extensive
    { name: 'Arrays - Kadane\'s Algorithm', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Strings - Longest Palindromic Substring', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Linked List - Reverse & Detect Cycle', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Stack - Next Greater Element', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Queue - Sliding Window Maximum', category: 'Coding', difficulty: 'Hard', source: 'LeetCode' },
    { name: 'Recursion - Subsets & Permutations', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Trees - BST Operations', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Graphs - Shortest Path Algorithms', category: 'Coding', difficulty: 'Hard', source: 'LeetCode' },
    { name: 'Dynamic Programming - LCS & LIS', category: 'Coding', difficulty: 'Hard', source: 'LeetCode' },
    { name: 'Heaps - Kth Largest Element', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Binary Search Variants', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Greedy - Activity Selection', category: 'Coding', difficulty: 'Medium', source: 'LeetCode' },
    { name: 'Trie - Autocomplete System', category: 'Coding', difficulty: 'Hard', source: 'LeetCode' },
    { name: 'Backtracking - N-Queens', category: 'Coding', difficulty: 'Hard', source: 'LeetCode' },
    // CS Fundamentals
    { name: 'OS - Process Synchronization', category: 'CS Fundamentals', difficulty: 'Hard', source: 'Custom' },
    { name: 'DBMS - Query Optimization', category: 'CS Fundamentals', difficulty: 'Hard', source: 'Custom' },
    { name: 'CN - TCP vs UDP Deep Dive', category: 'CS Fundamentals', difficulty: 'Medium', source: 'Custom' },
    { name: 'OOPs - Design Patterns', category: 'CS Fundamentals', difficulty: 'Hard', source: 'Custom' },
    { name: 'System Design Basics', category: 'CS Fundamentals', difficulty: 'Hard', source: 'Custom' },
    // Interview
    { name: 'System Design Interview Prep', category: 'Interview', difficulty: 'Hard', source: 'Custom' },
    { name: 'Behavioral Interview - STAR Method', category: 'Interview', difficulty: 'Medium', source: 'Custom' },
    { name: 'Mock Coding Interview Practice', category: 'Interview', difficulty: 'Hard', source: 'Custom' },
  ],
};

const companies = [
  { value: 'TCS', label: 'TCS (Ninja / Digital / Prime)', emoji: '🏢' },
  { value: 'Infosys', label: 'Infosys (System Engineer / Specialist)', emoji: '🏛️' },
  { value: 'Accenture', label: 'Accenture', emoji: '💼' },
  { value: 'Wipro', label: 'Wipro', emoji: '🌐' },
  { value: 'Capgemini', label: 'Capgemini', emoji: '🔷' },
  { value: 'Cognizant', label: 'Cognizant', emoji: '🧠' },
  { value: 'Deloitte', label: 'Deloitte', emoji: '📊' },
  { value: 'IBM', label: 'IBM', emoji: '💻' },
  { value: 'Product Companies', label: 'Product Companies (General)', emoji: '🚀' },
];

export default function CompanyTaskGeneratorPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [generated, setGenerated] = useState(false);
  const addTrackedTask = useStore(s => s.addTrackedTask);
  const trackedTasks = useStore(s => s.trackedTasks);

  const handleGenerate = () => {
    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    const tasks = companyTasks[selectedCompany];
    if (!tasks) return;

    const today = getTodayString();
    let added = 0;

    for (const t of tasks) {
      // Avoid duplicates by name + company
      const exists = trackedTasks.some(
        existing => existing.name === t.name && existing.category === t.category
      );
      if (!exists) {
        addTrackedTask({
          name: t.name,
          category: t.category,
          difficulty: t.difficulty,
          source: t.source,
          dateAdded: today,
          status: 'Pending',
        });
        added++;
      }
    }

    if (added === 0) {
      toast.info(`All ${selectedCompany} tasks already exist in your tracker`);
    } else {
      toast.success(`${added} tasks generated for ${selectedCompany} successfully`);
    }
    setGenerated(true);
  };

  const preview = selectedCompany ? companyTasks[selectedCompany] : [];
  const categoryCounts = preview?.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Factory className="w-6 h-6 text-primary" />
          Company Task Generator
        </h1>
        <p className="text-muted-foreground text-sm">Auto-generate a preparation plan tailored to a specific company</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Selection */}
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-sm">Select a Company</h2>
          <Select value={selectedCompany} onValueChange={(v) => { setSelectedCompany(v); setGenerated(false); }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a company..." />
            </SelectTrigger>
            <SelectContent>
              {companies.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={!selectedCompany} className="w-full gap-2">
            <Sparkles className="w-4 h-4" /> Generate Tasks
          </Button>
        </section>

        {/* Preview */}
        {selectedCompany && preview && preview.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">
                {companies.find(c => c.value === selectedCompany)?.emoji} {selectedCompany} — {preview.length} Tasks
              </h2>
              {generated && (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Added
                </span>
              )}
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="bg-muted/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{count}</p>
                  <p className="text-[11px] text-muted-foreground">{cat}</p>
                </div>
              ))}
            </div>

            {/* Task list preview */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {preview.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-muted/20"
                >
                  <span className="truncate mr-2">{t.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                      t.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {t.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.source}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
