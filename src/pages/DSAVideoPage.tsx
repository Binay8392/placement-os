import { useCallback, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useDSAProgress } from '@/features/dsa/hooks/useDSAProgress';
import { DSA_VIDEOS } from '@/features/dsa/data/dsaVideos';
import { DSAVideoPlayer } from '@/features/dsa/components/DSAVideoPlayer';
import { DSAResources } from '@/features/dsa/components/DSAResources';

// ─── Error Boundary: catches any render crash inside DSAVideoPlayer ───────────
class DSAPlayerErrorBoundary extends Component<
  { children: React.ReactNode; videoId: string },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode; videoId: string }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[DSAPlayerErrorBoundary] Player crashed:', error.message, info.componentStack);
  }
  render() {
    if (this.state.error) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${this.props.videoId}&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA`;
      return (
        <div className="aspect-video w-full rounded-2xl border border-destructive/40 bg-destructive/5 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="font-bold text-destructive text-sm">Unable to load this video</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            {this.state.error.message}
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Open on YouTube
            </a>
            <a
              href="/dsa"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              ← Back to DSA Roadmap
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DSAVideoPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { allProgress, markAsViewed, markAsNotCompleted, updateWatchProgress, completeVideo } = useDSAProgress(user?.uid);

  // Diagnostic log
  console.log('[DSAVideoPage] ROUTE VIDEO ID:', videoId);

  // Find video in catalog (match by videoId or internal id)
  const videoIndex = DSA_VIDEOS.findIndex(
    (v) => v.videoId === videoId || v.id === videoId
  );
  const video = videoIndex >= 0 ? DSA_VIDEOS[videoIndex] : null;

  console.log('[DSAVideoPage] FOUND VIDEO:', video ? video.title : 'NOT FOUND');

  const prevVideo = videoIndex > 0 ? DSA_VIDEOS[videoIndex - 1] : null;
  const nextVideo =
    videoIndex >= 0 && videoIndex < DSA_VIDEOS.length - 1
      ? DSA_VIDEOS[videoIndex + 1]
      : null;

  const progress = video ? allProgress[video.id] || allProgress[video.videoId] : null;
  const isCompleted = progress?.status === 'completed';
  const percent = isCompleted ? 100 : progress?.progressPercent || 0;

  const handleEnded = useCallback(() => {
    if (!video) return;
    void completeVideo(video.id, video.durationSeconds);
    toast.success('Great! Lecture completed.');
  }, [video, completeVideo]);

  const handleProgress = useCallback(
    (current: number, total: number, isEnding?: boolean) => {
      if (!video) return;
      void updateWatchProgress(video.id, current, total, isEnding);
    },
    [video, updateWatchProgress]
  );

  const handleToggleViewed = async () => {
    if (!video) return;
    if (isCompleted) {
      await markAsNotCompleted(video.id);
      toast.info('Lecture marked as not completed.');
    } else {
      await completeVideo(video.id, video.durationSeconds);
      toast.success('Lecture marked as completed.');
    }
  };

  // ── Not found ──
  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          Lecture not found for ID: <code className="text-xs bg-muted px-1 rounded">{videoId}</code>
        </p>
        <Button onClick={() => navigate('/dsa')} variant="outline">
          Back to DSA Roadmap
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      {/* Top Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur px-4 py-3 safe-top">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-xs md:text-sm"
            onClick={() => navigate('/dsa')}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to DSA Roadmap
          </Button>

          <div className="flex items-center gap-2">
            {prevVideo && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                onClick={() => navigate(`/dsa/video/${prevVideo.videoId}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
              </Button>
            )}
            {nextVideo && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                onClick={() => navigate(`/dsa/video/${nextVideo.videoId}`)}
              >
                Next <ChevronRight className="h-4 w-4 ml-0.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-5 md:py-6 space-y-6">
        {/* Lecture Info Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-semibold">
              Lec {video.order}
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">{video.topic}</span>
            {video.difficulty && (
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded capitalize ml-auto',
                  video.difficulty === 'easy'
                    ? 'bg-success/10 text-success'
                    : video.difficulty === 'medium'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-destructive/10 text-destructive'
                )}
              >
                {video.difficulty}
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
            {video.title}
          </h1>

          {video.description && (
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Player — wrapped in ErrorBoundary so crashes show a helpful message, not white screen */}
        <DSAPlayerErrorBoundary videoId={video.videoId}>
          <DSAVideoPlayer
            videoId={video.videoId}
            title={video.title}
            startPositionSeconds={progress?.lastPositionSeconds || 0}
            onEnded={handleEnded}
            onProgressUpdate={handleProgress}
          />
        </DSAPlayerErrorBoundary>

        {/* Action Controls & Progress Row */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleToggleViewed}
                variant={isCompleted ? 'outline' : 'default'}
                className={cn(
                  'font-semibold text-xs md:text-sm transition-all',
                  isCompleted ? 'border-success text-success hover:bg-success/10' : 'gradient-primary'
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-success fill-success/20" />
                    ✓ Marked as Viewed
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4 mr-2" />
                    Mark as Viewed
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs md:text-sm">
              <span className="text-muted-foreground font-medium">Status:</span>
              <Badge
                variant="outline"
                className={cn(
                  'font-semibold capitalize',
                  isCompleted
                    ? 'border-success/40 bg-success/10 text-success'
                    : percent > 0
                    ? 'border-warning/40 bg-warning/10 text-warning'
                    : 'border-border bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? 'Completed' : percent > 0 ? `In Progress (${percent}%)` : 'Not Started'}
              </Badge>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Watch Progress</span>
              <span>{percent}%</span>
            </div>
            <Progress value={percent} className="h-2" />
          </div>
        </div>

        {/* Completion Success Banner */}
        {isCompleted && (
          <div className="bg-success/10 border border-success/30 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/20 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-foreground">Lecture Completed!</h3>
                <p className="text-xs text-muted-foreground">Ready to take on the next video in sequence?</p>
              </div>
            </div>
            {nextVideo && (
              <Button
                onClick={() => navigate(`/dsa/video/${nextVideo.videoId}`)}
                className="gradient-primary text-xs md:text-sm shrink-0"
              >
                Continue to Next Lecture <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}

        {/* Lecture Resources */}
        <DSAResources
          sheetUrl={video.sheetUrl}
          codeUrl={video.codeUrl}
          notesUrl={video.notesUrl}
          practiceUrl={video.practiceUrl}
        />

        {/* Lecture Navigation Bottom Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
          {prevVideo ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dsa/video/${prevVideo.videoId}`)}
              className="text-xs md:text-sm truncate max-w-[180px] sm:max-w-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1 shrink-0" />
              <span className="truncate">Prev: Lec {prevVideo.order}</span>
            </Button>
          ) : (
            <div />
          )}

          {nextVideo && (
            <Button
              size="sm"
              onClick={() => navigate(`/dsa/video/${nextVideo.videoId}`)}
              className="gradient-primary text-xs md:text-sm truncate max-w-[180px] sm:max-w-xs ml-auto"
            >
              <span className="truncate">Next: Lec {nextVideo.order}</span>
              <ChevronRight className="h-4 w-4 ml-1 shrink-0" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
