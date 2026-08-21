import { createRng, pick, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion, VisualToken } from '../../types';

const shapes: VisualToken['shape'][] = ['circle', 'triangle', 'square', 'diamond', 'hexagon', 'plus'];
const colors: VisualToken['color'][] = ['primary', 'success', 'warning', 'sky', 'violet', 'destructive'];

export interface PatternMetadata {
  matrix: Array<VisualToken | null>;
  rule: string;
}

export function generatePatternQuestion(difficulty: Difficulty, seed: string): GameQuestion<PatternMetadata> {
  const rng = createRng(seed);
  const mode = pick(rng, ['shape-matrix', 'color-matrix', 'number-sequence'] as const);

  if (mode === 'number-sequence') {
    const start = randInt(rng, 3, 14);
    const stepA = randInt(rng, 2, difficulty === 'expert' ? 8 : 5);
    const stepB = difficulty === 'beginner' || difficulty === 'easy' ? stepA : stepA + randInt(rng, 1, 4);
    const values = [start, start + stepA, start + stepA + stepB, start + stepA * 2 + stepB];
    const answer = values[3] + stepB;
    const options = shuffle(rng, [answer, answer + stepA, answer - stepA, answer + stepB + 2]).map((value, index) => ({
      id: `pattern-number-${index}`,
      label: value.toString(),
      value: value.toString(),
    }));

    return {
      id: uniqueId('pattern', seed),
      gameId: 'pattern',
      type: mode,
      kind: 'multiple-choice',
      difficulty,
      prompt: `${values.join('  ')}  ?`,
      instruction: 'Continue the alternating number pattern.',
      options,
      correctAnswer: answer.toString(),
      explanation: `The sequence alternates between +${stepA} and +${stepB}.`,
      timeLimit: difficulty === 'expert' ? 32 : 38,
      metadata: { matrix: [], rule: 'alternating number increments' },
    };
  }

  const shapeOffset = randInt(rng, 0, shapes.length - 1);
  const colorOffset = randInt(rng, 0, colors.length - 1);
  const matrix = Array.from({ length: 9 }, (_, index): VisualToken | null => {
    if (index === 8) return null;
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      shape: mode === 'shape-matrix' ? shapes[(shapeOffset + row + col) % shapes.length] : shapes[shapeOffset],
      color: mode === 'color-matrix' ? colors[(colorOffset + row + col) % colors.length] : colors[colorOffset],
      rotation: (row + col) * 45,
      count: 1,
      label: `cell-${index}`,
    };
  });

  const answerToken: VisualToken = {
    shape: mode === 'shape-matrix' ? shapes[(shapeOffset + 4) % shapes.length] : shapes[shapeOffset],
    color: mode === 'color-matrix' ? colors[(colorOffset + 4) % colors.length] : colors[colorOffset],
    rotation: 180,
    count: 1,
    label: 'answer',
  };
  const options = shuffle(rng, [
    answerToken,
    { ...answerToken, shape: pick(rng, shapes.filter((shape) => shape !== answerToken.shape)) },
    { ...answerToken, color: pick(rng, colors.filter((color) => color !== answerToken.color)) },
    { ...answerToken, rotation: 90 },
  ]).map((token, index) => ({
    id: `pattern-${index}`,
    label: `Option ${index + 1}`,
    value: `${token.shape}-${token.color}-${token.rotation}`,
    token,
  }));
  const correctAnswer = `${answerToken.shape}-${answerToken.color}-${answerToken.rotation}`;

  return {
    id: uniqueId('pattern', seed),
    gameId: 'pattern',
    type: mode,
    kind: 'multiple-choice',
    difficulty,
    prompt: 'Complete the missing matrix cell.',
    instruction: 'Read rows and columns together, then choose the missing symbol.',
    options,
    correctAnswer,
    explanation:
      mode === 'shape-matrix'
        ? 'Shapes advance by one step across each row and column.'
        : 'Colors advance by one step across each row and column.',
    timeLimit: difficulty === 'expert' ? 32 : difficulty === 'hard' ? 35 : 38,
    metadata: {
      matrix,
      rule: mode === 'shape-matrix' ? 'shape progression matrix' : 'color progression matrix',
    },
  };
}
