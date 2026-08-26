import { useMemo } from 'react';
import type { DSAVideo, DSAVideoProgress } from '../types';
import { DSA_VIDEOS } from '../data/dsaVideos';

export function useDSAContinueLearning(allProgress: Record<string, DSAVideoProgress>) {
  return useMemo(() => {
    const totalVideos = DSA_VIDEOS.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let totalWatchedSeconds = 0;
    let totalDurationSeconds = 0;

    let lastWatchedVideo: { video: DSAVideo; progress: DSAVideoProgress } | null = null;
    let latestTimestamp = 0;

    // Map progress data
    for (const video of DSA_VIDEOS) {
      const prog = allProgress[video.id] || allProgress[video.videoId];
      totalDurationSeconds += video.durationSeconds || 1800;

      if (prog) {
        if (prog.status === 'completed') {
          completedCount++;
          totalWatchedSeconds += video.durationSeconds || 1800;
        } else if (prog.status === 'in_progress') {
          inProgressCount++;
          totalWatchedSeconds += prog.watchedSeconds || 0;
        }

        if (prog.lastWatchedAt) {
          const ts = new Date(prog.lastWatchedAt).getTime();
          if (ts > latestTimestamp) {
            latestTimestamp = ts;
            lastWatchedVideo = { video, progress: prog };
          }
        }
      }
    }

    // Determine "Continue Learning" video priority:
    // 1. Last watched video if it is in_progress
    // 2. First in_progress video in playlist order
    // 3. First not_started video in playlist order
    // 4. Fallback to first video in playlist
    let continueVideo: DSAVideo = DSA_VIDEOS[0];
    let continueProgress: DSAVideoProgress | null = null;

    if (lastWatchedVideo && lastWatchedVideo.progress.status === 'in_progress') {
      continueVideo = lastWatchedVideo.video;
      continueProgress = lastWatchedVideo.progress;
    } else {
      const firstInProgress = DSA_VIDEOS.find((v) => {
        const p = allProgress[v.id] || allProgress[v.videoId];
        return p?.status === 'in_progress';
      });

      if (firstInProgress) {
        continueVideo = firstInProgress;
        continueProgress = allProgress[firstInProgress.id] || allProgress[firstInProgress.videoId] || null;
      } else {
        const firstNotStarted = DSA_VIDEOS.find((v) => {
          const p = allProgress[v.id] || allProgress[v.videoId];
          return !p || p.status === 'not_started';
        });

        if (firstNotStarted) {
          continueVideo = firstNotStarted;
          continueProgress = allProgress[firstNotStarted.id] || allProgress[firstNotStarted.videoId] || null;
        }
      }
    }

    const remainingCount = totalVideos - completedCount;
    const progressPercent = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

    return {
      totalVideos,
      completedCount,
      inProgressCount,
      remainingCount,
      progressPercent,
      totalWatchedSeconds,
      totalDurationSeconds,
      continueVideo,
      continueProgress,
      lastWatchedVideo: lastWatchedVideo?.video ?? null,
    };
  }, [allProgress]);
}
