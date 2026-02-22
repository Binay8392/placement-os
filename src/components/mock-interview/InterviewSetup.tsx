import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  InterviewConfig, InterviewType, Difficulty,
  INTERVIEW_TYPES, ROLES, COMPANY_STYLES, DIFFICULTY_CONFIG,
} from '@/lib/interviewTypes';
import { Zap } from 'lucide-react';

interface Props { onStart: (config: InterviewConfig) => void; }

export default function InterviewSetup({ onStart }: Props) {
  const [type, setType] = useState<InterviewType>('technical');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [role, setRole] = useState(ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [rapidFire, setRapidFire] = useState(false);
  const [companyStyle, setCompanyStyle] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  const dc = DIFFICULTY_CONFIG[difficulty];
  const finalRole = role === 'Custom' ? customRole : role;

  const handleStart = () => {
    if (!finalRole.trim()) return;
    onStart({
      type, difficulty, role: finalRole,
      questionCount: dc.questions,
      timerPerQuestion: rapidFire ? 30 : dc.timer,
      rapidFire,
      companyStyle: companyStyle || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 p-4 pb-24"
    >
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Mock Interview
        </motion.h1>
        <p className="text-muted-foreground">Configure your interview session</p>
      </div>

      {/* Interview Type */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Interview Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INTERVIEW_TYPES.map((t) => (
            <motion.div key={t.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`cursor-pointer transition-all border-2 ${type === t.value
                  ? 'border-primary bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
                  : 'border-transparent hover:border-primary/30'
                }`}
                onClick={() => setType(t.value)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {type === 'custom' && (
          <Input placeholder="Enter custom topic (e.g. React Hooks, SQL Joins)" value={customTopic} onChange={e => setCustomTopic(e.target.value)} />
        )}
      </section>

      {/* Difficulty */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</h2>
        <div className="flex gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
            const cfg = DIFFICULTY_CONFIG[d];
            return (
              <motion.button key={d} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(d)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${difficulty === d
                  ? 'border-primary bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.1)]'
                  : 'border-border hover:border-primary/30'
                }`}>
                <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cfg.questions} questions · {cfg.timer}s each</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Role */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Target Role</h2>
        <div className="flex flex-wrap gap-2">
          {[...ROLES, 'Custom'].map((r) => (
            <Badge key={r} variant={role === r ? 'default' : 'outline'}
              className="cursor-pointer text-sm px-4 py-2 transition-all hover:scale-105"
              onClick={() => setRole(r)}>
              {r}
            </Badge>
          ))}
        </div>
        {role === 'Custom' && (
          <Input placeholder="Enter your target role" value={customRole} onChange={e => setCustomRole(e.target.value)} />
        )}
      </section>

      {/* Company Style */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company Style <span className="text-xs text-muted-foreground">(optional)</span></h2>
        <div className="flex gap-3">
          {COMPANY_STYLES.map((c) => (
            <motion.button key={c.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setCompanyStyle(companyStyle === c.value ? '' : c.value)}
              className={`flex-1 p-3 rounded-xl border-2 transition-all text-center ${companyStyle === c.value
                ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}>
              <span className="text-xl">{c.icon}</span>
              <p className="text-sm font-medium mt-1 text-foreground">{c.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Rapid Fire Toggle */}
      <div className="flex items-center gap-3">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setRapidFire(!rapidFire)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${rapidFire
            ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-border text-muted-foreground'
          }`}>
          <Zap className="w-5 h-5" />
          <span className="font-medium">Rapid Fire Mode</span>
          <span className="text-xs">(30s/question)</span>
        </motion.button>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button size="lg" className="w-full text-lg py-6 shadow-[0_0_30px_hsl(var(--primary)/0.3)]" onClick={handleStart}>
          Continue to Instructions →
        </Button>
      </motion.div>
    </motion.div>
  );
}
