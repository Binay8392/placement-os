import { useMemo, useEffect, useState } from 'react';
import { useStore, getStudyTimeForPeriod, getTodayString, calculateStreak } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Flame, BookOpen, Code2, Brain,
  CheckCircle2, Clock, Zap, BarChart3, ListChecks
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar,
  LineChart, Line
} from 'recharts';
import { ProgressRing } from '@/components/ProgressRing';

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function getLastNDays(n: number): string[] {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display}{suffix}</>;
}

function getReadinessLabel(score: number) {
  if (score >= 86) return { text: 'Highly Placement Ready', color: 'text-success' };
  if (score >= 71) return { text: 'Placement Ready', color: 'text-success' };
  if (score >= 51) return { text: 'Placement Ready Soon', color: 'text-warning' };
  if (score >= 31) return { text: 'Improving', color: 'text-warning' };
  return { text: 'Beginner', color: 'text-destructive' };
}

export default function AnalyticsPage() {
  const { studySessions, habits, dsaTopics, aptitudeTopics, trackedTasks, leetCodeProgress, dailyActivities } = useStore();
  const today = getTodayString();

  const studyChartData = useMemo(() => {
    const last7Days = getLastNDays(7);
    return last7Days.map((date) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const daySessions = studySessions.filter((s) => s.date === date);
      const totalMins = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
      return { day: dayName, minutes: totalMins, date };
    });
  }, [studySessions]);

  const categoryData = useMemo(() => {
    const weekSessions = getStudyTimeForPeriod(studySessions, 7);
    const categories = {
      dsa: { name: 'DSA', time: 0, color: 'hsl(var(--primary))' },
      aptitude: { name: 'Aptitude', time: 0, color: 'hsl(var(--success))' },
      'core-cs': { name: 'Core CS', time: 0, color: 'hsl(var(--warning))' },
      development: { name: 'Dev', time: 0, color: 'hsl(var(--destructive))' },
    };
    weekSessions.forEach((s) => {
      if (categories[s.category]) categories[s.category].time += s.duration;
    });
    return Object.values(categories).map((c) => ({ ...c, minutes: Math.round(c.time / 60) }));
  }, [studySessions]);

  const habitStats = useMemo(() => {
    const goodHabits = habits.filter((h) => h.type === 'good');
    const last7Days = getLastNDays(7);
    let totalPossible = 0, totalCompleted = 0;
    goodHabits.forEach((habit) => {
      last7Days.forEach((date) => { totalPossible++; if (habit.completedDates.includes(date)) totalCompleted++; });
    });
    const successRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    const avgStreak = goodHabits.length > 0 ? Math.round(goodHabits.reduce((acc, h) => acc + h.streak, 0) / goodHabits.length) : 0;
    return { successRate, avgStreak, totalHabits: goodHabits.length };
  }, [habits]);

  const dsaStats = useMemo(() => {
    const mastered = dsaTopics.filter((t) => t.status === 'mastered').length;
    const inProgress = dsaTopics.filter((t) => t.status === 'in-progress').length;
    const notStarted = dsaTopics.filter((t) => t.status === 'not-started').length;
    const totalQuestions = dsaTopics.reduce((acc, t) => acc + t.questionsSolved, 0);
    return { mastered, inProgress, notStarted, total: dsaTopics.length, progress: Math.round((mastered / dsaTopics.length) * 100), totalQuestions };
  }, [dsaTopics]);

  const aptitudeStats = useMemo(() => {
    const sections = { quantitative: { attempted: 0, correct: 0 }, logical: { attempted: 0, correct: 0 }, verbal: { attempted: 0, correct: 0 } };
    aptitudeTopics.forEach((t) => { sections[t.section].attempted += t.attempted; sections[t.section].correct += t.correct; });
    const totalAttempted = aptitudeTopics.reduce((acc, t) => acc + t.attempted, 0);
    const totalCorrect = aptitudeTopics.reduce((acc, t) => acc + t.correct, 0);
    return {
      sections: Object.entries(sections).map(([name, stats]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0, attempted: stats.attempted,
      })),
      totalAttempted,
      overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
    };
  }, [aptitudeTopics]);

  // Task stats
  const taskStats = useMemo(() => {
    const total = trackedTasks.length;
    const completed = trackedTasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const byCategory = trackedTasks.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + (t.status === 'Completed' ? 1 : 0); return acc; }, {} as Record<string, number>);
    return { total, completed, pending, percentage: total > 0 ? Math.round((completed / total) * 100) : 0, byCategory };
  }, [trackedTasks]);

  // Streak
  const streak = useMemo(() => calculateStreak(dailyActivities), [dailyActivities]);

  // Weekly task progress
  const weeklyTaskData = useMemo(() => {
    const last7Days = getLastNDays(7);
    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const completed = trackedTasks.filter(t => t.completionDate === date).length;
      return { day: dayName, completed };
    });
  }, [trackedTasks]);

  // PLACEMENT READINESS SCORE (Module 2)
  const readinessScore = useMemo(() => {
    // Coding Score (40%)
    const codingTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'Coding');
    const codingPoints = codingTasks.reduce((acc, t) => acc + (t.difficulty === 'Easy' ? 1 : t.difficulty === 'Medium' ? 2 : 3), 0);
    const lcPoints = leetCodeProgress.easySolved * 1 + leetCodeProgress.mediumSolved * 2 + leetCodeProgress.hardSolved * 3;
    const codingScore = Math.min(Math.round(((codingPoints + lcPoints) / 100) * 100), 100);

    // Aptitude Score (20%)
    const aptitudeScore = aptitudeStats.overallAccuracy;

    // CS Fundamentals Score (20%)
    const csTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'CS Fundamentals');
    const csScore = Math.min(csTasks.length * 8, 100);

    // Consistency Score (10%)
    const consistencyScore = Math.min(streak.current * 10, 100);

    // Interview Prep Score (10%)
    const interviewTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'Interview');
    const interviewScore = Math.min(interviewTasks.length * 10, 100);

    const total = Math.round(
      codingScore * 0.4 + aptitudeScore * 0.2 + csScore * 0.2 + consistencyScore * 0.1 + interviewScore * 0.1
    );

    return {
      total,
      label: getReadinessLabel(total),
      breakdown: [
        { name: 'Coding', value: codingScore, weight: '40%', color: 'hsl(var(--primary))' },
        { name: 'Aptitude', value: aptitudeScore, weight: '20%', color: 'hsl(var(--success))' },
        { name: 'CS Fund.', value: csScore, weight: '20%', color: 'hsl(var(--warning))' },
        { name: 'Consistency', value: consistencyScore, weight: '10%', color: 'hsl(var(--accent))' },
        { name: 'Interview', value: interviewScore, weight: '10%', color: 'hsl(var(--destructive))' },
      ],
    };
  }, [trackedTasks, leetCodeProgress, aptitudeStats, streak]);

  const radialData = [{ name: 'Readiness', value: readinessScore.total, fill: 'url(#readinessGradient)' }];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">Your placement intelligence overview</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Placement Readiness Score - Hero */}
        <motion.section initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-32 h-32 shrink-0">
              <ProgressRing progress={readinessScore.total} size={128} strokeWidth={12}>
                <div className="text-center">
                  <p className="text-3xl font-bold"><AnimatedCounter value={readinessScore.total} /></p>
                  <p className="text-[10px] text-muted-foreground">/100</p>
                </div>
              </ProgressRing>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg mb-1">Placement Readiness</h2>
              <p className={cn("text-sm font-medium mb-3", readinessScore.label.color)}>
                {readinessScore.label.text}
              </p>
              <div className="space-y-1.5">
                {readinessScore.breakdown.map((item) => (
                  <div key={item.name} className="text-xs">
                    <div className="flex justify-between text-muted-foreground mb-0.5">
                      <span>{item.name} ({item.weight})</span>
                      <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Streak & Task Overview */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-warning" />
              <span className="text-xs text-muted-foreground">Daily Streak</span>
            </div>
            <p className="text-3xl font-bold text-warning"><AnimatedCounter value={streak.current} /></p>
            <p className="text-xs text-muted-foreground mt-1">Best: {streak.longest} days</p>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
            className="glass-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Tasks</span>
            </div>
            <p className="text-3xl font-bold"><AnimatedCounter value={taskStats.completed} /><span className="text-lg text-muted-foreground">/{taskStats.total}</span></p>
            <p className="text-xs text-muted-foreground mt-1">{taskStats.percentage}% done</p>
          </motion.div>
        </div>

        {/* Weekly Task Progress Line Chart */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weekly Task Completion
          </h2>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTaskData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis hide />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Study Time Trend */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              Study Time (7 Days)
            </h2>
            <span className="text-sm text-muted-foreground">
              {formatDuration(studyChartData.reduce((acc, d) => acc + d.minutes * 60, 0))} total
            </span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyChartData}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis hide />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#studyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Category Distribution */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            Time by Category
          </h2>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={60} />
                <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Habit Success</span>
            </div>
            <p className="text-2xl font-bold text-success">{habitStats.successRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{habitStats.avgStreak} day avg streak</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">DSA Mastery</span>
            </div>
            <p className="text-2xl font-bold text-primary">{dsaStats.progress}%</p>
            <p className="text-xs text-muted-foreground mt-1">{dsaStats.mastered}/{dsaStats.total} topics</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Aptitude</span>
            </div>
            <p className="text-2xl font-bold text-warning">{aptitudeStats.overallAccuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">{aptitudeStats.totalAttempted} questions</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">DSA Solved</span>
            </div>
            <p className="text-2xl font-bold">{dsaStats.totalQuestions}</p>
            <p className="text-xs text-muted-foreground mt-1">{dsaStats.mastered} mastered</p>
          </div>
        </section>

        {/* Category-wise Task Breakdown */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <ListChecks className="w-4 h-4 text-primary" />
            Tasks by Category
          </h2>
          <div className="space-y-2">
            {['Coding', 'Aptitude', 'CS Fundamentals', 'Interview', 'Project', 'Other'].map(cat => {
              const total = trackedTasks.filter(t => t.category === cat).length;
              const completed = trackedTasks.filter(t => t.category === cat && t.status === 'Completed').length;
              if (total === 0) return null;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{cat}</span>
                    <span className="text-muted-foreground">{completed}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Aptitude by Section */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            Aptitude by Section
          </h2>
          <div className="space-y-3">
            {aptitudeStats.sections.map((section) => (
              <div key={section.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{section.name}</span>
                  <span className={cn("font-medium",
                    section.accuracy >= 70 ? "text-success" : section.accuracy >= 50 ? "text-warning" : section.accuracy > 0 ? "text-destructive" : "text-muted-foreground"
                  )}>{section.accuracy}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all",
                    section.accuracy >= 70 ? "bg-success" : section.accuracy >= 50 ? "bg-warning" : "bg-destructive"
                  )} style={{ width: `${section.accuracy}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{section.attempted} questions attempted</p>
              </div>
            ))}
          </div>
        </section>

        {/* DSA Topic Status Pie */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <Code2 className="w-4 h-4 text-primary" />
            DSA Topic Status
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Mastered', value: dsaStats.mastered, fill: 'hsl(var(--success))' },
                      { name: 'In Progress', value: dsaStats.inProgress, fill: 'hsl(var(--warning))' },
                      { name: 'Not Started', value: dsaStats.notStarted, fill: 'hsl(var(--muted))' },
                    ]}
                    cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Mastered', value: dsaStats.mastered, color: 'bg-success' },
                { label: 'In Progress', value: dsaStats.inProgress, color: 'bg-warning' },
                { label: 'Not Started', value: dsaStats.notStarted, color: 'bg-muted' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
