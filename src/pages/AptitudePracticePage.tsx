import { useState, useCallback, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Flag, RotateCcw, Send, BookOpen, Clock, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAptitudeSession } from '@/features/aptitude/hooks/useAptitudeSession';
import { useAptitudeProgress } from '@/features/aptitude/hooks/useAptitudeProgress';
import { useAptitudeStreak } from '@/features/aptitude/hooks/useAptitudeStreak';
import { getQuestionsForTopic, filterQuestions } from '@/features/aptitude/questionRegistry';
import { TOPIC_REGISTRY, SECTION_CONFIG } from '@/features/aptitude/config';
import { OptionButton } from '@/features/aptitude/components/OptionButton';
import { PracticeTimer } from '@/features/aptitude/components/PracticeTimer';
import { ExplanationPanel } from '@/features/aptitude/components/ExplanationPanel';
import { QuestionPalette } from '@/features/aptitude/components/QuestionPalette';
import { DifficultyBadge } from '@/features/aptitude/components/DifficultyBadge';
import type { Difficulty, AptitudeQuestion } from '@/features/aptitude/types';

type PracticeMode = 'practice' | 'timed' | 'assessment';

export default function AptitudePracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { saveAttempt, updateTopicAfterAttempt, addWrongAnswersBatch } = useAptitudeProgress(user?.uid);
  const { recordToday } = useAptitudeStreak(user?.uid);
  const { session, startSession, selectAnswer, clearAnswer, toggleMark, goNext, goPrev, goTo, submitSession, clearSession } = useAptitudeSession();

  const [configMode, setConfigMode] = useState(true);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [showPalette, setShowPalette] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Config state
  const [count, setCount] = useState(parseInt(searchParams.get('count') ?? '10', 10));
  const [mode, setMode] = useState<PracticeMode>((searchParams.get('mode') as PracticeMode) ?? 'practice');
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>(
    (searchParams.get('difficulty') as Difficulty | 'mixed') ?? 'mixed'
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    parseInt(searchParams.get('time') ?? '0', 10)
  );

  const topic = TOPIC_REGISTRY.find((t) => t.id === topicId);

  // Load questions
  useEffect(() => {
    if (!topicId) return;
    setLoadingQuestions(true);
    setQuestionError(null);
    getQuestionsForTopic(topicId)
      .then((qs) => {
        const filtered = filterQuestions(qs, { difficulty: difficulty === 'mixed' ? undefined : difficulty, count, shuffle: true });
        setQuestions(filtered);
      })
      .catch((e) => setQuestionError(e instanceof Error ? e.message : 'Failed to load questions'))
      .finally(() => setLoadingQuestions(false));
  }, [topicId, count, difficulty]);

  const handleStart = useCallback(() => {
    if (!topic || questions.length === 0) return;
    const isAssessment = mode === 'assessment';
    const timeLimitActual = mode === 'timed' ? (timeLimitMinutes || count) : isAssessment ? count * 2 : undefined;
    startSession(
      {
        mode,
        label: `${topic.name} — ${mode === 'assessment' ? 'Assessment' : mode === 'timed' ? 'Timed Practice' : 'Practice'}`,
        section: topic.section,
        topic: topic.id,
        difficulty: difficulty,
        count: questions.length,
        timeLimitMinutes: timeLimitActual,
        revealAnswers: mode !== 'assessment',
      },
      questions
    );
    setConfigMode(false);
    setRevealedQuestions(new Set());
  }, [topic, questions, mode, timeLimitMinutes, count, difficulty, startSession]);

  const handleSelectAnswer = useCallback((optionId: string) => {
    if (!session) return;
    const q = session.questions[session.currentIndex];
    selectAnswer(q.id, optionId);
    // In practice mode, reveal answer immediately in local state
    if (session.config.revealAnswers) {
      setRevealedQuestions((prev) => new Set(prev).add(q.id));
    }
  }, [session, selectAnswer]);

  const handleSubmit = useCallback(async () => {
    if (!session || submitting) return;
    setSubmitting(true);
    const attempt = submitSession();
    if (!attempt) { setSubmitting(false); return; }

    // Collect wrong answers
    const wrongItems: { question: any; selected: string | null }[] = [];
    for (const ans of attempt.answers) {
      if (!ans.isCorrect && !ans.skipped) {
        const q = attempt.questions.find((qq) => qq.id === ans.questionId);
        if (q) wrongItems.push({ question: q, selected: ans.selected });
      }
    }

    // Launch background parallel non-blocking persistence
    const bgTasks: Promise<any>[] = [];
    if (wrongItems.length > 0) {
      bgTasks.push(addWrongAnswersBatch(wrongItems));
    }
    if (topicId) {
      bgTasks.push(updateTopicAfterAttempt(topicId, attempt.totalQuestions, attempt.correct, attempt.timeTaken));
    }
    bgTasks.push(recordToday());
    bgTasks.push(saveAttempt(attempt));

    void Promise.allSettled(bgTasks).catch((err) => {
      console.error('Background persistence error:', err);
    });

    // Navigate immediately to results (< 50ms transition)
    navigate(`/aptitude/results/${attempt.attemptId}`, { state: { attempt } });
  }, [session, submitting, submitSession, addWrongAnswersBatch, topicId, updateTopicAfterAttempt, recordToday, saveAttempt, navigate]);

  if (!topic) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Topic not found.</p></div>;
  }

  // Config screen
  if (configMode) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <div className="px-4 pt-6 pb-4 safe-top border-b border-border">
          <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate(`/aptitude/topic/${topicId}`)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {topic.name}
          </Button>
          <h1 className="text-xl font-bold">Practice Setup</h1>
          <p className="text-sm text-muted-foreground">{topic.name}</p>
        </div>
        <div className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
          {/* Questions count */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3">Number of Questions</p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, topic.questionCount].filter((v, i, a) => a.indexOf(v) === i).map((c) => (
                <button key={c} onClick={() => setCount(c)}
                  className={cn('rounded-xl border p-3 text-sm font-bold transition-all',
                    count === c ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:border-primary/30'
                  )}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3">Practice Mode</p>
            <div className="space-y-2">
              {[
                { id: 'practice' as PracticeMode, label: 'Normal Practice', desc: 'See answer and explanation after each question', icon: BookOpen },
                { id: 'timed' as PracticeMode, label: 'Timed Practice', desc: 'Race against the clock with immediate feedback', icon: Clock },
                { id: 'assessment' as PracticeMode, label: 'Assessment Mode', desc: 'No feedback until you submit. Simulates real test.', icon: Target },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={cn('w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                      mode === m.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0', mode === m.id ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <p className={cn('text-sm font-medium', mode === m.id ? 'text-primary' : '')}>{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3">Difficulty</p>
            <div className="grid grid-cols-4 gap-2">
              {(['mixed', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={cn('rounded-xl border p-2 text-xs font-semibold capitalize transition-all',
                    difficulty === d
                      ? d === 'easy' ? 'border-success bg-success/10 text-success'
                        : d === 'medium' ? 'border-warning bg-warning/10 text-warning'
                        : d === 'hard' ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >{d}</button>
              ))}
            </div>
          </div>

          {loadingQuestions ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : questionError ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">{questionError}</div>
          ) : (
            <Button onClick={handleStart} className="w-full gradient-primary" size="lg" disabled={questions.length === 0}>
              Start Practice ({questions.length} Questions)
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Practice screen
  if (!session) return null;
  const q = session.questions[session.currentIndex];
  const ans = session.answers[q.id];
  const isRevealed = session.config.revealAnswers && revealedQuestions.has(q.id);
  const isLastQuestion = session.currentIndex === session.questions.length - 1;
  const progressPct = ((session.currentIndex + 1) / session.questions.length) * 100;
  const totalSeconds = session.config.timeLimitMinutes ? session.config.timeLimitMinutes * 60 : 0;

  const answeredIndices = new Set(
    session.questions.map((sq, idx) => session.answers[sq.id]?.selected != null ? idx : -1).filter((i) => i >= 0)
  );
  const markedIndices = new Set(
    session.questions.map((sq, idx) => session.answers[sq.id]?.marked ? idx : -1).filter((i) => i >= 0)
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-2 flex items-center gap-3">
        <button onClick={() => { clearSession(); navigate(`/aptitude/topic/${topicId}`); }} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{topic.name}</p>
          <Progress value={progressPct} className="h-1.5 mt-0.5" />
        </div>
        <span className="text-sm font-mono font-semibold shrink-0">{session.currentIndex + 1}/{session.questions.length}</span>
        {session.timeRemainingSeconds !== null && (
          <PracticeTimer seconds={session.timeRemainingSeconds} totalSeconds={totalSeconds} />
        )}
        <button onClick={() => setShowPalette(!showPalette)} className="text-muted-foreground hover:text-foreground">
          <Target className="h-5 w-5" />
        </button>
      </div>

      {/* Palette drawer */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-muted/30 px-4 py-3"
          >
            <QuestionPalette
              total={session.questions.length}
              currentIndex={session.currentIndex}
              answered={answeredIndices}
              marked={markedIndices}
              onSelect={(i) => { goTo(i); setShowPalette(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <div className="flex-1 max-w-[800px] mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Question meta */}
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyBadge difficulty={q.difficulty} />
              {ans?.marked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 border border-warning/30 px-2 py-0.5 text-[11px] font-semibold text-warning">
                  <Flag className="h-3 w-3" /> Marked
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">~{q.estimatedTime}s</span>
            </div>

            {/* Passage */}
            {q.passage && (
              <div className="bg-muted/40 border border-border rounded-xl p-4 text-sm leading-relaxed italic">
                {q.passage}
              </div>
            )}

            {/* Question text */}
            <div className="text-base font-medium leading-relaxed">{q.question}</div>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((option, idx) => {
                const isSelected = ans?.selected === option.id;
                const isCorrect = isRevealed && option.id === q.correctAnswer;
                const isIncorrect = isRevealed && isSelected && option.id !== q.correctAnswer;
                return (
                  <OptionButton
                    key={option.id}
                    option={option}
                    index={idx}
                    selected={isSelected}
                    correct={isCorrect}
                    incorrect={isIncorrect}
                    disabled={isRevealed || session.isSubmitted}
                    onSelect={handleSelectAnswer}
                  />
                );
              })}
            </div>

            {/* Explanation */}
            {isRevealed && (
              <ExplanationPanel question={q} selected={ans?.selected ?? null} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 md:relative border-t border-border bg-background/95 backdrop-blur px-4 py-3 safe-bottom">
        <div className="max-w-[800px] mx-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => goPrev()} disabled={session.currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMark(q.id)}
            className={cn('flex-none', ans?.marked ? 'text-warning' : 'text-muted-foreground')}
          >
            <Flag className="h-4 w-4" />
          </Button>

          {ans?.selected && (
            <Button variant="ghost" size="sm" onClick={() => clearAnswer(q.id)} className="text-muted-foreground flex-none">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          <div className="flex-1" />

          {isLastQuestion ? (
            <Button
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="gradient-primary"
              size="sm"
            >
              <Send className="h-4 w-4 mr-1" />
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button size="sm" onClick={() => goNext()}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
