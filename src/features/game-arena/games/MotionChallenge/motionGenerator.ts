import { createRng, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion } from '../../types';
import { findShortestPath, type MotionMove } from './motionSolver';

const gridSizeByDifficulty: Record<Difficulty, number> = {
  beginner: 4,
  easy: 5,
  medium: 5,
  hard: 6,
  expert: 7,
};

const obstacleRatioByDifficulty: Record<Difficulty, number> = {
  beginner: 0.08,
  easy: 0.12,
  medium: 0.16,
  hard: 0.2,
  expert: 0.23,
};

export interface MotionMetadata {
  gridSize: number;
  start: number;
  target: number;
  obstacles: number[];
  optimalPath: MotionMove[];
  maxMoves: number;
}

export function generateMotionQuestion(difficulty: Difficulty, seed: string): GameQuestion<MotionMetadata> {
  const rng = createRng(seed);
  const gridSize = gridSizeByDifficulty[difficulty];
  const totalCells = gridSize * gridSize;
  const start = 0;
  const target = totalCells - 1;
  const obstacleCount = Math.floor(totalCells * obstacleRatioByDifficulty[difficulty]);
  let obstacles: number[] = [];
  let optimalPath: MotionMove[] | null = null;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    obstacles = shuffle(
      rng,
      Array.from({ length: totalCells }, (_, index) => index).filter((index) => index !== start && index !== target),
    ).slice(0, obstacleCount);
    optimalPath = findShortestPath({ gridSize, start, target, obstacles });
    if (optimalPath && optimalPath.length >= gridSize) break;
  }

  if (!optimalPath) {
    obstacles = [];
    optimalPath = findShortestPath({ gridSize, start, target, obstacles }) || [];
  }

  const maxMoves = optimalPath.length + randInt(rng, difficulty === 'expert' ? 1 : 2, difficulty === 'beginner' ? 6 : 4);

  return {
    id: uniqueId('motion', seed),
    gameId: 'motion',
    type: 'path-planning',
    kind: 'motion-path',
    difficulty,
    prompt: 'Guide the marker to the target.',
    instruction: 'Use the shortest reliable path. Obstacles block movement.',
    correctAnswer: optimalPath,
    explanation: `One optimal route uses ${optimalPath.length} moves: ${optimalPath.join(', ')}.`,
    timeLimit: difficulty === 'expert' ? 55 : difficulty === 'hard' ? 60 : 65,
    metadata: { gridSize, start, target, obstacles, optimalPath, maxMoves },
  };
}
