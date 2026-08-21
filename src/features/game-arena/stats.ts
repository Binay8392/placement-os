import { GAME_DEFINITIONS, GAME_ORDER } from './gameRegistry';
import { getReadinessLabel } from './scoring';
import type { ArenaStats, GameId, GameResult, GameStatsSummary } from './types';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateGameStats(attempts: GameResult[], gameId: GameId): GameStatsSummary {
  const filtered = attempts.filter((attempt) => attempt.gameId === gameId);
  const completed = filtered.length;
  const bestScore = completed > 0 ? Math.max(...filtered.map((attempt) => attempt.score)) : 0;
  const accuracy = completed > 0
    ? Math.round(filtered.reduce((total, attempt) => total + attempt.accuracy, 0) / completed)
    : 0;
  const averageTime = completed > 0
    ? Number((filtered.reduce((total, attempt) => total + attempt.averageResponseTime, 0) / completed).toFixed(1))
    : 0;

  return {
    attempts: completed,
    bestScore,
    accuracy,
    averageTime,
    completed,
    lastPlayed: filtered[0]?.completedAt,
  };
}

export function calculateGameStreak(attempts: GameResult[]) {
  const days = [...new Set(attempts.map((attempt) => attempt.completedAt.slice(0, 10)))].sort().reverse();
  if (days.length === 0) return 0;
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 0;
  const start = new Date(`${days[0]}T12:00:00`);
  for (let index = 0; index < 365; index += 1) {
    const check = new Date(start);
    check.setDate(start.getDate() - index);
    if (days.includes(dateKey(check))) streak += 1;
    else break;
  }
  return streak;
}

export function calculateArenaStats(attempts: GameResult[]): ArenaStats {
  if (attempts.length === 0) {
    return {
      overallScore: 0,
      gamesCompleted: 0,
      currentStreak: 0,
      bestScore: 0,
      averageAccuracy: 0,
      averageResponseTime: 0,
      readiness: 0,
      totalXp: 0,
    };
  }

  const overallScore = Math.round(attempts.reduce((total, attempt) => total + attempt.score, 0) / attempts.length);
  const averageAccuracy = Math.round(attempts.reduce((total, attempt) => total + attempt.accuracy, 0) / attempts.length);
  const averageResponseTime = Number((attempts.reduce((total, attempt) => total + attempt.averageResponseTime, 0) / attempts.length).toFixed(1));
  const bestScore = Math.max(...attempts.map((attempt) => attempt.score));
  const variety = new Set(attempts.map((attempt) => attempt.gameId)).size / GAME_ORDER.length;
  const consistency = clamp(calculateGameStreak(attempts) * 8, 0, 100);
  const readiness = clamp(Math.round(overallScore * 0.62 + averageAccuracy * 0.22 + variety * 10 + consistency * 0.06));
  const totalXp = attempts.reduce((total, attempt) => {
    const completionXp = 20;
    const correctXp = attempt.correct * 4;
    const performanceXp = attempt.score >= 90 ? 40 : attempt.score >= 80 ? 25 : 10;
    return total + completionXp + correctXp + performanceXp;
  }, 0);

  return {
    overallScore,
    gamesCompleted: attempts.length,
    currentStreak: calculateGameStreak(attempts),
    bestScore,
    averageAccuracy,
    averageResponseTime,
    readiness,
    totalXp,
  };
}

export function getDailyChallenge() {
  const today = dateKey();
  const seed = today.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  const gameId = GAME_ORDER[seed % GAME_ORDER.length];
  return {
    date: today,
    gameId,
    title: GAME_DEFINITIONS[gameId].name,
    questions: 10,
    minutes: 5,
    rewardXp: 50,
  };
}

export function getWeeklyPerformance(attempts: GameResult[], days = 7) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
    const key = dateKey(date);
    const dayAttempts = attempts.filter((attempt) => attempt.completedAt.slice(0, 10) === key);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: dayAttempts.length
        ? Math.round(dayAttempts.reduce((total, attempt) => total + attempt.score, 0) / dayAttempts.length)
        : 0,
      attempts: dayAttempts.length,
    };
  });
}

export function getWeakestGames(attempts: GameResult[]) {
  return GAME_ORDER
    .map((gameId) => ({ gameId, stats: calculateGameStats(attempts, gameId) }))
    .filter((item) => item.stats.attempts > 0)
    .sort((a, b) => a.stats.accuracy - b.stats.accuracy)
    .slice(0, 3);
}

export function getRecommendations(results: GameResult[]) {
  const source = results.length > 0 ? results : [];
  const byGame = GAME_ORDER
    .map((gameId) => {
      const gameResults = source.filter((result) => result.gameId === gameId);
      if (gameResults.length === 0) return null;
      const accuracy = Math.round(gameResults.reduce((total, result) => total + result.accuracy, 0) / gameResults.length);
      return { gameId, accuracy };
    })
    .filter(Boolean) as Array<{ gameId: GameId; accuracy: number }>;

  const focused = byGame
    .filter((item) => item.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (focused.length === 0) {
    return ['Maintain a mixed routine across numerical, visual, memory, and spatial games.'];
  }

  return focused.map((item) => {
    const name = GAME_DEFINITIONS[item.gameId].shortName;
    const advice: Record<GameId, string> = {
      digit: 'Practice numerical transformations and alternating arithmetic.',
      grid: 'Practice visual memory with short exposure windows.',
      motion: 'Practice spatial planning and shortest-path scanning.',
      switch: 'Practice chained transformation rules.',
      'geo-sudo': 'Practice row-column visual deduction.',
      oddo: 'Practice classifying shapes, rotations, and distractors.',
      inductive: 'Practice inferring shape, color, count, and rotation progressions.',
      pattern: 'Practice matrix and mixed sequence prediction.',
    };
    return `${name}: ${advice[item.gameId]} Recommended: 3 focused practice sessions.`;
  });
}

export function readinessSummary(score: number) {
  return {
    label: getReadinessLabel(score),
    note: 'PrepTrack-generated readiness estimate, not a company selection prediction.',
  };
}
