import { useMemo } from 'react';
import { useStore, getStudyTimeForPeriod, getTodayString } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  BookOpen, 
  Code2, 
  Brain,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Helper to format minutes/hours
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

// Get last N days as labels
function getLastNDays(n: number): string[] {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

export default function AnalyticsPage() {
  const { studySessions, habits, dsaTopics, aptitudeTopics } = useStore();
  const today = getTodayString();

  // Study time data for last 7 days
  const studyChartData = useMemo(() => {
    const last7Days = getLastNDays(7);
    return last7Days.map((date) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const daySessions = studySessions.filter((s) => s.date === date);
      const totalMins = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
      return { day: dayName, minutes: totalMins, date };
    });
  }, [studySessions]);

  // Study time by category
  const categoryData = useMemo(() => {
    const weekSessions = getStudyTimeForPeriod(studySessions, 7);
    const categories = {
      dsa: { name: 'DSA', time: 0, color: 'hsl(var(--primary))' },
      aptitude: { name: 'Aptitude', time: 0, color: 'hsl(var(--success))' },
      'core-cs': { name: 'Core CS', time: 0, color: 'hsl(var(--warning))' },
      development: { name: 'Dev', time: 0, color: 'hsl(var(--destructive))' },
    };
    
    weekSessions.forEach((s) => {
      if (categories[s.category]) {
        categories[s.category].time += s.duration;
      }
    });
    
    return Object.values(categories).map((c) => ({
      ...c,
      minutes: Math.round(c.time / 60),
    }));
  }, [studySessions]);

  // Habit success rates
  const habitStats = useMemo(() => {
    const goodHabits = habits.filter((h) => h.type === 'good');
    const last7Days = getLastNDays(7);
    
    let totalPossible = 0;
    let totalCompleted = 0;
    
    goodHabits.forEach((habit) => {
      last7Days.forEach((date) => {
        totalPossible++;
        if (habit.completedDates.includes(date)) {
          totalCompleted++;
        }
      });
    });
    
    const successRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    const avgStreak = goodHabits.length > 0 
      ? Math.round(goodHabits.reduce((acc, h) => acc + h.streak, 0) / goodHabits.length)
      : 0;
    
    return { successRate, avgStreak, totalHabits: goodHabits.length };
  }, [habits]);

  // DSA progress
  const dsaStats = useMemo(() => {
    const mastered = dsaTopics.filter((t) => t.status === 'mastered').length;
    const inProgress = dsaTopics.filter((t) => t.status === 'in-progress').length;
    const notStarted = dsaTopics.filter((t) => t.status === 'not-started').length;
    const totalQuestions = dsaTopics.reduce((acc, t) => acc + t.questionsSolved, 0);
    const avgConfidence = dsaTopics.length > 0
      ? Math.round((dsaTopics.reduce((acc, t) => acc + t.confidence, 0) / dsaTopics.length) * 20)
      : 0;
    
    return {
      mastered,
      inProgress,
      notStarted,
      total: dsaTopics.length,
      progress: Math.round((mastered / dsaTopics.length) * 100),
      totalQuestions,
      avgConfidence,
    };
  }, [dsaTopics]);

  // Aptitude progress
  const aptitudeStats = useMemo(() => {
    const sections = {
      quantitative: { attempted: 0, correct: 0 },
      logical: { attempted: 0, correct: 0 },
      verbal: { attempted: 0, correct: 0 },
    };
    
    aptitudeTopics.forEach((t) => {
      sections[t.section].attempted += t.attempted;
      sections[t.section].correct += t.correct;
    });
    
    const totalAttempted = aptitudeTopics.reduce((acc, t) => acc + t.attempted, 0);
    const totalCorrect = aptitudeTopics.reduce((acc, t) => acc + t.correct, 0);
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    
    return {
      sections: Object.entries(sections).map(([name, stats]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
        attempted: stats.attempted,
      })),
      totalAttempted,
      overallAccuracy,
    };
  }, [aptitudeTopics]);

  // Overall Placement Readiness Score (weighted composite)
  const readinessScore = useMemo(() => {
    const dsaWeight = 0.35;
    const aptitudeWeight = 0.25;
    const habitWeight = 0.20;
    const studyWeight = 0.20;

    const dsaScore = dsaStats.progress;
    const aptitudeScore = aptitudeStats.overallAccuracy;
    const habitScore = habitStats.successRate;
    
    // Study consistency: target 2 hours/day average
    const weekStudyMins = studyChartData.reduce((acc, d) => acc + d.minutes, 0);
    const avgDailyMins = weekStudyMins / 7;
    const studyScore = Math.min(Math.round((avgDailyMins / 120) * 100), 100);

    const total = Math.round(
      (dsaScore * dsaWeight) +
      (aptitudeScore * aptitudeWeight) +
      (habitScore * habitWeight) +
      (studyScore * studyWeight)
    );

    return {
      total,
      breakdown: [
        { name: 'DSA', value: dsaScore, weight: dsaWeight },
        { name: 'Aptitude', value: aptitudeScore, weight: aptitudeWeight },
        { name: 'Habits', value: habitScore, weight: habitWeight },
        { name: 'Study', value: studyScore, weight: studyWeight },
      ],
    };
  }, [dsaStats, aptitudeStats, habitStats, studyChartData]);

  // Radial chart data for readiness
  const radialData = [
    { name: 'Readiness', value: readinessScore.total, fill: 'url(#readinessGradient)' },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your placement readiness</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Placement Readiness Score */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  data={radialData}
                >
                  <defs>
                    <linearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(210 90% 55%)" />
                    </linearGradient>
                  </defs>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: 'hsl(var(--muted))' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-bold">{readinessScore.total}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Placement Readiness
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {readinessScore.breakdown.map((item) => (
                  <div key={item.name} className="text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{item.name}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full gradient-primary rounded-full transition-all"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Study Time Trend */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Study Time (7 Days)
            </h2>
            <span className="text-sm text-muted-foreground">
              {formatDuration(studyChartData.reduce((acc, d) => acc + d.minutes * 60, 0))} total
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyChartData}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#studyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Category Distribution */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Time by Category
          </h2>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  width={60}
                />
                <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Habit Success */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Habit Success</span>
            </div>
            <p className="text-2xl font-bold text-success">{habitStats.successRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {habitStats.avgStreak} day avg streak
            </p>
          </div>

          {/* DSA Progress */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">DSA Mastery</span>
            </div>
            <p className="text-2xl font-bold text-primary">{dsaStats.progress}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dsaStats.mastered}/{dsaStats.total} topics
            </p>
          </div>

          {/* Aptitude Accuracy */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Aptitude Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-warning">{aptitudeStats.overallAccuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {aptitudeStats.totalAttempted} questions
            </p>
          </div>

          {/* Questions Solved */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">DSA Solved</span>
            </div>
            <p className="text-2xl font-bold">{dsaStats.totalQuestions}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dsaStats.avgConfidence}% avg confidence
            </p>
          </div>
        </section>

        {/* Aptitude by Section */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Aptitude by Section
          </h2>
          <div className="space-y-3">
            {aptitudeStats.sections.map((section) => (
              <div key={section.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{section.name}</span>
                  <span className={cn(
                    "font-medium",
                    section.accuracy >= 70 ? "text-success" :
                    section.accuracy >= 50 ? "text-warning" :
                    section.accuracy > 0 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {section.accuracy}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      section.accuracy >= 70 ? "bg-success" :
                      section.accuracy >= 50 ? "bg-warning" :
                      "bg-destructive"
                    )}
                    style={{ width: `${section.accuracy}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {section.attempted} questions attempted
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DSA Topic Status */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
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
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm">Mastered</span>
                <span className="text-sm font-medium ml-auto">{dsaStats.mastered}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm">In Progress</span>
                <span className="text-sm font-medium ml-auto">{dsaStats.inProgress}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm">Not Started</span>
                <span className="text-sm font-medium ml-auto">{dsaStats.notStarted}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
