import { useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Clock, CheckCircle2, XCircle, Minus, ArrowLeft, RotateCcw, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DifficultyBadge } from '@/features/aptitude/components/DifficultyBadge';
import type { AptitudeAttempt } from '@/features/aptitude/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AptitudeResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const attempt = location.state?.attempt as AptitudeAttempt | undefined;

  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Results not found. Please complete a practice session.</p>
        <Button onClick={() => navigate('/aptitude')}>Back to Aptitude Arena</Button>
      </div>
    );
  }

  const topicAnalysis = useMemo(() => {
    const byTopic: Record<string, { correct: number; total: number }> = {};
    for (const ans of attempt.answers) {
      if (!byTopic[ans.topic]) byTopic[ans.topic] = { correct: 0, total: 0 };
      byTopic[ans.topic].total++;
      if (ans.isCorrect) byTopic[ans.topic].correct++;
    }
    return Object.entries(byTopic).map(([topic, stats]) => ({
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total,
    }));
  }, [attempt]);

  const difficultyAnalysis = useMemo(() => {
    const byDiff: Record<string, { correct: number; total: number }> = {};
    for (const ans of attempt.answers) {
      if (!byDiff[ans.difficulty]) byDiff[ans.difficulty] = { correct: 0, total: 0 };
      byDiff[ans.difficulty].total++;
      if (ans.isCorrect) byDiff[ans.difficulty].correct++;
    }
    return Object.entries(byDiff).map(([diff, stats]) => ({
      diff,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    }));
  }, [attempt]);

  const grade = attempt.accuracy >= 90 ? 'A+' : attempt.accuracy >= 80 ? 'A' : attempt.accuracy >= 70 ? 'B' : attempt.accuracy >= 60 ? 'C' : 'D';
  const gradeColor = attempt.accuracy >= 80 ? 'text-success' : attempt.accuracy >= 60 ? 'text-warning' : 'text-destructive';

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 safe-top border-b border-border">
        <Button variant="ghost" size="sm" className="-ml-2 mb-2" onClick={() => navigate('/aptitude')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Aptitude Arena
        </Button>
        <h1 className="text-xl font-bold">Results</h1>
        <p className="text-sm text-muted-foreground">{attempt.label}</p>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
        {/* Score card */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className={cn('text-6xl font-bold mb-1', gradeColor)}>{grade}</div>
          <div className="text-3xl font-bold mb-1">{attempt.accuracy}%</div>
          <p className="text-muted-foreground text-sm">{attempt.correct} correct out of {attempt.totalQuestions}</p>
          <Progress value={attempt.accuracy} className="h-2 mt-4" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Correct', value: attempt.correct, icon: CheckCircle2, color: 'text-success' },
            { label: 'Incorrect', value: attempt.incorrect, icon: XCircle, color: 'text-destructive' },
            { label: 'Skipped', value: attempt.skipped, icon: Minus, color: 'text-muted-foreground' },
            { label: 'Time Taken', value: formatTime(attempt.timeTaken), icon: Clock, color: 'text-primary' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
                <Icon className={cn('h-5 w-5 mx-auto mb-1', s.color)} />
                <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Avg time */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Average time per question</span>
          </div>
          <span className="font-semibold">{formatTime(attempt.averageTime)}</span>
        </div>

        {/* Difficulty breakdown */}
        {difficultyAnalysis.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Difficulty Breakdown</h2>
            <div className="space-y-2">
              {difficultyAnalysis.map((d) => (
                <div key={d.diff} className="flex items-center gap-3">
                  <DifficultyBadge difficulty={d.diff as 'easy' | 'medium' | 'hard'} className="w-16 justify-center" />
                  <Progress value={d.accuracy} className="h-2 flex-1" />
                  <span className="text-sm font-semibold w-10 text-right">{d.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic chart (if multiple topics) */}
        {topicAnalysis.length > 1 && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Topic Performance</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topicAnalysis} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="topic" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Question review */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold">Question Review</h2>
          </div>
          <div className="divide-y divide-border">
            {attempt.questions.map((q, idx) => {
              const ans = attempt.answers.find((a) => a.questionId === q.id);
              if (!ans) return null;
              const correctOpt = q.options.find((o) => o.id === q.correctAnswer);
              const selectedOpt = ans.selected ? q.options.find((o) => o.id === ans.selected) : null;
              return (
                <details key={q.id} className="group">
                  <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors list-none">
                    <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">{idx + 1}</span>
                    {ans.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : ans.skipped ? (
                      <Minus className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <p className="text-sm flex-1 line-clamp-1">{q.question}</p>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </summary>
                  <div className="px-4 pb-4 pt-2 bg-muted/20 space-y-2">
                    {q.passage && <p className="text-xs italic text-muted-foreground border-l-2 border-border pl-3">{q.passage.substring(0, 150)}...</p>}
                    {selectedOpt && !ans.isCorrect && (
                      <p className="text-sm"><span className="text-destructive font-medium">Your answer: </span>{selectedOpt.text}</p>
                    )}
                    {correctOpt && (
                      <p className="text-sm"><span className="text-success font-medium">Correct: </span>{correctOpt.text}</p>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate(`/aptitude/topic/${attempt.topic}`)}>
            <BookOpen className="h-4 w-4 mr-2" /> Learn Topic
          </Button>
          <Button className="flex-1 gradient-primary" onClick={() => navigate(`/aptitude/practice/${attempt.topic}`)}>
            <RotateCcw className="h-4 w-4 mr-2" /> Practice Again
          </Button>
        </div>
      </div>
    </div>
  );
}
