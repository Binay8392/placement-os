import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Gauge,
  AlertCircle,
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

  // Development logging
  console.log('DSA VIDEO ID:', videoId);
  console.log('YOUTUBE URL:', `https://www.youtube.com/watch?v=${videoId}`);

  // Store callbacks in stable refs so prop changes NEVER recreate the player
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
  const [currentTime, setCurrentTime] = useState(startPositionSeconds);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  // Initialize YouTube IFrame Player ONCE per videoId change
  useEffect(() => {
    let isMounted = true;
    setPlayerError(null);
    setUseIframeFallback(false);

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('[DSAVideoPlayer] Cleanup error:', e);
        }
      }

      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
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
              if (!isMounted) return;
              setPlayerReady(true);
              const dur = event.target.getDuration ? event.target.getDuration() : 0;
              if (dur > 0) setDuration(dur);
              console.log('[DSAVideoPlayer] PLAYER_READY', { videoId, duration: dur });
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                const dur = event.target.getDuration ? event.target.getDuration() : 0;
                if (dur > 0) setDuration(dur);
                console.log('[DSAVideoPlayer] PLAYER_PLAYING');
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                console.log('[DSAVideoPlayer] PLAYER_PAUSED');
                if (event.target.getCurrentTime) {
                  const cur = event.target.getCurrentTime();
                  const dur = event.target.getDuration ? event.target.getDuration() : 0;
                  onProgressUpdateRef.current?.(cur, dur, false);
                }
              } else if (state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setIsCompleted(true);
                console.log('[DSAVideoPlayer] PLAYER_ENDED');
                if (event.target.getDuration) {
                  const dur = event.target.getDuration();
                  setCurrentTime(dur);
                  onProgressUpdateRef.current?.(dur, dur, true);
                }
                onEndedRef.current?.();
              } else if (state === window.YT.PlayerState.BUFFERING) {
                console.log('[DSAVideoPlayer] PLAYER_BUFFERING');
              }
            },
            onError: (err: any) => {
              console.error('[DSAVideoPlayer] PLAYER_ERROR', err);
              // Error 100, 101, 150 -> use iframe fallback
              setUseIframeFallback(true);
              setPlayerReady(true);
            },
          },
        });
      } catch (err) {
        console.error('[DSAVideoPlayer] Init Exception:', err);
        setUseIframeFallback(true);
        setPlayerReady(true);
      }
    };

    if (!window.YT) {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        initPlayer();
      };
      // Fallback timer if script is slow/blocked
      const fallbackTimer = setTimeout(() => {
        if (!playerReady && isMounted && !window.YT) {
          setUseIframeFallback(true);
          setPlayerReady(true);
        }
      }, 3500);

      return () => {
        isMounted = false;
        clearTimeout(fallbackTimer);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          try {
            playerRef.current.destroy();
          } catch (e) {}
          playerRef.current = null;
        }
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [videoId]); // STRICTLY depend only on videoId!

  // Interval polling for currentTime during playback
  useEffect(() => {
    if (isPlaying && !useIframeFallback) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const cur = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration ? playerRef.current.getDuration() : duration;
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
          onProgressUpdateRef.current?.(cur, dur, false);
        }
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration, useIframeFallback]);

  // Player controls
  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
    const cur = playerRef.current.getCurrentTime();
    const dur = playerRef.current.getDuration ? playerRef.current.getDuration() : duration;
    let target = cur + seconds;
    if (target < 0) target = 0;
    if (dur > 0 && target > dur) target = dur;

    console.log(`[DSAVideoPlayer] Seeking by ${seconds}s from ${cur}s to ${target}s`);
    playerRef.current.seekTo(target, true);
    setCurrentTime(target);
    onProgressUpdateRef.current?.(target, dur, false);
  };

  const changeSpeed = (rateStr: string) => {
    const rate = parseFloat(rateStr);
    setPlaybackRate(rate);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(rate);
    }
  };

  // Keyboard shortcuts (ArrowLeft = -5s, ArrowRight = +5s, Space = Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true');
      if (isInput) return;

      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipSeconds(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipSeconds(5);
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA`;
  const originParam = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${originParam}&rel=0&autoplay=0&controls=1`;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 16:9 Aspect Ratio YouTube IFrame Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-md"
      >
        {useIframeFallback ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div id={`yt-player-${videoId}`} className="w-full h-full" />
        )}

        {/* Loading Overlay before IFrame API Ready */}
        {!playerReady && !useIframeFallback && (
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

      {/* Control Bar: Skip -10s, Skip -5s, Play/Pause, Skip +5s, Skip +10s & Speed */}
      <div className="bg-card border border-border rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {/* Skip -10s */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipSeconds(-10)}
            title="Rewind 10s"
            className="h-8 px-2 text-xs font-mono gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" /> 10s
          </Button>

          {/* Skip -5s */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipSeconds(-5)}
            title="Rewind 5s (←)"
            className="h-8 px-2 text-xs font-mono gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" /> 5s
          </Button>

          {/* Play / Pause Toggle */}
          <Button
            onClick={togglePlayPause}
            variant={isPlaying ? 'secondary' : 'default'}
            size="sm"
            title="Play / Pause (Space)"
            className={cn('h-8 px-3 text-xs font-semibold gap-1.5', !isPlaying && 'gradient-primary')}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Play
              </>
            )}
          </Button>

          {/* Skip +5s */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipSeconds(5)}
            title="Forward 5s (→)"
            className="h-8 px-2 text-xs font-mono gap-1"
          >
            5s <RotateCw className="h-3.5 w-3.5" />
          </Button>

          {/* Skip +10s */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipSeconds(10)}
            title="Forward 10s"
            className="h-8 px-2 text-xs font-mono gap-1"
          >
            10s <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Speed Selector */}
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
