import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-trn-001',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Crossing a pole',
    question:
      'A train 150 m long passes a pole in 15 seconds. What is the speed of the train in km/h?',
    type: 'mcq',
    options: [
      { id: 'a', text: '36 km/h' },
      { id: 'b', text: '40 km/h' },
      { id: 'c', text: '54 km/h' },
      { id: 'd', text: '60 km/h' },
    ],
    correctAnswer: 'a',
    explanation:
      'Speed = Distance / Time = 150 m / 15 s = 10 m/s. Convert to km/h: 10 × (18/5) = 36 km/h.',
    shortcut: 'Speed (km/h) = (Length / Time) × 3.6',
    concept: 'When a train crosses a pole, the distance covered equals the length of the train.',
    difficulty: 'easy',
    estimatedTime: 45,
    tags: ['trains', 'speed', 'pole'],
    companyRelevance: ['TCS', 'Wipro', 'Infosys'],
  },
  {
    id: 'quant-trn-002',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Crossing a platform',
    question:
      'A train 200 m long crosses a platform 300 m long in 25 seconds. What is the speed of the train?',
    type: 'mcq',
    options: [
      { id: 'a', text: '72 km/h' },
      { id: 'b', text: '54 km/h' },
      { id: 'c', text: '80 km/h' },
      { id: 'd', text: '90 km/h' },
    ],
    correctAnswer: 'a',
    explanation:
      'Distance = Length of train + Length of platform = 200 + 300 = 500 m. Time = 25 s. Speed = 500/25 = 20 m/s = 20 × 3.6 = 72 km/h.',
    concept: 'When crossing a platform, total distance = train length + platform length.',
    difficulty: 'easy',
    estimatedTime: 50,
    tags: ['trains', 'platform', 'speed'],
    companyRelevance: ['TCS', 'Accenture', 'Capgemini'],
  },
  {
    id: 'quant-trn-003',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Relative speed – same direction',
    question:
      'Train A (100 m long, 60 km/h) overtakes Train B (200 m long, 40 km/h) moving in the same direction. How long does the overtaking take?',
    type: 'mcq',
    options: [
      { id: 'a', text: '54 seconds' },
      { id: 'b', text: '45 seconds' },
      { id: 'c', text: '60 seconds' },
      { id: 'd', text: '36 seconds' },
    ],
    correctAnswer: 'a',
    explanation:
      'Relative speed (same direction) = 60 − 40 = 20 km/h = 20 × (5/18) = 50/9 m/s. Total distance = 100 + 200 = 300 m. Time = 300 ÷ (50/9) = 300 × 9/50 = 54 seconds.',
    shortcut: 'Relative speed (same dir) = |v1 − v2|',
    difficulty: 'easy',
    estimatedTime: 60,
    tags: ['trains', 'relative speed', 'same direction'],
    companyRelevance: ['Wipro', 'Infosys', 'HCL'],
  },
  {
    id: 'quant-trn-004',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Time to cross a stationary object',
    question:
      'How many seconds will a 240 m long train take to cross a tree if it is travelling at 72 km/h?',
    type: 'mcq',
    options: [
      { id: 'a', text: '10 seconds' },
      { id: 'b', text: '12 seconds' },
      { id: 'c', text: '15 seconds' },
      { id: 'd', text: '18 seconds' },
    ],
    correctAnswer: 'b',
    explanation:
      'Speed = 72 km/h = 72 × (5/18) = 20 m/s. Distance = 240 m (only train length, tree is a point). Time = 240 / 20 = 12 seconds.',
    difficulty: 'easy',
    estimatedTime: 40,
    tags: ['trains', 'speed conversion', 'stationary object'],
    companyRelevance: ['TCS', 'Wipro'],
  },

  // ─── MEDIUM (4) ──────────────────────────────────────────────────────────────
  {
    id: 'quant-trn-005',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Crossing in opposite directions',
    question:
      'Two trains of lengths 180 m and 120 m are running towards each other on parallel tracks at 60 km/h and 40 km/h respectively. In how many seconds will they cross each other?',
    type: 'mcq',
    options: [
      { id: 'a', text: '9 seconds' },
      { id: 'b', text: '10.8 seconds' },
      { id: 'c', text: '12 seconds' },
      { id: 'd', text: '7.2 seconds' },
    ],
    correctAnswer: 'b',
    explanation:
      'Relative speed (opposite direction) = 60 + 40 = 100 km/h = 100 × (5/18) = 250/9 m/s. Total distance = 180 + 120 = 300 m. Time = 300 ÷ (250/9) = 300 × 9/250 = 2700/250 = 10.8 seconds.',
    shortcut: 'Relative speed (opposite dir) = v1 + v2',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['trains', 'relative speed', 'opposite direction'],
    companyRelevance: ['Infosys', 'Accenture', 'Cognizant'],
  },
  {
    id: 'quant-trn-006',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Find length of train',
    question:
      'A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/h, what is the length of the platform?',
    type: 'mcq',
    options: [
      { id: 'a', text: '220 m' },
      { id: 'b', text: '240 m' },
      { id: 'c', text: '260 m' },
      { id: 'd', text: '300 m' },
    ],
    correctAnswer: 'b',
    explanation:
      'Speed = 54 km/h = 15 m/s. Length of train = 15 × 20 = 300 m. Distance covered crossing platform = 15 × 36 = 540 m = train + platform. Platform length = 540 − 300 = 240 m.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['trains', 'platform length', 'find length'],
    companyRelevance: ['TCS', 'Wipro', 'HCL'],
  },
  {
    id: 'quant-trn-007',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Find length of second train',
    question:
      'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. Find the ratio of their speeds.',
    type: 'mcq',
    options: [
      { id: 'a', text: '1 : 3' },
      { id: 'b', text: '3 : 2' },
      { id: 'c', text: '2 : 3' },
      { id: 'd', text: '3 : 1' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let the speeds be v1 and v2, and lengths be L1 and L2. L1 = 27v1, L2 = 17v2. Crossing each other: (L1 + L2)/(v1 + v2) = 23 → (27v1 + 17v2)/(v1 + v2) = 23 → 27v1 + 17v2 = 23v1 + 23v2 → 4v1 = 6v2 → v1/v2 = 6/4 = 3/2. Ratio = 3:2.',
    difficulty: 'medium',
    estimatedTime: 90,
    tags: ['trains', 'ratio of speeds', 'opposite direction'],
    companyRelevance: ['Infosys', 'Cognizant'],
  },
  {
    id: 'quant-trn-008',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Train crossing bridge',
    question:
      'A train 360 m long is running at a speed of 45 km/h. In what time will it pass a bridge 140 m long?',
    type: 'mcq',
    options: [
      { id: 'a', text: '32 seconds' },
      { id: 'b', text: '36 seconds' },
      { id: 'c', text: '40 seconds' },
      { id: 'd', text: '48 seconds' },
    ],
    correctAnswer: 'c',
    explanation:
      'Speed = 45 km/h = 45 × (5/18) = 12.5 m/s. Total distance = 360 + 140 = 500 m. Time = 500 / 12.5 = 40 seconds.',
    difficulty: 'medium',
    estimatedTime: 60,
    tags: ['trains', 'bridge', 'crossing'],
    companyRelevance: ['Accenture', 'Capgemini', 'Wipro'],
  },

  // ─── HARD (2) ────────────────────────────────────────────────────────────────
  {
    id: 'quant-trn-009',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Speed from two crossings',
    question:
      'A train overtakes two persons walking in the same direction at 2 km/h and 4 km/h and passes them completely in 9 seconds and 10 seconds respectively. Find the length of the train.',
    type: 'mcq',
    options: [
      { id: 'a', text: '45 m' },
      { id: 'b', text: '50 m' },
      { id: 'c', text: '60 m' },
      { id: 'd', text: '72 m' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let train speed = v m/s and length = L m. Person 1 speed = 2 km/h = 5/9 m/s; Person 2 speed = 4 km/h = 10/9 m/s. Relative speed for person 1 = (v − 5/9), for person 2 = (v − 10/9). L = 9(v − 5/9) = 9v − 5. L = 10(v − 10/9) = 10v − 100/9. So 9v − 5 = 10v − 100/9 → v = 100/9 − 5 = 100/9 − 45/9 = 55/9 m/s. L = 9(55/9 − 5/9) = 9 × 50/9 = 50 m.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['trains', 'simultaneous equations', 'length'],
    companyRelevance: ['TCS', 'Infosys'],
  },
  {
    id: 'quant-trn-010',
    section: 'quantitative',
    topic: 'Trains',
    subtopic: 'Meeting point after crossing',
    question:
      'Two trains start simultaneously from stations A and B towards each other. After passing each other they take 25 seconds and 36 seconds to reach B and A respectively. What is the ratio of speed of the first train to that of the second?',
    type: 'mcq',
    options: [
      { id: 'a', text: '5 : 6' },
      { id: 'b', text: '6 : 5' },
      { id: 'c', text: '25 : 36' },
      { id: 'd', text: '36 : 25' },
    ],
    correctAnswer: 'b',
    explanation:
      'If two trains cross each other and take t1 and t2 seconds to reach the other end after meeting, then Speed1/Speed2 = √(t2/t1) = √(36/25) = 6/5. So ratio = 6 : 5.',
    shortcut: 'v1/v2 = √(t2/t1) when trains cross and reach destinations in t1 and t2 after crossing.',
    difficulty: 'hard',
    estimatedTime: 120,
    tags: ['trains', 'meeting point', 'ratio of speeds'],
    companyRelevance: ['Infosys', 'Cognizant', 'TCS'],
  },
];

export default questions;
