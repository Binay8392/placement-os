export interface RoadmapPhase {
  title: string;
  items: string[];
}

export interface HRQuestion {
  id: string;
  question: string;
}

export interface InterviewRound {
  name: string;
  questions: string[];
}

export interface InterviewExperience {
  role: string;
  rounds: string[];
  roundDetails: InterviewRound[];
  questions: string[];
  difficulty: string;
  tips: string[];
  source?: string;
}

export interface MentorTalk {
  title: string;
  advice: string;
  videoUrl?: string;
  videoTitle?: string;
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
  { id: 'hr9', question: 'What motivates you to work hard?' },
  { id: 'hr10', question: 'How do you handle failure?' },
  { id: 'hr11', question: 'Tell us about a time you worked in a team.' },
  { id: 'hr12', question: 'What is your greatest achievement?' },
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
      { id: 'tcs4', question: 'What do you know about TCS Digital?' },
      { id: 'tcs5', question: 'Are you comfortable working in any domain?' },
      { id: 'tcs6', question: 'What salary do you expect?' },
    ],
    interviewExperiences: [
      {
        role: 'Ninja',
        rounds: ['Aptitude Round', 'Coding Round', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Aptitude Round', questions: ['Percentage problems — 20% of 350', 'Profit and Loss — Cost price was 400, sold at 480', 'Ratio & Proportion word problems', 'Time and Work — A finishes in 5 days, B in 10 days', 'Data Interpretation — bar graph analysis'] },
          { name: 'Coding Round', questions: ['Two Sum Problem (Arrays)', 'Reverse a string without using built-in functions', 'Check if a number is palindrome', 'Pattern printing — pyramid pattern'] },
          { name: 'Technical Interview', questions: ['Explain OOPs concepts with examples', 'What are the four pillars of OOPs?', 'Difference between process and thread', 'What is normalization in DBMS?', 'SQL query to find second highest salary'] },
          { name: 'HR Interview', questions: ['Tell me about yourself', 'Why TCS?', 'Are you comfortable with the bond period?', 'Are you willing to relocate?'] },
        ],
        questions: ['Two Sum problem', 'OOPs pillars', 'SQL joins', 'Tell me about yourself'],
        difficulty: 'Easy-Medium',
        tips: ['Focus on aptitude — it has the highest weightage', 'Practice basic coding patterns', 'Be prepared to explain your final year project clearly', 'TCS NQT score determines your track (Ninja/Digital/Prime)'],
        source: 'GeeksforGeeks',
      },
      {
        role: 'Digital',
        rounds: ['Advanced Aptitude', 'Coding Round (2 questions)', 'Technical + Managerial', 'HR'],
        roundDetails: [
          { name: 'Advanced Aptitude', questions: ['Advanced percentage and CI/SI problems', 'Probability questions', 'Permutation & Combination', 'Data Interpretation — complex charts'] },
          { name: 'Coding Round (2 questions)', questions: ['Linked list reversal', 'Find the longest substring without repeating characters', 'Merge two sorted arrays'] },
          { name: 'Technical + Managerial', questions: ['DBMS normalization — explain 1NF to BCNF', 'System design basics — design a URL shortener', 'Explain your project architecture', 'What is deadlock in OS?', 'Explain TCP vs UDP'] },
          { name: 'HR', questions: ['Why do you want TCS Digital specifically?', 'Leadership experience', 'How do you handle pressure?'] },
        ],
        questions: ['Linked list reversal', 'DBMS normalization', 'System design basics'],
        difficulty: 'Medium',
        tips: ['Stronger coding skills required than Ninja', 'Prepare OS & CN well', 'System design basics are asked for Digital', 'Aim for 70%+ in NQT for Digital shortlist'],
        source: 'GeeksforGeeks',
      },
      {
        role: 'Prime',
        rounds: ['NQT Advanced', 'Coding Round (3 questions)', 'System Design', 'Technical + HR'],
        roundDetails: [
          { name: 'NQT Advanced', questions: ['Complex aptitude — probability, P&C', 'Advanced logical reasoning', 'Code debugging MCQs'] },
          { name: 'Coding Round (3 questions)', questions: ['Dynamic Programming — longest increasing subsequence', 'Graph BFS/DFS traversal', 'String manipulation with regex'] },
          { name: 'System Design', questions: ['Design a chat application', 'Explain microservices vs monolith', 'Database sharding concepts'] },
          { name: 'Technical + HR', questions: ['Deep dive into your project', 'OOPs design patterns', 'Why TCS Prime over product companies?'] },
        ],
        questions: ['DP problems', 'Graph traversal', 'System design'],
        difficulty: 'Medium-Hard',
        tips: ['Prime requires product-company level preparation', 'Score 85%+ in NQT', 'System design is a must-prepare topic'],
        source: 'GeeksforGeeks',
      },
    ],
    mentorTalks: [
      { title: 'TCS Preparation Strategy', advice: 'TCS focuses heavily on aptitude and basic coding. Spend 60% time on aptitude, 30% on coding basics, and 10% on CS fundamentals. Practice from PrepInsta for TCS-specific patterns.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'How to Crack TCS NQT 2025 — Complete Strategy' },
      { title: 'Cracking TCS NQT', advice: 'The NQT exam is the gateway. Score well in aptitude to clear the cutoff. For coding, focus on arrays, strings, and basic sorting. Speed matters more than complexity.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoTitle: 'TCS NQT Aptitude Tips & Tricks' },
      { title: 'TCS Interview Tips from Seniors', advice: 'In the technical interview, they ask basic OOPs, DBMS, and your project. Be confident, don\'t bluff. HR round is straightforward — be genuine about your goals and relocation preferences.' },
    ],
    resources: [
      { title: 'TCS NQT Previous Year Papers', type: 'aptitude', url: 'https://www.geeksforgeeks.org/tcs-nqt-previous-year-papers/' },
      { title: 'Top 50 TCS Coding Questions', type: 'coding', url: 'https://www.geeksforgeeks.org/tcs-coding-practice/' },
      { title: 'TCS Interview Questions Collection', type: 'interview', url: 'https://www.geeksforgeeks.org/tcs-interview-experience/' },
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
      { id: 'inf3', question: 'How does Infosys contribute to digital transformation?' },
      { id: 'inf4', question: 'Are you open to working in any technology stack?' },
      { id: 'inf5', question: 'What do you know about Infosys Springboard?' },
    ],
    interviewExperiences: [
      {
        role: 'System Engineer',
        rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Online Test', questions: ['Logical reasoning — seating arrangement puzzles', 'Quantitative aptitude — probability, combinations', 'Verbal ability — reading comprehension', 'Coding — recursion-based problems', 'Coding — string manipulation'] },
          { name: 'Technical Interview', questions: ['Explain ER diagrams with an example', 'What is normalization? Explain up to 3NF', 'Difference between DBMS and RDBMS', 'Explain your final year project in detail', 'What are joins in SQL? Write a query using inner join'] },
          { name: 'HR Interview', questions: ['Why Infosys?', 'Tell me about yourself', 'Are you willing to work in shifts?', 'Where do you see yourself in 5 years?'] },
        ],
        questions: ['Recursion problems', 'DBMS ER diagrams', 'Explain your project'],
        difficulty: 'Medium',
        tips: ['InfyTQ certification gives bonus marks', 'Focus on logical reasoning for the online test', 'DBMS is the most asked topic in technical round', 'Prepare your project explanation well — they dive deep'],
        source: 'GeeksforGeeks',
      },
      {
        role: 'Specialist Programmer',
        rounds: ['Online Coding Test', 'Advanced Technical Round', 'HR Round'],
        roundDetails: [
          { name: 'Online Coding Test', questions: ['3 coding questions in 180 minutes', 'Linked list merge sort', 'Dynamic programming — coin change', 'Graph — shortest path BFS'] },
          { name: 'Advanced Technical Round', questions: ['Explain time complexity of merge sort vs quick sort', 'Design a library management system (OOP)', 'What is indexing in DBMS?', 'Explain deadlock and its prevention', 'Implement a stack using queues'] },
          { name: 'HR Round', questions: ['Why SP track over SE?', 'Your biggest coding achievement', 'How do you handle tight deadlines?'] },
        ],
        questions: ['DP problems', 'Graph traversal', 'System design'],
        difficulty: 'Medium-Hard',
        tips: ['SP requires solving 2+ out of 3 coding problems', 'Practice medium-hard LeetCode problems', 'OS and DBMS are heavily tested in technical round'],
        source: 'GeeksforGeeks',
      },
    ],
    mentorTalks: [
      { title: 'Infosys SP vs SE', advice: 'Specialist Programmer (SP) requires stronger DSA skills. System Engineer (SE) focuses more on aptitude and reasoning. Choose your track wisely and prepare accordingly.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Infosys SP vs SE — Which to Choose?' },
      { title: 'InfyTQ Certification Guide', advice: 'Complete InfyTQ certification before the exam — it gives you bonus marks and priority shortlisting. Focus on Python and Java modules on the platform.' },
      { title: 'Infosys Interview Preparation', advice: 'Infosys values logical thinking. Practice puzzles daily. For coding, focus on recursion and string problems. In the interview, they want you to explain concepts, not just recite definitions.' },
    ],
    resources: [
      { title: 'InfyTQ Practice Problems', type: 'coding', url: 'https://infytq.infosys.com/' },
      { title: 'Infosys Aptitude Question Bank', type: 'aptitude', url: 'https://www.geeksforgeeks.org/infosys-interview-preparation/' },
      { title: 'Infosys Interview Experiences - GFG', type: 'interview', url: 'https://www.geeksforgeeks.org/infosys-interview-experience/' },
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
      { id: 'acc3', question: 'What do you know about Accenture\'s services?' },
      { id: 'acc4', question: 'Describe a situation where you showed leadership.' },
      { id: 'acc5', question: 'How do you stay updated with technology?' },
    ],
    interviewExperiences: [
      {
        role: 'Associate Software Engineer',
        rounds: ['Cognitive Assessment', 'Coding Test', 'Communication Test', 'HR Interview'],
        roundDetails: [
          { name: 'Cognitive Assessment', questions: ['Abstract reasoning — pattern recognition', 'Logical deduction problems', 'Numerical series completion', 'Verbal analogies'] },
          { name: 'Coding Test', questions: ['Array manipulation — rotate array by k positions', 'String palindrome check', 'Find missing number in array 1 to n'] },
          { name: 'Communication Test', questions: ['Write an email to your manager about project delay', 'Sentence correction — 10 questions', 'Reading comprehension passage'] },
          { name: 'HR Interview', questions: ['Tell me about yourself', 'Why Accenture?', 'Situational — how would you handle a conflict in team?', 'Where do you see yourself in 3 years?'] },
        ],
        questions: ['Array manipulation', 'Communication essay', 'Behavioral scenarios'],
        difficulty: 'Easy-Medium',
        tips: ['Communication test is unique to Accenture — practice written English', 'Coding is moderate difficulty', 'Focus on cognitive ability practice — it\'s timed and tricky', 'Be articulate in HR — Accenture values communication'],
        source: 'Glassdoor',
      },
    ],
    mentorTalks: [
      { title: 'Accenture Hiring Process', advice: 'Accenture values communication skills alongside technical ability. The Communication Assessment is equally important as coding. Practice writing structured paragraphs and emails.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Accenture Interview Process Explained' },
      { title: 'Communication Test Strategy', advice: 'The communication test has email writing, error detection, and reading comprehension. Practice 30 minutes daily with English grammar exercises. Read editorials from newspapers.' },
    ],
    resources: [
      { title: 'Accenture Previous Year Questions', type: 'aptitude', url: 'https://www.geeksforgeeks.org/accenture-interview-preparation/' },
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
      { id: 'wip3', question: 'Are you comfortable with a service-based company?' },
      { id: 'wip4', question: 'How do you handle monotonous work?' },
    ],
    interviewExperiences: [
      {
        role: 'Project Engineer',
        rounds: ['Online Aptitude Test', 'Written Coding Test', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Online Aptitude Test', questions: ['Quantitative — percentages, averages, ratio', 'Logical — syllogism, blood relations, coding-decoding', 'Verbal — sentence correction, fill in blanks', 'Reading comprehension — 2 passages'] },
          { name: 'Written Coding Test', questions: ['String reversal without built-in functions', 'Find factorial using recursion', 'Check if array is sorted'] },
          { name: 'Technical Interview', questions: ['OOPs concepts — explain with real-life examples', 'What is inheritance? Types of inheritance in Java', 'SQL basics — write a GROUP BY query', 'Explain your project'] },
          { name: 'HR Interview', questions: ['Tell me about yourself', 'Why Wipro?', 'Strengths and weaknesses', 'Are you willing to relocate?'] },
        ],
        questions: ['String reversal', 'OOPs concepts', 'SQL basics'],
        difficulty: 'Easy',
        tips: ['Wipro focuses on basics — don\'t over-prepare advanced topics', 'Be confident in HR round', 'Aptitude section has negative marking — be careful', 'Project explanation should be crisp and clear'],
        source: 'GeeksforGeeks',
      },
    ],
    mentorTalks: [
      { title: 'Wipro NLTH Strategy', advice: 'Wipro\'s National Level Talent Hunt focuses on aptitude and basic coding. Solve PrepInsta questions for Wipro-specific patterns. Focus on speed and accuracy.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Wipro NLTH Complete Guide' },
      { title: 'Wipro Elite vs Turbo', advice: 'Wipro Elite is the standard track. Turbo requires higher coding skills and offers better packages. If you can solve medium-level coding problems, aim for Turbo.' },
    ],
    resources: [
      { title: 'Wipro NLTH Question Papers', type: 'aptitude', url: 'https://www.geeksforgeeks.org/wipro-interview-preparation/' },
      { title: 'Wipro Coding Practice Set', type: 'coding' },
      { title: 'Wipro Interview Guide', type: 'interview', url: 'https://www.geeksforgeeks.org/wipro-interview-experience/' },
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
      { id: 'cap3', question: 'What makes you a team player?' },
      { id: 'cap4', question: 'Describe a project you are proud of.' },
    ],
    interviewExperiences: [
      {
        role: 'Analyst',
        rounds: ['Game-based Round', 'Technical MCQs', 'Coding Round', 'Technical + HR Interview'],
        roundDetails: [
          { name: 'Game-based Round', questions: ['Balloon inflation game — risk assessment', 'Memory card matching — pattern recognition', 'Tower building — resource management', 'Emotion recognition — empathy test'] },
          { name: 'Technical MCQs', questions: ['OOPs — abstraction vs encapsulation', 'DBMS — indexing types', 'OS — process scheduling algorithms', 'Networking — OSI model layers'] },
          { name: 'Coding Round', questions: ['Linked list operations — insert at position', 'Stack implementation using arrays', 'Find duplicate elements in array'] },
          { name: 'Technical + HR Interview', questions: ['Project walkthrough', 'DBMS indexing — when to use?', 'Why Capgemini?', 'Biggest challenge in college?'] },
        ],
        questions: ['Linked list operations', 'DBMS indexing', 'Project walkthrough'],
        difficulty: 'Medium',
        tips: ['The game-based round tests behavioral traits, not knowledge', 'Be honest and consistent in game responses', 'Technical MCQs cover OOPs and DBMS heavily', 'Practice pseudo-code for coding round'],
        source: 'Glassdoor',
      },
    ],
    mentorTalks: [
      { title: 'Capgemini Game Round', advice: 'Capgemini\'s game-based aptitude is unique. It tests behavioral traits like risk-taking, teamwork, and decision-making. Be consistent in your responses — they detect contradictions.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Capgemini Game Round Strategy' },
      { title: 'Capgemini Tracks Explained', advice: 'Capgemini has Analyst, Senior Analyst, and Manager tracks. Each has different CTC and requirements. Aim for Senior Analyst by performing well in coding.' },
    ],
    resources: [
      { title: 'Capgemini Game-based Assessment Guide', type: 'aptitude' },
      { title: 'Capgemini Coding Questions', type: 'coding', url: 'https://www.geeksforgeeks.org/capgemini-interview-preparation/' },
      { title: 'Capgemini Interview Experiences', type: 'interview', url: 'https://www.geeksforgeeks.org/capgemini-interview-experience/' },
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
      { id: 'cog2', question: 'What do you know about Cognizant\'s GenC program?' },
      { id: 'cog3', question: 'How do you prioritize multiple tasks?' },
    ],
    interviewExperiences: [
      {
        role: 'GenC',
        rounds: ['Aptitude Test', 'Coding Assessment', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Aptitude Test', questions: ['Number series — find the pattern', 'Quantitative — ratios and averages', 'Logical reasoning — puzzles', 'Verbal — para jumbles'] },
          { name: 'Coding Assessment', questions: ['Sort an array without built-in sort', 'String — count vowels and consonants', 'Simple SQL query — SELECT with WHERE'] },
          { name: 'Technical Interview', questions: ['What is OOPs? Explain four pillars', 'Difference between abstract class and interface', 'What is a primary key vs foreign key?', 'Explain your project briefly'] },
          { name: 'HR Interview', questions: ['Tell me about yourself', 'Why Cognizant?', 'Are you a team player?', 'Salary expectations?'] },
        ],
        questions: ['Array problems', 'OOPs concepts', 'SQL queries'],
        difficulty: 'Easy-Medium',
        tips: ['GenC Pro requires better coding skills', 'Focus on SQL for Cognizant', 'Aptitude is fairly standard — practice from any good source', 'Be clear about your career goals in HR'],
        source: 'GeeksforGeeks',
      },
      {
        role: 'GenC Pro',
        rounds: ['Advanced Aptitude', 'Coding Round (2 problems)', 'Technical Interview', 'HR'],
        roundDetails: [
          { name: 'Advanced Aptitude', questions: ['Advanced logical reasoning', 'Complex data interpretation', 'Critical thinking scenarios'] },
          { name: 'Coding Round (2 problems)', questions: ['Matrix rotation 90 degrees', 'Implement a queue using two stacks', 'Find the longest common prefix in array of strings'] },
          { name: 'Technical Interview', questions: ['Explain ACID properties in DBMS', 'What is deadlock? How to prevent it?', 'Design a simple e-commerce database schema', 'Explain any sorting algorithm with time complexity'] },
          { name: 'HR', questions: ['Why GenC Pro?', 'How do you handle disagreements?', 'Long-term career plans'] },
        ],
        questions: ['Matrix rotation', 'Queue implementation', 'DBMS ACID'],
        difficulty: 'Medium',
        tips: ['Aim to solve both coding problems', 'DBMS and OS are heavily asked', 'Show problem-solving approach in technical round'],
        source: 'GeeksforGeeks',
      },
    ],
    mentorTalks: [
      { title: 'Cognizant GenC Tracks', advice: 'Cognizant has GenC, GenC Next, and GenC Pro tracks. Each has different difficulty levels. Aim for GenC Pro for better packages by strengthening your coding skills.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Cognizant GenC Complete Guide' },
      { title: 'Cognizant Coding Tips', advice: 'Cognizant coding problems are straightforward. Focus on arrays, strings, and SQL. Practice implementing data structures from scratch — they value fundamentals over libraries.' },
    ],
    resources: [
      { title: 'Cognizant GenC Practice Set', type: 'aptitude', url: 'https://www.geeksforgeeks.org/cognizant-interview-preparation/' },
      { title: 'Cognizant Coding Questions', type: 'coding' },
      { title: 'Cognizant Interview Guide', type: 'interview', url: 'https://www.geeksforgeeks.org/cognizant-interview-experience/' },
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
      { id: 'del3', question: 'How do you approach problem-solving?' },
      { id: 'del4', question: 'What do you know about Deloitte\'s consulting practice?' },
    ],
    interviewExperiences: [
      {
        role: 'Analyst',
        rounds: ['Aptitude + Technical MCQs', 'Coding Round', 'Group Discussion', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Aptitude + Technical MCQs', questions: ['Analytical reasoning — data interpretation', 'Business scenario analysis', 'Technical MCQs — OS, DBMS, CN', 'Quantitative — advanced word problems'] },
          { name: 'Coding Round', questions: ['DP — 0/1 Knapsack problem', 'Tree traversal — level order traversal', 'String manipulation — anagram check'] },
          { name: 'Group Discussion', questions: ['Topic: AI will replace human jobs — for or against?', 'Topic: Remote work vs office work', 'Tips: Structure your arguments, listen actively'] },
          { name: 'Technical Interview', questions: ['Explain system design for a booking platform', 'What are design patterns? Name 3', 'Advanced SQL — window functions', 'Your approach to a complex debugging scenario'] },
          { name: 'HR Interview', questions: ['Why Deloitte?', 'Tell about a leadership experience', 'How do you handle ambiguity?'] },
        ],
        questions: ['DP problems', 'Case study analysis', 'System design discussion'],
        difficulty: 'Medium-Hard',
        tips: ['GD is critical — practice structured argumentation', 'Case study prep differentiates top candidates', 'Deloitte values leadership and communication', 'Prepare current affairs for GD topics'],
        source: 'Glassdoor',
      },
    ],
    mentorTalks: [
      { title: 'Cracking Deloitte', advice: 'Deloitte values analytical thinking and communication. Prepare for case studies by reading business scenarios. Group discussions require structured arguments, not just speaking loudly.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'Deloitte Hiring Process 2025' },
      { title: 'Deloitte GD Preparation', advice: 'For Group Discussions: 1) Start with a clear stance 2) Use data points 3) Acknowledge opposing views 4) Conclude with a balanced summary. Practice with peers weekly.' },
    ],
    resources: [
      { title: 'Deloitte Analytical Reasoning Set', type: 'aptitude' },
      { title: 'Deloitte Coding Questions', type: 'coding' },
      { title: 'Case Study Preparation Guide', type: 'interview', url: 'https://www.geeksforgeeks.org/deloitte-interview-experience/' },
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
      { id: 'ibm3', question: 'What excites you about AI and cloud computing?' },
      { id: 'ibm4', question: 'How would you contribute to IBM\'s innovation culture?' },
    ],
    interviewExperiences: [
      {
        role: 'Associate System Engineer',
        rounds: ['Cognitive Ability Test', 'Coding Assessment', 'Technical Interview', 'HR Interview'],
        roundDetails: [
          { name: 'Cognitive Ability Test', questions: ['Pattern recognition — abstract shapes', 'Number series — complex patterns', 'English — grammar and comprehension', 'Logical deduction — 15 questions in 15 min'] },
          { name: 'Coding Assessment', questions: ['Graph traversal — BFS on adjacency list', 'Greedy — activity selection problem', 'Array — find peak element'] },
          { name: 'Technical Interview', questions: ['Explain virtual memory and paging', 'What is concurrency control in DBMS?', 'Explain your project architecture', 'What is subnetting? Solve a subnetting problem', 'Design a parking lot system (OOP)'] },
          { name: 'HR Interview', questions: ['Tell me about yourself', 'What IBM technologies interest you?', 'How do you learn new skills?', 'Team experience'] },
        ],
        questions: ['Graph traversal', 'OS concepts', 'Project explanation'],
        difficulty: 'Medium',
        tips: ['IBM\'s cognitive test is unique — practice logical reasoning patterns', 'Show interest in AI/Cloud — IBM\'s focus areas', 'Know about Watson, IBM Cloud, and Red Hat', 'Technical interview covers OS and CN more than others'],
        source: 'GeeksforGeeks',
      },
    ],
    mentorTalks: [
      { title: 'IBM Preparation Tips', advice: 'IBM values innovation and curiosity. Show genuine interest in emerging technologies like AI, Cloud, and Quantum Computing during interviews. Technical questions are moderate difficulty.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'IBM Interview Preparation Guide' },
      { title: 'IBM Technical Deep Dive', advice: 'IBM asks more OS and Networking questions compared to other companies. Prepare virtual memory, paging, subnetting, and TCP/IP well. For coding, graph problems are common.' },
    ],
    resources: [
      { title: 'IBM Cognitive Ability Practice', type: 'aptitude' },
      { title: 'IBM Coding Assessment Guide', type: 'coding' },
      { title: 'IBM Interview Experiences', type: 'interview', url: 'https://www.geeksforgeeks.org/ibm-interview-experience/' },
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
      { id: 'prod4', question: 'Tell me about your most technically challenging project.' },
      { id: 'prod5', question: 'How do you stay motivated during long debugging sessions?' },
    ],
    interviewExperiences: [
      {
        role: 'SDE-1 (Amazon)',
        rounds: ['Online Assessment', 'DSA Round 1', 'DSA Round 2', 'System Design', 'Hiring Manager / Bar Raiser'],
        roundDetails: [
          { name: 'Online Assessment', questions: ['2-3 medium/hard coding problems in 90 min', 'LRU Cache implementation', 'Merge K Sorted Lists', 'Work simulation — behavioral MCQs'] },
          { name: 'DSA Round 1', questions: ['Design a data structure for max stack', 'Binary tree — lowest common ancestor', 'Two pointer — container with most water'] },
          { name: 'DSA Round 2', questions: ['Graph — detect cycle in directed graph', 'DP — word break problem', 'Trie — implement autocomplete'] },
          { name: 'System Design', questions: ['Design a URL shortener like bit.ly', 'Design a notification system', 'Trade-offs between SQL and NoSQL'] },
          { name: 'Hiring Manager / Bar Raiser', questions: ['Tell me about a time you disagreed with your manager (STAR)', 'How do you handle ambiguity?', 'Amazon Leadership Principles deep dive'] },
        ],
        questions: ['LRU Cache', 'Merge K Sorted Lists', 'Design a URL Shortener', 'Behavioral questions (STAR)'],
        difficulty: 'Hard',
        tips: ['Solve 300+ LeetCode problems minimum', 'Practice system design with real-world examples', 'Think aloud during interviews — communication matters', 'Learn Amazon Leadership Principles by heart'],
        source: 'LeetCode Discuss',
      },
      {
        role: 'SDE (Google)',
        rounds: ['Phone Screen', 'Onsite Round 1', 'Onsite Round 2', 'Onsite Round 3', 'Googleyness & Leadership'],
        roundDetails: [
          { name: 'Phone Screen', questions: ['Medium-hard coding problem', 'Optimize brute force solution step by step', 'Discuss time and space complexity'] },
          { name: 'Onsite Round 1', questions: ['Graph — shortest path with modifications', 'DP — edit distance', 'Clarify ambiguities before coding'] },
          { name: 'Onsite Round 2', questions: ['Design a distributed cache', 'System design — design Google Docs', 'Scalability and consistency trade-offs'] },
          { name: 'Onsite Round 3', questions: ['Tree — serialize and deserialize binary tree', 'Backtracking — N-Queens problem', 'Bit manipulation problems'] },
          { name: 'Googleyness & Leadership', questions: ['How do you handle disagreements?', 'Tell me about a time you helped a teammate grow', 'How would you deal with a project that\'s behind schedule?'] },
        ],
        questions: ['Edit Distance', 'N-Queens', 'System Design — Google Docs'],
        difficulty: 'Hard',
        tips: ['Google values clean, optimal code', 'Always discuss multiple approaches before coding', 'System design rounds test scalability thinking', 'Practice mock interviews — communication is key'],
        source: 'LeetCode Discuss',
      },
    ],
    mentorTalks: [
      { title: 'Product Company Strategy', advice: 'Product companies test deep DSA knowledge and system design. Aim for 300+ LeetCode problems covering all patterns. System design becomes critical for senior roles. Practice mock interviews weekly.', videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', videoTitle: 'How to Crack MAANG Interviews' },
      { title: 'DSA Roadmap for MAANG', advice: 'Start with arrays and strings, then move to trees and graphs, finally DP and advanced topics. Follow NeetCode 150 or Blind 75 for structured preparation. Solve each problem in under 30 minutes.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoTitle: 'Complete DSA Roadmap 2025' },
      { title: 'System Design Preparation', advice: 'For system design: study load balancers, databases (SQL vs NoSQL), caching, message queues, and CDN. Practice designing real systems — Twitter, Uber, WhatsApp. Use the book "Designing Data-Intensive Applications".' },
    ],
    resources: [
      { title: 'Blind 75 / NeetCode 150 Problem List', type: 'coding', url: 'https://neetcode.io/practice' },
      { title: 'System Design Primer (GitHub)', type: 'interview', url: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'Behavioral Interview - STAR Method Guide', type: 'interview' },
    ],
  },
};

export const companyKeys = Object.keys(companyDataMap);
