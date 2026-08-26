import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DSAVideoPlayerProps {
  videoId: string;
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
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  // Use a ref to track playerReady without stale closures
  const playerReadyRef = useRef(false);
  const isMountedRef = useRef(true);

  // Stable refs for callbacks — NEVER recreates player
  const onEndedRef = useRef(onEnded);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const initialStartPosRef = useRef(startPositionSeconds);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  // 'loading' | 'ready' | 'fallback' | 'error'
  const [playerState, setPlayerState] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading');

  // DEV logging
  if (import.meta.env.DEV) {
    console.log('[DSAVideoPlayer] videoId =', videoId);
    console.log('[DSAVideoPlayer] YOUTUBE URL =', `https://www.youtube.com/watch?v=${videoId}`);
  }

  // Initialize YouTube IFrame Player ONCE per videoId change
  useEffect(() => {
    if (!videoId) {
      setPlayerState('error');
      return;
    }

    isMountedRef.current = true;
    playerReadyRef.current = false;
    setPlayerState('loading');
    setIsPlaying(false);
    setIsCompleted(false);
    setCurrentTime(0);
    setDuration(0);

    const initPlayer = () => {
      if (!isMountedRef.current) return;
      if (!window.YT || !window.YT.Player) {
        console.warn('[DSAVideoPlayer] YT not available, using fallback iframe');
        if (isMountedRef.current) setPlayerState('fallback');
        return;
      }

      // Destroy any previous player instance safely
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('[DSAVideoPlayer] Error destroying old player:', e);
        }
        playerRef.current = null;
      }

      try {
        const origin = window.location.origin;

        playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
          host: 'https://www.youtube.com',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            enablejsapi: 1,
            origin: origin,
            modestbranding: 1,
            start: initialStartPosRef.current ? Math.floor(initialStartPosRef.current) : 0,
          },
          events: {
            onReady: (event: any) => {
              if (!isMountedRef.current) return;
              console.log('[DSAVideoPlayer] PLAYER_READY', { videoId });
              playerReadyRef.current = true;
              const dur = event.target.getDuration ? event.target.getDuration() : 0;
              if (dur > 0 && isMountedRef.current) setDuration(dur);
              if (isMountedRef.current) setPlayerState('ready');
            },
            onStateChange: (event: any) => {
              if (!isMountedRef.current) return;
              const state = event.data;
              if (state === window.YT?.PlayerState?.PLAYING) {
                setIsPlaying(true);
                const dur = event.target.getDuration ? event.target.getDuration() : 0;
                if (dur > 0) setDuration(dur);
                console.log('[DSAVideoPlayer] PLAYER_PLAYING');
              } else if (state === window.YT?.PlayerState?.PAUSED) {
                setIsPlaying(false);
                console.log('[DSAVideoPlayer] PLAYER_PAUSED');
                const cur = event.target.getCurrentTime?.() ?? 0;
                const dur = event.target.getDuration?.() ?? 0;
                onProgressUpdateRef.current?.(cur, dur, false);
              } else if (state === window.YT?.PlayerState?.ENDED) {
                setIsPlaying(false);
                setIsCompleted(true);
                console.log('[DSAVideoPlayer] PLAYER_ENDED');
                const dur = event.target.getDuration?.() ?? 0;
                setCurrentTime(dur);
                onProgressUpdateRef.current?.(dur, dur, true);
                onEndedRef.current?.();
              } else if (state === window.YT?.PlayerState?.BUFFERING) {
                console.log('[DSAVideoPlayer] PLAYER_BUFFERING');
              }
            },
            onError: (err: any) => {
              console.error('[DSAVideoPlayer] PLAYER_ERROR code:', err?.data);
              // Fall back to plain iframe embed on any player error
              if (isMountedRef.current) setPlayerState('fallback');
            },
          },
        });
      } catch (err) {
        console.error('[DSAVideoPlayer] Failed to initialize YT.Player:', err);
        if (isMountedRef.current) setPlayerState('fallback');
      }
    };

    // Inject the YouTube IFrame API script exactly once
    if (!window.YT || !window.YT.Player) {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      // Chain onYouTubeIframeAPIReady callbacks safely
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        initPlayer();
      };

      // Fallback: if API never fires (blocked / slow), use plain iframe after 4s
      // Use ref-based check to avoid stale closure bug
      const fallbackTimer = setTimeout(() => {
        if (!playerReadyRef.current && isMountedRef.current) {
          console.warn('[DSAVideoPlayer] YT API timeout, switching to iframe fallback');
          setPlayerState('fallback');
        }
      }, 4000);

      return () => {
        isMountedRef.current = false;
        clearTimeout(fallbackTimer);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (playerRef.current) {
          try { playerRef.current.destroy(); } catch (_) {}
          playerRef.current = null;
        }
      };
    } else {
      // API already loaded
      initPlayer();
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, [videoId]); // ONLY re-run when videoId changes

  // Progress polling interval — read-only, never pauses player
  useEffect(() => {
    if (isPlaying && playerState === 'ready') {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const cur = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration?.() ?? duration;
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
          onProgressUpdateRef.current?.(cur, dur, false);
        }
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, playerState, duration]);

  // Player controls
  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  }, [isPlaying]);

  const skipSeconds = useCallback((seconds: number) => {
    if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
    const cur = playerRef.current.getCurrentTime();
    const dur = playerRef.current.getDuration?.() ?? duration;
    const target = Math.max(0, Math.min(dur || Infinity, cur + seconds));
    playerRef.current.seekTo(target, true);
    setCurrentTime(target);
    onProgressUpdateRef.current?.(target, dur, false);
  }, [duration]);

  const changeSpeed = useCallback((rateStr: string) => {
    const rate = parseFloat(rateStr);
    setPlaybackRate(rate);
    playerRef.current?.setPlaybackRate?.(rate);
  }, []);

  // Keyboard shortcuts — ArrowLeft/-5s, ArrowRight/+5s, Space/toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.activeElement?.getAttribute('contenteditable') === 'true') return;
      if (e.code === 'ArrowLeft') { e.preventDefault(); skipSeconds(-5); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); skipSeconds(5); }
      else if (e.code === 'Space') { e.preventDefault(); togglePlayPause(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipSeconds, togglePlayPause]);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&autoplay=0&controls=1`;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 16:9 Aspect Ratio YouTube IFrame Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-md">

        {/* Stable YT API div — always rendered when not in fallback */}
        {playerState !== 'fallback' && playerState !== 'error' && (
          <div id={`yt-player-${videoId}`} className="w-full h-full" />
        )}

        {/* Fallback: plain iframe */}
        {playerState === 'fallback' && (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}

        {/* Error state */}
        {playerState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 text-white p-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium text-center">Video unavailable. Open it on YouTube.</p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Open on YouTube
            </a>
          </div>
        )}

        {/* Loading overlay */}
        {playerState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-3 p-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading YouTube Player...</p>
          </div>
        )}

        {/* Completion badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/90 backdrop-blur text-white px-3 py-1 text-xs font-bold shadow-lg">
              <CheckCircle2 className="h-4 w-4" /> Lecture Completed
            </span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-card border border-border rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => skipSeconds(-10)} title="Rewind 10s"
            className="h-8 px-2 text-xs font-mono gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> 10s
          </Button>
          <Button variant="outline" size="sm" onClick={() => skipSeconds(-5)} title="Rewind 5s (←)"
            className="h-8 px-2 text-xs font-mono gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> 5s
          </Button>
          <Button
            onClick={togglePlayPause}
            variant={isPlaying ? 'secondary' : 'default'}
            size="sm"
            title="Play / Pause (Space)"
            className={cn('h-8 px-3 text-xs font-semibold gap-1.5', !isPlaying && 'gradient-primary')}
          >
            {isPlaying ? (
              <><Pause className="h-3.5 w-3.5 fill-current" /> Pause</>
            ) : (
              <><Play className="h-3.5 w-3.5 fill-current" /> Play</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => skipSeconds(5)} title="Forward 5s (→)"
            className="h-8 px-2 text-xs font-mono gap-1">
            5s <RotateCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => skipSeconds(10)} title="Forward 10s"
            className="h-8 px-2 text-xs font-mono gap-1">
            10s <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Gauge className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline-block" />
          <Select value={playbackRate.toString()} onValueChange={changeSpeed}>
            <SelectTrigger className="h-8 w-[85px] text-xs font-mono">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x (Normal)</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="1.75">1.75x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attribution */}
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
