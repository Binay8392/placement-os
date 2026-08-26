import { Video, CheckCircle2, Clock, PlayCircle, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DSAProgressOverviewProps {
  completedCount: number;
  totalVideos: number;
  inProgressCount: number;
  remainingCount: number;
  progressPercent: number;
  totalWatchedSeconds: number;
  className?: string;
}

function formatHoursMinutes(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function DSAProgressOverview({
  completedCount,
  totalVideos,
  inProgressCount,
  remainingCount,
  progressPercent,
  totalWatchedSeconds,
  className,
}: DSAProgressOverviewProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5 md:p-6 space-y-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> DSA Video Roadmap Progress
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Track your video lecture completion across all core DSA topics
          </p>
        </div>

        <div className="text-right sm:text-right">
          <p className="font-mono text-2xl font-bold text-primary">{progressPercent}%</p>
          <p className="text-xs text-muted-foreground">
            {completedCount} / {totalVideos} lectures completed
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <Progress value={progressPercent} className="h-3 rounded-full" />
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-muted/40 border border-border/70 rounded-xl p-3 text-center">
          <Video className="h-4 w-4 mx-auto mb-1 text-primary" />
          <p className="font-mono text-lg font-bold">{totalVideos}</p>
          <p className="text-[11px] text-muted-foreground">Total Lectures</p>
        </div>

        <div className="bg-success/5 border border-success/20 rounded-xl p-3 text-center">
          <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-success" />
          <p className="font-mono text-lg font-bold text-success">{completedCount}</p>
          <p className="text-[11px] text-muted-foreground">Completed</p>
        </div>

        <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 text-center">
          <PlayCircle className="h-4 w-4 mx-auto mb-1 text-warning" />
          <p className="font-mono text-lg font-bold text-warning">{inProgressCount}</p>
          <p className="text-[11px] text-muted-foreground">In Progress</p>
        </div>

        <div className="bg-muted/40 border border-border/70 rounded-xl p-3 text-center">
          <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="font-mono text-lg font-bold">{formatHoursMinutes(totalWatchedSeconds)}</p>
          <p className="text-[11px] text-muted-foreground">Watch Time</p>
        </div>
      </div>
    </div>
  );
}
