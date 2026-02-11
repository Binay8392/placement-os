import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyConfig {
  name: string;
  codingWeight: number;
  aptitudeWeight: number;
  csWeight: number;
  minScore: number; // minimum to be "ready"
  logo: string;
}

const companies: CompanyConfig[] = [
  { name: 'TCS', codingWeight: 0.3, aptitudeWeight: 0.4, csWeight: 0.3, minScore: 55, logo: '🏢' },
  { name: 'Infosys', codingWeight: 0.35, aptitudeWeight: 0.35, csWeight: 0.3, minScore: 60, logo: '🏛️' },
  { name: 'Wipro', codingWeight: 0.3, aptitudeWeight: 0.4, csWeight: 0.3, minScore: 55, logo: '🌐' },
  { name: 'Accenture', codingWeight: 0.35, aptitudeWeight: 0.35, csWeight: 0.3, minScore: 60, logo: '💼' },
  { name: 'Capgemini', codingWeight: 0.4, aptitudeWeight: 0.3, csWeight: 0.3, minScore: 60, logo: '🔷' },
  { name: 'Product Companies', codingWeight: 0.55, aptitudeWeight: 0.15, csWeight: 0.3, minScore: 75, logo: '🚀' },
];

function getReadinessLabel(score: number, minScore: number) {
  if (score >= minScore + 15) return { text: 'Ready', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' };
  if (score >= minScore) return { text: 'Ready Soon', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' };
  return { text: 'Needs Improvement', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' };
}

export default function CompanyReadinessPage() {
  const navigate = useNavigate();
  const { trackedTasks, leetCodeProgress, aptitudeTopics, dsaTopics } = useStore();

  const scores = useMemo(() => {
    // Coding score from tasks + leetcode
    const codingTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'Coding');
    const codingPoints = codingTasks.reduce((acc, t) => {
      if (t.difficulty === 'Easy') return acc + 1;
      if (t.difficulty === 'Medium') return acc + 2;
      return acc + 3;
    }, 0);
    const lcPoints = leetCodeProgress.easySolved * 1 + leetCodeProgress.mediumSolved * 2 + leetCodeProgress.hardSolved * 3;
    const dsaMastered = dsaTopics.filter(t => t.status === 'mastered').length;
    const codingScore = Math.min(Math.round(((codingPoints + lcPoints) / 150 + dsaMastered / dsaTopics.length) * 50), 100);

    // Aptitude score
    const totalAttempted = aptitudeTopics.reduce((acc, t) => acc + t.attempted, 0);
    const totalCorrect = aptitudeTopics.reduce((acc, t) => acc + t.correct, 0);
    const aptitudeScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    // CS Fundamentals score
    const csTasks = trackedTasks.filter(t => t.status === 'Completed' && t.category === 'CS Fundamentals');
    const csScore = Math.min(csTasks.length * 10, 100);

    return { codingScore, aptitudeScore, csScore };
  }, [trackedTasks, leetCodeProgress, aptitudeTopics, dsaTopics]);

  const companyScores = useMemo(() => {
    return companies.map(company => {
      const score = Math.round(
        scores.codingScore * company.codingWeight +
        scores.aptitudeScore * company.aptitudeWeight +
        scores.csScore * company.csWeight
      );
      const readiness = getReadinessLabel(score, company.minScore);
      return { ...company, score, readiness };
    });
  }, [scores]);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Company Readiness
        </h1>
        <p className="text-muted-foreground text-sm">Predict your placement readiness for top companies</p>
      </header>

      <main className="px-4 space-y-4">
        {/* Score Factors */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold mb-3 text-sm">Your Score Factors</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Coding', value: scores.codingScore, color: 'text-primary' },
              { label: 'Aptitude', value: scores.aptitudeScore, color: 'text-success' },
              { label: 'CS Fund.', value: scores.csScore, color: 'text-warning' },
            ].map(f => (
              <div key={f.label} className="text-center">
                <p className={`text-2xl font-bold ${f.color}`}>{f.value}%</p>
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Cards */}
        <div className="space-y-3">
          {companyScores.map((company, i) => {
            const ReadinessIcon = company.readiness.icon;
            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/company/${company.name}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{company.logo}</span>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <div className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full", company.readiness.bg, company.readiness.color)}>
                        <ReadinessIcon className="w-3 h-3" />
                        {company.readiness.text}
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className={cn("text-3xl font-bold", company.readiness.color)}
                    key={company.score}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {company.score}%
                  </motion.span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      company.score >= company.minScore + 15 ? 'bg-success' :
                      company.score >= company.minScore ? 'bg-warning' : 'bg-destructive'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${company.score}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">View Dashboard <ChevronRight className="w-3 h-3" /></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
