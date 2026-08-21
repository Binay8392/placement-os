import type { AssessmentConfig, Difficulty, GameConfig, GameId, ScoringWeights } from './types';

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Beginner',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export const difficultyScore: Record<Difficulty, number> = {
  beginner: 45,
  easy: 60,
  medium: 75,
  hard: 88,
  expert: 100,
};

export const difficultyStep: Record<Difficulty, number> = {
  beginner: 0,
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
};

export const stepDifficulty: Difficulty[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

export const defaultScoringWeights: ScoringWeights = {
  accuracy: 0.5,
  speed: 0.2,
  difficulty: 0.2,
  efficiency: 0.1,
};

export const defaultGameConfigs: Record<GameId, GameConfig> = {
  digit: {
    id: 'digit',
    name: 'Digit Challenge',
    description: 'Number logic and rapid calculation.',
    difficulty: 'medium',
    timeLimit: 30,
    questionCount: 10,
    enabled: true,
  },
  'geo-sudo': {
    id: 'geo-sudo',
    name: 'Geo-Sudo Challenge',
    description: 'Shape based deduction on compact logic grids.',
    difficulty: 'medium',
    timeLimit: 75,
    questionCount: 5,
    enabled: true,
  },
  grid: {
    id: 'grid',
    name: 'Grid Challenge',
    description: 'Visual memory under timed recall.',
    difficulty: 'medium',
    timeLimit: 24,
    questionCount: 8,
    enabled: true,
  },
  motion: {
    id: 'motion',
    name: 'Motion Challenge',
    description: 'Spatial planning through obstacle maps.',
    difficulty: 'medium',
    timeLimit: 60,
    questionCount: 6,
    enabled: true,
  },
  oddo: {
    id: 'oddo',
    name: 'Oddo Challenge',
    description: 'Identify the item that violates the hidden rule.',
    difficulty: 'medium',
    timeLimit: 28,
    questionCount: 10,
    enabled: true,
  },
  switch: {
    id: 'switch',
    name: 'Switch Challenge',
    description: 'Apply chained symbol transformations.',
    difficulty: 'medium',
    timeLimit: 40,
    questionCount: 10,
    enabled: true,
  },
  inductive: {
    id: 'inductive',
    name: 'Inductive Challenge',
    description: 'Infer the next visual state from examples.',
    difficulty: 'medium',
    timeLimit: 36,
    questionCount: 10,
    enabled: true,
  },
  pattern: {
    id: 'pattern',
    name: 'Pattern Challenge',
    description: 'Mixed number, shape, matrix, and sequence logic.',
    difficulty: 'medium',
    timeLimit: 38,
    questionCount: 10,
    enabled: true,
  },
};

export const defaultAssessmentConfig: AssessmentConfig = {
  configId: 'default-preptrack-simulation',
  name: 'PrepTrack General Cognitive Simulation',
  totalGames: 4,
  totalTimeMinutes: 24,
  showInstructions: true,
  randomizeGames: true,
  allowPause: false,
  allowRestart: false,
  showAnswersDuringTest: false,
  fullscreenRecommended: true,
  adaptiveDifficulty: true,
  gameOrder: ['digit', 'grid', 'motion', 'switch', 'geo-sudo', 'oddo', 'inductive', 'pattern'],
  gameConfigs: defaultGameConfigs,
  scoringWeights: defaultScoringWeights,
};

export const practiceModes = [
  { id: 'quick', label: 'Quick Practice', questionCount: 5, timed: false },
  { id: 'standard', label: 'Standard Practice', questionCount: 15, timed: false },
  { id: 'intensive', label: 'Intensive Practice', questionCount: 30, timed: false },
  { id: 'timed', label: 'Timed Practice', questionCount: 10, timed: true },
  { id: 'unlimited', label: 'Unlimited', questionCount: 999, timed: false },
] as const;

export const mockProfiles = [
  {
    id: 'quick-mock',
    label: 'Quick Mock',
    minutes: 10,
    games: 2,
    difficulty: 'easy' as Difficulty,
  },
  {
    id: 'standard-mock',
    label: 'Standard Mock',
    minutes: 20,
    games: 4,
    difficulty: 'medium' as Difficulty,
  },
  {
    id: 'full-simulation',
    label: 'Full Simulation',
    minutes: 24,
    games: 4,
    difficulty: 'hard' as Difficulty,
  },
  {
    id: 'company-simulation',
    label: 'Capgemini-Style PrepTrack Simulation',
    minutes: 24,
    games: 4,
    difficulty: 'medium' as Difficulty,
  },
] as const;
