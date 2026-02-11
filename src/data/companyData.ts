export interface RoadmapPhase {
  title: string;
  items: string[];
}

export interface HRQuestion {
  id: string;
  question: string;
}

export interface InterviewExperience {
  role: string;
  rounds: string[];
  questions: string[];
  difficulty: string;
  tips: string[];
}

export interface MentorTalk {
  title: string;
  advice: string;
  videoUrl?: string;
}

export interface CompanyResource {
  title: string;
  url?: string;
  type: 'coding' | 'aptitude' | 'interview';
}

export interface CompanyInfo {
  name: string;
  emoji: string;
  description: string;
  roadmap: RoadmapPhase[];
  hrQuestions: HRQuestion[];
  interviewExperiences: InterviewExperience[];
  mentorTalks: MentorTalk[];
  resources: CompanyResource[];
}

const sharedHR: HRQuestion[] = [
  { id: 'hr1', question: 'Tell me about yourself.' },
  { id: 'hr2', question: 'What are your strengths and weaknesses?' },
  { id: 'hr3', question: 'Where do you see yourself in 5 years?' },
  { id: 'hr4', question: 'Why should we hire you?' },
  { id: 'hr5', question: 'Describe a challenging situation you faced and how you handled it.' },
  { id: 'hr6', question: 'What are your hobbies and interests?' },
  { id: 'hr7', question: 'Tell us about your final year project.' },
  { id: 'hr8', question: 'Are you willing to relocate?' },
];

export const companyDataMap: Record<string, CompanyInfo> = {
  TCS: {
    name: 'TCS',
    emoji: '🏢',
    description: 'Tata Consultancy Services — India\'s largest IT services company.',
    roadmap: [
      { title: 'Phase 1: Aptitude Preparation', items: ['Percentage', 'Profit and Loss', 'Ratio and Proportion', 'Time and Work', 'Speed, Time & Distance'] },
      { title: 'Phase 2: Coding Preparation', items: ['Arrays', 'Strings', 'Searching', 'Sorting', 'Pattern Printing'] },
      { title: 'Phase 3: CS Fundamentals', items: ['OOPs Concepts', 'DBMS Basics', 'OS Basics'] },
      { title: 'Phase 4: Interview Preparation', items: ['HR Questions', 'Project Explanation', 'Mock Interview'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'tcs1', question: 'Why do you want to join TCS?' },
      { id: 'tcs2', question: 'What do you know about TCS?' },
      { id: 'tcs3', question: 'Are you okay with the bond period?' },
    ],
    interviewExperiences: [
      { role: 'Ninja', rounds: ['Aptitude Round', 'Coding Round', 'Technical Interview', 'HR Interview'], questions: ['Two Sum problem', 'OOPs pillars', 'SQL joins', 'Tell me about yourself'], difficulty: 'Easy-Medium', tips: ['Focus on aptitude — it has the highest weightage', 'Practice basic coding patterns'] },
      { role: 'Digital', rounds: ['Advanced Aptitude', 'Coding Round (2 questions)', 'Technical + Managerial', 'HR'], questions: ['Linked list reversal', 'DBMS normalization', 'System design basics'], difficulty: 'Medium', tips: ['Stronger coding skills required than Ninja', 'Prepare OS & CN well'] },
    ],
    mentorTalks: [
      { title: 'TCS Preparation Strategy', advice: 'TCS focuses heavily on aptitude and basic coding. Spend 60% time on aptitude, 30% on coding basics, and 10% on CS fundamentals. Practice from PrepInsta for TCS-specific patterns.' },
      { title: 'Cracking TCS NQT', advice: 'The NQT exam is the gateway. Score well in aptitude to clear the cutoff. For coding, focus on arrays, strings, and basic sorting. Speed matters more than complexity.' },
    ],
    resources: [
      { title: 'TCS NQT Previous Year Papers', type: 'aptitude' },
      { title: 'Top 50 TCS Coding Questions', type: 'coding' },
      { title: 'TCS Interview Questions Collection', type: 'interview' },
    ],
  },
  Infosys: {
    name: 'Infosys',
    emoji: '🏛️',
    description: 'Infosys — Global leader in consulting and digital services.',
    roadmap: [
      { title: 'Phase 1: Aptitude & Reasoning', items: ['Logical Reasoning', 'Puzzles', 'Probability', 'Data Interpretation', 'Coding-Decoding'] },
      { title: 'Phase 2: Coding', items: ['Arrays', 'Strings', 'Recursion', 'Linked Lists', 'Pattern Matching'] },
      { title: 'Phase 3: CS Fundamentals', items: ['DBMS', 'OS', 'Computer Networks'] },
      { title: 'Phase 4: Interview', items: ['Technical Interview Prep', 'HR Round Prep', 'Project Discussion'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'inf1', question: 'Why Infosys over other IT companies?' },
      { id: 'inf2', question: 'What do you know about Infosys\' InfyTQ platform?' },
    ],
    interviewExperiences: [
      { role: 'System Engineer', rounds: ['Online Test', 'Technical Interview', 'HR Interview'], questions: ['Recursion problems', 'DBMS ER diagrams', 'Explain your project'], difficulty: 'Medium', tips: ['InfyTQ certification gives bonus marks', 'Focus on logical reasoning for the online test'] },
    ],
    mentorTalks: [
      { title: 'Infosys SP vs SE', advice: 'Specialist Programmer (SP) requires stronger DSA skills. System Engineer (SE) focuses more on aptitude and reasoning. Choose your track wisely and prepare accordingly.' },
    ],
    resources: [
      { title: 'InfyTQ Practice Problems', type: 'coding' },
      { title: 'Infosys Aptitude Question Bank', type: 'aptitude' },
      { title: 'Infosys Interview Experiences - GeeksForGeeks', type: 'interview' },
    ],
  },
  Accenture: {
    name: 'Accenture',
    emoji: '💼',
    description: 'Accenture — Global professional services company.',
    roadmap: [
      { title: 'Phase 1: Cognitive & Aptitude', items: ['Logical Reasoning', 'Analytical Questions', 'Verbal Ability'] },
      { title: 'Phase 2: Coding', items: ['Arrays', 'Strings', 'Medium-level Problems', 'Two Pointer', 'Sliding Window'] },
      { title: 'Phase 3: CS Fundamentals', items: ['OOPs', 'DBMS', 'SQL Queries'] },
      { title: 'Phase 4: Communication & Interview', items: ['Communication Assessment', 'HR & Behavioral Prep'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'acc1', question: 'Why do you want to join Accenture?' },
      { id: 'acc2', question: 'How do you handle pressure and deadlines?' },
    ],
    interviewExperiences: [
      { role: 'Associate Software Engineer', rounds: ['Cognitive Assessment', 'Coding Test', 'Communication Test', 'HR Interview'], questions: ['Array manipulation', 'Communication essay', 'Behavioral scenarios'], difficulty: 'Easy-Medium', tips: ['Communication test is unique to Accenture — practice written English', 'Coding is moderate difficulty'] },
    ],
    mentorTalks: [
      { title: 'Accenture Hiring Process', advice: 'Accenture values communication skills alongside technical ability. The Communication Assessment is equally important as coding. Practice writing structured paragraphs and emails.' },
    ],
    resources: [
      { title: 'Accenture Previous Year Questions', type: 'aptitude' },
      { title: 'Accenture Coding Problems Set', type: 'coding' },
      { title: 'Communication Assessment Guide', type: 'interview' },
    ],
  },
  Wipro: {
    name: 'Wipro',
    emoji: '🌐',
    description: 'Wipro — Leading global IT services company.',
    roadmap: [
      { title: 'Phase 1: Aptitude', items: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Reading Comprehension'] },
      { title: 'Phase 2: Coding', items: ['Basic Arrays', 'Strings', 'Searching & Sorting', 'Basic Recursion'] },
      { title: 'Phase 3: CS Fundamentals', items: ['OOPs', 'DBMS & SQL', 'OS Basics'] },
      { title: 'Phase 4: Interview', items: ['Technical Interview', 'HR Questions'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'wip1', question: 'Why do you want to join Wipro?' },
      { id: 'wip2', question: 'What do you know about Wipro\'s services?' },
    ],
    interviewExperiences: [
      { role: 'Project Engineer', rounds: ['Online Aptitude Test', 'Written Coding Test', 'Technical Interview', 'HR Interview'], questions: ['String reversal', 'OOPs concepts', 'SQL basics'], difficulty: 'Easy', tips: ['Wipro focuses on basics — don\'t over-prepare advanced topics', 'Be confident in HR round'] },
    ],
    mentorTalks: [
      { title: 'Wipro NLTH Strategy', advice: 'Wipro\'s National Level Talent Hunt focuses on aptitude and basic coding. Solve PrepInsta questions for Wipro-specific patterns. Focus on speed and accuracy.' },
    ],
    resources: [
      { title: 'Wipro NLTH Question Papers', type: 'aptitude' },
      { title: 'Wipro Coding Practice Set', type: 'coding' },
      { title: 'Wipro Interview Guide', type: 'interview' },
    ],
  },
  Capgemini: {
    name: 'Capgemini',
    emoji: '🔷',
    description: 'Capgemini — Global leader in consulting and technology services.',
    roadmap: [
      { title: 'Phase 1: Game-based Aptitude', items: ['Game-based Assessments', 'Behavioral Competency', 'Logical Puzzles'] },
      { title: 'Phase 2: Coding', items: ['Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Recursion'] },
      { title: 'Phase 3: CS Fundamentals', items: ['DBMS - Indexing', 'OS - Paging', 'OOPs'] },
      { title: 'Phase 4: Interview', items: ['Technical Interview', 'Project Discussion', 'HR Round'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'cap1', question: 'Why Capgemini?' },
      { id: 'cap2', question: 'How do you approach learning new technologies?' },
    ],
    interviewExperiences: [
      { role: 'Analyst', rounds: ['Game-based Round', 'Technical MCQs', 'Coding Round', 'Technical + HR Interview'], questions: ['Linked list operations', 'DBMS indexing', 'Project walkthrough'], difficulty: 'Medium', tips: ['The game-based round tests behavioral traits, not knowledge', 'Be honest and consistent in game responses'] },
    ],
    mentorTalks: [
      { title: 'Capgemini Game Round', advice: 'Capgemini\'s game-based aptitude is unique. It tests behavioral traits like risk-taking, teamwork, and decision-making. Be consistent in your responses — they detect contradictions.' },
    ],
    resources: [
      { title: 'Capgemini Game-based Assessment Guide', type: 'aptitude' },
      { title: 'Capgemini Coding Questions', type: 'coding' },
      { title: 'Capgemini Interview Experiences', type: 'interview' },
    ],
  },
  Cognizant: {
    name: 'Cognizant',
    emoji: '🧠',
    description: 'Cognizant — Global professional services and digital solutions company.',
    roadmap: [
      { title: 'Phase 1: Aptitude', items: ['Quantitative Aptitude', 'Logical Reasoning', 'Number Series'] },
      { title: 'Phase 2: Coding', items: ['Array Sorting', 'String Processing', 'Basic Data Structures', 'SQL Queries'] },
      { title: 'Phase 3: CS Fundamentals', items: ['OOPs', 'DBMS', 'OS Basics'] },
      { title: 'Phase 4: Interview', items: ['Technical Interview', 'HR Round'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'cog1', question: 'Why do you want to join Cognizant?' },
    ],
    interviewExperiences: [
      { role: 'GenC / GenC Pro', rounds: ['Aptitude Test', 'Coding Assessment', 'Technical Interview', 'HR Interview'], questions: ['Array problems', 'OOPs concepts', 'SQL queries'], difficulty: 'Easy-Medium', tips: ['GenC Pro requires better coding skills', 'Focus on SQL for Cognizant'] },
    ],
    mentorTalks: [
      { title: 'Cognizant GenC Tracks', advice: 'Cognizant has GenC, GenC Next, and GenC Pro tracks. Each has different difficulty levels. Aim for GenC Pro for better packages by strengthening your coding skills.' },
    ],
    resources: [
      { title: 'Cognizant GenC Practice Set', type: 'aptitude' },
      { title: 'Cognizant Coding Questions', type: 'coding' },
      { title: 'Cognizant Interview Guide', type: 'interview' },
    ],
  },
  Deloitte: {
    name: 'Deloitte',
    emoji: '📊',
    description: 'Deloitte — One of the Big Four professional services firms.',
    roadmap: [
      { title: 'Phase 1: Analytical Reasoning', items: ['Analytical Reasoning', 'Business Aptitude', 'Quantitative Analysis'] },
      { title: 'Phase 2: Coding', items: ['Arrays & Hashing', 'String Algorithms', 'Tree Traversals', 'Dynamic Programming'] },
      { title: 'Phase 3: CS Fundamentals', items: ['Advanced SQL', 'Networking Protocols', 'System Design Basics'] },
      { title: 'Phase 4: Interview', items: ['Case Study Preparation', 'Group Discussion', 'Technical + HR'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'del1', question: 'Why Deloitte over other Big Four firms?' },
      { id: 'del2', question: 'Describe a time you led a team project.' },
    ],
    interviewExperiences: [
      { role: 'Analyst', rounds: ['Aptitude + Technical MCQs', 'Coding Round', 'Group Discussion', 'Technical Interview', 'HR Interview'], questions: ['DP problems', 'Case study analysis', 'System design discussion'], difficulty: 'Medium-Hard', tips: ['GD is critical — practice structured argumentation', 'Case study prep differentiates top candidates'] },
    ],
    mentorTalks: [
      { title: 'Cracking Deloitte', advice: 'Deloitte values analytical thinking and communication. Prepare for case studies by reading business scenarios. Group discussions require structured arguments, not just speaking loudly.' },
    ],
    resources: [
      { title: 'Deloitte Analytical Reasoning Set', type: 'aptitude' },
      { title: 'Deloitte Coding Questions', type: 'coding' },
      { title: 'Case Study Preparation Guide', type: 'interview' },
    ],
  },
  IBM: {
    name: 'IBM',
    emoji: '💻',
    description: 'IBM — Pioneer in computing and enterprise solutions.',
    roadmap: [
      { title: 'Phase 1: Cognitive Ability', items: ['Cognitive Ability Test', 'English Language', 'Numerical Reasoning'] },
      { title: 'Phase 2: Coding', items: ['Arrays & Strings', 'Graph Basics (BFS/DFS)', 'Greedy Algorithms', 'OOP Design'] },
      { title: 'Phase 3: CS Fundamentals', items: ['OS - Virtual Memory', 'DBMS - Concurrency', 'CN - Subnetting'] },
      { title: 'Phase 4: Interview', items: ['Technical Interview', 'HR Round'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'ibm1', question: 'What do you know about IBM\'s current focus areas?' },
      { id: 'ibm2', question: 'How do you stay updated with technology trends?' },
    ],
    interviewExperiences: [
      { role: 'Associate System Engineer', rounds: ['Cognitive Ability Test', 'Coding Assessment', 'Technical Interview', 'HR Interview'], questions: ['Graph traversal', 'OS concepts', 'Project explanation'], difficulty: 'Medium', tips: ['IBM\'s cognitive test is unique — practice logical reasoning patterns', 'Show interest in AI/Cloud — IBM\'s focus areas'] },
    ],
    mentorTalks: [
      { title: 'IBM Preparation Tips', advice: 'IBM values innovation and curiosity. Show genuine interest in emerging technologies like AI, Cloud, and Quantum Computing during interviews. Technical questions are moderate difficulty.' },
    ],
    resources: [
      { title: 'IBM Cognitive Ability Practice', type: 'aptitude' },
      { title: 'IBM Coding Assessment Guide', type: 'coding' },
      { title: 'IBM Interview Experiences', type: 'interview' },
    ],
  },
  'Product Companies': {
    name: 'Product Companies',
    emoji: '🚀',
    description: 'Top product-based companies — Google, Amazon, Microsoft, etc.',
    roadmap: [
      { title: 'Phase 1: DSA Mastery', items: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Dynamic Programming', 'Backtracking', 'Heaps & Tries'] },
      { title: 'Phase 2: CS Fundamentals Deep Dive', items: ['OS - Process Sync', 'DBMS - Query Optimization', 'CN - TCP/UDP', 'OOPs - Design Patterns', 'System Design'] },
      { title: 'Phase 3: Problem Solving', items: ['LeetCode 300+ Problems', 'Contest Participation', 'Time-bound Practice'] },
      { title: 'Phase 4: Interview', items: ['System Design Interview', 'Behavioral (STAR Method)', 'Mock Interviews', 'Communication Skills'] },
    ],
    hrQuestions: [
      ...sharedHR,
      { id: 'prod1', question: 'Tell us about a time you built something from scratch.' },
      { id: 'prod2', question: 'How do you prioritize tasks when everything is urgent?' },
      { id: 'prod3', question: 'Describe a conflict with a teammate and how you resolved it.' },
    ],
    interviewExperiences: [
      { role: 'SDE-1', rounds: ['Online Assessment (2-3 coding)', 'DSA Round 1', 'DSA Round 2', 'System Design', 'Hiring Manager / HR'], questions: ['LRU Cache', 'Merge K Sorted Lists', 'Design a URL Shortener', 'Behavioral questions (STAR)'], difficulty: 'Hard', tips: ['Solve 300+ LeetCode problems minimum', 'Practice system design with real-world examples', 'Think aloud during interviews — communication matters'] },
    ],
    mentorTalks: [
      { title: 'Product Company Strategy', advice: 'Product companies test deep DSA knowledge and system design. Aim for 300+ LeetCode problems covering all patterns. System design becomes critical for senior roles. Practice mock interviews weekly.' },
    ],
    resources: [
      { title: 'Blind 75 / NeetCode 150 Problem List', type: 'coding' },
      { title: 'System Design Primer (GitHub)', type: 'interview' },
      { title: 'Behavioral Interview - STAR Method Guide', type: 'interview' },
    ],
  },
};

export const companyKeys = Object.keys(companyDataMap);
