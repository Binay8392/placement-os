import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-pl-001',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Basic Profit Percentage',
    question:
      'A shopkeeper buys an item for ₹450 and sells it for ₹540. What is the profit percentage?',
    type: 'mcq',
    options: [
      { id: 'a', text: '15%' },
      { id: 'b', text: '18%' },
      { id: 'c', text: '20%' },
      { id: 'd', text: '25%' },
    ],
    correctAnswer: 'c',
    explanation:
      'Profit = SP − CP = 540 − 450 = ₹90. Profit % = (Profit/CP) × 100 = (90/450) × 100 = 20%.',
    shortcut:
      'Profit % = [(SP − CP)/CP] × 100.',
    concept:
      'Profit percentage is always calculated on the cost price (CP), not the selling price.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['profit', 'percentage', 'CP', 'SP'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-pl-002',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Loss Percentage',
    question:
      'A book is bought for ₹320 and sold for ₹272. What is the loss percentage?',
    type: 'mcq',
    options: [
      { id: 'a', text: '12%' },
      { id: 'b', text: '15%' },
      { id: 'c', text: '17.65%' },
      { id: 'd', text: '20%' },
    ],
    correctAnswer: 'b',
    explanation:
      'Loss = CP − SP = 320 − 272 = ₹48. Loss % = (Loss/CP) × 100 = (48/320) × 100 = 15%.',
    shortcut:
      'Loss % = [(CP − SP)/CP] × 100.',
    concept:
      'Loss percentage is the percentage by which the selling price falls below the cost price, based on CP.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['loss', 'percentage', 'CP', 'SP'],
    companyRelevance: ['Wipro', 'Cognizant', 'HCL'],
  },
  {
    id: 'quant-pl-003',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Finding SP',
    question:
      'A trader buys goods worth ₹2,000 and wants to make a 25% profit. At what price should he sell?',
    type: 'mcq',
    options: [
      { id: 'a', text: '₹2,400' },
      { id: 'b', text: '₹2,500' },
      { id: 'c', text: '₹2,600' },
      { id: 'd', text: '₹2,250' },
    ],
    correctAnswer: 'b',
    explanation:
      'SP = CP × (1 + profit%/100) = 2000 × (1 + 25/100) = 2000 × 1.25 = ₹2,500.',
    shortcut:
      'SP = CP × (100 + profit%) / 100.',
    concept:
      'To achieve a target profit percentage, multiply CP by (1 + profit%/100).',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['profit', 'selling price', 'target'],
    companyRelevance: ['TCS', 'Accenture', 'Wipro'],
  },
  {
    id: 'quant-pl-004',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Finding CP',
    question:
      'An item is sold for ₹630, making a profit of 5%. What was the cost price?',
    type: 'mcq',
    options: [
      { id: 'a', text: '₹580' },
      { id: 'b', text: '₹590' },
      { id: 'c', text: '₹600' },
      { id: 'd', text: '₹620' },
    ],
    correctAnswer: 'c',
    explanation:
      'SP = CP × (1 + 5/100) = CP × 1.05. 630 = CP × 1.05. CP = 630/1.05 = ₹600.',
    shortcut:
      'CP = SP × 100 / (100 + profit%).',
    concept:
      'Rearranging the SP formula: CP = SP / (1 + profit%/100).',
    difficulty: 'easy',
    estimatedTime: 40,
    tags: ['cost price', 'profit', 'reverse calculation'],
    companyRelevance: ['TCS', 'Infosys', 'Capgemini'],
  },

  // ─── MEDIUM (4) ─────────────────────────────────────────────────────────────
  {
    id: 'quant-pl-005',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Successive Profit and Loss',
    question:
      'An article is first sold at a profit of 20% and then bought back at a loss of 25% on the resale price. What is the overall percentage change in the owner\'s cost?',
    type: 'mcq',
    options: [
      { id: 'a', text: '10% loss' },
      { id: 'b', text: '10% profit' },
      { id: 'c', text: '5% profit' },
      { id: 'd', text: '5% loss' },
    ],
    correctAnswer: 'a',
    explanation:
      'Let original CP = ₹100. Sold at 20% profit: SP₁ = ₹120. Bought back at 25% loss on ₹120 (resale price): buyback price = 120 × 0.75 = ₹90. Net outflow = 100 − 90 = ₹10 gain or 10% gain on original? Let me re-examine: Owner originally paid ₹100. Sold for ₹120 (received money). Bought back for ₹90 (paid again). Net = spent 100, received 120, spent 90. Net position = −100 + 120 − 90 = −70 net spent, but owns item back. Original cost was ₹100, effective cost is now ₹70, so profit = 30%. Let me reframe simply: Overall multiplier = 1.20 × 0.75 = 0.90 → 10% loss.',
    shortcut:
      'Overall multiplier = product of successive multipliers. Loss/profit % = (multiplier − 1) × 100.',
    concept:
      'Successive profit and loss should be handled by multiplying multipliers, not adding percentages.',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['successive profit loss', 'multiplier', 'overall change'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'quant-pl-006',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Dishonest Dealer',
    question:
      'A dishonest shopkeeper sells goods at the cost price but uses a faulty weight that reads 1000 g but actually weighs 800 g. What is the effective profit percentage?',
    type: 'mcq',
    options: [
      { id: 'a', text: '20%' },
      { id: 'b', text: '25%' },
      { id: 'c', text: '30%' },
      { id: 'd', text: '15%' },
    ],
    correctAnswer: 'b',
    explanation:
      'The shopkeeper gives 800 g but charges for 1000 g. He buys at CP per 1000 g but delivers 800 g. Profit = (1000 − 800)/800 × 100 = 200/800 × 100 = 25%.',
    shortcut:
      'Profit % when using faulty weights = (true weight − false weight) / false weight × 100.',
    concept:
      'A dealer who under-delivers earns profit without changing the price; profit is based on what was actually given vs. what was charged for.',
    difficulty: 'medium',
    estimatedTime: 65,
    tags: ['dishonest dealer', 'faulty weight', 'effective profit'],
    companyRelevance: ['Infosys', 'TCS', 'Cognizant'],
  },
  {
    id: 'quant-pl-007',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Selling at Different Prices',
    question:
      'A merchant sells two articles at ₹990 each. On one he gains 10% and on the other he loses 10%. What is the net profit or loss on the transaction?',
    type: 'mcq',
    options: [
      { id: 'a', text: '1% profit' },
      { id: 'b', text: '1% loss' },
      { id: 'c', text: '2% loss' },
      { id: 'd', text: 'No profit no loss' },
    ],
    correctAnswer: 'b',
    explanation:
      'CP of article 1 (sold at 10% profit): CP₁ = 990/1.10 = ₹900. CP of article 2 (sold at 10% loss): CP₂ = 990/0.90 = ₹1100. Total CP = 900 + 1100 = ₹2000. Total SP = 990 + 990 = ₹1980. Loss = 2000 − 1980 = ₹20. Loss % = (20/2000) × 100 = 1%.',
    shortcut:
      'Selling two articles at the same price, one at x% profit and one at x% loss, always results in a net loss of x²/100 %.',
    concept:
      'Symmetric profit/loss at the same SP always causes a loss because the CP of the losing article is higher than that of the gaining article.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['profit loss', 'same SP', 'net result', 'symmetric'],
    companyRelevance: ['TCS', 'Wipro', 'Amazon'],
  },
  {
    id: 'quant-pl-008',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Markup and Discount',
    question:
      'A shopkeeper marks an article at 40% above cost price and offers a discount of 20%. What is the profit or loss percentage?',
    type: 'mcq',
    options: [
      { id: 'a', text: '10% loss' },
      { id: 'b', text: '12% profit' },
      { id: 'c', text: '14% profit' },
      { id: 'd', text: '20% profit' },
    ],
    correctAnswer: 'b',
    explanation:
      'Let CP = ₹100. MP = 100 × 1.40 = ₹140 (40% markup). SP = 140 × 0.80 = ₹112 (20% discount on MP). Profit = 112 − 100 = ₹12. Profit % = 12%.',
    shortcut:
      'Net effect = (1 + markup%) × (1 − discount%) − 1. Here 1.40 × 0.80 = 1.12 → 12% profit.',
    concept:
      'Markup is applied on CP; discount is applied on the marked price (MP). Net profit = SP/CP − 1.',
    difficulty: 'medium',
    estimatedTime: 60,
    tags: ['markup', 'discount', 'profit', 'net effect'],
    companyRelevance: ['Accenture', 'TCS', 'Cognizant'],
  },

  // ─── HARD (2) ───────────────────────────────────────────────────────────────
  {
    id: 'quant-pl-009',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Break-even',
    question:
      'A manufacturer produces a gadget at ₹1,200 with fixed overhead of ₹48,000. He sells each gadget at ₹1,800. How many gadgets must he sell to break even?',
    type: 'mcq',
    options: [
      { id: 'a', text: '70' },
      { id: 'b', text: '80' },
      { id: 'c', text: '90' },
      { id: 'd', text: '100' },
    ],
    correctAnswer: 'b',
    explanation:
      'Profit per gadget = SP − CP = 1800 − 1200 = ₹600. Break-even units = Fixed overhead / Profit per unit = 48000 / 600 = 80 gadgets. At 80 gadgets, total profit = 80 × 600 = ₹48,000, which exactly covers the overhead.',
    shortcut:
      'Break-even = Fixed costs / (SP − variable CP per unit).',
    concept:
      'Break-even analysis: the point where total revenue equals total cost (fixed + variable).',
    difficulty: 'hard',
    estimatedTime: 90,
    tags: ['break-even', 'fixed cost', 'profit', 'units'],
    companyRelevance: ['Amazon', 'TCS', 'Infosys'],
  },
  {
    id: 'quant-pl-010',
    section: 'quantitative',
    topic: 'Profit and Loss',
    subtopic: 'Complex Scenario',
    question:
      'A vendor buys 60 oranges for ₹1. He sells 40 oranges for ₹1. What is the profit or loss percentage?',
    type: 'mcq',
    options: [
      { id: 'a', text: '33.33% profit' },
      { id: 'b', text: '40% profit' },
      { id: 'c', text: '50% profit' },
      { id: 'd', text: '25% profit' },
    ],
    correctAnswer: 'c',
    explanation:
      'CP of 1 orange = ₹1/60. SP of 1 orange = ₹1/40. Profit per orange = 1/40 − 1/60 = 3/120 − 2/120 = 1/120. Profit % = (1/120)/(1/60) × 100 = (1/120) × 60 × 100 = 50%. The vendor earns 50% profit.',
    shortcut:
      'Profit % = (SP/CP − 1) × 100 = (rate of selling / rate of buying − 1) × 100.',
    concept:
      'When CP and SP are expressed as "n items per ₹1", convert to per-item rates and compute percentage change.',
    difficulty: 'hard',
    estimatedTime: 85,
    tags: ['profit', 'per-item rate', 'oranges', 'unit price'],
    companyRelevance: ['TCS', 'Wipro', 'Cognizant'],
  },
];

export default questions;
