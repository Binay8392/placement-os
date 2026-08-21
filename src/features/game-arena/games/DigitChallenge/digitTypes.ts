import type { GameQuestion } from '../../types';

export type DigitQuestionType = 'sequence' | 'transform' | 'comparison' | 'hidden-rule';

export interface DigitMetadata {
  values?: number[];
  examples?: Array<{ input: number; output: number }>;
  rule: string;
}

export type DigitQuestion = GameQuestion<DigitMetadata>;
