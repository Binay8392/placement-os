import { useState, useEffect, useCallback, useRef } from 'react';
import type { DSAVideoProgress, DSAVideoStatus } from '../types';
import {
  getAllDSAVideoProgress,
  saveDSAVideoProgress,
  markDSAVideoStatus,
} from '../utils/dsaFirebase';
import { DSA_VIDEOS } from '../data/dsaVideos';

export function useDSAProgress(uid: string | undefined) {
  const [allProgress, setAllProgress] = useState<Record<string, DSAVideoProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to throttle Firestore writes during video playback
  const lastSaveTimeRef = useRef<Record<string, number>>({});

  const fetchProgress = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getAllDSAVideoProgress(uid);
      setAllProgress(data);
    } catch (e) {
      console.error('Failed to load DSA video progress:', e);
      setError(e instanceof Error ? e.message : 'Failed to load video progress');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void fetchProgress();
  }, [fetchProgress]);

  // Mark video as completed (Optimistic UI)
  const markAsViewed = useCallback(
    async (videoId: string, durationSeconds = 0) => {
      const now = new Date().toISOString();
      const targetVid = DSA_VIDEOS.find((v) => v.id === videoId || v.videoId === videoId);
      const dur = durationSeconds || targetVid?.durationSeconds || 0;

      // Optimistic local state update
      setAllProgress((prev) => ({
        ...prev,
        [videoId]: {
          videoId,
          status: 'completed',
          watchedSeconds: dur,
          durationSeconds: dur,
          progressPercent: 100,
          completedAt: now,
          lastWatchedAt: now,
          lastPositionSeconds: dur,
        },
      }));

      if (!uid) return;
      try {
        await markDSAVideoStatus(uid, videoId, 'completed', dur);
      } catch (e) {
        console.error('Failed to mark video as viewed in Firestore:', e);
      }
    },
    [uid]
  );

  // Mark video as not completed / not started (Optimistic UI)
  const markAsNotCompleted = useCallback(
    async (videoId: string) => {
      const now = new Date().toISOString();
      // Optimistic local state update
      setAllProgress((prev) => ({
        ...prev,
        [videoId]: {
          videoId,
          status: 'not_started',
          watchedSeconds: 0,
          durationSeconds: prev[videoId]?.durationSeconds || 0,
          progressPercent: 0,
          completedAt: null,
          lastWatchedAt: now,
          lastPositionSeconds: 0,
        },
      }));

      if (!uid) return;
      try {
        await markDSAVideoStatus(uid, videoId, 'not_started');
      } catch (e) {
        console.error('Failed to mark video as not completed in Firestore:', e);
      }
    },
    [uid]
  );

  // Throttled video progress update (called while watching)
  const updateWatchProgress = useCallback(
    async (
      videoId: string,
      currentSeconds: number,
      totalSeconds: number,
      forceImmediate = false
    ) => {
      if (totalSeconds <= 0) return;

      const pct = Math.min(100, Math.round((currentSeconds / totalSeconds) * 100));
      const isEnded = currentSeconds >= totalSeconds - 2 || pct >= 98;
      const status: DSAVideoStatus = isEnded
        ? 'completed'
        : currentSeconds > 5
        ? 'in_progress'
        : 'not_started';

      const now = new Date().toISOString();

      // Always update React local state immediately
      setAllProgress((prev) => {
        const existing = prev[videoId];
        // If already completed and not force ending, preserve completed status
        const finalStatus = existing?.status === 'completed' && !isEnded ? 'completed' : status;
        const finalPct = finalStatus === 'completed' ? 100 : pct;

        return {
          ...prev,
          [videoId]: {
            videoId,
            status: finalStatus,
            watchedSeconds: Math.max(existing?.watchedSeconds || 0, Math.round(currentSeconds)),
            durationSeconds: Math.round(totalSeconds),
            progressPercent: finalPct,
            completedAt: finalStatus === 'completed' ? existing?.completedAt || now : null,
            lastWatchedAt: now,
            lastPositionSeconds: Math.round(currentSeconds),
          },
        };
      });

      if (!uid) return;

      // Throttle Firestore write (max once every 12 seconds unless forceImmediate or ended)
      const lastSave = lastSaveTimeRef.current[videoId] || 0;
      const nowMs = Date.now();

      if (forceImmediate || isEnded || nowMs - lastSave >= 12000) {
        lastSaveTimeRef.current[videoId] = nowMs;
        try {
          await saveDSAVideoProgress(uid, videoId, {
            videoId,
            status,
            watchedSeconds: Math.round(currentSeconds),
            durationSeconds: Math.round(totalSeconds),
            progressPercent: isEnded ? 100 : pct,
            completedAt: isEnded ? now : null,
            lastWatchedAt: now,
            lastPositionSeconds: Math.round(currentSeconds),
          });
        } catch (e) {
          console.error('Failed to update watch progress in Firestore:', e);
        }
      }
    },
    [uid]
  );

  return {
    allProgress,
    loading,
    error,
    refetch: fetchProgress,
    markAsViewed,
    markAsNotCompleted,
    updateWatchProgress,
  };
}
