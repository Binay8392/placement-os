import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, CheckCircle2, Trash2, ArrowLeft, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { DifficultyBadge } from '@/features/aptitude/components/DifficultyBadge';
import { SECTION_CONFIG } from '@/features/aptitude/config';
import type { AptitudeSection } from '@/features/aptitude/types';

const SECTIONS: AptitudeSection[] = ['quantitative', 'logical', 'verbal'];

export default function AptitudeWrongAnswersPage() {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { wrongAnswers, removeWrongAnswer, loading } = useAptitudeProgress(user?.uid);
  const [filter, setFilter] = useState<AptitudeSection | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? wrongAnswers : wrongAnswers.filter((w) => w.section === filter);

  const handlePracticeWrongAnswers = () => {
    if (filtered.length === 0) return;
    // Pick the topic of the first wrong answer or navigate to aptitude
    const firstTopic = filtered[0]?.topic;
    if (firstTopic) {
      navigate(`/aptitude/practice/${firstTopic}?count=10&mode=practice`);
    } else {
      navigate('/aptitude');
    }
  };

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
                <XCircle className="h-5 w-5 text-destructive" /> Wrong Answers
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">{wrongAnswers.length} incorrect questions to review</p>
            </div>
            {filtered.length > 0 && (
              <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handlePracticeWrongAnswers}>
                <Play className="h-4 w-4 mr-1.5" /> Practice Wrong Answers
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
                  ? 'border-destructive bg-destructive/10 text-destructive font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:border-destructive/30'
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 mb-4">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="font-semibold text-base mb-1">No incorrect questions yet</h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-6">
              Questions you answer incorrectly during practice sessions will automatically appear here for review.
            </p>
            <Button onClick={() => navigate('/aptitude')} className="gradient-primary">
              <Play className="h-4 w-4 mr-2" /> Start Practicing
            </Button>
          </div>
        ) : (
          /* Wrong Answers List */
          <div className="space-y-3">
            {filtered.map((w) => {
              const config = SECTION_CONFIG[w.section];
              const isExpanded = expandedId === w.id;
              const correctOpt = w.options.find((o) => o.id === w.correctAnswer);
              const selectedOpt = w.selected ? w.options.find((o) => o.id === w.selected) : null;
              const recordedDate = w.recordedAt ? new Date(w.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '';

              return (
                <div key={w.id} className="bg-card border border-destructive/20 rounded-2xl overflow-hidden transition-colors">
                  <div
                    className="p-4 md:p-5 cursor-pointer hover:bg-muted/30 transition-colors flex items-start gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : w.id)}
                  >
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', config.bgColor, config.color)}>
                          {config.shortLabel}
                        </span>
                        <DifficultyBadge difficulty={w.difficulty} />
                        <span className="text-xs text-muted-foreground">{w.topic}</span>
                        {recordedDate && <span className="text-[10px] text-muted-foreground ml-auto">{recordedDate}</span>}
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">{w.question}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void removeWrongAnswer(w.id);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors shrink-0"
                      title="Clear Wrong Answer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-5 pt-1 border-t border-border bg-muted/20 space-y-3">
                      {w.passage && (
                        <p className="text-xs italic text-muted-foreground border-l-2 border-border pl-3">{w.passage.substring(0, 180)}...</p>
                      )}
                      {selectedOpt && (
                        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs md:text-sm">
                          <XCircle className="h-4 w-4 text-destructive shrink-0" />
                          <p><span className="font-semibold text-destructive">Your Answer: </span>{selectedOpt.text}</p>
                        </div>
                      )}
                      {correctOpt && (
                        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-3 text-xs md:text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          <p><span className="font-semibold text-success">Correct Answer: </span>{correctOpt.text}</p>
                        </div>
                      )}
                      <div className="rounded-xl bg-background border border-border p-3 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Detailed Explanation</span>
                        <p className="text-xs text-foreground leading-relaxed">{w.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
