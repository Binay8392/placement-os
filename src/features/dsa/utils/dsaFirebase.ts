import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { DSAVideoProgress, DSAVideoStatus } from '../types';

const dsaProgressDoc = (uid: string, videoId: string) =>
  doc(firestore, 'users', uid, 'dsaVideoProgress', videoId);

export async function getDSAVideoProgress(
  uid: string,
  videoId: string
): Promise<DSAVideoProgress | null> {
  const snap = await getDoc(dsaProgressDoc(uid, videoId));
  return snap.exists() ? (snap.data() as DSAVideoProgress) : null;
}

export async function getAllDSAVideoProgress(
  uid: string
): Promise<Record<string, DSAVideoProgress>> {
  const col = collection(firestore, 'users', uid, 'dsaVideoProgress');
  const snap = await getDocs(col);
  const result: Record<string, DSAVideoProgress> = {};
  snap.docs.forEach((d) => {
    result[d.id] = d.data() as DSAVideoProgress;
  });
  return result;
}

export async function saveDSAVideoProgress(
  uid: string,
  videoId: string,
  updates: Partial<DSAVideoProgress>
): Promise<void> {
  const ref = dsaProgressDoc(uid, videoId);
  const now = new Date().toISOString();
  await setDoc(
    ref,
    {
      videoId,
      lastWatchedAt: now,
      updatedAt: serverTimestamp(),
      ...updates,
    },
    { merge: true }
  );
}

export async function markDSAVideoStatus(
  uid: string,
  videoId: string,
  status: DSAVideoStatus,
  durationSeconds = 0
): Promise<void> {
  const ref = dsaProgressDoc(uid, videoId);
  const now = new Date().toISOString();
  const isCompleted = status === 'completed';

  await setDoc(
    ref,
    {
      videoId,
      status,
      progressPercent: isCompleted ? 100 : status === 'not_started' ? 0 : 50,
      completedAt: isCompleted ? now : null,
      lastWatchedAt: now,
      ...(isCompleted && durationSeconds > 0
        ? { watchedSeconds: durationSeconds, lastPositionSeconds: durationSeconds }
        : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
