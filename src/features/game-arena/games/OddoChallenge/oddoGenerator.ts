import { createRng, pick, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty, GameQuestion, VisualToken } from '../../types';

const itemCountByDifficulty: Record<Difficulty, number> = {
  beginner: 6,
  easy: 8,
  medium: 10,
  hard: 12,
  expert: 14,
};

const shapes: VisualToken['shape'][] = ['circle', 'triangle', 'square', 'diamond', 'hexagon', 'plus'];
const colors: VisualToken['color'][] = ['primary', 'success', 'warning', 'sky', 'violet', 'destructive'];

export interface OddoMetadata {
  items: VisualToken[];
  rule: string;
  correctIndex: number;
}

export function generateOddoQuestion(difficulty: Difficulty, seed: string): GameQuestion<OddoMetadata> {
  const rng = createRng(seed);
  const count = itemCountByDifficulty[difficulty];
  const ruleType = pick(rng, ['shape', 'color', 'rotation', 'count'] as const);
  const correctIndex = randInt(rng, 0, count - 1);
  const baseShape = pick(rng, shapes);
  const oddShape = pick(rng, shapes.filter((shape) => shape !== baseShape));
  const baseColor = pick(rng, colors);
  const oddColor = pick(rng, colors.filter((color) => color !== baseColor));
  const baseRotation = pick(rng, [0, 90, 180, 270]);
  const oddRotation = pick(rng, [0, 90, 180, 270].filter((rotation) => rotation !== baseRotation));
  const baseCount = randInt(rng, 1, difficulty === 'beginner' ? 1 : 3);
  const oddCount = baseCount === 3 ? 1 : baseCount + 1;

  const items = Array.from({ length: count }, (_, index): VisualToken & { originalIndex: number } => ({
    shape: ruleType === 'shape' && index === correctIndex ? oddShape : baseShape,
    color: ruleType === 'color' && index === correctIndex ? oddColor : baseColor,
    rotation: ruleType === 'rotation' && index === correctIndex ? oddRotation : baseRotation,
    count: ruleType === 'count' && index === correctIndex ? oddCount : baseCount,
    label: `Item ${index + 1}`,
    originalIndex: index,
  }));
  const shuffledItems = shuffle(rng, items);
  const shuffledCorrectIndex = shuffledItems.findIndex((item) => item.originalIndex === correctIndex);

  const ruleLabel = {
    shape: 'All items share the same shape except one.',
    color: 'All items share the same color family except one.',
    rotation: 'All items point in the same direction except one.',
    count: 'All items repeat the same number of marks except one.',
  }[ruleType];

  return {
    id: uniqueId('oddo', seed),
    gameId: 'oddo',
    type: ruleType,
    kind: 'oddo-grid',
    difficulty,
    prompt: 'Find the odd item.',
    instruction: 'Most items follow one rule. Tap the item that violates it.',
    correctAnswer: shuffledCorrectIndex.toString(),
    explanation: ruleLabel,
    timeLimit: difficulty === 'expert' ? 24 : difficulty === 'hard' ? 26 : 30,
    metadata: {
      items: shuffledItems.map(({ originalIndex: _originalIndex, ...item }, index) => ({ ...item, label: `Item ${index + 1}` })),
      rule: ruleLabel,
      correctIndex: shuffledCorrectIndex,
    },
  };
}
