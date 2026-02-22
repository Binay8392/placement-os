import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewResult } from '@/lib/interviewTypes';
import { getInterviewResults, getStreak, getXP, getBadges } from '@/lib/interviewStorage';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { Flame, Zap, Trophy, BarChart3 } from 'lucide-react';

export default function InterviewAnalytics() {
  const results = useMemo(() => getInterviewResults(), []);
  const streak = getStreak();
  const xp = getXP();
  const badges = useMemo(() => getBadges(results), [results]);

  if (results.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        <p className="text-lg">No interviews yet. Take one to see analytics!</p>
      </div>
    );
  }

  const avgScore = Math.round(results.reduce((s, r) => s + r.scores.overall, 0) / results.length);

  const scoreOverTime = results.slice(0, 10).reverse().map((r, i) => ({
    name: `#${i + 1}`,
    score: r.scores.overall,
  }));

  const typePerformance = ['technical', 'hr', 'dsa', 'system-design'].map(type => {
    const typeResults = results.filter(r => r.config.type === type);
    return {
      type: type.replace('-', ' '),
      avg: typeResults.length ? Math.round(typeResults.reduce((s, r) => s + r.scores.overall, 0) / typeResults.length) : 0,
      count: typeResults.length,
    };
  }).filter(t => t.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Interviews', value: results.length, icon: BarChart3, color: 'text-primary' },
          { label: 'Avg Score', value: `${avgScore}/100`, icon: Trophy, color: 'text-yellow-400' },
          { label: 'Streak', value: `${streak} 🔥`, icon: Flame, color: 'text-orange-400' },
          { label: 'XP Points', value: xp, icon: Zap, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Score over time */}
      {scoreOverTime.length > 1 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Score Progress</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreOverTime}>
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Type performance */}
      {typePerformance.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Performance by Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typePerformance}>
                <XAxis dataKey="type" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Badges</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div key={b.name}
                className={`text-center p-3 rounded-xl border transition-all ${b.earned
                  ? 'border-primary/30 bg-primary/5' : 'border-border opacity-40 grayscale'
                }`}>
                <span className="text-2xl">{b.icon}</span>
                <p className="text-[10px] font-medium mt-1 text-foreground">{b.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
