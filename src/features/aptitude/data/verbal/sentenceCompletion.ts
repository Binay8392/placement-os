import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ────────────────────────────────────────────────────────────────
  {
    id: 'verb-sco-001',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'Despite the heavy rain, the cricket match was not ________; it was resumed after a brief delay.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'abandoned' },
      { id: 'b', text: 'celebrated' },
      { id: 'c', text: 'organized' },
      { id: 'd', text: 'postponed' },
    ],
    correctAnswer: 'a',
    explanation:
      'The word "abandoned" (permanently stopped) correctly contrasts with the clause "it was resumed after a brief delay." The sentence establishes a contradiction—despite bad weather, the match was not permanently stopped. "Postponed" would also create a contrast but is weaker because a match that is postponed typically does not resume in the same session.',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['sentence completion', 'single blank', 'easy'],
    companyRelevance: ['TCS', 'Wipro', 'Infosys'],
  },
  {
    id: 'verb-sco-002',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'The new employee was ________ about her first week at the job; she stayed after hours every day to learn the systems.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'indifferent' },
      { id: 'b', text: 'enthusiastic' },
      { id: 'c', text: 'pessimistic' },
      { id: 'd', text: 'reluctant' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Enthusiastic" best completes the sentence because staying after hours to learn voluntarily is evidence of enthusiasm. The other options contradict the behavior described.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['sentence completion', 'single blank', 'easy'],
    companyRelevance: ['Accenture', 'TCS', 'Cognizant'],
  },
  {
    id: 'verb-sco-003',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'The scientist\'s discovery was so ________ that it changed the entire direction of research in the field.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'trivial' },
      { id: 'b', text: 'groundbreaking' },
      { id: 'c', text: 'mediocre' },
      { id: 'd', text: 'ordinary' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Groundbreaking" means innovative and pioneering, which fits the context of a discovery that changed an entire field. The other options imply unimportance, which contradicts the significant impact described.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['sentence completion', 'single blank', 'easy'],
    companyRelevance: ['Wipro', 'HCL', 'TCS'],
  },
  {
    id: 'verb-sco-004',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'The manager asked the team to ________ the report before the final submission to check for errors.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'ignore' },
      { id: 'b', text: 'discard' },
      { id: 'c', text: 'proofread' },
      { id: 'd', text: 'plagiarize' },
    ],
    correctAnswer: 'c',
    explanation:
      '"Proofread" means to read and correct errors in a written document, which perfectly fits the context of checking a report for errors before final submission.',
    difficulty: 'easy',
    estimatedTime: 25,
    tags: ['sentence completion', 'single blank', 'workplace'],
    companyRelevance: ['Infosys', 'Accenture', 'Capgemini'],
  },

  // ─── MEDIUM (4) ──────────────────────────────────────────────────────────────
  {
    id: 'verb-sco-005',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Double Blank',
    question:
      'The CEO\'s speech was ________ yet ________; it was brief but left the audience with much to think about.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'verbose … forgettable' },
      { id: 'b', text: 'concise … profound' },
      { id: 'c', text: 'lengthy … shallow' },
      { id: 'd', text: 'elaborate … insignificant' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Concise … profound" fits perfectly: "concise" (brief) matches "it was brief" and "profound" (giving much to think about) matches "left the audience with much to think about." Both blanks must support the sentence\'s meaning.',
    difficulty: 'medium',
    estimatedTime: 45,
    tags: ['sentence completion', 'double blank', 'intermediate'],
    companyRelevance: ['TCS', 'Infosys', 'Accenture'],
  },
  {
    id: 'verb-sco-006',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Double Blank',
    question:
      'Although he was ________ by the complexity of the problem, he refused to give up and eventually arrived at an ________ solution.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'thrilled … unsatisfactory' },
      { id: 'b', text: 'daunted … elegant' },
      { id: 'c', text: 'pleased … mediocre' },
      { id: 'd', text: 'bored … obvious' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Daunted" (intimidated) fits "Although he was __ by the complexity" (showing it was difficult), and "elegant" (ingeniously simple and effective) fits an excellent solution reached after perseverance. The "Although" signals a contrast between being overwhelmed and succeeding.',
    difficulty: 'medium',
    estimatedTime: 50,
    tags: ['sentence completion', 'double blank', 'intermediate'],
    companyRelevance: ['Wipro', 'HCL', 'Cognizant'],
  },
  {
    id: 'verb-sco-007',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'The company\'s decision to ________ its older product line was controversial, but it proved necessary to stay competitive in the rapidly evolving market.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'retain' },
      { id: 'b', text: 'celebrate' },
      { id: 'c', text: 'discontinue' },
      { id: 'd', text: 'replicate' },
    ],
    correctAnswer: 'c',
    explanation:
      '"Discontinue" means to stop producing or using something. It logically fits a decision that is both controversial and necessary for staying competitive, as retiring an older product line to launch newer ones often is.',
    difficulty: 'medium',
    estimatedTime: 40,
    tags: ['sentence completion', 'single blank', 'business'],
    companyRelevance: ['Accenture', 'TCS', 'Deloitte'],
  },
  {
    id: 'verb-sco-008',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Single Blank',
    question:
      'The auditors found several ________ in the company\'s financial records, raising concerns about the accuracy of the reported figures.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'compliments' },
      { id: 'b', text: 'discrepancies' },
      { id: 'c', text: 'improvements' },
      { id: 'd', text: 'endorsements' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Discrepancies" means inconsistencies or differences that should not exist. Finding discrepancies in financial records would naturally raise concerns about accuracy, making this the correct completion.',
    difficulty: 'medium',
    estimatedTime: 40,
    tags: ['sentence completion', 'single blank', 'business'],
    companyRelevance: ['Deloitte', 'KPMG', 'Accenture'],
  },

  // ─── HARD (2) ────────────────────────────────────────────────────────────────
  {
    id: 'verb-sco-009',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Double Blank',
    question:
      'Critics ________ the film for its ________ narrative that failed to engage the audience even in its climactic scenes.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'lauded … captivating' },
      { id: 'b', text: 'panned … meandering' },
      { id: 'c', text: 'applauded … gripping' },
      { id: 'd', text: 'commended … riveting' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Panned" (harshly criticized) and "meandering" (slow and aimlessly wandering) correctly complete the sentence. The clause "failed to engage the audience even in its climactic scenes" signals negative criticism and a poor narrative structure.',
    difficulty: 'hard',
    estimatedTime: 60,
    tags: ['sentence completion', 'double blank', 'advanced'],
    companyRelevance: ['Infosys', 'TCS', 'IBM'],
  },
  {
    id: 'verb-sco-010',
    section: 'verbal',
    topic: 'Sentence Completion',
    subtopic: 'Double Blank',
    question:
      'The historian\'s account was ________, drawing on primary sources and cross-referencing multiple archives, yet remained surprisingly ________ and readable for a general audience.',
    type: 'mcq',
    options: [
      { id: 'a', text: 'superficial … tedious' },
      { id: 'b', text: 'rigorous … accessible' },
      { id: 'c', text: 'biased … complex' },
      { id: 'd', text: 'careless … academic' },
    ],
    correctAnswer: 'b',
    explanation:
      '"Rigorous" (thorough and careful) fits the description of using primary sources and cross-referencing archives. "Accessible" fits "readable for a general audience." The contrast word "yet" signals that despite being scholarly, it was easy to read.',
    difficulty: 'hard',
    estimatedTime: 65,
    tags: ['sentence completion', 'double blank', 'advanced'],
    companyRelevance: ['Wipro', 'Cognizant', 'Deloitte'],
  },
];

export default questions;
