import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InterviewConfig, DIFFICULTY_CONFIG } from '@/lib/interviewTypes';
import { Clock, FileText, AlertTriangle, Zap } from 'lucide-react';

interface Props { config: InterviewConfig; onStart: () => void; onBack: () => void; }

export default function InterviewInstructions({ config, onStart, onBack }: Props) {
  const dc = DIFFICULTY_CONFIG[config.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pb-24 space-y-8"
    >
      <div className="text-center space-y-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-4">📋</motion.div>
        <h1 className="text-3xl font-bold text-foreground">Interview Instructions</h1>
        <p className="text-muted-foreground">Read carefully before starting</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-4">
          <FileText className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Total Questions</p>
            <p className="text-sm text-muted-foreground">{config.questionCount} questions will be asked</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-4">
          <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Time Limit</p>
            <p className="text-sm text-muted-foreground">
              {config.rapidFire ? '30 seconds' : `${config.timerPerQuestion} seconds`} per question
              {config.rapidFire && <span className="text-orange-400 font-medium"> (Rapid Fire 🔥)</span>}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Rules</p>
            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
              <li>• Answer in your own words</li>
              <li>• Timer auto-advances when it hits 0</li>
              <li>• You can skip questions but it affects your score</li>
              <li>• AI will evaluate your answers at the end</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
          <Zap className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Your Config</p>
            <p className="text-sm text-muted-foreground">
              {config.type.replace('-', ' ')} · {dc.label} · {config.role}
              {config.companyStyle && ` · ${config.companyStyle} style`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <motion.div className="flex-[2]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="w-full text-lg py-6 shadow-[0_0_30px_hsl(var(--primary)/0.3)]" onClick={onStart}>
            🚀 Start Interview
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
