import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  arrayUnion,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { AptitudeAttempt, QuestionSnapshot, TopicProgress } from '../types';

// Collection paths
const aptitudeAttemptsCol = (uid: string) => collection(firestore, 'users', uid, 'aptitudeAttempts');
const aptitudeProgressDoc = (uid: string, topicId: string) => doc(firestore, 'users', uid, 'aptitudeProgress', topicId);
const aptitudeBookmarksCol = (uid: string) => collection(firestore, 'users', uid, 'aptitudeBookmarks');
const aptitudeWrongAnswersCol = (uid: string) => collection(firestore, 'users', uid, 'aptitudeWrongAnswers');
const aptitudeMetaDoc = (uid: string) => doc(firestore, 'users', uid, 'aptitudeMeta', 'main');

// ── Attempts ──────────────────────────────────────────────────────────────────

export async function saveAptitudeAttempt(uid: string, attempt: AptitudeAttempt): Promise<void> {
  await addDoc(aptitudeAttemptsCol(uid), { ...attempt, savedAt: serverTimestamp() });
}

export async function getRecentAttempts(uid: string, count = 10): Promise<AptitudeAttempt[]> {
  const q = query(aptitudeAttemptsCol(uid), orderBy('completedAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as AptitudeAttempt);
}

// ── Topic Progress ─────────────────────────────────────────────────────────────

export async function getTopicProgress(uid: string, topicId: string): Promise<TopicProgress | null> {
  const snap = await getDoc(aptitudeProgressDoc(uid, topicId));
  return snap.exists() ? (snap.data() as TopicProgress) : null;
}

export async function upsertTopicProgress(
  uid: string,
  topicId: string,
  updates: Partial<TopicProgress>
): Promise<void> {
  const ref = aptitudeProgressDoc(uid, topicId);
  await setDoc(ref, updates, { merge: true });
}

export async function getAllTopicProgress(uid: string): Promise<Record<string, TopicProgress>> {
  const col = collection(firestore, 'users', uid, 'aptitudeProgress');
  const snap = await getDocs(col);
  const result: Record<string, TopicProgress> = {};
  snap.docs.forEach((d) => { result[d.id] = d.data() as TopicProgress; });
  return result;
}

// ── Bookmarks ──────────────────────────────────────────────────────────────────

export async function addBookmark(uid: string, question: QuestionSnapshot): Promise<void> {
  await setDoc(doc(aptitudeBookmarksCol(uid), question.id), {
    ...question,
    bookmarkedAt: serverTimestamp(),
  });
}

export async function removeBookmark(uid: string, questionId: string): Promise<void> {
  await deleteDoc(doc(aptitudeBookmarksCol(uid), questionId));
}

export async function getBookmarks(uid: string): Promise<(QuestionSnapshot & { bookmarkedAt: string })[]> {
  const q = query(aptitudeBookmarksCol(uid), orderBy('bookmarkedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const ts = data.bookmarkedAt as Timestamp | null;
    return { ...data, bookmarkedAt: ts?.toDate().toISOString() ?? '' } as QuestionSnapshot & { bookmarkedAt: string };
  });
}

export async function isBookmarked(uid: string, questionId: string): Promise<boolean> {
  const snap = await getDoc(doc(aptitudeBookmarksCol(uid), questionId));
  return snap.exists();
}

// ── Wrong Answers ──────────────────────────────────────────────────────────────

export async function saveWrongAnswer(
  uid: string,
  question: QuestionSnapshot,
  selected: string | null
): Promise<void> {
  await setDoc(doc(aptitudeWrongAnswersCol(uid), question.id), {
    ...question,
    selected,
    recordedAt: serverTimestamp(),
  });
}

export async function saveWrongAnswersBatch(
  uid: string,
  items: { question: QuestionSnapshot; selected: string | null }[]
): Promise<void> {
  if (items.length === 0) return;
  const batch = writeBatch(firestore);
  for (const { question, selected } of items) {
    const ref = doc(aptitudeWrongAnswersCol(uid), question.id);
    batch.set(ref, {
      ...question,
      selected,
      recordedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export async function removeWrongAnswer(uid: string, questionId: string): Promise<void> {
  await deleteDoc(doc(aptitudeWrongAnswersCol(uid), questionId));
}

export async function getWrongAnswers(
  uid: string
): Promise<(QuestionSnapshot & { selected: string | null; recordedAt: string })[]> {
  const q = query(aptitudeWrongAnswersCol(uid), orderBy('recordedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const ts = data.recordedAt as Timestamp | null;
    return { ...data, recordedAt: ts?.toDate().toISOString() ?? '' } as QuestionSnapshot & { selected: string | null; recordedAt: string };
  });
}

// ── Streak / Meta ──────────────────────────────────────────────────────────────

interface AptitudeMeta {
  practiceDates: string[];
  dailyChallenge: Record<string, { score: number; accuracy: number; completedAt: string }>;
  lastUpdated: string;
}

export async function getAptitudeMeta(uid: string): Promise<AptitudeMeta | null> {
  const snap = await getDoc(aptitudeMetaDoc(uid));
  return snap.exists() ? (snap.data() as AptitudeMeta) : null;
}

export async function recordPracticeDate(uid: string, dateStr: string): Promise<void> {
  const ref = aptitudeMetaDoc(uid);
  await setDoc(
    ref,
    {
      practiceDates: arrayUnion(dateStr),
      lastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function saveDailyChallenge(
  uid: string,
  dateStr: string,
  result: { score: number; accuracy: number; completedAt: string }
): Promise<void> {
  const ref = aptitudeMetaDoc(uid);
  await setDoc(
    ref,
    {
      practiceDates: arrayUnion(dateStr),
      [`dailyChallenge.${dateStr}`]: result,
      lastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );
}

export function calculateStreak(practiceDates: string[]): number {
  if (practiceDates.length === 0) return 0;
  const sorted = [...new Set(practiceDates)].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  // Streak must include today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 0;
  let expected = sorted[0] === today ? today : yesterday;
  for (const date of sorted) {
    if (date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}
