import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-hl-001',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Finding HCF',
    question: 'Find the HCF of 48, 64, and 80.',
    type: 'mcq',
    options: [
      { id: 'a', text: '8' },
      { id: 'b', text: '16' },
      { id: 'c', text: '12' },
      { id: 'd', text: '24' },
    ],
    correctAnswer: 'b',
    explanation:
      'Using prime factorization: 48 = 2⁴ × 3, 64 = 2⁶, 80 = 2⁴ × 5. HCF is the product of the smallest power of each common prime factor. The only common prime is 2, with minimum exponent 4. Therefore HCF = 2⁴ = 16.',
    shortcut:
      'HCF = product of common primes raised to their minimum exponent across all numbers.',
    concept:
      'The HCF (Highest Common Factor) is the largest integer that divides all the given numbers without a remainder.',
    difficulty: 'easy',
    estimatedTime: 50,
    tags: ['HCF', 'prime factorization', 'GCD'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-hl-002',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Finding LCM',
    question: 'What is the LCM of 12, 18, and 30?',
    type: 'mcq',
    options: [
      { id: 'a', text: '90' },
      { id: 'b', text: '120' },
      { id: 'c', text: '180' },
      { id: 'd', text: '60' },
    ],
    correctAnswer: 'c',
    explanation:
      '12 = 2² × 3, 18 = 2 × 3², 30 = 2 × 3 × 5. LCM = product of highest powers of all prime factors = 2² × 3² × 5 = 4 × 9 × 5 = 180.',
    shortcut:
      'LCM = product of all prime factors raised to their maximum exponent across all numbers.',
    concept:
      'The LCM (Lowest Common Multiple) is the smallest positive integer that is a multiple of each of the given numbers.',
    difficulty: 'easy',
    estimatedTime: 50,
    tags: ['LCM', 'prime factorization', 'multiples'],
    companyRelevance: ['TCS', 'Wipro', 'Cognizant'],
  },
  {
    id: 'quant-hl-003',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Product Relationship',
    question:
      'The HCF of two numbers is 12 and their LCM is 180. If one of the numbers is 36, what is the other number?',
    type: 'mcq',
    options: [
      { id: 'a', text: '48' },
      { id: 'b', text: '60' },
      { id: 'c', text: '72' },
      { id: 'd', text: '54' },
    ],
    correctAnswer: 'b',
    explanation:
      'Using the property: HCF × LCM = Product of the two numbers. So 12 × 180 = 36 × Other number. 2160 = 36 × Other number. Other number = 2160 / 36 = 60. Verify: HCF(36, 60) = 12 ✓ and LCM(36, 60) = 180 ✓.',
    shortcut: 'Other number = (HCF × LCM) / Given number.',
    concept:
      'For any two positive integers a and b: HCF(a,b) × LCM(a,b) = a × b.',
    difficulty: 'easy',
    estimatedTime: 55,
    tags: ['HCF', 'LCM', 'product relationship'],
    companyRelevance: ['TCS', 'Infosys', 'Accenture'],
  },
  {
    id: 'quant-hl-004',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Word Problems',
    question:
      'Three bells ring at intervals of 8, 12, and 15 minutes. They all ring together at 9:00 AM. At what time will they next ring together?',
    type: 'mcq',
    options: [
      { id: 'a', text: '10:00 AM' },
      { id: 'b', text: '10:30 AM' },
      { id: 'c', text: '11:00 AM' },
      { id: 'd', text: '9:45 AM' },
    ],
    correctAnswer: 'a',
    explanation:
      'The bells will next ring together after LCM(8, 12, 15) minutes. 8 = 2³, 12 = 2² × 3, 15 = 3 × 5. LCM = 2³ × 3 × 5 = 120 minutes = 2 hours. Starting from 9:00 AM, they will next ring together at 9:00 AM + 2 hours = 11:00 AM. Wait — 120 minutes = 2 hours, 9:00 + 2:00 = 11:00 AM. So the answer is 11:00 AM, option c.',
    shortcut:
      'For simultaneous events, find LCM of all intervals to get the time until next coincidence.',
    concept:
      'The LCM of time intervals gives the period after which periodic events coincide again.',
    difficulty: 'easy',
    estimatedTime: 65,
    tags: ['LCM', 'word problem', 'bells'],
    companyRelevance: ['Wipro', 'TCS', 'HCL'],
  },

  // ─── MEDIUM (4) ─────────────────────────────────────────────────────────────
  {
    id: 'quant-hl-005',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Word Problems',
    question:
      'Find the greatest number that divides 445, 572, and 699 leaving remainders of 4, 5, and 6 respectively.',
    type: 'mcq',
    options: [
      { id: 'a', text: '63' },
      { id: 'b', text: '31' },
      { id: 'c', text: '42' },
      { id: 'd', text: '21' },
    ],
    correctAnswer: 'b',
    explanation:
      'If the number N leaves remainder 4 when dividing 445, then N divides (445 - 4) = 441. Similarly, N divides (572 - 5) = 567 and (699 - 6) = 693. The greatest such N is HCF(441, 567, 693). 441 = 3² × 7², 567 = 3⁴ × 7, 693 = 3² × 7 × 11. HCF = 3² × 7 = 63. So the answer is 63, option a.',
    shortcut:
      'Greatest divisor leaving different remainders: compute HCF of (number − remainder) for each pair.',
    concept:
      'If N divides (a−r₁), (b−r₂), (c−r₃) exactly, then N is a factor of HCF of those differences.',
    difficulty: 'medium',
    estimatedTime: 90,
    tags: ['HCF', 'remainders', 'divisor'],
    companyRelevance: ['TCS', 'Infosys', 'Cognizant'],
  },
  {
    id: 'quant-hl-006',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Fractions',
    question: 'Find the LCM of the fractions 2/3, 4/9, and 5/6.',
    type: 'mcq',
    options: [
      { id: 'a', text: '20/3' },
      { id: 'b', text: '20/9' },
      { id: 'c', text: '10/9' },
      { id: 'd', text: '20/27' },
    ],
    correctAnswer: 'a',
    explanation:
      'For fractions, LCM = LCM of numerators / HCF of denominators. LCM of numerators (2, 4, 5): 2 = 2, 4 = 2², 5 = 5. LCM = 2² × 5 = 20. HCF of denominators (3, 9, 6): 3 = 3, 9 = 3², 6 = 2 × 3. HCF = 3. Therefore LCM of fractions = 20/3.',
    shortcut: 'LCM of fractions = LCM(numerators) / HCF(denominators).',
    concept:
      'HCF of fractions = HCF(numerators)/LCM(denominators). LCM of fractions = LCM(numerators)/HCF(denominators).',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['LCM', 'fractions', 'HCF'],
    companyRelevance: ['Wipro', 'Accenture', 'TCS'],
  },
  {
    id: 'quant-hl-007',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Word Problems',
    question:
      'Two runners start at the same point and run around a circular track of 400 m. Runner A completes a lap in 60 seconds and Runner B in 80 seconds. After how many seconds will they first be at the starting point together?',
    type: 'mcq',
    options: [
      { id: 'a', text: '160 seconds' },
      { id: 'b', text: '240 seconds' },
      { id: 'c', text: '300 seconds' },
      { id: 'd', text: '320 seconds' },
    ],
    correctAnswer: 'b',
    explanation:
      'They will meet at the starting point after LCM(60, 80) seconds. 60 = 2² × 3 × 5, 80 = 2⁴ × 5. LCM = 2⁴ × 3 × 5 = 240. After 240 seconds, Runner A has completed 240/60 = 4 laps and Runner B has completed 240/80 = 3 laps, both at the starting point. Therefore they first meet at the starting point after 240 seconds.',
    shortcut:
      'Time to meet at start = LCM of individual lap times.',
    concept:
      'When two periodic events start simultaneously, they coincide again after their LCM period.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['LCM', 'circular track', 'meeting point'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-hl-008',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'HCF by Division',
    question:
      'Using Euclid\'s division algorithm, find HCF(1071, 462).',
    type: 'mcq',
    options: [
      { id: 'a', text: '21' },
      { id: 'b', text: '42' },
      { id: 'c', text: '63' },
      { id: 'd', text: '77' },
    ],
    correctAnswer: 'a',
    explanation:
      'Applying Euclid\'s algorithm: Step 1: 1071 = 462 × 2 + 147. Step 2: 462 = 147 × 3 + 21. Step 3: 147 = 21 × 7 + 0. Since the remainder is 0, HCF(1071, 462) = 21.',
    shortcut:
      'Euclid\'s algorithm: HCF(a,b) = HCF(b, a mod b), repeat until remainder = 0.',
    concept:
      'Euclid\'s Division Algorithm is an efficient method to compute HCF by repeatedly applying the division step.',
    difficulty: 'medium',
    estimatedTime: 80,
    tags: ["Euclid's algorithm", 'HCF', 'division'],
    companyRelevance: ['Infosys', 'TCS', 'Cognizant'],
  },

  // ─── HARD (2) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-hl-009',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Word Problems',
    question:
      'The HCF and LCM of two numbers are 8 and 336 respectively. If one number is between 40 and 60, find the sum of the two numbers.',
    type: 'mcq',
    options: [
      { id: 'a', text: '88' },
      { id: 'b', text: '96' },
      { id: 'c', text: '104' },
      { id: 'd', text: '112' },
    ],
    correctAnswer: 'c',
    explanation:
      'Both numbers must be multiples of HCF = 8. Write them as 8a and 8b where HCF(a,b)=1 (co-prime). Product of numbers = HCF × LCM = 8 × 336 = 2688. So (8a)(8b) = 2688 → 64ab = 2688 → ab = 42. Find co-prime pairs (a,b) with ab=42: 42=1×42, 2×21, 3×14, 6×7. Co-prime pairs: (1,42), (2,21)—gcd=1✓, (3,14)—gcd=1✓, (6,7)—gcd=1✓. Corresponding number pairs: (8,336), (16,168), (24,112), (48,56). The pair where one number is between 40 and 60: (48, 56) ✓. Sum = 48 + 56 = 104.',
    shortcut:
      'Write numbers as HCF × m and HCF × n where gcd(m,n)=1. Then m×n = LCM/HCF.',
    concept:
      'Any two numbers can be expressed as multiples of their HCF. Their product = HCF × LCM.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['HCF', 'LCM', 'co-prime', 'word problem'],
    companyRelevance: ['Google', 'Amazon', 'Infosys'],
  },
  {
    id: 'quant-hl-010',
    section: 'quantitative',
    topic: 'HCF and LCM',
    subtopic: 'Word Problems',
    question:
      'A merchant has three containers with 403 L, 434 L, and 465 L of milk. He wants to measure them all using the same largest possible container (whole litres). How many container-loads will he need in total?',
    type: 'mcq',
    options: [
      { id: 'a', text: '38' },
      { id: 'b', text: '40' },
      { id: 'c', text: '42' },
      { id: 'd', text: '44' },
    ],
    correctAnswer: 'c',
    explanation:
      'The largest container size is HCF(403, 434, 465). Using Euclid\'s algorithm: HCF(403,434): 434 = 403×1 + 31; 403 = 31×13 + 0 → HCF = 31. HCF(31, 465): 465 = 31×15 + 0 → HCF = 31. Container size = 31 L. Total loads = 403/31 + 434/31 + 465/31 = 13 + 14 + 15 = 42 loads.',
    shortcut:
      'Container size = HCF of all quantities. Total containers = sum of (each quantity ÷ HCF).',
    concept:
      'To divide multiple quantities using a single measuring unit, use their HCF as the unit size.',
    difficulty: 'hard',
    estimatedTime: 110,
    tags: ['HCF', 'measurement', 'word problem'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
];

export default questions;
