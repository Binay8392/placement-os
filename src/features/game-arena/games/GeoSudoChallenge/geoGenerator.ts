import { createRng, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion, VisualToken } from '../../types';

const symbols: VisualToken[] = [
  { shape: 'circle', color: 'primary', label: 'Circle' },
  { shape: 'triangle', color: 'success', label: 'Triangle' },
  { shape: 'square', color: 'warning', label: 'Square' },
  { shape: 'diamond', color: 'sky', label: 'Diamond' },
  { shape: 'hexagon', color: 'violet', label: 'Hexagon' },
  { shape: 'plus', color: 'destructive', label: 'Plus' },
];

const sizeByDifficulty: Record<Difficulty, number> = {
  beginner: 4,
  easy: 4,
  medium: 5,
  hard: 5,
  expert: 6,
};

const blanksByDifficulty: Record<Difficulty, number> = {
  beginner: 4,
  easy: 6,
  medium: 8,
  hard: 11,
  expert: 14,
};

const timeByDifficulty: Record<Difficulty, number> = {
  beginner: 70,
  easy: 75,
  medium: 85,
  hard: 95,
  expert: 110,
};

export interface GeoSudoMetadata {
  gridSize: number;
  symbols: VisualToken[];
  puzzle: Array<string | null>;
  solution: string[];
  blanks: number[];
}

export function generateGeoSudoQuestion(difficulty: Difficulty, seed: string): GameQuestion<GeoSudoMetadata> {
  const rng = createRng(seed);
  const gridSize = sizeByDifficulty[difficulty];
  const activeSymbols = shuffle(rng, symbols).slice(0, gridSize);
  const offset = randInt(rng, 0, gridSize - 1);
  const solution = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return activeSymbols[(row + col + offset) % gridSize].label || '';
  });
  const blankCount = blanksByDifficulty[difficulty];
  const blanks = shuffle(rng, Array.from({ length: gridSize * gridSize }, (_, index) => index)).slice(0, blankCount);
  const blankSet = new Set(blanks);
  const puzzle = solution.map((value, index) => (blankSet.has(index) ? null : value));

  return {
    id: uniqueId('geo', seed),
    gameId: 'geo-sudo',
    type: 'latin-shapes',
    kind: 'geo-sudo',
    difficulty,
    prompt: `${gridSize} x ${gridSize} Geo-Sudo`,
    instruction: 'Fill every blank so each row and column contains each symbol once.',
    correctAnswer: solution,
    explanation: 'Rows and columns follow a Latin-square rule: each symbol appears once per row and once per column.',
    timeLimit: timeByDifficulty[difficulty],
    metadata: { gridSize, symbols: activeSymbols, puzzle, solution, blanks },
  };
}
