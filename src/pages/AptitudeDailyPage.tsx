import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Flame, ArrowLeft, Play, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { useAptitudeStreak } from '@/features/aptitude/hooks/useAptitudeStreak';
import { StreakBadge } from '@/features/aptitude/components/StreakBadge';
import { TOPIC_REGISTRY, DAILY_CHALLENGE_CONFIG, SECTION_CONFIG } from '@/features/aptitude/config';
import { getQuestionsForTopics, filterQuestions } from '@/features/aptitude/questionRegistry';
import type { AptitudeQuestion } from '@/features/aptitude/types';

const TODAY = new Date().toISOString().split('T')[0];

export default function AptitudeDailyPage() {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { streak, practiceDates } = useAptitudeStreak(user?.uid);
  const { allProgress } = useAptitudeProgress(user?.uid);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const todayCompleted = practiceDates.includes(TODAY);

  useEffect(() => {
    const dist = DAILY_CHALLENGE_CONFIG.distribution;
    // Deterministic selection based on date string seed (e.g. 20260824)
    const dateNum = parseInt(TODAY.replace(/-/g, ''), 10);

    const getTopicIdsForSection = (section: 'quantitative' | 'logical' | 'verbal', count: number) => {
      const topics = TOPIC_REGISTRY.filter((t) => t.section === section);
      const selected: string[] = [];
      for (let i = 0; i < count; i++) {
        const idx = (dateNum + i * 7) % topics.length;
        selected.push(topics[idx].id);
      }
      return selected;
    };

    const topicIds = [
      ...getTopicIdsForSection('quantitative', dist.quantitative),
      ...getTopicIdsForSection('logical', dist.logical),
      ...getTopicIdsForSection('verbal', dist.verbal),
    ];

    setLoading(true);
    getQuestionsForTopics(topicIds)
      .then((qs) => {
        // If questions loaded, take 10 questions deterministically
        const selectedQuestions = qs.length >= 10 ? qs.slice(0, 10) : qs;
        setQuestions(selectedQuestions);
      })
      .catch((err) => {
        console.error('Failed to load daily questions:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartDaily = useCallback(() => {
    // Pick the first available topic from the daily challenge questions
    const targetTopic = questions[0]?.topicId ?? questions[0]?.topic ?? 'number-system';
    const topicEntry = TOPIC_REGISTRY.find((t) => t.id === targetTopic || t.name === targetTopic);
    const validTopicId = topicEntry?.id ?? 'number-system';

    navigate(`/aptitude/practice/${validTopicId}?count=10&mode=timed&time=${DAILY_CHALLENGE_CONFIG.timeMinutes}`);
  }, [navigate, questions]);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 safe-top border-b border-border">
        <div className="max-w-[800px] mx-auto">
          <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate('/aptitude')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Aptitude Arena
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" /> Daily Aptitude Challenge
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {streak > 0 && <StreakBadge streak={streak} size="md" />}
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
        {/* Weekly Streak Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-warning" /> Weekly Consistency
            </h2>
            <span className="text-xs text-muted-foreground font-semibold">{streak} Day Streak</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((dateStr) => {
              const isDone = practiceDates.includes(dateStr);
              const isToday = dateStr === TODAY;
              const dateObj = new Date(dateStr);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dateObj.getDate();

              return (
                <div key={dateStr} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-[10px] text-muted-foreground font-medium">{dayName}</span>
                  <div
                    className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all',
                      isDone
                        ? 'bg-warning/20 text-warning border border-warning/40'
                        : isToday
                        ? 'border-2 border-primary bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground/60 border border-border'
                    )}
                  >
                    {isDone ? <Flame className="h-4.5 w-4.5 text-warning fill-warning/30" /> : dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenge Box */}
        <div
          className={cn(
            'rounded-2xl border p-5 md:p-6 space-y-4 transition-all',
            todayCompleted ? 'border-success/30 bg-success/5' : 'border-primary/30 bg-primary/5'
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Daily Assessment</span>
              <h2 className="text-lg md:text-xl font-bold mt-0.5">
                {todayCompleted ? 'Daily Challenge Complete! 🎉' : 'Today\'s 10-Question Sprint'}
              </h2>
            </div>
            {todayCompleted && (
              <span className="rounded-full bg-success/10 text-success border border-success/30 px-3 py-1 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium"><Target className="h-4 w-4 text-primary" /> 10 Questions</span>
            <span className="flex items-center gap-1 font-medium"><Clock className="h-4 w-4 text-warning" /> 12 Minutes</span>
            <span className="font-medium">3 Quant · 3 Logic · 4 Verbal</span>
          </div>

          {loading ? (
            <div className="h-12 rounded-xl bg-muted animate-pulse" />
          ) : todayCompleted ? (
            <div className="space-y-3">
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                Great job maintaining your streak! You have already completed today's challenge. Keep practicing in the Aptitude Arena to sharpen your accuracy.
              </p>
              <Button onClick={() => navigate('/aptitude')} variant="outline" className="w-full">
                Explore Aptitude Arena
              </Button>
            </div>
          ) : (
            <Button onClick={handleStartDaily} className="w-full gradient-primary" size="lg">
              <Play className="h-4 w-4 mr-2" /> Start Today's Challenge
            </Button>
          )}
        </div>

        {/* Section Breakdown info */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
          <h3 className="text-sm font-semibold">Today's Topic Mix</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { section: 'quantitative' as const, count: 3 },
              { section: 'logical' as const, count: 3 },
              { section: 'verbal' as const, count: 4 },
            ].map((item) => {
              const config = SECTION_CONFIG[item.section];
              return (
                <div key={item.section} className={cn('rounded-xl border p-3 flex items-center justify-between', config.borderColor, config.bgColor)}>
                  <span className={cn('text-xs font-bold', config.color)}>{config.label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-background">{item.count} Qs</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
