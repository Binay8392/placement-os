import { createRng, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion } from '../../types';

const gridSizeByDifficulty: Record<Difficulty, number> = {
  beginner: 4,
  easy: 5,
  medium: 5,
  hard: 6,
  expert: 6,
};

const cellsByDifficulty: Record<Difficulty, number> = {
  beginner: 3,
  easy: 5,
  medium: 7,
  hard: 10,
  expert: 12,
};

const exposureByDifficulty: Record<Difficulty, number> = {
  beginner: 2400,
  easy: 2100,
  medium: 1700,
  hard: 1300,
  expert: 1000,
};

export interface GridMemoryMetadata {
  gridSize: number;
  highlightedCells: string[];
  exposureMs: number;
}

export function generateGridQuestion(difficulty: Difficulty, seed: string): GameQuestion<GridMemoryMetadata> {
  const rng = createRng(seed);
  const gridSize = gridSizeByDifficulty[difficulty];
  const count = cellsByDifficulty[difficulty];
  const highlightedCells = shuffle(
    rng,
    Array.from({ length: gridSize * gridSize }, (_, index) => index.toString()),
  ).slice(0, count).sort((a, b) => Number(a) - Number(b));

  return {
    id: uniqueId('grid', seed),
    gameId: 'grid',
    type: 'cell-recall',
    kind: 'grid-memory',
    difficulty,
    prompt: 'Memorize the highlighted cells.',
    instruction: 'After the pattern hides, select all cells that were highlighted.',
    correctAnswer: highlightedCells,
    explanation: `The highlighted cells were ${highlightedCells.length} positions in the grid.`,
    timeLimit: Math.max(18, Math.round(exposureByDifficulty[difficulty] / 1000) + 18),
    metadata: {
      gridSize,
      highlightedCells,
      exposureMs: exposureByDifficulty[difficulty],
    },
  };
}
