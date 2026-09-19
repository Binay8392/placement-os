import type { AptitudeQuestion } from '../../types';

const questions: AptitudeQuestion[] = [
  // ─── EASY (4) ────────────────────────────────────────────────────────────────
  {
    id: 'verb-scr-001',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Subject-Verb Agreement',
    question:
      'Choose the best corrected version of the following sentence: "Each of the students have submitted their assignment."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Each of the students has submitted their assignment.' },
      { id: 'b', text: 'Each of the students have submitted his assignment.' },
      { id: 'c', text: 'Each of the students were submitting their assignment.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      '"Each" is a singular indefinite pronoun and always takes a singular verb. The correct form is "has," not "have." "Their" is acceptable as a singular gender-neutral pronoun in modern usage. So the corrected sentence is: "Each of the students has submitted their assignment."',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['sentence correction', 'subject-verb agreement', 'easy'],
    companyRelevance: ['TCS', 'Infosys', 'Wipro'],
  },
  {
    id: 'verb-scr-002',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Tense',
    question:
      'Choose the best corrected version: "By the time the manager arrived, the team already finished the presentation."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'By the time the manager arrived, the team had already finished the presentation.' },
      { id: 'b', text: 'By the time the manager arrives, the team has already finished the presentation.' },
      { id: 'c', text: 'By the time the manager arrived, the team was finishing the presentation.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'When two past events are described and one occurred before the other, the earlier event uses the past perfect tense (had + past participle). The team finishing the presentation happened before the manager arrived, so "had already finished" is correct.',
    difficulty: 'easy',
    estimatedTime: 40,
    tags: ['sentence correction', 'tense', 'past perfect'],
    companyRelevance: ['Accenture', 'Capgemini', 'TCS'],
  },
  {
    id: 'verb-scr-003',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Preposition',
    question:
      'Choose the best corrected version: "She is very good in mathematics and always scores well in exams."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'She is very good at mathematics and always scores well in exams.' },
      { id: 'b', text: 'She is very good for mathematics and always scores well in exams.' },
      { id: 'c', text: 'She is very good of mathematics and always scores well in exams.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'The correct collocation is "good at" a subject or skill, not "good in." We say "good at mathematics," "good at playing the piano," etc. "Good in" is a common non-native speaker error.',
    difficulty: 'easy',
    estimatedTime: 30,
    tags: ['sentence correction', 'preposition', 'collocation'],
    companyRelevance: ['Wipro', 'HCL', 'TCS'],
  },
  {
    id: 'verb-scr-004',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Pronoun',
    question:
      'Choose the best corrected version: "The committee has announced their decision to postpone the event."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'The committee has announced its decision to postpone the event.' },
      { id: 'b', text: 'The committee have announced their decision to postpone the event.' },
      { id: 'c', text: 'The committee has announced the decision to postpone the event.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'In American English, collective nouns like "committee," "team," "jury" are treated as singular and take singular pronouns ("its") and singular verbs ("has"). The original sentence incorrectly uses "their" (plural) with "has" (singular). The correction makes both agree: "has" (singular verb) + "its" (singular pronoun).',
    difficulty: 'easy',
    estimatedTime: 35,
    tags: ['sentence correction', 'pronoun', 'collective nouns'],
    companyRelevance: ['TCS', 'Infosys', 'Accenture'],
  },

  // ─── MEDIUM (4) ──────────────────────────────────────────────────────────────
  {
    id: 'verb-scr-005',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Modifier',
    question:
      'Choose the best corrected version: "Running down the street, the rain began to pour heavily."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Running down the street, she was caught by the heavy rain.' },
      { id: 'b', text: 'As she was running down the street, the rain began to pour heavily.' },
      { id: 'c', text: 'Running down the street, the heavy rain began to pour.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The original has a dangling modifier: "Running down the street" modifies nothing (the rain cannot run). Option A is acceptable but option B, using the subordinate clause "As she was running…," is the clearest and most grammatically complete correction.',
    difficulty: 'medium',
    estimatedTime: 45,
    tags: ['sentence correction', 'dangling modifier', 'intermediate'],
    companyRelevance: ['Accenture', 'TCS', 'Infosys'],
  },
  {
    id: 'verb-scr-006',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Parallel Structure',
    question:
      'Choose the best corrected version: "The project manager is responsible for planning, to coordinate, and the implementation of tasks."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'The project manager is responsible for planning, coordinating, and implementing tasks.' },
      { id: 'b', text: 'The project manager is responsible for planning, to coordinate, and implement tasks.' },
      { id: 'c', text: 'The project manager is responsible to plan, coordinating, and implementing tasks.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'Parallel structure requires that all items in a list use the same grammatical form. The original mixes gerunds (planning) with an infinitive (to coordinate) and a noun phrase (the implementation). The correct version uses gerunds for all three items: planning, coordinating, and implementing.',
    difficulty: 'medium',
    estimatedTime: 45,
    tags: ['sentence correction', 'parallel structure', 'intermediate'],
    companyRelevance: ['TCS', 'Wipro', 'Cognizant'],
  },
  {
    id: 'verb-scr-007',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Comparative',
    question:
      'Choose the best corrected version: "She is more smarter than her sister when it comes to solving logical problems."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'She is more smart than her sister when it comes to solving logical problems.' },
      { id: 'b', text: 'She is smarter than her sister when it comes to solving logical problems.' },
      { id: 'c', text: 'She is much more smarter than her sister when it comes to solving logical problems.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'b',
    explanation:
      'For one-syllable adjectives and many two-syllable adjectives, use "-er" for comparatives, not "more." "Smarter" is the correct comparative of "smart." "More smarter" is a double comparative and is grammatically incorrect.',
    difficulty: 'medium',
    estimatedTime: 40,
    tags: ['sentence correction', 'comparative', 'adjective'],
    companyRelevance: ['Wipro', 'HCL', 'TCS'],
  },
  {
    id: 'verb-scr-008',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Article',
    question:
      'Choose the best corrected version: "He is a honest man who always keeps his word."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'He is the honest man who always keeps his word.' },
      { id: 'b', text: 'He is an honest man who always keeps his word.' },
      { id: 'c', text: 'He is honest man who always keeps his word.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'b',
    explanation:
      'The article "an" is used before words that begin with a vowel sound. "Honest" begins with a silent "h," making its first sound the vowel "o." Therefore, "an honest" is correct, not "a honest." This is the same rule as "an hour," "an heir," "an honor."',
    difficulty: 'medium',
    estimatedTime: 30,
    tags: ['sentence correction', 'article', 'phonetics'],
    companyRelevance: ['Accenture', 'Cognizant', 'TCS'],
  },

  // ─── HARD (2) ────────────────────────────────────────────────────────────────
  {
    id: 'verb-scr-009',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Complex Structures',
    question:
      'Choose the best corrected version: "Neither the director nor the producers was present at the press conference, which disappointed the reporters."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Neither the director nor the producers were present at the press conference, which disappointed the reporters.' },
      { id: 'b', text: 'Neither the director nor the producers was present in the press conference, which disappointed the reporters.' },
      { id: 'c', text: 'Neither the director nor the producers has been present at the press conference, which disappointed the reporters.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'With "neither…nor" constructions, the verb agrees with the subject closest to it (the proximity rule). Here, "the producers" (plural) is closest to the verb, so the verb must be plural: "were." The correct sentence is "Neither the director nor the producers were present."',
    difficulty: 'hard',
    estimatedTime: 60,
    tags: ['sentence correction', 'neither nor', 'subject-verb agreement', 'hard'],
    companyRelevance: ['Infosys', 'Accenture', 'Deloitte'],
  },
  {
    id: 'verb-scr-010',
    section: 'verbal',
    topic: 'Sentence Correction',
    subtopic: 'Complex Structures',
    question:
      'Choose the best corrected version: "Had I known about the meeting, I would attend it without fail."',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Had I known about the meeting, I would have attended it without fail.' },
      { id: 'b', text: 'If I had known about the meeting, I would attend it without fail.' },
      { id: 'c', text: 'Had I knew about the meeting, I would have attended it without fail.' },
      { id: 'd', text: 'No correction required.' },
    ],
    correctAnswer: 'a',
    explanation:
      'The sentence uses an inverted conditional (third conditional without "if"). The structure is: "Had + subject + past participle … would have + past participle." The original incorrectly uses "would attend" (simple) instead of "would have attended" (perfect). Option A correctly uses "would have attended."',
    difficulty: 'hard',
    estimatedTime: 65,
    tags: ['sentence correction', 'conditionals', 'third conditional', 'hard'],
    companyRelevance: ['TCS', 'Wipro', 'IBM'],
  },
];

export default questions;
