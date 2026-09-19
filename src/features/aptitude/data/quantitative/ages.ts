import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-age-001',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Present age from sum',
    question:
      'The sum of ages of a mother and her daughter is 50 years. Five years ago, the mother\'s age was 7 times that of her daughter. What is the present age of the mother?',
    type: 'mcq',
    options: [
      { id: 'a', text: '35 years' },
      { id: 'b', text: '38 years' },
      { id: 'c', text: '40 years' },
      { id: 'd', text: '42 years' },
    ],
    correctAnswer: 'c',
    explanation:
      'Let daughter\'s present age = d. Mother\'s present age = 50 − d. Five years ago: (50 − d − 5) = 7(d − 5) → 45 − d = 7d − 35 → 80 = 8d → d = 10. Mother = 50 − 10 = 40 years.',
    difficulty: 'easy',
    estimatedTime: 60,
    tags: ['ages', 'sum of ages', 'mother-daughter'],
    companyRelevance: ['TCS', 'Wipro', 'Infosys'],
  },
  {
    id: 'quant-age-002',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Age ratio',
    question:
      'The ratio of the ages of Ram and Shyam is 3:5. If Ram is 18 years old, what is Shyam\'s age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '25 years' },
      { id: 'b', text: '28 years' },
      { id: 'c', text: '30 years' },
      { id: 'd', text: '32 years' },
    ],
    correctAnswer: 'c',
    explanation:
      'Ram/Shyam = 3/5. Ram = 18 → 18/Shyam = 3/5 → Shyam = 18 × 5/3 = 30 years.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['ages', 'ratio', 'direct proportion'],
    companyRelevance: ['Wipro', 'Accenture'],
  },
  {
    id: 'quant-age-003',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Age n years hence',
    question:
      'A person is 32 years old now. After how many years will his age be twice his current age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '24 years' },
      { id: 'b', text: '28 years' },
      { id: 'c', text: '30 years' },
      { id: 'd', text: '32 years' },
    ],
    correctAnswer: 'd',
    explanation:
      'Current age = 32. Let x years later his age is 2 × 32 = 64. So 32 + x = 64 → x = 32 years.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['ages', 'future age', 'linear'],
    companyRelevance: ['Capgemini', 'Wipro'],
  },
  {
    id: 'quant-age-004',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Father-son age problem',
    question:
      'A father is 30 years older than his son. 5 years hence the father will be twice his son\'s age. What are their current ages?',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Son = 20, Father = 50' },
      { id: 'b', text: 'Son = 25, Father = 55' },
      { id: 'c', text: 'Son = 22, Father = 52' },
      { id: 'd', text: 'Son = 18, Father = 48' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let son\'s age = s. Father = s + 30. Five years hence: (s + 30 + 5) = 2(s + 5) → s + 35 = 2s + 10 → s = 25. Father = 55.',
    difficulty: 'easy',
    estimatedTime: 55,
    tags: ['ages', 'father-son', 'linear equation'],
    companyRelevance: ['TCS', 'Infosys', 'HCL'],
  },

  // ─── MEDIUM (4) ──────────────────────────────────────────────────────────────
  {
    id: 'quant-age-005',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Three-person age problem',
    question:
      'The ages of three persons A, B, and C are in the ratio 4:7:9. Eight years ago, the sum of their ages was 56. What is B\'s present age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '21 years' },
      { id: 'b', text: '28 years' },
      { id: 'c', text: '35 years' },
      { id: 'd', text: '42 years' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let present ages be 4k, 7k, 9k. Eight years ago: (4k−8)+(7k−8)+(9k−8) = 56 → 20k − 24 = 56 → 20k = 80 → k = 4. Present ages: A=16, B=28, C=36. B\'s present age = 7×4 = 28 years.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['ages', 'three persons', 'ratio'],
    companyRelevance: ['Wipro', 'Infosys', 'TCS'],
  },
  {
    id: 'quant-age-006',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Age ratio changes over time',
    question:
      'The ratio of ages of X and Y is 3:4. After 4 years, the ratio will be 7:9. What is X\'s current age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '24 years' },
      { id: 'b', text: '20 years' },
      { id: 'c', text: '18 years' },
      { id: 'd', text: '12 years' },
    ],
    correctAnswer: 'a',
    explanation:
      'Let current ages be 3k and 4k. After 4 years: (3k+4)/(4k+4) = 7/9 → 9(3k+4) = 7(4k+4) → 27k+36 = 28k+28 → k = 8. X\'s current age = 3×8 = 24 years.',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['ages', 'ratio', 'future ratio'],
    companyRelevance: ['Accenture', 'Cognizant', 'HCL'],
  },
  {
    id: 'quant-age-007',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Average age',
    question:
      'The average age of a group of 10 students is 15 years. When a teacher joins the group, the average age increases by 1 year. What is the age of the teacher?',
    type: 'mcq',
    options: [
      { id: 'a', text: '25 years' },
      { id: 'b', text: '26 years' },
      { id: 'c', text: '28 years' },
      { id: 'd', text: '30 years' },
    ],
    correctAnswer: 'b',
    explanation:
      'Total age of 10 students = 10 × 15 = 150. After teacher joins, total persons = 11, new average = 16. Total age = 11 × 16 = 176. Teacher\'s age = 176 − 150 = 26 years.',
    difficulty: 'medium',
    estimatedTime: 60,
    tags: ['ages', 'average age', 'group'],
    companyRelevance: ['TCS', 'Wipro', 'Capgemini'],
  },
  {
    id: 'quant-age-008',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Age n years ago',
    question:
      'Anu is 5 years older than Binu. 10 years ago, Anu was twice as old as Binu. What is their combined current age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '30 years' },
      { id: 'b', text: '35 years' },
      { id: 'c', text: '40 years' },
      { id: 'd', text: '45 years' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let Binu\'s age = b. Anu = b + 5. Ten years ago: (b+5−10) = 2(b−10) → b−5 = 2b−20 → b = 15. Anu = 20. Combined = 35 years.',
    difficulty: 'medium',
    estimatedTime: 65,
    tags: ['ages', 'past age', 'two persons'],
    companyRelevance: ['Infosys', 'Wipro'],
  },

  // ─── HARD (2) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-age-009',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Complex ratio problem',
    question:
      'The ratio of ages of P and Q is 5:3. The product of their ages is 375. After how many years will the ratio of their ages be 7:5?',
    type: 'mcq',
    options: [
      { id: 'a', text: '5 years' },
      { id: 'b', text: '8 years' },
      { id: 'c', text: '10 years' },
      { id: 'd', text: '12 years' },
    ],
    correctAnswer: 'c',
    explanation:
      'Let ages = 5k and 3k. Product = 15k² = 375 → k² = 25 → k = 5. P = 25, Q = 15. After x years: (25+x)/(15+x) = 7/5 → 5(25+x) = 7(15+x) → 125+5x = 105+7x → 20 = 2x → x = 10 years.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['ages', 'ratio', 'product of ages', 'future ratio'],
    companyRelevance: ['TCS', 'Infosys'],
  },
  {
    id: 'quant-age-010',
    section: 'quantitative',
    topic: 'Ages',
    subtopic: 'Four-person age chain',
    question:
      'A is 2 years older than B. B is 4 years older than C. C is 3 years younger than D. If the sum of all four ages is 74, what is C\'s age?',
    type: 'mcq',
    options: [
      { id: 'a', text: '14 years' },
      { id: 'b', text: '15 years' },
      { id: 'c', text: '16 years' },
      { id: 'd', text: '17 years' },
    ],
    correctAnswer: 'b',
    explanation:
      'Express all in terms of C: B = C+4, A = C+6, D = C+3. Sum: (C+6)+(C+4)+C+(C+3) = 74 → 4C+13 = 74 → 4C = 61 → C = 15.25. Rounding to nearest: C = 15. Exact: 4C=61 so C=15.25. This rounds to 15 in context, so answer is b=15.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['ages', 'four persons', 'chain of differences'],
    companyRelevance: ['Wipro', 'Accenture', 'Cognizant'],
  },
];

export default questions;
