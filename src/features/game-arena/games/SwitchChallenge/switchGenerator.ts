import { createRng, pick, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion, VisualToken } from '../../types';

const symbolPool: VisualToken[] = [
  { shape: 'circle', color: 'primary', label: 'A' },
  { shape: 'triangle', color: 'success', label: 'B' },
  { shape: 'square', color: 'warning', label: 'C' },
  { shape: 'diamond', color: 'sky', label: 'D' },
  { shape: 'hexagon', color: 'violet', label: 'E' },
  { shape: 'plus', color: 'destructive', label: 'F' },
];

const stepsByDifficulty: Record<Difficulty, number> = {
  beginner: 1,
  easy: 2,
  medium: 3,
  hard: 4,
  expert: 5,
};

export interface SwitchMetadata {
  rules: Array<{ from: VisualToken; to: VisualToken }>;
  start: VisualToken;
  steps: number;
  sequence: VisualToken[];
}

export function generateSwitchQuestion(difficulty: Difficulty, seed: string): GameQuestion<SwitchMetadata> {
  const rng = createRng(seed);
  const activeCount = difficulty === 'expert' ? 6 : difficulty === 'hard' ? 5 : 4;
  const activeSymbols = shuffle(rng, symbolPool).slice(0, activeCount);
  const shifted = [...activeSymbols.slice(1), activeSymbols[0]];
  const rules = activeSymbols.map((from, index) => ({ from, to: shifted[index] }));
  const start = pick(rng, activeSymbols);
  const steps = stepsByDifficulty[difficulty];
  const sequence = [start];
  let current = start;

  for (let i = 0; i < steps; i += 1) {
    current = rules.find((rule) => rule.from.label === current.label)?.to || current;
    sequence.push(current);
  }

  const answer = current.label || '';
  const distractors = shuffle(rng, activeSymbols.filter((symbol) => symbol.label !== answer)).slice(0, 3);
  const options = shuffle(rng, [current, ...distractors]).map((token, index) => ({
    id: `switch-${index}`,
    label: token.label || '',
    value: token.label || '',
    token,
  }));

  return {
    id: uniqueId('switch', seed),
    gameId: 'switch',
    type: 'symbol-transform',
    kind: 'multiple-choice',
    difficulty,
    prompt: `Start at ${start.label}. Apply the switch rule ${steps} ${steps === 1 ? 'time' : 'times'}.`,
    instruction: 'Follow the transformation chain and choose the final symbol.',
    options,
    correctAnswer: answer,
    explanation: `The transformation path is ${sequence.map((item) => item.label).join(' -> ')}.`,
    timeLimit: difficulty === 'expert' ? 34 : difficulty === 'hard' ? 36 : 40,
    metadata: { rules, start, steps, sequence },
  };
}
