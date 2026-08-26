import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { DSAVideoProgress, DSAVideoStatus } from '../types';
import {
  saveDSAVideoProgress,
  markDSAVideoStatus,
} from '../utils/dsaFirebase';
import { DSA_VIDEOS } from '../data/dsaVideos';
import { firestore } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface DSAProgressContextType {
  allProgress: Record<string, DSAVideoProgress>;
  loading: boolean;
  error: string | null;
  completeVideo: (videoId: string, durationSeconds?: number) => Promise<void>;
  markAsViewed: (videoId: string, durationSeconds?: number) => Promise<void>;
  markAsNotCompleted: (videoId: string) => Promise<void>;
  updateWatchProgress: (
    videoId: string,
    currentSeconds: number,
    totalSeconds: number,
    forceImmediate?: boolean
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

export const DSAProgressContext = createContext<DSAProgressContextType | null>(null);

export function DSAProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth();
  const uid = user?.uid;

  const [allProgress, setAllProgress] = useState<Record<string, DSAVideoProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to throttle Firestore writes during playback
  const lastSaveTimeRef = useRef<Record<string, number>>({});

  // Real-time Firestore sync listener using onSnapshot
  useEffect(() => {
    if (!uid) {
      setAllProgress({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const col = collection(firestore, 'users', uid, 'dsaVideoProgress');

    const unsubscribe = onSnapshot(
      col,
      (snap) => {
        const data: Record<string, DSAVideoProgress> = {};
        snap.docs.forEach((d) => {
          const prog = d.data() as DSAVideoProgress;
          const key = d.id;
          data[key] = prog;

          // Find catalog match to store under both internal ID (e.g. 'dsa-v-001') and YouTube videoId (e.g. 'WQoB2z67hvY')
          const target = DSA_VIDEOS.find((v) => v.id === key || v.videoId === key || v.id === prog.videoId || v.videoId === prog.videoId);
          if (target) {
            data[target.id] = prog;
            data[target.videoId] = prog;
          }
        });

        setAllProgress(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[DSAProgressContext] Realtime listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  // Unified Video Completion function (used by both "Mark as Viewed" and YouTube ENDED event)
  const completeVideo = useCallback(
    async (videoId: string, durationSeconds = 0) => {
      const now = new Date().toISOString();
      const targetVid = DSA_VIDEOS.find((v) => v.id === videoId || v.videoId === videoId);
      const dur = durationSeconds || targetVid?.durationSeconds || 0;
      const canonicalId = targetVid?.id || videoId;
      const ytId = targetVid?.videoId || videoId;

      const completedRecord: DSAVideoProgress = {
        videoId: canonicalId,
        status: 'completed',
        watchedSeconds: dur,
        durationSeconds: dur,
        progressPercent: 100,
        completedAt: now,
        lastWatchedAt: now,
        lastPositionSeconds: dur,
      };

      // 1. Optimistic UI update — updates React Context immediately (0ms)
      setAllProgress((prev) => ({
        ...prev,
        [canonicalId]: completedRecord,
        [ytId]: completedRecord,
      }));

      // 2. Persist to Firestore in background
      if (!uid) return;
      try {
        await markDSAVideoStatus(uid, canonicalId, 'completed', dur);
      } catch (e) {
        console.error('[DSAProgressContext] Failed to save completion to Firestore:', e);
      }
    },
    [uid]
  );

  // Mark as Viewed delegates directly to completeVideo
  const markAsViewed = useCallback(
    async (videoId: string, durationSeconds = 0) => {
      await completeVideo(videoId, durationSeconds);
    },
    [completeVideo]
  );

  // Mark as Not Completed
  const markAsNotCompleted = useCallback(
    async (videoId: string) => {
      const now = new Date().toISOString();
      const targetVid = DSA_VIDEOS.find((v) => v.id === videoId || v.videoId === videoId);
      const canonicalId = targetVid?.id || videoId;
      const ytId = targetVid?.videoId || videoId;

      const resetRecord: DSAVideoProgress = {
        videoId: canonicalId,
        status: 'not_started',
        watchedSeconds: 0,
        durationSeconds: targetVid?.durationSeconds || 0,
        progressPercent: 0,
        completedAt: null,
        lastWatchedAt: now,
        lastPositionSeconds: 0,
      };

      // 1. Optimistic UI update
      setAllProgress((prev) => ({
        ...prev,
        [canonicalId]: resetRecord,
        [ytId]: resetRecord,
      }));

      // 2. Persist to Firestore
      if (!uid) return;
      try {
        await markDSAVideoStatus(uid, canonicalId, 'not_started');
      } catch (e) {
        console.error('[DSAProgressContext] Failed to reset status in Firestore:', e);
      }
    },
    [uid]
  );

  // Watch progress update during playback
  const updateWatchProgress = useCallback(
    async (
      videoId: string,
      currentSeconds: number,
      totalSeconds: number,
      forceImmediate = false
    ) => {
      if (totalSeconds <= 0) return;

      const targetVid = DSA_VIDEOS.find((v) => v.id === videoId || v.videoId === videoId);
      const canonicalId = targetVid?.id || videoId;
      const ytId = targetVid?.videoId || videoId;

      const pct = Math.min(100, Math.round((currentSeconds / totalSeconds) * 100));
      const isEnded = Boolean(forceImmediate || pct >= 95);

      if (isEnded) {
        await completeVideo(canonicalId, totalSeconds);
        return;
      }

      const status: DSAVideoStatus = currentSeconds > 5 ? 'in_progress' : 'not_started';
      const now = new Date().toISOString();

      setAllProgress((prev) => {
        const existing = prev[canonicalId] || prev[ytId];
        if (existing?.status === 'completed') return prev; // Don't demote completed

        const updatedRecord: DSAVideoProgress = {
          videoId: canonicalId,
          status,
          watchedSeconds: Math.max(existing?.watchedSeconds || 0, Math.round(currentSeconds)),
          durationSeconds: Math.round(totalSeconds),
          progressPercent: pct,
          completedAt: null,
          lastWatchedAt: now,
          lastPositionSeconds: Math.round(currentSeconds),
        };

        return {
          ...prev,
          [canonicalId]: updatedRecord,
          [ytId]: updatedRecord,
        };
      });

      if (!uid) return;

      // Throttle Firestore write (max once every 12 seconds unless forceImmediate)
      const lastSave = lastSaveTimeRef.current[canonicalId] || 0;
      const nowMs = Date.now();

      if (forceImmediate || nowMs - lastSave >= 12000) {
        lastSaveTimeRef.current[canonicalId] = nowMs;
        try {
          await saveDSAVideoProgress(uid, canonicalId, {
            videoId: canonicalId,
            status,
            watchedSeconds: Math.round(currentSeconds),
            durationSeconds: Math.round(totalSeconds),
            progressPercent: pct,
            completedAt: null,
            lastWatchedAt: now,
            lastPositionSeconds: Math.round(currentSeconds),
          });
        } catch (e) {
          console.error('[DSAProgressContext] Failed to throttle-save watch progress:', e);
        }
      }
    },
    [uid, completeVideo]
  );

  const refetch = useCallback(async () => {
    // onSnapshot automatically manages refetching, provided for compatibility
  }, []);

  return (
    <DSAProgressContext.Provider
      value={{
        allProgress,
        loading,
        error,
        completeVideo,
        markAsViewed,
        markAsNotCompleted,
        updateWatchProgress,
        refetch,
      }}
    >
      {children}
    </DSAProgressContext.Provider>
  );
}

export function useDSAProgressContext() {
  const context = useContext(DSAProgressContext);
  if (!context) {
    throw new Error('useDSAProgressContext must be used within a DSAProgressProvider');
  }
  return context;
}
