import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkX, ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { DifficultyBadge } from '@/features/aptitude/components/DifficultyBadge';
import { SECTION_CONFIG } from '@/features/aptitude/config';
import type { AptitudeSection } from '@/features/aptitude/types';

const SECTIONS: AptitudeSection[] = ['quantitative', 'logical', 'verbal'];

export default function AptitudeBookmarksPage() {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { bookmarks, removeBookmark, loading } = useAptitudeProgress(user?.uid);
  const [filter, setFilter] = useState<AptitudeSection | 'all'>('all');

  const filtered = filter === 'all' ? bookmarks : bookmarks.filter((b) => b.section === filter);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 safe-top border-b border-border">
        <div className="max-w-[900px] mx-auto">
          <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate('/aptitude')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Aptitude Arena
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-success" /> Bookmarks
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">{bookmarks.length} saved questions</p>
            </div>
            {bookmarks.length > 0 && (
              <Button size="sm" className="gradient-primary" onClick={() => navigate('/aptitude')}>
                <Play className="h-4 w-4 mr-1.5" /> Practice Arena
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-4">
        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap">
          {(['all', ...SECTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full border px-3.5 py-1 text-xs font-medium capitalize transition-colors',
                filter === s
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30'
              )}
            >
              {s === 'all' ? 'All' : SECTION_CONFIG[s].shortLabel}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-2xl bg-card/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
              <Bookmark className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-base mb-1">No bookmarked questions yet</h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-6">
              Bookmark important or tricky questions while practicing to review them here anytime.
            </p>
            <Button onClick={() => navigate('/aptitude')} className="gradient-primary">
              <Play className="h-4 w-4 mr-2" /> Start Practicing
            </Button>
          </div>
        ) : (
          /* Bookmarks List */
          <div className="space-y-3">
            {filtered.map((q) => {
              const config = SECTION_CONFIG[q.section];
              return (
                <div key={q.id} className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', config.bgColor, config.color)}>
                        {config.shortLabel}
                      </span>
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span className="text-xs text-muted-foreground font-medium">{q.topic}</span>
                    </div>
                    <button
                      onClick={() => void removeBookmark(q.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-muted"
                      title="Remove Bookmark"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-foreground">{q.question}</p>

                  <div className="rounded-xl bg-muted/40 border border-border p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Explanation</span>
                    <p className="text-xs text-foreground/90 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
