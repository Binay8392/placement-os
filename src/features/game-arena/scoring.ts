import {
  defaultScoringWeights,
  difficultyScore,
  difficultyStep,
  stepDifficulty,
} from './config';
import type {
  AnswerRecord,
  Difficulty,
  GameId,
  GameMode,
  GameQuestion,
  GameResult,
  ScoringWeights,
} from './types';

const expectedResponseByDifficulty: Record<Difficulty, number> = {
  beginner: 10,
  easy: 8,
  medium: 6,
  hard: 5,
  expert: 4,
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function getGrade(score: number) {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export function calculateGameResult({
  answers,
  gameId,
  difficulty,
  mode,
  startedAt,
  completedAt,
  weights = defaultScoringWeights,
  sessionId,
  userId,
}: {
  answers: AnswerRecord[];
  gameId: GameId;
  difficulty: Difficulty;
  mode: GameMode;
  startedAt: number;
  completedAt: number;
  weights?: ScoringWeights;
  sessionId?: string;
  userId?: string;
}): GameResult {
  const totalQuestions = Math.max(answers.length, 1);
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const skipped = answers.filter((answer) => answer.skipped).length;
  const incorrect = Math.max(0, totalQuestions - correct - skipped);
  const accuracyScore = Math.round((correct / totalQuestions) * 100);
  const averageResponseTime =
    answers.reduce((total, answer) => total + answer.responseTime, 0) / totalQuestions / 1000;
  const expectedResponse = expectedResponseByDifficulty[difficulty];
  const speedScore = clamp(
    Math.round(100 - Math.max(0, averageResponseTime - expectedResponse) * (42 / expectedResponse)),
  );
  const difficultyScoreValue = difficultyScore[difficulty];
  const efficiencyScore = clamp(
    Math.round((answers.reduce((total, answer) => total + answer.efficiency, 0) / totalQuestions) * 100),
  );
  const finalScore = clamp(
    Math.round(
      accuracyScore * weights.accuracy +
      speedScore * weights.speed +
      difficultyScoreValue * weights.difficulty +
      efficiencyScore * weights.efficiency,
    ),
  );

  return {
    attemptId: `${gameId}-${completedAt.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    sessionId,
    userId,
    gameId,
    difficulty,
    mode,
    score: finalScore,
    accuracy: accuracyScore,
    correct,
    incorrect,
    skipped,
    totalQuestions,
    totalTime: Math.round((completedAt - startedAt) / 1000),
    averageResponseTime: Number(averageResponseTime.toFixed(1)),
    scoring: {
      accuracyScore,
      speedScore,
      difficultyScore: difficultyScoreValue,
      efficiencyScore,
      finalScore,
      grade: getGrade(finalScore),
    },
    answers,
    completedAt: new Date(completedAt).toISOString(),
  };
}

export function normalizeAnswer(answer: string | string[] | null) {
  if (Array.isArray(answer)) return answer.map(String).sort().join('|');
  return answer === null ? '' : String(answer);
}

export function validateAnswer(question: GameQuestion, answer: string | string[] | null) {
  if (answer === null) return false;

  if (question.kind === 'geo-sudo') {
    if (!Array.isArray(answer) || !Array.isArray(question.correctAnswer)) return false;
    return answer.length === question.correctAnswer.length &&
      answer.every((value, index) => value === question.correctAnswer[index]);
  }

  if (question.kind === 'motion-path') {
    const metadata = question.metadata as {
      gridSize: number;
      start: number;
      target: number;
      obstacles: number[];
      maxMoves: number;
    };
    const path = Array.isArray(answer) ? answer : [String(answer)];
    let position = metadata.start;
    const blocked = new Set(metadata.obstacles);
    for (const move of path) {
      const row = Math.floor(position / metadata.gridSize);
      const col = position % metadata.gridSize;
      let next = position;
      if (move === 'up' && row > 0) next -= metadata.gridSize;
      if (move === 'down' && row < metadata.gridSize - 1) next += metadata.gridSize;
      if (move === 'left' && col > 0) next -= 1;
      if (move === 'right' && col < metadata.gridSize - 1) next += 1;
      if (next === position || blocked.has(next)) return false;
      position = next;
    }
    return position === metadata.target && path.length <= metadata.maxMoves;
  }

  return normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);
}

export function calculateAnswerEfficiency(question: GameQuestion, answer: string | string[] | null) {
  if (question.kind !== 'motion-path' || !Array.isArray(answer)) return 1;
  const metadata = question.metadata as { optimalPath: string[] };
  const optimal = Math.max(metadata.optimalPath.length, 1);
  return clamp(optimal / Math.max(answer.length, 1), 0.35, 1);
}

export function adjustDifficulty(
  current: Difficulty,
  consecutiveCorrect: number,
  consecutiveIncorrect: number,
) {
  const step = difficultyStep[current];
  if (consecutiveCorrect >= 3) return stepDifficulty[Math.min(step + 1, stepDifficulty.length - 1)];
  if (consecutiveIncorrect >= 2) return stepDifficulty[Math.max(step - 1, 0)];
  return current;
}

export function getReadinessLabel(score: number) {
  if (score <= 39) return 'Needs Preparation';
  if (score <= 59) return 'Beginner';
  if (score <= 74) return 'Developing';
  if (score <= 84) return 'Assessment Ready';
  if (score <= 94) return 'Strong';
  return 'Excellent';
}

export function calculateOverallScore(results: GameResult[]) {
  if (results.length === 0) return 0;
  return Math.round(results.reduce((total, result) => total + result.score, 0) / results.length);
}
