import { Link } from 'react-router-dom';
import { Play, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DSAVideo, DSAVideoProgress } from '../types';

interface ContinueLearningCardProps {
  continueVideo: DSAVideo;
  progress: DSAVideoProgress | null;
  className?: string;
}

export function ContinueLearningCard({
  continueVideo,
  progress,
  className,
}: ContinueLearningCardProps) {
  const isCompleted = progress?.status === 'completed';
  const percent = progress?.progressPercent || 0;
  const durationMin = Math.round((continueVideo.durationSeconds || 2400) / 60);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 md:p-6 shadow-sm',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1 bg-primary/15 text-primary text-xs font-semibold">
              <Sparkles className="h-3 w-3" /> Continue Learning
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">{continueVideo.topic}</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {continueVideo.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-3.5 w-3.5" /> ~{durationMin} min
            </span>
            <span>·</span>
            <span className="font-semibold text-foreground">
              {isCompleted ? 'Completed' : percent > 0 ? `${percent}% watched` : 'Not Started'}
            </span>
          </div>

          <div className="pt-2 max-w-md">
            <Progress value={isCompleted ? 100 : percent} className="h-2" />
          </div>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Button asChild size="lg" className="w-full sm:w-auto gradient-primary shadow-md">
            <Link to={`/dsa/video/${continueVideo.videoId}`}>
              <Play className="h-4.5 w-4.5 mr-2 fill-current" />
              {percent > 0 && !isCompleted ? 'Resume Lecture' : 'Start Lecture'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
