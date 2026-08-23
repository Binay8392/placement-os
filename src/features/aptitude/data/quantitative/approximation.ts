import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-approx-001',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Rounding',
    question:
      'Which of the following is the closest approximation to 798.97 × 4.03?',
    type: 'mcq',
    options: [
      { id: 'a', text: '3000' },
      { id: 'b', text: '3200' },
      { id: 'c', text: '3600' },
      { id: 'd', text: '4000' },
    ],
    correctAnswer: 'b',
    explanation:
      'Round 798.97 ≈ 800 and 4.03 ≈ 4. Then 800 × 4 = 3200. The actual value is 798.97 × 4.03 ≈ 3219.05, which is closest to 3200.',
    shortcut:
      'Round each number to the nearest convenient integer or power of 10, then multiply.',
    concept:
      'Approximation by rounding simplifies complex calculations while keeping the result close to the true value.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['approximation', 'rounding', 'multiplication'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-approx-002',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Square Root Approximation',
    question: 'Which is the best approximation for √(2499)?',
    type: 'mcq',
    options: [
      { id: 'a', text: '47' },
      { id: 'b', text: '49' },
      { id: 'c', text: '50' },
      { id: 'd', text: '52' },
    ],
    correctAnswer: 'c',
    explanation:
      '50² = 2500, which is very close to 2499. Therefore √2499 ≈ √2500 = 50. We can also check: 49² = 2401 and 50² = 2500. Since 2499 is extremely close to 2500, the best approximation is 50.',
    shortcut:
      'Identify the nearest perfect square: √(n²+1) ≈ n for large n.',
    concept:
      'Square root approximation: find the perfect square closest to the given number.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['square root', 'approximation', 'estimation'],
    companyRelevance: ['TCS', 'Cognizant', 'HCL'],
  },
  {
    id: 'quant-approx-003',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Division Approximation',
    question: 'Approximate: 6789 ÷ 22.8',
    type: 'mcq',
    options: [
      { id: 'a', text: '250' },
      { id: 'b', text: '275' },
      { id: 'c', text: '300' },
      { id: 'd', text: '325' },
    ],
    correctAnswer: 'c',
    explanation:
      '6789 ≈ 6900 and 22.8 ≈ 23. Then 6900 ÷ 23 = 300. Actual: 6789 ÷ 22.8 ≈ 297.8, closest to 300.',
    shortcut:
      'Round both dividend and divisor to numbers that divide cleanly, then compute.',
    concept:
      'Approximation in division: round to nearby numbers for easy mental calculation.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['approximation', 'division', 'estimation'],
    companyRelevance: ['Wipro', 'Infosys', 'Accenture'],
  },
  {
    id: 'quant-approx-004',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Mixed Approximation',
    question: 'Approximate: 18.97² − 13.04² ',
    type: 'mcq',
    options: [
      { id: 'a', text: '160' },
      { id: 'b', text: '185' },
      { id: 'c', text: '192' },
      { id: 'd', text: '200' },
    ],
    correctAnswer: 'c',
    explanation:
      'Round: 18.97 ≈ 19 and 13.04 ≈ 13. Then 19² − 13² = 361 − 169 = 192. Using the identity a²−b² = (a+b)(a−b): (19+13)(19−13) = 32 × 6 = 192.',
    shortcut:
      'Use the difference of squares: a²−b² = (a+b)(a−b) for faster computation.',
    concept:
      'The algebraic identity a²−b² = (a+b)(a−b) can speed up squared-number computations.',
    difficulty: 'easy',
    estimatedTime: 40,
    tags: ['approximation', 'squares', 'difference of squares'],
    companyRelevance: ['TCS', 'Wipro', 'Infosys'],
  },

  // ─── MEDIUM (4) ─────────────────────────────────────────────────────────────
  {
    id: 'quant-approx-005',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Cube Root Approximation',
    question: 'Which of the following is the best approximation of ∛(21952)?',
    type: 'mcq',
    options: [
      { id: 'a', text: '26' },
      { id: 'b', text: '28' },
      { id: 'c', text: '30' },
      { id: 'd', text: '32' },
    ],
    correctAnswer: 'b',
    explanation:
      '28³ = 28 × 28 × 28 = 784 × 28 = 21952. So ∛21952 = 28 exactly. This means 28 is the exact cube root, not just an approximation.',
    shortcut:
      'Try cubes of round numbers near the expected answer: 25³=15625, 28³=21952, 30³=27000.',
    concept:
      'Recognizing perfect cubes helps in exact cube root computation without a calculator.',
    difficulty: 'medium',
    estimatedTime: 60,
    tags: ['cube root', 'approximation', 'perfect cubes'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-approx-006',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Closest Value',
    question:
      'Which is the closest value to (√998 × √996) / √994?',
    type: 'mcq',
    options: [
      { id: 'a', text: '30' },
      { id: 'b', text: '31.5' },
      { id: 'c', text: '31.6' },
      { id: 'd', text: '32' },
    ],
    correctAnswer: 'c',
    explanation:
      'Approximate each: √998 ≈ √1000 ≈ 31.62, √996 ≈ 31.56, √994 ≈ 31.53. Product of first two ≈ 31.62 × 31.56 ≈ 998. Then 998 / 31.53 ≈ 31.65. Alternatively, using √(998×996/994): numerator 998×996 = 994008; 994008/994 ≈ 1000.008; √1000.008 ≈ 31.62. Closest is 31.6.',
    shortcut:
      'For √(a×b/c), estimate a,b,c by nearby round numbers to simplify the radical.',
    concept:
      'Products and quotients under square roots can be combined: √(ab/c) = √a × √b / √c.',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['square root', 'approximation', 'closest value'],
    companyRelevance: ['Infosys', 'Accenture', 'Cognizant'],
  },
  {
    id: 'quant-approx-007',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Complex Expression',
    question:
      'Approximate: (3.99 × 12.02 + 4.98 × 8.01) / 9.97',
    type: 'mcq',
    options: [
      { id: 'a', text: '8' },
      { id: 'b', text: '9' },
      { id: 'c', text: '10' },
      { id: 'd', text: '11' },
    ],
    correctAnswer: 'c',
    explanation:
      'Round: 4 × 12 = 48 and 5 × 8 = 40. Numerator ≈ 48 + 40 = 88. Denominator ≈ 10. Result ≈ 88/10 = 8.8 ≈ 9. Actual: (3.99×12.02) + (4.98×8.01) = 47.96 + 39.89 = 87.85; 87.85/9.97 ≈ 8.81. Closest to 9.',
    shortcut:
      'Round each factor to a whole number, compute numerator and denominator, then divide.',
    concept:
      'Approximation works by substituting messy numbers with clean nearby values.',
    difficulty: 'medium',
    estimatedTime: 65,
    tags: ['approximation', 'complex expression', 'estimation'],
    companyRelevance: ['TCS', 'HCL', 'Wipro'],
  },
  {
    id: 'quant-approx-008',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Percentage Approximation',
    question:
      'Approximate the value of 32.04% of 1499.8.',
    type: 'mcq',
    options: [
      { id: 'a', text: '420' },
      { id: 'b', text: '450' },
      { id: 'c', text: '480' },
      { id: 'd', text: '500' },
    ],
    correctAnswer: 'c',
    explanation:
      '32.04% ≈ 32% and 1499.8 ≈ 1500. So 32% of 1500 = 0.32 × 1500 = 480. The actual value is 32.04% × 1499.8 ≈ 480.54, which rounds to 480.',
    shortcut:
      'Round the percentage and the base number, then multiply: x% of N ≈ (x/100) × N.',
    concept:
      'When both the percentage and the base are approximate, rounding both slightly may introduce small combined errors that remain acceptable.',
    difficulty: 'medium',
    estimatedTime: 45,
    tags: ['percentage', 'approximation', 'estimation'],
    companyRelevance: ['TCS', 'Infosys', 'Capgemini'],
  },

  // ─── HARD (2) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-approx-009',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Radical Expression',
    question:
      'Which value best approximates √(5.06² + 11.97²)?',
    type: 'mcq',
    options: [
      { id: 'a', text: '12' },
      { id: 'b', text: '13' },
      { id: 'c', text: '14' },
      { id: 'd', text: '17' },
    ],
    correctAnswer: 'b',
    explanation:
      '5.06 ≈ 5 and 11.97 ≈ 12. So 5² + 12² = 25 + 144 = 169. √169 = 13. The actual value: 5.06²≈25.6, 11.97²≈143.28, sum≈168.88, √168.88≈13.0. The answer is 13.',
    shortcut:
      'Recognize Pythagorean triplets: (5, 12, 13) gives √(5²+12²) = 13.',
    concept:
      'Pythagorean triples (a,b,c with a²+b²=c²) allow instant evaluation of hypotenuse-type expressions.',
    difficulty: 'hard',
    estimatedTime: 80,
    tags: ['approximation', 'Pythagorean triple', 'square root'],
    companyRelevance: ['Google', 'Amazon', 'Microsoft'],
  },
  {
    id: 'quant-approx-010',
    section: 'quantitative',
    topic: 'Approximation',
    subtopic: 'Multi-step Approximation',
    question:
      'Approximate: (√(8099) + ∛(3374)) × 2.97',
    type: 'mcq',
    options: [
      { id: 'a', text: '282' },
      { id: 'b', text: '297' },
      { id: 'c', text: '312' },
      { id: 'd', text: '275' },
    ],
    correctAnswer: 'b',
    explanation:
      '√8099 ≈ √8100 = 90. ∛3374: note 15³ = 3375, so ∛3374 ≈ 15. Sum = 90 + 15 = 105. Then 105 × 2.97 ≈ 105 × 3 = 315. Actual: 105 × 2.97 = 311.85 ≈ 312. So the closest answer is 312, option c.',
    shortcut:
      'Identify perfect squares and perfect cubes near the radicands for quick evaluation.',
    concept:
      'Multi-step approximation: evaluate each radical first, combine, then multiply. Errors compound but remain small if each rounding step is small.',
    difficulty: 'hard',
    estimatedTime: 90,
    tags: ['approximation', 'square root', 'cube root', 'multi-step'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
];

export default questions;
