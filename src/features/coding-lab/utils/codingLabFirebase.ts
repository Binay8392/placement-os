import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { AssessmentAttempt } from '../types';

// Per-user subcollection path guaranteeing authenticated user data isolation
const codingAttemptsCol = (uid: string) => collection(firestore, 'users', uid, 'codingAttempts');

/**
 * Save an assessment attempt under the authenticated user's private collection
 */
export async function saveCodingAttempt(uid: string, attempt: AssessmentAttempt): Promise<void> {
  if (!uid || uid === 'anonymous_student') return;
  const docRef = doc(codingAttemptsCol(uid), attempt.id);
  await setDoc(
    docRef,
    {
      ...attempt,
      userId: uid,
      savedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Retrieve user's previous assessment attempts ordered by completion date
 */
export async function getUserCodingAttempts(uid: string, maxResults = 20): Promise<AssessmentAttempt[]> {
  if (!uid || uid === 'anonymous_student') return [];
  try {
    const q = query(codingAttemptsCol(uid), orderBy('completedAt', 'desc'), limit(maxResults));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AssessmentAttempt);
  } catch (err) {
    console.warn('[CodingLab] Firestore attempt fetch fallback:', err);
    return [];
  }
}
