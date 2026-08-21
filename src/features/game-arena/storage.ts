import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { defaultAssessmentConfig } from './config';
import type { AssessmentConfig, AssessmentSession, GameId, GameResult } from './types';

const ATTEMPTS_KEY = 'preptrack-game-arena-attempts';
const SESSIONS_KEY = 'preptrack-game-arena-sessions';
const CONFIG_KEY = 'preptrack-game-arena-config';
const PRIVACY_KEY = 'preptrack-game-arena-hide-leaderboard';
const ACTIVE_SESSION_KEY = 'preptrack-game-arena-active-session';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getArenaConfig() {
  const saved = readJson<AssessmentConfig | null>(CONFIG_KEY, null);
  return {
    ...defaultAssessmentConfig,
    ...saved,
    gameConfigs: {
      ...defaultAssessmentConfig.gameConfigs,
      ...(saved?.gameConfigs || {}),
    },
    scoringWeights: {
      ...defaultAssessmentConfig.scoringWeights,
      ...(saved?.scoringWeights || {}),
    },
  };
}

export function saveArenaConfig(config: AssessmentConfig) {
  writeJson(CONFIG_KEY, config);
}

export function getGameAttempts() {
  return readJson<GameResult[]>(ATTEMPTS_KEY, []);
}

export function saveGameAttemptLocal(attempt: GameResult) {
  const attempts = getGameAttempts();
  const exists = attempts.some((item) => item.attemptId === attempt.attemptId);
  const next = exists
    ? attempts.map((item) => (item.attemptId === attempt.attemptId ? attempt : item))
    : [attempt, ...attempts];
  writeJson(ATTEMPTS_KEY, next.slice(0, 500));
}

export async function syncGameAttempt(attempt: GameResult) {
  saveGameAttemptLocal(attempt);
  if (!attempt.userId) return;

  try {
    await setDoc(doc(firestore, 'gameAttempts', attempt.attemptId), {
      ...attempt,
      syncedAt: serverTimestamp(),
    });
    await setDoc(doc(firestore, 'gameStats', attempt.userId), {
      userId: attempt.userId,
      lastAttemptAt: serverTimestamp(),
      lastGameId: attempt.gameId,
      lastScore: attempt.score,
    }, { merge: true });
  } catch (error) {
    console.warn('Game attempt saved locally. Firestore sync failed.', error);
  }
}

export function getAssessmentSessions() {
  return readJson<AssessmentSession[]>(SESSIONS_KEY, []);
}

export function saveAssessmentSessionLocal(session: AssessmentSession) {
  const sessions = getAssessmentSessions();
  const exists = sessions.some((item) => item.sessionId === session.sessionId);
  const next = exists
    ? sessions.map((item) => (item.sessionId === session.sessionId ? session : item))
    : [session, ...sessions];
  writeJson(SESSIONS_KEY, next.slice(0, 100));
}

export async function syncAssessmentSession(session: AssessmentSession) {
  saveAssessmentSessionLocal(session);
  if (!session.userId) return;

  try {
    await setDoc(doc(firestore, 'gameSessions', session.sessionId), {
      ...session,
      syncedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Assessment session saved locally. Firestore sync failed.', error);
  }
}

export function getAssessmentSession(sessionId: string) {
  return getAssessmentSessions().find((session) => session.sessionId === sessionId) || null;
}

export function getAttemptsForGame(gameId: GameId) {
  return getGameAttempts().filter((attempt) => attempt.gameId === gameId);
}

export function setLeaderboardPrivacy(hidden: boolean) {
  writeJson(PRIVACY_KEY, hidden);
}

export function getLeaderboardPrivacy() {
  return readJson<boolean>(PRIVACY_KEY, false);
}

export function saveActiveSession(session: AssessmentSession | null) {
  if (typeof window === 'undefined') return;
  if (!session) {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }
  writeJson(ACTIVE_SESSION_KEY, session);
}

export function getActiveSession() {
  return readJson<AssessmentSession | null>(ACTIVE_SESSION_KEY, null);
}

export async function fetchRemoteRecentAttempts(userId?: string) {
  if (!userId) return [];
  try {
    const attemptsQuery = query(
      collection(firestore, 'gameAttempts'),
      orderBy('completedAt', 'desc'),
      limit(50),
    );
    const snapshot = await getDocs(attemptsQuery);
    return snapshot.docs
      .map((item) => item.data() as GameResult)
      .filter((attempt) => attempt.userId === userId);
  } catch {
    return [];
  }
}
