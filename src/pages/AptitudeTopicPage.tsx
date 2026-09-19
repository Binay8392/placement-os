import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Play,
  ClipboardList,
  Brain,
  Calculator,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { TOPIC_REGISTRY, SECTION_CONFIG } from '@/features/aptitude/config';
import { AccuracyRing } from '@/features/aptitude/components/AccuracyRing';
import type { AptitudeSection } from '@/features/aptitude/types';

// Map section → icon component
const SECTION_ICONS: Record<AptitudeSection, typeof Calculator> = {
  quantitative: Calculator,
  logical: Brain,
  verbal: MessageSquare,
};

export default function AptitudeTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { allProgress } = useAptitudeProgress(user?.uid);

  const topic = useMemo(
    () => TOPIC_REGISTRY.find((t) => t.id === topicId),
    [topicId],
  );

  const progress = topicId ? allProgress[topicId] : undefined;
  const accuracy =
    progress && progress.attempted > 0
      ? Math.round((progress.correct / progress.attempted) * 100)
      : 0;

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Topic not found.</p>
        <Button onClick={() => navigate('/aptitude')} variant="outline">
          Back to Aptitude
        </Button>
      </div>
    );
  }

  const config = SECTION_CONFIG[topic.section];
  const SectionIcon = SECTION_ICONS[topic.section];

  // Sibling navigation within same section
  const sectionTopics = TOPIC_REGISTRY.filter(
    (t) => t.section === topic.section,
  );
  const currentIdx = sectionTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIdx > 0 ? sectionTopics[currentIdx - 1] : null;
  const nextTopic =
    currentIdx < sectionTopics.length - 1
      ? sectionTopics[currentIdx + 1]
      : null;

  // Deduplicate quick-count options (avoid repeat if questionCount ≤ 25 etc.)
  const quickCounts = [10, 25, 50, topic.questionCount].filter(
    (v, i, a) => a.indexOf(v) === i && v <= topic.questionCount,
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'px-4 pt-6 pb-4 safe-top border-b border-border',
          config.bgColor,
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-3"
          onClick={() => navigate('/aptitude')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="flex items-start gap-4">
          <div className={cn('rounded-xl p-3', config.bgColor)}>
            <SectionIcon className={cn('h-6 w-6', config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{topic.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">
              {topic.section} Aptitude · {topic.questionCount} questions
            </p>
          </div>
          <AccuracyRing accuracy={accuracy} size={60} strokeWidth={6} />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
        {/* ── Progress card ─────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-3">Your Progress</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Solved', value: progress?.attempted ?? 0 },
              { label: 'Correct', value: progress?.correct ?? 0 },
              { label: 'Accuracy', value: `${accuracy}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        {/* ── Practice options ──────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-3">Practice Options</h2>

          {/* Quick-count grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickCounts.map((count) => (
              <Link
                key={count}
                to={`/aptitude/practice/${topic.id}?count=${count}&mode=practice`}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all',
                  'border-border bg-card hover:border-primary/50 hover:bg-primary/5',
                )}
              >
                <span className="text-lg font-bold text-primary">{count}</span>
                <span className="text-xs text-muted-foreground">Questions</span>
              </Link>
            ))}
          </div>

          {/* Timed / Assessment */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Link
              to={`/aptitude/practice/${topic.id}?count=10&mode=timed&time=10`}
              className="flex items-center justify-center gap-2 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm font-medium text-warning hover:bg-warning/10 transition-colors"
            >
              <Play className="h-4 w-4" /> Timed (10 min)
            </Link>
            <Link
              to={`/aptitude/practice/${topic.id}?count=10&mode=assessment`}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <ClipboardList className="h-4 w-4" /> Assessment
            </Link>
          </div>
        </div>

        {/* ── Learn card ────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-2">Learn This Topic</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Study concepts, formulas, shortcuts, and worked examples before
            practicing.
          </p>
          <Button
            asChild
            variant={config.color === 'text-primary' ? 'default' : 'outline'}
            className="w-full"
          >
            <Link to={`/aptitude/learn/${topic.id}`}>
              <BookOpen className="h-4 w-4 mr-2" /> Learn {topic.name}
            </Link>
          </Button>
        </div>

        {/* ── Tags ──────────────────────────────────────────────────────── */}
        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Company relevance ─────────────────────────────────────────── */}
        {topic.companyRelevance.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
              Relevant for
            </p>
            <div className="flex flex-wrap gap-2">
              {topic.companyRelevance.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Sibling navigation ────────────────────────────────────────── */}
        {(prevTopic ?? nextTopic) && (
          <div className="flex gap-3">
            {prevTopic && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={`/aptitude/topic/${prevTopic.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {prevTopic.name}
                </Link>
              </Button>
            )}
            {nextTopic && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 justify-end"
              >
                <Link to={`/aptitude/topic/${nextTopic.id}`}>
                  {nextTopic.name}
                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
