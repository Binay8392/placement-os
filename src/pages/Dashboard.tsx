import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Flame,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Video,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useDSAProgress } from '@/features/dsa/hooks/useDSAProgress';
import { useDSAContinueLearning } from '@/features/dsa/hooks/useDSAContinueLearning';
import {
  calculateStreak,
  getTodayString,
  type TrackedTask,
  useStore,
} from '@/lib/store';
import { ProgressRing } from '@/components/ProgressRing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const STUDY_GOAL_SECONDS = 2 * 60 * 60;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = 'primary',
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: 'primary' | 'success' | 'warning' | 'muted';
}) {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    muted: 'bg-muted text-muted-foreground',
  }[tone];

  return (
    <Card className="border-border/70 bg-card/75 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneClass)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="font-mono text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function TaskRow({
  task,
  onComplete,
}: {
  task: TrackedTask;
  onComplete: (id: string) => void;
}) {
  const difficultyClass = {
    Easy: 'text-success',
    Medium: 'text-warning',
    Hard: 'text-destructive',
  }[task.difficulty];

  return (
    <div className="group flex items-center gap-3 py-3">
      <Checkbox
        checked={false}
        onCheckedChange={() => onComplete(task.id)}
        aria-label={`Complete ${task.name}`}
        className="h-5 w-5 rounded-md"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{task.category}</span>
          <span aria-hidden="true">·</span>
          <span className={difficultyClass}>{task.difficulty}</span>
        </div>
      </div>
      <Badge variant="secondary" className="hidden font-normal text-muted-foreground sm:inline-flex">
        {task.source}
      </Badge>
      <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </div>
  );
}

export default function Dashboard() {
  const {
    habits,
    dsaTopics,
    studySessions,
    trackedTasks,
    leetCodeProgress,
    dailyActivities,
    aptitudeTopics,
    applications,
    profile,
    toggleTaskStatus,
  } = useStore();
  const { user } = useFirebaseAuth();
  const { allProgress } = useDSAProgress(user?.uid);
  const dsaVideoMetrics = useDSAContinueLearning(allProgress);

  const today = getTodayString();
  const firstName = user?.displayName?.split(' ')[0] || profile.name?.split(' ')[0] || 'there';
  const todayStudySeconds = studySessions
    .filter((session) => session.date === today)
    .reduce((total, session) => total + session.duration, 0);
  const codingSolved = dsaTopics.reduce((total, topic) => total + topic.questionsSolved, 0);
  const masteredTopics = dsaTopics.filter((topic) => topic.status === 'mastered').length;
  const pendingTasks = trackedTasks.filter((task) => task.status === 'Pending');
  const completedTasks = trackedTasks.filter((task) => task.status === 'Completed');
  const completedToday = completedTasks.filter((task) => task.completionDate === today).length;
  const goodHabits = habits.filter((habit) => habit.type === 'good');
  const habitsDoneToday = goodHabits.filter((habit) => habit.completedDates.includes(today)).length;
  const streak = useMemo(() => calculateStreak(dailyActivities), [dailyActivities]);
  const activeApplications = applications.filter(
    (application) => application.result === 'pending',
  );

  const weeklyActivity = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = toDateKey(date);
      const focusMinutes = Math.round(
        studySessions
          .filter((session) => session.date === key)
          .reduce((total, session) => total + session.duration, 0) / 60,
      );
      const tasks = trackedTasks.filter(
        (task) => task.status === 'Completed' && task.completionDate === key,
      ).length;

      return {
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: key,
        focusMinutes,
        tasks,
      };
    });
  }, [studySessions, trackedTasks]);

  const weekFocusSeconds = weeklyActivity.reduce(
    (total, day) => total + day.focusMinutes * 60,
    0,
  );

  const readiness = useMemo(() => {
    const leetCodeTotal =
      leetCodeProgress.easySolved +
      leetCodeProgress.mediumSolved +
      leetCodeProgress.hardSolved;
    const leetCodeTarget = Math.max(leetCodeProgress.target, 1);
    const roadmapCoverage = dsaTopics.length > 0 ? masteredTopics / dsaTopics.length : 0;
    const dsaVideoRatio = (dsaVideoMetrics.progressPercent || 0) / 100;
    const coding = clampScore(
      (leetCodeTotal / leetCodeTarget) * 40 + roadmapCoverage * 30 + dsaVideoRatio * 30,
    );

    const aptitudeAttempted = aptitudeTopics.reduce((total, topic) => total + topic.attempted, 0);
    const aptitudeCorrect = aptitudeTopics.reduce((total, topic) => total + topic.correct, 0);
    const aptitudeAccuracy = aptitudeAttempted > 0 ? aptitudeCorrect / aptitudeAttempted : 0;
    const aptitude = clampScore(
      aptitudeAccuracy * 70 + Math.min(aptitudeAttempted / 100, 1) * 30,
    );

    const csCompleted = completedTasks.filter(
      (task) => task.category === 'CS Fundamentals',
    ).length;
    const cs = clampScore(Math.min(csCompleted / 12, 1) * 100);

    const interviewCompleted = completedTasks.filter(
      (task) => task.category === 'Interview',
    ).length;
    const interviewStageCount = applications.filter(
      (application) => application.status === 'interview',
    ).length;
    const interview = clampScore(
      Math.min(interviewCompleted / 8, 1) * 70 + Math.min(interviewStageCount / 3, 1) * 30,
    );

    const consistency = clampScore(
      Math.min(streak.current / 14, 1) * 70 +
      Math.min(weeklyActivity.filter((day) => day.focusMinutes > 0).length / 7, 1) * 30,
    );

    const overall = clampScore(
      coding * 0.4 +
      aptitude * 0.15 +
      cs * 0.2 +
      interview * 0.15 +
      consistency * 0.1,
    );

    return {
      overall,
      areas: [
        { label: 'Coding & DSA', value: coding },
        { label: 'Core CS', value: cs },
        { label: 'Aptitude', value: aptitude },
        { label: 'Interviews', value: interview },
        { label: 'Consistency', value: consistency },
      ],
    };
  }, [
    aptitudeTopics,
    applications,
    completedTasks,
    dsaTopics.length,
    leetCodeProgress,
    masteredTopics,
    streak,
    weeklyActivity,
  ]);

  const weakestTopic = useMemo(() => {
    return [...dsaTopics]
      .filter((topic) => topic.status !== 'mastered')
      .sort((a, b) => a.confidence - b.confidence)[0];
  }, [dsaTopics]);

  const nextInterview = useMemo(() => {
    return [...applications]
      .filter(
        (application) =>
          application.interviewDate &&
          application.interviewDate >= today &&
          application.result === 'pending',
      )
      .sort((a, b) => (a.interviewDate || '').localeCompare(b.interviewDate || ''))[0];
  }, [applications, today]);

  const todayFocusPercent = clampScore((todayStudySeconds / STUDY_GOAL_SECONDS) * 100);
  const todayPlanTotal = pendingTasks.length + completedToday;
  const todayPlanPercent = todayPlanTotal > 0
    ? clampScore((completedToday / todayPlanTotal) * 100)
    : 0;

  return (
    <div className="dashboard-canvas min-h-full pb-24 md:pb-10">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {getGreeting()}, {firstName}.
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Here’s your placement pulse. Pick the highest-leverage task and keep the streak alive.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-9 gap-2 rounded-lg border-border/70 bg-card/70 px-3 font-normal">
              <Flame className="h-4 w-4 text-warning" />
              <span className="font-mono font-semibold text-foreground">{streak.current}</span>
              day streak
            </Badge>
            <Button asChild className="h-9">
              <Link to="/timer">
                <Play className="h-4 w-4 fill-current" />
                Start focus session
              </Link>
            </Button>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Progress overview">
          <MetricCard
            title="Focus today"
            value={formatDuration(todayStudySeconds)}
            detail={`${todayFocusPercent}% of your 2 hour target`}
            icon={Clock3}
          />
          <MetricCard
            title="Problems solved"
            value={codingSolved.toLocaleString('en-IN')}
            detail={`${masteredTopics} of ${dsaTopics.length} topics mastered`}
            icon={Code2}
            tone="success"
          />
          <MetricCard
            title="Tasks completed"
            value={completedToday.toString()}
            detail={pendingTasks.length > 0 ? `${pendingTasks.length} still in your queue` : 'Your queue is clear'}
            icon={BookOpenCheck}
            tone="warning"
          />
          <MetricCard
            title="Active applications"
            value={activeApplications.length.toString()}
            detail={nextInterview ? `Next: ${nextInterview.company} interview` : 'Keep your pipeline current'}
            icon={BriefcaseBusiness}
            tone="muted"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-12">
          <Card className="readiness-card overflow-hidden border-border/70 shadow-sm xl:col-span-8">
            <CardContent className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[220px_1fr] lg:items-center">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative">
                  <ProgressRing progress={readiness.overall} size={176} strokeWidth={10}>
                    <div className="text-center">
                      <p className="font-mono text-4xl font-semibold tracking-tight">
                        {readiness.overall}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Readiness
                      </p>
                    </div>
                  </ProgressRing>
                  <div className="absolute -right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-primary/25 bg-background text-primary shadow-sm">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-3 gap-1.5 bg-primary/10 text-primary">
                    <Sparkles className="h-3 w-3" />
                    Placement readiness
                  </Badge>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {readiness.overall >= 75
                      ? 'You’re entering interview-ready territory.'
                      : readiness.overall >= 45
                        ? 'Your preparation engine is building momentum.'
                        : 'Your strongest gains are still ahead.'}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    This score combines coding, core CS, aptitude, interview work, and consistency from your actual PrepTrack activity.
                  </p>
                </div>

                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {readiness.areas.map((area) => (
                    <div key={area.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{area.label}</span>
                        <span className="font-mono font-medium">{area.value}%</span>
                      </div>
                      <Progress value={area.value} className="h-1.5 bg-muted/80" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/75 shadow-sm xl:col-span-4">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-5 pb-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Today’s execution</p>
                <CardTitle className="mt-1 text-lg">Daily operating plan</CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-5 pt-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Plan completion</span>
                  <span className="font-mono font-medium">{todayPlanPercent}%</span>
                </div>
                <Progress value={todayPlanPercent} className="h-2" />
              </div>
              <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border/70 bg-muted/30 py-3 text-center">
                <div>
                  <p className="font-mono text-lg font-semibold">{completedToday}</p>
                  <p className="text-[10px] text-muted-foreground">Done</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">{pendingTasks.length}</p>
                  <p className="text-[10px] text-muted-foreground">Queued</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold">{habitsDoneToday}/{goodHabits.length}</p>
                  <p className="text-[10px] text-muted-foreground">Habits</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to="/daily-plan">
                  Open today’s plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-12">
          <Card className="border-border/70 bg-card/75 shadow-sm xl:col-span-7">
            <CardHeader className="flex-row items-start justify-between space-y-0 p-5 pb-2 sm:p-6 sm:pb-2">
              <div>
                <CardTitle className="text-base">Focus queue</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Finish what matters before adding more.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link to="/tasks">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="px-5 pb-4 sm:px-6">
              {pendingTasks.length > 0 ? (
                <div className="divide-y divide-border/70">
                  {pendingTasks.slice(0, 4).map((task) => (
                    <TaskRow key={task.id} task={task} onComplete={toggleTaskStatus} />
                  ))}
                </div>
              ) : (
                <div className="my-4 flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/25 px-5 py-8 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Your task queue is clear</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    Plan the next focused block so tomorrow starts with a decision already made.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link to="/tasks">Add a focused task</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/75 shadow-sm xl:col-span-5">
            <CardHeader className="flex-row items-start justify-between space-y-0 p-5 pb-0 sm:p-6 sm:pb-0">
              <div>
                <CardTitle className="text-base">Weekly momentum</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDuration(weekFocusSeconds)} of focused study this week
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="h-64 p-3 pt-6 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 6" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    dy={8}
                  />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeOpacity: 0.2 }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-md)',
                      color: 'hsl(var(--popover-foreground))',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} min`, 'Focus time']}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="focusMinutes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#focusGradient)"
                    activeDot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/70 bg-card/75 shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Video className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="font-mono font-semibold text-primary">
                  {dsaVideoMetrics.progressPercent}%
                </Badge>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                DSA Video Roadmap
              </p>
              <h3 className="text-base font-semibold truncate">
                {dsaVideoMetrics.continueVideo.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                Topic: {dsaVideoMetrics.continueVideo.topic} · {dsaVideoMetrics.completedCount} / {dsaVideoMetrics.totalVideos} lectures completed
              </p>
              <Progress value={dsaVideoMetrics.progressPercent} className="h-1.5 mt-2" />
              <Button asChild variant="link" className="mt-2 h-auto p-0">
                <Link to={`/dsa/video/${dsaVideoMetrics.continueVideo.videoId}`}>
                  Continue Learning <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/75 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-normal">
                  {nextInterview ? 'Upcoming' : `${activeApplications.length} active`}
                </Badge>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Placement pipeline
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                {nextInterview ? `${nextInterview.company} · ${nextInterview.role}` : 'Keep your pipeline moving'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {nextInterview?.interviewDate
                  ? `Interview on ${new Date(`${nextInterview.interviewDate}T12:00:00`).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}. Review the role and rehearse your strongest stories.`
                  : 'Track every application, assessment, follow-up, and outcome in one reliable timeline.'}
              </p>
              <Button asChild variant="link" className="mt-3 h-auto p-0">
                <Link to="/placements">Open placement tracker <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/75 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Trophy className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-normal">AI guided</Badge>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Interview gym
              </p>
              <h3 className="mt-2 text-lg font-semibold">Practice before it counts</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Run a timed mock, sharpen your reasoning, and turn feedback into the next practice loop.
              </p>
              <Button asChild variant="link" className="mt-3 h-auto p-0">
                <Link to="/mock-interview">Start a mock interview <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <Separator className="opacity-60" />

        <footer className="flex flex-col justify-between gap-2 pb-2 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>PrepTrack turns daily effort into placement readiness.</p>
          <div className="flex items-center gap-4">
            <Link to="/analytics" className="transition-colors hover:text-foreground">View analytics</Link>
            <Link to="/reflect" className="transition-colors hover:text-foreground">Reflect on today</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
