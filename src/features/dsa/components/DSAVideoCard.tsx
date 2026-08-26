import { Link } from 'react-router-dom';
import { Play, CheckCircle2, Clock, FileText, Code2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DSAVideo, DSAVideoProgress } from '../types';

interface DSAVideoCardProps {
  video: DSAVideo;
  progress?: DSAVideoProgress;
  className?: string;
}

export function DSAVideoCard({ video, progress, className }: DSAVideoCardProps) {
  const status = progress?.status || 'not_started';
  const percent = progress?.progressPercent || 0;
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const durationMin = Math.round((video.durationSeconds || 2400) / 60);

  return (
    <div
      className={cn(
        'group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 md:p-4 rounded-xl border transition-all text-left',
        isCompleted
          ? 'border-success/30 bg-success/5 hover:border-success/50'
          : isInProgress
          ? 'border-warning/30 bg-warning/5 hover:border-warning/50'
          : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Status Indicator Icon */}
        <div className="mt-0.5 shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-success fill-success/20" />
          ) : isInProgress ? (
            <div className="relative flex h-5 w-5 items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/50" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-muted-foreground">Lec {video.order}</span>
            {video.difficulty && (
              <span
                className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded capitalize',
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
            {video.sheetUrl && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                <FileText className="h-3 w-3" /> DSA Sheet
              </span>
            )}
          </div>

          <p className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {video.title}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {durationMin} min
            </span>
            <span>·</span>
            {isCompleted ? (
              <span className="text-success font-semibold">Completed</span>
            ) : isInProgress ? (
              <span className="text-warning font-semibold">{percent}% watched</span>
            ) : (
              <span>Not Started</span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-end">
        <Button asChild size="sm" variant={isCompleted ? 'outline' : isInProgress ? 'default' : 'secondary'} className="h-8 text-xs">
          <Link to={`/dsa/video/${video.videoId}`}>
            <Play className="h-3.5 w-3.5 mr-1 fill-current" />
            {isCompleted ? 'Rewatch' : isInProgress ? 'Resume' : 'Watch'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
