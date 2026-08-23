export type AptitudeSection = 'quantitative' | 'logical' | 'verbal';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType =
  | 'mcq'
  | 'true-false'
  | 'multi-select'
  | 'passage'
  | 'data-interpretation'
  | 'puzzle'
  | 'arrangement';

export interface AnswerOption {
  id: string;
  text: string;
}

export interface AptitudeQuestion {
  id: string;
  section: AptitudeSection;
  topic: string;
  subtopic?: string;
  passage?: string;
  question: string;
  type: QuestionType;
  options: AnswerOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  estimatedTime: number;
  tags: string[];
  companyRelevance: string[];
}

export interface QuestionSnapshot {
  id: string;
  section: AptitudeSection;
  topic: string;
  question: string;
  passage?: string;
  options: AnswerOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface AptitudeAnswer {
  questionId: string;
  section: AptitudeSection;
  topic: string;
  difficulty: Difficulty;
  selected: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  skipped: boolean;
  marked: boolean;
  timeSpent: number;
}

export type PracticeMode = 'practice' | 'timed' | 'mock' | 'company' | 'daily' | 'smart' | 'review';

export interface AptitudeAttempt {
  attemptId: string;
  userId?: string;
  mode: PracticeMode;
  label: string;
  section?: AptitudeSection;
  topic?: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  score: number;
  timeTaken: number;
  averageTime: number;
  answers: AptitudeAnswer[];
  questions: QuestionSnapshot[];
  completedAt: string;
}

export interface TopicProgress {
  attempted: number;
  correct: number;
  totalTime: number;
  lastPracticed: string | null;
  recent: boolean[];
}

export interface AptitudeProgressState {
  topics: Record<string, TopicProgress>;
  bookmarks: QuestionSnapshot[];
  wrongAnswers: (QuestionSnapshot & { selected: string | null; recordedAt: string })[];
  attempts: AptitudeAttempt[];
  practiceDates: string[];
  dailyChallenge: Record<string, { score: number; accuracy: number; completedAt: string }>;
}

export interface TopicMeta {
  id: string;
  section: AptitudeSection;
  name: string;
  order: number;
  difficulty: Difficulty;
  questionCount: number;
  tags: string[];
  companyRelevance: string[];
}

export interface WorkedExample {
  question: string;
  solution: string;
}

export interface LearnContent {
  concept: string;
  formulas: string[];
  shortcuts: string[];
  mistakes: string[];
  strategy: string[];
  examples: WorkedExample[];
  tips: string[];
}

export interface ActiveSessionConfig {
  mode: PracticeMode;
  label: string;
  section?: AptitudeSection;
  topic?: string;
  topics?: string[];
  difficulty?: Difficulty | 'mixed';
  count: number;
  timeLimitMinutes?: number;
  revealAnswers: boolean;
  company?: string;
}
