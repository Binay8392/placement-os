import { createRng, pick, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion, VisualToken } from '../../types';

const shapes: VisualToken['shape'][] = ['circle', 'triangle', 'square', 'diamond', 'hexagon'];
const colors: VisualToken['color'][] = ['primary', 'success', 'warning', 'sky', 'violet'];
const rotations = [0, 45, 90, 135, 180, 225, 270, 315];

export interface InductiveMetadata {
  sequence: VisualToken[];
  rule: string;
}

export function generateInductiveQuestion(difficulty: Difficulty, seed: string): GameQuestion<InductiveMetadata> {
  const rng = createRng(seed);
  const ruleType = pick(rng, ['rotation', 'shape', 'color', 'count'] as const);
  const length = difficulty === 'beginner' ? 3 : 4;
  const startShapeIndex = randInt(rng, 0, shapes.length - 1);
  const startColorIndex = randInt(rng, 0, colors.length - 1);
  const rotationStep = difficulty === 'expert' ? 90 : pick(rng, [45, 90]);
  const countStep = difficulty === 'hard' || difficulty === 'expert' ? 2 : 1;

  const makeToken = (index: number): VisualToken => {
    const shape = ruleType === 'shape' ? shapes[(startShapeIndex + index) % shapes.length] : shapes[startShapeIndex];
    const color = ruleType === 'color' ? colors[(startColorIndex + index) % colors.length] : colors[startColorIndex];
    const rotation = ruleType === 'rotation' ? rotations[((index * rotationStep) / 45) % rotations.length] : 0;
    const count = ruleType === 'count' ? 1 + ((index * countStep) % 4) : 1;
    return { shape, color, rotation, count, label: `${shape}-${color}-${rotation}-${count}` };
  };
  const tokenValue = (token: VisualToken) => `${token.shape}-${token.color}-${token.rotation || 0}-${token.count || 1}`;

  const sequence = Array.from({ length }, (_, index) => makeToken(index));
  const answerToken = makeToken(length);
  const options = shuffle(
    rng,
    [
      answerToken,
      makeToken(length + 1),
      { ...answerToken, color: pick(rng, colors.filter((color) => color !== answerToken.color)) },
      { ...answerToken, shape: pick(rng, shapes.filter((shape) => shape !== answerToken.shape)) },
    ],
  ).map((token, index) => ({
    id: `inductive-${index}`,
    label: `Option ${index + 1}`,
    value: tokenValue(token),
    token: { ...token, label: `Option ${index + 1}` },
  }));

  const correctValue = tokenValue(answerToken);
  const ruleText = {
    rotation: `The symbol rotates by ${rotationStep} degrees each step.`,
    shape: 'The shape advances one position in the shape cycle.',
    color: 'The color advances one position in the color cycle.',
    count: `The number of marks increases by ${countStep} with wraparound.`,
  }[ruleType];

  return {
    id: uniqueId('inductive', seed),
    gameId: 'inductive',
    type: ruleType,
    kind: 'multiple-choice',
    difficulty,
    prompt: 'Which visual state comes next?',
    instruction: 'Infer the rule from the examples.',
    options,
    correctAnswer: correctValue,
    explanation: ruleText,
    timeLimit: difficulty === 'expert' ? 30 : difficulty === 'hard' ? 32 : 36,
    metadata: { sequence, rule: ruleText },
  };
}
