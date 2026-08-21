import { createRng, pick, randInt, shuffle, uniqueId } from '../../rng';
import type { Difficulty } from '../../types';
import type { DigitQuestion } from './digitTypes';

const timeByDifficulty: Record<Difficulty, number> = {
  beginner: 32,
  easy: 30,
  medium: 28,
  hard: 26,
  expert: 24,
};

function numericOptions(rng: () => number, answer: number, spread = 12) {
  const values = new Set<number>([answer]);
  while (values.size < 4) {
    const offset = randInt(rng, -spread, spread);
    if (offset !== 0) values.add(answer + offset);
  }
  return shuffle(rng, [...values]).map((value, index) => ({
    id: `option-${index}`,
    label: value.toString(),
    value: value.toString(),
  }));
}

export function generateDigitQuestion(difficulty: Difficulty, seed: string): DigitQuestion {
  const rng = createRng(seed);
  const type =
    difficulty === 'beginner'
      ? 'sequence'
      : pick(rng, ['sequence', 'transform', 'comparison', 'hidden-rule'] as const);

  if (type === 'sequence') {
    const start = randInt(rng, 2, difficulty === 'expert' ? 35 : 18);
    const delta = randInt(rng, 2, difficulty === 'beginner' ? 7 : 12);
    const multiplier = difficulty === 'hard' || difficulty === 'expert' ? randInt(rng, 2, 3) : 1;
    const values = [0, 1, 2, 3].map((index) => start + delta * index * multiplier);
    const answer = start + delta * 4 * multiplier;
    return {
      id: uniqueId('digit', seed),
      gameId: 'digit',
      type,
      kind: 'multiple-choice',
      difficulty,
      prompt: `${values.join('  ')}  ?`,
      instruction: 'Find the next number in the sequence.',
      options: numericOptions(rng, answer, delta * 4 + 8),
      correctAnswer: answer.toString(),
      explanation: `The pattern increases by ${delta * multiplier} at every step.`,
      timeLimit: timeByDifficulty[difficulty],
      metadata: { values, rule: `+${delta * multiplier}` },
    };
  }

  if (type === 'transform') {
    const multiplier = randInt(rng, difficulty === 'easy' ? 2 : 3, difficulty === 'expert' ? 7 : 5);
    const add = randInt(rng, difficulty === 'easy' ? 1 : 3, difficulty === 'expert' ? 18 : 11);
    const inputs = [randInt(rng, 6, 18), randInt(rng, 19, 35), randInt(rng, 36, 54)];
    const examples = inputs.slice(0, 2).map((input) => ({ input, output: input * multiplier + add }));
    const target = inputs[2];
    const answer = target * multiplier + add;
    return {
      id: uniqueId('digit', seed),
      gameId: 'digit',
      type,
      kind: 'multiple-choice',
      difficulty,
      prompt: `${examples.map((example) => `${example.input} -> ${example.output}`).join('    ')}    ${target} -> ?`,
      instruction: 'Apply the same transformation to the final number.',
      options: numericOptions(rng, answer, multiplier * 10),
      correctAnswer: answer.toString(),
      explanation: `Each input is multiplied by ${multiplier} and then increased by ${add}.`,
      timeLimit: timeByDifficulty[difficulty],
      metadata: { examples, rule: `x${multiplier}+${add}` },
    };
  }

  if (type === 'comparison') {
    const a = randInt(rng, 6, 24);
    const b = randInt(rng, 3, 16);
    const c = randInt(rng, 2, 9);
    const answer = difficulty === 'expert' ? a * b - c * c : a * b + c;
    return {
      id: uniqueId('digit', seed),
      gameId: 'digit',
      type,
      kind: 'multiple-choice',
      difficulty,
      prompt: `${a} x ${b} ${difficulty === 'expert' ? `- ${c}^2` : `+ ${c}`} = ?`,
      instruction: 'Solve the expression quickly and accurately.',
      options: numericOptions(rng, answer, 20),
      correctAnswer: answer.toString(),
      explanation:
        difficulty === 'expert'
          ? `Calculate ${a} x ${b}, then subtract ${c} squared.`
          : `Calculate ${a} x ${b}, then add ${c}.`,
      timeLimit: timeByDifficulty[difficulty],
      metadata: { values: [a, b, c], rule: 'comparison arithmetic' },
    };
  }

  const left = randInt(rng, 12, 89);
  const digitSum = Math.floor(left / 10) + (left % 10);
  const factor = difficulty === 'hard' || difficulty === 'expert' ? randInt(rng, 3, 5) : 2;
  const answer = digitSum * factor + (difficulty === 'expert' ? left % 10 : 0);
  const exampleInput = left + randInt(rng, 3, 9);
  const exampleSum = Math.floor(exampleInput / 10) + (exampleInput % 10);
  const exampleOutput = exampleSum * factor + (difficulty === 'expert' ? exampleInput % 10 : 0);

  return {
    id: uniqueId('digit', seed),
    gameId: 'digit',
    type,
    kind: 'multiple-choice',
    difficulty,
    prompt: `${exampleInput} -> ${exampleOutput}    ${left} -> ?`,
    instruction: 'Infer the hidden digit rule.',
    options: numericOptions(rng, answer, 16),
    correctAnswer: answer.toString(),
    explanation:
      difficulty === 'expert'
        ? `Add the digits, multiply by ${factor}, then add the ones digit.`
        : `Add the digits and multiply the sum by ${factor}.`,
    timeLimit: timeByDifficulty[difficulty],
    metadata: { examples: [{ input: exampleInput, output: exampleOutput }], rule: 'digit sum transform' },
  };
}
