import type { ReactNode } from 'react';
import type { Difficulty, GameConfig, GameMode, GameResult, ScoringWeights } from '../types';

export interface ChallengeProps {
  config: GameConfig;
  mode: GameMode;
  questionCount?: number;
  difficulty?: Difficulty;
  adaptive?: boolean;
  showExplanations?: boolean;
  scoringWeights?: ScoringWeights;
  sessionId?: string;
  userId?: string;
  sessionSeed?: string;
  compact?: boolean;
  overallSlot?: ReactNode;
  onComplete: (result: GameResult) => void;
  onAbort?: (result: GameResult | null) => void;
}
