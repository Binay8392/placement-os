import type { LucideIcon } from 'lucide-react';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTIES: Difficulty[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

export type GameId =
  | 'digit'
  | 'geo-sudo'
  | 'grid'
  | 'motion'
  | 'oddo'
  | 'switch'
  | 'inductive'
  | 'pattern';

export type GameMode = 'quick' | 'standard' | 'intensive' | 'timed' | 'unlimited' | 'assessment';

export type QuestionKind =
  | 'multiple-choice'
  | 'grid-memory'
  | 'geo-sudo'
  | 'motion-path'
  | 'oddo-grid';

export interface AnswerOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  token?: VisualToken;
}

export interface VisualToken {
  shape: 'circle' | 'triangle' | 'square' | 'diamond' | 'hexagon' | 'plus' | 'bar';
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'sky' | 'violet' | 'slate';
  label?: string;
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
}

export interface GameQuestion<TMetadata = Record<string, unknown>> {
  id: string;
  gameId: GameId;
  type: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  prompt: string;
  instruction: string;
  options?: AnswerOption[];
  correctAnswer: string | string[];
  explanation: string;
  timeLimit: number;
  metadata: TMetadata;
}

export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  difficulty: Difficulty;
  timeLimit: number;
  questionCount: number;
  enabled: boolean;
}

export interface ScoringWeights {
  accuracy: number;
  speed: number;
  difficulty: number;
  efficiency: number;
}

export interface ScoringBreakdown {
  accuracyScore: number;
  speedScore: number;
  difficultyScore: number;
  efficiencyScore: number;
  finalScore: number;
  grade: string;
}

export interface AnswerRecord {
  questionId: string;
  gameId: GameId;
  difficulty: Difficulty;
  answer: string | string[] | null;
  correctAnswer: string | string[];
  isCorrect: boolean;
  skipped: boolean;
  responseTime: number;
  efficiency: number;
  explanation: string;
}

export interface GameResult {
  attemptId: string;
  sessionId?: string;
  userId?: string;
  gameId: GameId;
  difficulty: Difficulty;
  mode: GameMode;
  score: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  skipped: number;
  totalQuestions: number;
  totalTime: number;
  averageResponseTime: number;
  scoring: ScoringBreakdown;
  answers: AnswerRecord[];
  completedAt: string;
}

export interface AssessmentConfig {
  configId: string;
  name: string;
  totalGames: number;
  totalTimeMinutes: number;
  showInstructions: boolean;
  randomizeGames: boolean;
  allowPause: boolean;
  allowRestart: boolean;
  showAnswersDuringTest: boolean;
  fullscreenRecommended: boolean;
  adaptiveDifficulty: boolean;
  gameOrder: GameId[];
  gameConfigs: Record<GameId, GameConfig>;
  scoringWeights: ScoringWeights;
}

export type AssessmentSessionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'expired'
  | 'abandoned';

export interface AssessmentSession {
  sessionId: string;
  userId?: string;
  mode: 'quick-mock' | 'standard-mock' | 'full-simulation' | 'custom' | 'company-simulation';
  profileName: string;
  games: GameId[];
  currentGameIndex: number;
  currentQuestionIndex: number;
  startedAt: string;
  expiresAt: string;
  completedAt?: string;
  status: AssessmentSessionStatus;
  results: GameResult[];
  overallScore?: number;
}

export interface GameDefinition {
  id: GameId;
  name: string;
  shortName: string;
  route: string;
  description: string;
  purpose: string;
  icon: LucideIcon;
  accent: 'primary' | 'success' | 'warning' | 'destructive' | 'sky' | 'violet' | 'slate';
}

export interface GameStatsSummary {
  attempts: number;
  bestScore: number;
  accuracy: number;
  averageTime: number;
  completed: number;
  lastPlayed?: string;
}

export interface ArenaStats {
  overallScore: number;
  gamesCompleted: number;
  currentStreak: number;
  bestScore: number;
  averageAccuracy: number;
  averageResponseTime: number;
  readiness: number;
  totalXp: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QuestionGenerator = (difficulty: Difficulty, seed: string) => GameQuestion<any>;
