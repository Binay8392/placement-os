import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, CheckCircle2, ExternalLink, RefreshCw, Volume2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DSAVideoPlayerProps {
  videoId: string; // YouTube video ID e.g. "WQoB2z67hvY"
  title: string;
  startPositionSeconds?: number;
  onEnded?: () => void;
  onProgressUpdate?: (currentSeconds: number, totalSeconds: number, isEnding?: boolean) => void;
  className?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export function DSAVideoPlayer({
  videoId,
  title,
  startPositionSeconds = 0,
  onEnded,
  onProgressUpdate,
  className,
}: DSAVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(startPositionSeconds);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  // Initialize YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const loadPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          start: Math.floor(startPositionSeconds),
        },
        events: {
          onReady: (event: any) => {
            if (!isMounted) return;
            setPlayerReady(true);
            const dur = event.target.getDuration();
            if (dur > 0) setDuration(dur);
          },
          onStateChange: (event: any) => {
            if (!isMounted) return;
            // State 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              const dur = event.target.getDuration();
              if (dur > 0) setDuration(dur);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              const cur = event.target.getCurrentTime();
              const dur = event.target.getDuration();
              onProgressUpdate?.(cur, dur, false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setIsCompleted(true);
              const dur = event.target.getDuration();
              setCurrentTime(dur);
              onProgressUpdate?.(dur, dur, true);
              onEnded?.();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        loadPlayer();
      };
    } else {
      loadPlayer();
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startPositionSeconds, onEnded, onProgressUpdate]);

  // Interval for monitoring currentTime during playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const cur = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration() || duration;
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
          onProgressUpdate?.(cur, dur, false);
        }
      }, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration, onProgressUpdate]);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA`;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 16:9 Aspect Ratio Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-md"
      >
        <div id={`yt-player-${videoId}`} className="w-full h-full" />

        {/* Loading Overlay before IFrame API Ready */}
        {!playerReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-3 p-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading YouTube Player...</p>
          </div>
        )}

        {/* Completion Success Banner Overlay */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/90 backdrop-blur text-white px-3 py-1 text-xs font-bold shadow-lg">
              <CheckCircle2 className="h-4 w-4" /> Lecture Completed
            </span>
          </div>
        )}
      </div>

      {/* Attribution & Official YouTube Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
        <span>Video source: Official YouTube / CodeHelp by Love Babbar</span>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          Watch on YouTube <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
