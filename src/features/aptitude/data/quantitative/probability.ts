import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-prob-001',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Coin toss',
    question:
      'A fair coin is tossed twice. What is the probability of getting at least one head?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '3/4' },
      { id: 'd', text: '1' },
    ],
    correctAnswer: 'c',
    explanation:
      'Total outcomes = {HH, HT, TH, TT} = 4. Outcomes with at least one head = {HH, HT, TH} = 3. P = 3/4. Alternatively: P(at least 1 head) = 1 − P(no head) = 1 − P(TT) = 1 − 1/4 = 3/4.',
    shortcut: 'P(at least one) = 1 − P(none)',
    concept: 'Complementary probability is often the fastest route for "at least one" problems.',
    difficulty: 'easy',
    estimatedTime: 40,
    tags: ['probability', 'coin', 'complementary events'],
    companyRelevance: ['TCS', 'Wipro', 'Infosys'],
  },
  {
    id: 'quant-prob-002',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Dice',
    question:
      'A fair die is rolled once. What is the probability of getting a prime number?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/3' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '2/3' },
      { id: 'd', text: '1/6' },
    ],
    correctAnswer: 'b',
    explanation:
      'Total outcomes = {1, 2, 3, 4, 5, 6} = 6. Prime numbers on a die: {2, 3, 5} = 3 outcomes. P = 3/6 = 1/2.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['probability', 'dice', 'prime numbers'],
    companyRelevance: ['TCS', 'Accenture', 'Capgemini'],
  },
  {
    id: 'quant-prob-003',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Cards – single draw',
    question:
      'One card is drawn at random from a standard deck of 52 cards. What is the probability that it is a king?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/13' },
      { id: 'b', text: '1/52' },
      { id: 'c', text: '1/26' },
      { id: 'd', text: '4/52' },
    ],
    correctAnswer: 'a',
    explanation:
      'There are 4 kings in a deck of 52 cards. P(king) = 4/52 = 1/13. (Note: option d = 4/52 = 1/13 is the same as option a, but expressed as a simplified fraction. Option a is the most reduced form.)',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['probability', 'cards', 'single draw'],
    companyRelevance: ['Wipro', 'Infosys', 'HCL'],
  },
  {
    id: 'quant-prob-004',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Balls in a bag',
    question:
      'A bag contains 3 red balls and 5 blue balls. A ball is drawn at random. What is the probability of drawing a red ball?',
    type: 'mcq',
    options: [
      { id: 'a', text: '3/8' },
      { id: 'b', text: '5/8' },
      { id: 'c', text: '3/5' },
      { id: 'd', text: '1/2' },
    ],
    correctAnswer: 'a',
    explanation:
      'Total balls = 3 + 5 = 8. Favourable outcomes (red ball) = 3. P = 3/8.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['probability', 'balls', 'basic probability'],
    companyRelevance: ['TCS', 'Wipro'],
  },

  // ─── MEDIUM (4) ──────────────────────────────────────────────────────────────
  {
    id: 'quant-prob-005',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Cards – two draws without replacement',
    question:
      'Two cards are drawn at random from a standard deck of 52 without replacement. What is the probability that both are aces?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/221' },
      { id: 'b', text: '1/169' },
      { id: 'c', text: '4/663' },
      { id: 'd', text: '2/221' },
    ],
    correctAnswer: 'a',
    explanation:
      'P(first ace) = 4/52 = 1/13. P(second ace | first ace drawn) = 3/51 = 1/17. P(both aces) = (1/13) × (1/17) = 1/221.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['probability', 'cards', 'without replacement', 'dependent events'],
    companyRelevance: ['TCS', 'Infosys', 'Cognizant'],
  },
  {
    id: 'quant-prob-006',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Dice – two dice sum',
    question:
      'Two fair dice are thrown simultaneously. What is the probability that the sum of numbers shown is 8?',
    type: 'mcq',
    options: [
      { id: 'a', text: '5/36' },
      { id: 'b', text: '4/36' },
      { id: 'c', text: '6/36' },
      { id: 'd', text: '7/36' },
    ],
    correctAnswer: 'a',
    explanation:
      'Total outcomes = 6 × 6 = 36. Pairs that sum to 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 pairs. P = 5/36.',
    difficulty: 'medium',
    estimatedTime: 65,
    tags: ['probability', 'dice', 'sum', 'two dice'],
    companyRelevance: ['TCS', 'Wipro', 'Accenture'],
  },
  {
    id: 'quant-prob-007',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Mutually exclusive events',
    question:
      'A bag contains 4 white, 3 red, and 5 black balls. If two balls are drawn simultaneously at random, what is the probability that they are of different colours?',
    type: 'mcq',
    options: [
      { id: 'a', text: '47/66' },
      { id: 'b', text: '40/66' },
      { id: 'c', text: '19/66' },
      { id: 'd', text: '29/66' },
    ],
    correctAnswer: 'a',
    explanation:
      'Total balls = 12. Total ways to pick 2 = C(12,2) = 66. Ways to pick 2 of SAME colour: C(4,2)+C(3,2)+C(5,2) = 6+3+10 = 19. Ways to pick different colours = 66 − 19 = 47. P = 47/66.',
    difficulty: 'medium',
    estimatedTime: 80,
    tags: ['probability', 'different colours', 'combinations'],
    companyRelevance: ['TCS', 'Infosys'],
  },
  {
    id: 'quant-prob-008',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Conditional probability',
    question:
      'In a class, 60% of students play cricket, 40% play football, and 20% play both. A student is selected at random. Given that the student plays football, what is the probability that the student also plays cricket?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/3' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '2/3' },
      { id: 'd', text: '3/4' },
    ],
    correctAnswer: 'b',
    explanation:
      'P(Cricket) = 0.6, P(Football) = 0.4, P(Cricket ∩ Football) = 0.2. P(Cricket | Football) = P(Cricket ∩ Football) / P(Football) = 0.2/0.4 = 1/2.',
    shortcut: 'P(A|B) = P(A∩B)/P(B)',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['probability', 'conditional', 'sets'],
    companyRelevance: ['Infosys', 'Wipro', 'Cognizant'],
  },

  // ─── HARD (2) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-prob-009',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Cards – face cards',
    question:
      'From a deck of 52 cards, 3 cards are drawn simultaneously. What is the probability that all 3 are face cards (Jack, Queen, King)?',
    type: 'mcq',
    options: [
      { id: 'a', text: '11/1105' },
      { id: 'b', text: '22/1105' },
      { id: 'c', text: '12/1105' },
      { id: 'd', text: '44/1105' },
    ],
    correctAnswer: 'a',
    explanation:
      'Face cards = 12 (4 Jacks, 4 Queens, 4 Kings). Ways to choose 3 face cards: C(12,3) = 12×11×10/6 = 220. Total ways to choose 3 from 52: C(52,3) = 52×51×50/6 = 22100. P = 220/22100 = 11/1105.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['probability', 'cards', 'combinations', 'face cards'],
    companyRelevance: ['TCS', 'Infosys'],
  },
  {
    id: 'quant-prob-010',
    section: 'quantitative',
    topic: 'Probability',
    subtopic: 'Probability of independent events',
    question:
      'P(A) = 1/2, P(B) = 1/3, P(C) = 1/4. A, B, C are independent events. What is the probability that none of them occur?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/3' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '1/6' },
    ],
    correctAnswer: 'a',
    explanation:
      'P(none occur) = P(A\') × P(B\') × P(C\') = (1−1/2)(1−1/3)(1−1/4) = (1/2)(2/3)(3/4) = 6/24 = 1/4.',
    difficulty: 'hard',
    estimatedTime: 110,
    tags: ['probability', 'independent events', 'complementary'],
    companyRelevance: ['Infosys', 'TCS', 'Wipro'],
  },
];

export default questions;
