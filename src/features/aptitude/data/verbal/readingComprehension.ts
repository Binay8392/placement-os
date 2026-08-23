import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── PASSAGE 1: Technology ─────────────────────────────────────────────────
  // EASY
  {
    id: 'verb-rc-001',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Technology',
    passage:
      'Artificial intelligence is transforming the way we interact with technology. From virtual assistants that answer our questions to recommendation systems that predict our preferences, AI has become an integral part of daily life. Unlike traditional software, AI systems learn from data, improving their performance over time without being explicitly programmed for every scenario. This ability to learn and adapt makes AI especially powerful in fields such as healthcare, finance, and education, where the volume and complexity of data exceed human capacity to process manually.',
    question: 'According to the passage, what makes AI different from traditional software?',
    type: 'passage',
    options: [
      { id: 'a', text: 'AI is more expensive to develop.' },
      { id: 'b', text: 'AI learns from data and improves without explicit programming for every task.' },
      { id: 'c', text: 'AI can only be used in healthcare.' },
      { id: 'd', text: 'AI does not require any human input.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The passage explicitly states that "unlike traditional software, AI systems learn from data, improving their performance over time without being explicitly programmed for every scenario."',
    difficulty: 'easy',
    estimatedTime: 60,
    tags: ['reading comprehension', 'technology', 'AI'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture'],
  },
  // MEDIUM
  {
    id: 'verb-rc-002',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Technology',
    passage:
      'Artificial intelligence is transforming the way we interact with technology. From virtual assistants that answer our questions to recommendation systems that predict our preferences, AI has become an integral part of daily life. Unlike traditional software, AI systems learn from data, improving their performance over time without being explicitly programmed for every scenario. This ability to learn and adapt makes AI especially powerful in fields such as healthcare, finance, and education, where the volume and complexity of data exceed human capacity to process manually.',
    question: 'Which of the following can be inferred from the passage?',
    type: 'passage',
    options: [
      { id: 'a', text: 'AI will eventually replace all human workers.' },
      { id: 'b', text: 'AI is suited for domains with large and complex datasets.' },
      { id: 'c', text: 'Traditional software is completely obsolete.' },
      { id: 'd', text: 'Recommendation systems are used only in education.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The passage says AI is powerful where "the volume and complexity of data exceed human capacity to process manually," implying it is well-suited for data-rich domains. No other option is supported by the text.',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['reading comprehension', 'inference', 'technology'],
    companyRelevance: ['TCS', 'Cognizant', 'Infosys'],
  },

  // ─── PASSAGE 2: Environment ────────────────────────────────────────────────
  // EASY
  {
    id: 'verb-rc-003',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Environment',
    passage:
      'Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures, caused primarily by the emission of greenhouse gases such as carbon dioxide and methane, are leading to more frequent and severe weather events. Polar ice caps are melting at an alarming rate, causing sea levels to rise and threatening coastal communities worldwide. Scientists and policymakers agree that immediate, coordinated global action is necessary to limit warming to 1.5°C above pre-industrial levels, as outlined in the Paris Agreement.',
    question: 'Which gas is mentioned in the passage as a primary cause of rising global temperatures?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Oxygen' },
      { id: 'b', text: 'Nitrogen' },
      { id: 'c', text: 'Carbon dioxide' },
      { id: 'd', text: 'Hydrogen' },
    ],
    correctAnswer: 'c',
    explanation:
      'The passage states that greenhouse gases "such as carbon dioxide and methane" are the primary causes of rising global temperatures.',
    difficulty: 'easy',
    estimatedTime: 55,
    tags: ['reading comprehension', 'environment', 'climate change'],
    companyRelevance: ['Wipro', 'Infosys', 'HCL'],
  },
  // MEDIUM
  {
    id: 'verb-rc-004',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Environment',
    passage:
      'Climate change is one of the most pressing challenges facing humanity today. Rising global temperatures, caused primarily by the emission of greenhouse gases such as carbon dioxide and methane, are leading to more frequent and severe weather events. Polar ice caps are melting at an alarming rate, causing sea levels to rise and threatening coastal communities worldwide. Scientists and policymakers agree that immediate, coordinated global action is necessary to limit warming to 1.5°C above pre-industrial levels, as outlined in the Paris Agreement.',
    question: 'The tone of the passage can best be described as:',
    type: 'passage',
    options: [
      { id: 'a', text: 'Indifferent and detached' },
      { id: 'b', text: 'Urgent and informative' },
      { id: 'c', text: 'Humorous and light-hearted' },
      { id: 'd', text: 'Pessimistic and hopeless' },
    ],
    correctAnswer: 'b',
    explanation:
      'Words like "pressing challenges," "alarming rate," and "immediate, coordinated global action is necessary" establish a tone that is both urgent (calling for action) and informative (providing facts about climate change).',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['reading comprehension', 'tone', 'environment'],
    companyRelevance: ['Accenture', 'TCS', 'Capgemini'],
  },

  // ─── PASSAGE 3: Business ──────────────────────────────────────────────────
  // MEDIUM
  {
    id: 'verb-rc-005',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Business',
    passage:
      'Start-ups have disrupted traditional industries by leveraging technology to deliver goods and services more efficiently. Unlike established corporations bound by legacy systems and bureaucratic processes, start-ups can iterate quickly and pivot when market conditions change. However, the high failure rate of start-ups—estimated at over 90% within the first five years—highlights the challenges of sustaining innovation. Access to venture capital, a skilled workforce, and a receptive market are critical factors that determine whether a start-up succeeds or becomes another cautionary tale.',
    question: 'According to the passage, what is the estimated failure rate of start-ups within the first five years?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Over 50%' },
      { id: 'b', text: 'Over 70%' },
      { id: 'c', text: 'Over 90%' },
      { id: 'd', text: 'Exactly 75%' },
    ],
    correctAnswer: 'c',
    explanation:
      'The passage explicitly states the failure rate is "estimated at over 90% within the first five years."',
    difficulty: 'medium',
    estimatedTime: 60,
    tags: ['reading comprehension', 'business', 'start-ups'],
    companyRelevance: ['Deloitte', 'Accenture', 'KPMG'],
  },
  // HARD
  {
    id: 'verb-rc-006',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Business',
    passage:
      'Start-ups have disrupted traditional industries by leveraging technology to deliver goods and services more efficiently. Unlike established corporations bound by legacy systems and bureaucratic processes, start-ups can iterate quickly and pivot when market conditions change. However, the high failure rate of start-ups—estimated at over 90% within the first five years—highlights the challenges of sustaining innovation. Access to venture capital, a skilled workforce, and a receptive market are critical factors that determine whether a start-up succeeds or becomes another cautionary tale.',
    question: 'Which of the following, if true, would most weaken the argument that start-ups are superior to established corporations?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Several start-ups have grown into billion-dollar companies within a decade.' },
      { id: 'b', text: 'Many established corporations have dedicated innovation labs that iterate as quickly as start-ups.' },
      { id: 'c', text: 'Venture capital funding for start-ups has increased over the past decade.' },
      { id: 'd', text: 'Start-ups employ a large number of recent graduates.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The passage argues that start-ups have an advantage because they "iterate quickly." If established corporations also have innovation labs that iterate just as quickly, this advantage disappears, weakening the argument.',
    difficulty: 'hard',
    estimatedTime: 90,
    tags: ['reading comprehension', 'critical reasoning', 'business'],
    companyRelevance: ['McKinsey', 'Deloitte', 'Accenture'],
  },

  // ─── PASSAGE 4: Culture ───────────────────────────────────────────────────
  // EASY
  {
    id: 'verb-rc-007',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Culture',
    passage:
      'Language is far more than a tool for communication—it is the vessel through which culture, history, and identity are transmitted across generations. When a language becomes extinct, an irreplaceable repository of human knowledge and experience is lost forever. Linguists estimate that nearly half of the world\'s approximately 7,000 languages are endangered, with one language disappearing every two weeks on average. Efforts to document and revitalize endangered languages are therefore not merely academic exercises but urgent acts of cultural preservation.',
    question: 'How frequently does a language disappear, according to the passage?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Every day' },
      { id: 'b', text: 'Every two weeks' },
      { id: 'c', text: 'Every month' },
      { id: 'd', text: 'Every two months' },
    ],
    correctAnswer: 'b',
    explanation:
      'The passage states that "one language disappears every two weeks on average."',
    difficulty: 'easy',
    estimatedTime: 50,
    tags: ['reading comprehension', 'culture', 'language'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  // MEDIUM
  {
    id: 'verb-rc-008',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Culture',
    passage:
      'Language is far more than a tool for communication—it is the vessel through which culture, history, and identity are transmitted across generations. When a language becomes extinct, an irreplaceable repository of human knowledge and experience is lost forever. Linguists estimate that nearly half of the world\'s approximately 7,000 languages are endangered, with one language disappearing every two weeks on average. Efforts to document and revitalize endangered languages are therefore not merely academic exercises but urgent acts of cultural preservation.',
    question: 'The author\'s primary purpose in writing this passage is to:',
    type: 'passage',
    options: [
      { id: 'a', text: 'Criticize linguists for failing to preserve languages.' },
      { id: 'b', text: 'Entertain readers with stories about extinct languages.' },
      { id: 'c', text: 'Highlight the importance and urgency of preserving endangered languages.' },
      { id: 'd', text: 'Argue that all languages will eventually become extinct.' },
    ],
    correctAnswer: 'c',
    explanation:
      'The passage emphasizes that language extinction is a serious loss and frames preservation efforts as "urgent acts of cultural preservation," establishing the author\'s purpose as advocating for the importance of saving endangered languages.',
    difficulty: 'medium',
    estimatedTime: 70,
    tags: ['reading comprehension', 'purpose', 'culture'],
    companyRelevance: ['Accenture', 'Cognizant', 'HCL'],
  },

  // ─── PASSAGE 5: Science ───────────────────────────────────────────────────
  // MEDIUM
  {
    id: 'verb-rc-009',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Science',
    passage:
      'The human brain, often described as the most complex structure in the known universe, contains roughly 86 billion neurons, each forming thousands of synaptic connections. Despite decades of neuroscience research, consciousness—the subjective experience of being aware—remains poorly understood. Some researchers subscribe to the view that consciousness arises purely from physical processes in the brain, while others argue that it involves factors beyond current scientific explanation. Advances in neuroimaging have given scientists unprecedented windows into brain activity, yet the precise neural correlates of consciousness remain elusive.',
    question: 'Which of the following best describes the current state of understanding of consciousness, as presented in the passage?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Fully explained by neuroimaging studies.' },
      { id: 'b', text: 'Proven to arise purely from physical brain processes.' },
      { id: 'c', text: 'Incompletely understood despite significant research.' },
      { id: 'd', text: 'A topic no longer studied by neuroscientists.' },
    ],
    correctAnswer: 'c',
    explanation:
      'The passage says consciousness "remains poorly understood" and its "precise neural correlates… remain elusive," indicating it is incompletely understood despite ongoing research.',
    difficulty: 'medium',
    estimatedTime: 75,
    tags: ['reading comprehension', 'science', 'neuroscience'],
    companyRelevance: ['TCS', 'IBM', 'Infosys'],
  },
  // HARD
  {
    id: 'verb-rc-010',
    section: 'verbal',
    topic: 'Reading Comprehension',
    subtopic: 'Science',
    passage:
      'The human brain, often described as the most complex structure in the known universe, contains roughly 86 billion neurons, each forming thousands of synaptic connections. Despite decades of neuroscience research, consciousness—the subjective experience of being aware—remains poorly understood. Some researchers subscribe to the view that consciousness arises purely from physical processes in the brain, while others argue that it involves factors beyond current scientific explanation. Advances in neuroimaging have given scientists unprecedented windows into brain activity, yet the precise neural correlates of consciousness remain elusive.',
    question: 'With which of the following statements would the author of this passage most likely agree?',
    type: 'passage',
    options: [
      { id: 'a', text: 'Neuroimaging has definitively resolved the debate about the origins of consciousness.' },
      { id: 'b', text: 'The question of consciousness may require explanations that go beyond current scientific frameworks.' },
      { id: 'c', text: 'The human brain is less complex than previously believed.' },
      { id: 'd', text: 'Consciousness research should be discontinued due to its lack of progress.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The passage presents both the physical explanation and the view that consciousness "involves factors beyond current scientific explanation," without dismissing either. The word "elusive" and the balanced presentation suggest the author accepts that current science may be insufficient, making option B the best inference.',
    difficulty: 'hard',
    estimatedTime: 90,
    tags: ['reading comprehension', 'inference', 'science', 'neuroscience'],
    companyRelevance: ['IBM', 'Microsoft', 'Google'],
  },
];

export default questions;
