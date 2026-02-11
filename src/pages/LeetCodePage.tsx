import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Code2, Target, TrendingUp, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressRing } from '@/components/ProgressRing';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function LeetCodePage() {
  const { leetCodeProgress, updateLeetCodeProgress } = useStore();
  const { easySolved, mediumSolved, hardSolved, target } = leetCodeProgress;

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const codingStrength = Math.min(
    Math.round((easySolved * 1 + mediumSolved * 2 + hardSolved * 3) / Math.max(target * 1.5, 1) * 100),
    100
  );
  const progressPercent = Math.min(Math.round((totalSolved / target) * 100), 100);

  const pieData = [
    { name: 'Easy', value: easySolved, color: 'hsl(var(--success))' },
    { name: 'Medium', value: mediumSolved, color: 'hsl(var(--warning))' },
    { name: 'Hard', value: hardSolved, color: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Easy', solved: easySolved, fill: 'hsl(var(--success))' },
    { name: 'Medium', solved: mediumSolved, fill: 'hsl(var(--warning))' },
    { name: 'Hard', solved: hardSolved, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          LeetCode Tracker
        </h1>
        <p className="text-muted-foreground text-sm">Track your coding problem progress</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Progress Ring */}
        <motion.section initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center py-4">
          <ProgressRing progress={progressPercent} size={180} strokeWidth={14}>
            <div className="text-center">
              <motion.p className="text-4xl font-bold"
                key={totalSolved}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {totalSolved}
              </motion.p>
              <p className="text-xs text-muted-foreground">/ {target} target</p>
            </div>
          </ProgressRing>
          <p className="text-sm text-muted-foreground mt-3">{progressPercent}% of target reached</p>
        </motion.section>

        {/* Input Section */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Update Progress
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-success">Easy Solved</Label>
              <Input type="number" min={0} value={easySolved}
                onChange={(e) => updateLeetCodeProgress({ easySolved: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label className="text-warning">Medium Solved</Label>
              <Input type="number" min={0} value={mediumSolved}
                onChange={(e) => updateLeetCodeProgress({ mediumSolved: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label className="text-destructive">Hard Solved</Label>
              <Input type="number" min={0} value={hardSolved}
                onChange={(e) => updateLeetCodeProgress({ hardSolved: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Target Problems</Label>
              <Input type="number" min={1} value={target}
                onChange={(e) => updateLeetCodeProgress({ target: parseInt(e.target.value) || 200 })} />
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Coding Strength</span>
            </div>
            <p className="text-2xl font-bold text-primary">{codingStrength}%</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <motion.div className="h-full gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${codingStrength}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Total Solved</span>
            </div>
            <p className="text-2xl font-bold">{totalSolved}</p>
            <p className="text-xs text-muted-foreground mt-1">
              E:{easySolved} M:{mediumSolved} H:{hardSolved}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {totalSolved > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-4">
              <h2 className="font-semibold mb-3 text-sm">By Difficulty</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                      paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-4">
            <h2 className="font-semibold mb-3 text-sm">Progress Breakdown</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis hide />
                  <Bar dataKey="solved" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
