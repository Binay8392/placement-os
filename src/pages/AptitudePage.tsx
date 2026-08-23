import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calculator, Brain, MessageSquare, BookOpen, ClipboardList,
  Bookmark, XCircle, Trophy, Target, Zap, TrendingUp, ArrowRight, Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { useAptitudeStreak } from '@/features/aptitude/hooks/useAptitudeStreak';
import { TOPIC_REGISTRY, SECTION_CONFIG } from '@/features/aptitude/config';
import { AccuracyRing } from '@/features/aptitude/components/AccuracyRing';
import { StreakBadge } from '@/features/aptitude/components/StreakBadge';
import type { AptitudeSection } from '@/features/aptitude/types';
import type { TopicProgress } from '@/features/aptitude/types';

const SECTIONS: AptitudeSection[] = ['quantitative', 'logical', 'verbal'];

const ICONS: Record<AptitudeSection, typeof Calculator> = {
  quantitative: Calculator,
  logical: Brain,
  verbal: MessageSquare,
};

function calcSectionStats(
  section: AptitudeSection,
  allProgress: Record<string, TopicProgress>,
) {
  const topics = TOPIC_REGISTRY.filter((t) => t.section === section);
  let attempted = 0;
  let correct = 0;
  let completed = 0;
  for (const t of topics) {
    const p = allProgress[t.id];
    if (p) {
      attempted += p.attempted;
      correct += p.correct;
      if (p.attempted > 0) completed++;
    }
  }
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  return { attempted, correct, accuracy, completed, total: topics.length };
}

function getWeakestTopic(
  section: AptitudeSection,
  allProgress: Record<string, TopicProgress>,
) {
  const topics = TOPIC_REGISTRY.filter(
    (t) => t.section === section && (allProgress[t.id]?.attempted ?? 0) >= 5,
  );
  if (topics.length === 0) return null;
  const withAccuracy = topics.map((t) => {
    const p = allProgress[t.id]!;
    return { ...t, accuracy: Math.round((p.correct / p.attempted) * 100) };
  });
  const weakest = withAccuracy.sort((a, b) => a.accuracy - b.accuracy)[0];
  return weakest ?? null;
}

export default function AptitudePage() {
  const { user } = useFirebaseAuth();
  const { allProgress, loading } = useAptitudeProgress(user?.uid);
  const { streak } = useAptitudeStreak(user?.uid);

  const overallStats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    let completed = 0;
    for (const p of Object.values(allProgress)) {
      attempted += p.attempted;
      correct += p.correct;
      if (p.attempted > 0) completed++;
    }
    return {
      attempted,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      completed,
      total: TOPIC_REGISTRY.length,
    };
  }, [allProgress]);

  const sectionStats = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((s) => [s, calcSectionStats(s, allProgress)]),
      ) as Record<AptitudeSection, ReturnType<typeof calcSectionStats>>,
    [allProgress],
  );

  const weakTopics = useMemo(
    () =>
      TOPIC_REGISTRY.filter((t) => {
        const p = allProgress[t.id];
        if (!p || p.attempted < 5) return false;
        return Math.round((p.correct / p.attempted) * 100) < 60;
      }).slice(0, 4),
    [allProgress],
  );

  const firstTopicPerSection = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((s) => [s, TOPIC_REGISTRY.find((t) => t.section === s)]),
      ) as Record<AptitudeSection, (typeof TOPIC_REGISTRY)[number] | undefined>,
    [],
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 pt-8 pb-6 safe-top">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Aptitude Arena</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Master campus-placement aptitude — Quant · Logical · Verbal
              </p>
            </div>
            {streak > 0 && <StreakBadge streak={streak} size="md" />}
          </motion.div>

          {/* Quick stats */}
          {loading ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                {
                  label: 'Questions Solved',
                  value: overallStats.attempted,
                  icon: Target,
                  color: 'text-primary',
                },
                {
                  label: 'Overall Accuracy',
                  value: `${overallStats.accuracy}%`,
                  icon: TrendingUp,
                  color:
                    overallStats.accuracy >= 70 ? 'text-success' : 'text-warning',
                },
                {
                  label: 'Day Streak',
                  value: streak,
                  icon: Flame,
                  color: 'text-orange-500',
                },
                {
                  label: 'Topics Done',
                  value: `${overallStats.completed}/${overallStats.total}`,
                  icon: Zap,
                  color: 'text-success',
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-card/80 border border-border rounded-xl p-3 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={cn('h-4 w-4', stat.color)} />
                      <span className="text-xs text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <p className={cn('text-xl font-bold', stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
        {/* ── Section cards ── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Sections
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SECTIONS.map((section, i) => {
              const config = SECTION_CONFIG[section];
              const stats = sectionStats[section];
              const Icon = ICONS[section];
              const weakest = getWeakestTopic(section, allProgress);
              const firstTopic = firstTopicPerSection[section];
              if (!stats) return null;
              return (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className={cn(
                    'bg-card border rounded-2xl p-4 flex flex-col gap-3',
                    config.borderColor,
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('rounded-xl p-2', config.bgColor)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{config.shortLabel}</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.total} topics
                        </p>
                      </div>
                    </div>
                    <AccuracyRing accuracy={stats.accuracy} size={52} strokeWidth={5} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>
                        {stats.completed}/{stats.total} topics started
                      </span>
                      <span>{stats.attempted} solved</span>
                    </div>
                    <Progress
                      value={(stats.completed / stats.total) * 100}
                      className="h-1.5"
                    />
                  </div>

                  {weakest && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="text-destructive font-medium">Weakest:</span>
                      <Link
                        to={`/aptitude/topic/${weakest.id}`}
                        className="hover:underline truncate"
                      >
                        {weakest.name}
                      </Link>
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-8"
                    >
                      <Link
                        to={
                          firstTopic
                            ? `/aptitude/learn/${firstTopic.id}`
                            : '/aptitude'
                        }
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-1" /> Learn
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        'flex-1 text-xs h-8 text-white',
                        section === 'quantitative'
                          ? 'bg-primary hover:bg-primary/90'
                          : section === 'logical'
                          ? 'bg-warning hover:bg-warning/90'
                          : 'bg-success hover:bg-success/90',
                      )}
                    >
                      <Link
                        to={
                          firstTopic
                            ? `/aptitude/topic/${firstTopic.id}`
                            : '/aptitude'
                        }
                      >
                        Practice <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Quick actions ── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: 'Daily Challenge',
                icon: Target,
                to: '/aptitude/daily',
                color: 'text-primary',
                bg: 'bg-primary/10 border-primary/30',
              },
              {
                label: 'Mock Tests',
                icon: ClipboardList,
                to: '/aptitude/mock',
                color: 'text-warning',
                bg: 'bg-warning/10 border-warning/30',
              },
              {
                label: 'Bookmarks',
                icon: Bookmark,
                to: '/aptitude/bookmarks',
                color: 'text-success',
                bg: 'bg-success/10 border-success/30',
              },
              {
                label: 'Wrong Answers',
                icon: XCircle,
                to: '/aptitude/wrong-answers',
                color: 'text-destructive',
                bg: 'bg-destructive/10 border-destructive/30',
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all hover:scale-[1.02] active:scale-[0.98]',
                    action.bg,
                  )}
                >
                  <Icon className={cn('h-6 w-6', action.color)} />
                  <span className="text-xs font-semibold">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Smart recommendations ── */}
        {weakTopics.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Focus Areas
            </h2>
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-3">
                Based on your accuracy, prioritize these topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((t) => {
                  const p = allProgress[t.id]!;
                  const acc = Math.round((p.correct / p.attempted) * 100);
                  return (
                    <Link
                      key={t.id}
                      to={`/aptitude/topic/${t.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-background border border-destructive/30 px-3 py-1.5 text-xs font-medium hover:border-destructive/60 transition-colors"
                    >
                      <span>{t.name}</span>
                      <span className="text-destructive font-bold">{acc}%</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Topic browser ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              All Topics
            </h2>
          </div>
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const config = SECTION_CONFIG[section];
              const topics = TOPIC_REGISTRY.filter((t) => t.section === section);
              const Icon = ICONS[section];
              return (
                <div
                  key={section}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 border-b border-border',
                      config.bgColor,
                    )}
                  >
                    <Icon className={cn('h-5 w-5', config.color)} />
                    <span className="font-semibold">{config.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {topics.length} topics
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {topics.map((topic) => {
                      const p = allProgress[topic.id];
                      const acc =
                        p && p.attempted > 0
                          ? Math.round((p.correct / p.attempted) * 100)
                          : null;
                      return (
                        <Link
                          key={topic.id}
                          to={`/aptitude/topic/${topic.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {topic.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {topic.questionCount} questions
                            </p>
                          </div>
                          {acc !== null ? (
                            <span
                              className={cn(
                                'text-sm font-semibold',
                                acc >= 70
                                  ? 'text-success'
                                  : acc >= 50
                                  ? 'text-warning'
                                  : 'text-destructive',
                              )}
                            >
                              {acc}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not started
                            </span>
                          )}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
