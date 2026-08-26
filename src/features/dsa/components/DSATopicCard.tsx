import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DSATopicMeta, DSAVideo, DSAVideoProgress } from '../types';
import { DSAVideoCard } from './DSAVideoCard';

interface DSATopicCardProps {
  topic: DSATopicMeta;
  videos: DSAVideo[];
  allProgress: Record<string, DSAVideoProgress>;
  defaultExpanded?: boolean;
  className?: string;
}

export function DSATopicCard({
  topic,
  videos,
  allProgress,
  defaultExpanded = false,
  className,
}: DSATopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completedVideos = videos.filter((v) => {
    const p = allProgress[v.id] || allProgress[v.videoId];
    return p?.status === 'completed';
  }).length;

  const totalVideos = videos.length;
  const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  const isAllCompleted = totalVideos > 0 && completedVideos === totalVideos;

  return (
    <div
      className={cn(
        'bg-card border rounded-2xl overflow-hidden transition-all shadow-sm',
        isAllCompleted ? 'border-success/30' : 'border-border/80',
        className
      )}
    >
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="shrink-0 text-muted-foreground">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm md:text-base text-foreground truncate">{topic.name}</span>
              {isAllCompleted && (
                <Badge variant="secondary" className="gap-1 bg-success/15 text-success text-[10px] font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Mastered
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{topic.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 pl-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-mono font-bold text-foreground">
              {completedVideos}/{totalVideos} Done
            </p>
            <p className="text-[10px] text-muted-foreground">{progressPercent}%</p>
          </div>
          <div className="w-16 hidden sm:block">
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>
      </button>

      {/* Expanded Videos List */}
      {isExpanded && (
        <div className="border-t border-border/70 p-3 md:p-4 space-y-2 bg-muted/20">
          {videos.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-4">No video lectures listed for this topic yet.</p>
          ) : (
            videos.map((video) => (
              <DSAVideoCard
                key={video.id}
                video={video}
                progress={allProgress[video.id] || allProgress[video.videoId]}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
