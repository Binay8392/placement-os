import type { GameQuestion } from '../../types';

export function isDigitAnswerCorrect(question: GameQuestion, answer: string) {
  return String(question.correctAnswer) === answer;
}
