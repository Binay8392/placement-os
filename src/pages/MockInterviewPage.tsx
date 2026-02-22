import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InterviewConfig, InterviewQuestion, InterviewAnswer, InterviewResult } from '@/lib/interviewTypes';
import { saveInterviewResult } from '@/lib/interviewStorage';
import { supabase } from '@/integrations/supabase/client';
import InterviewSetup from '@/components/mock-interview/InterviewSetup';
import InterviewInstructions from '@/components/mock-interview/InterviewInstructions';
import QuestionScreen from '@/components/mock-interview/QuestionScreen';
import ScoreCard from '@/components/mock-interview/ScoreCard';
import InterviewAnalytics from '@/components/mock-interview/InterviewAnalytics';

type Phase = 'setup' | 'instructions' | 'loading' | 'interview' | 'evaluating' | 'results';

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [tab, setTab] = useState('interview');

  const handleConfigComplete = (cfg: InterviewConfig) => {
    setConfig(cfg);
    setPhase('instructions');
  };

  const handleStartInterview = useCallback(async () => {
    if (!config) return;
    setPhase('loading');
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: { action: 'generate-questions', config },
      });
      if (error) throw error;
      const q = data?.questions || [];
      if (q.length === 0) throw new Error('No questions generated');
      setQuestions(q);
      setPhase('interview');
    } catch (err) {
      console.error('Failed to generate questions:', err);
      // Fallback static questions
      const fallback: InterviewQuestion[] = Array.from({ length: config.questionCount }, (_, i) => ({
        id: `q${i + 1}`,
        question: `Sample ${config.type} question #${i + 1} for ${config.role} (${config.difficulty})`,
        category: config.type,
        expectedKeywords: [],
      }));
      setQuestions(fallback);
      setPhase('interview');
    }
  }, [config]);

  const handleInterviewComplete = useCallback(async (answers: InterviewAnswer[]) => {
    if (!config) return;
    setPhase('evaluating');
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: { action: 'evaluate-answers', config, answers },
      });
      if (error) throw error;
      const interviewResult: InterviewResult = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        config,
        answers,
        scores: data.scores,
        feedback: data.feedback,
      };
      saveInterviewResult(interviewResult);
      setResult(interviewResult);
      setPhase('results');
    } catch (err) {
      console.error('Evaluation failed:', err);
      const fallbackResult: InterviewResult = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        config,
        answers,
        scores: { overall: 50, confidence: 50, technicalDepth: 50, communication: 50 },
        feedback: {
          strengths: ['Completed the interview'],
          weaknesses: ['Could not evaluate — please try again'],
          improvements: ['Retry for AI-powered feedback'],
          topicsToRevise: [],
        },
      };
      saveInterviewResult(fallbackResult);
      setResult(fallbackResult);
      setPhase('results');
    }
  }, [config]);

  const resetInterview = () => {
    setPhase('setup');
    setConfig(null);
    setQuestions([]);
    setResult(null);
  };

  // Loading / evaluating screens
  if (phase === 'loading' || phase === 'evaluating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-lg text-muted-foreground font-medium">
          {phase === 'loading' ? '🧠 Generating AI questions...' : '📊 Evaluating your answers...'}
        </p>
      </div>
    );
  }

  // Interview flow phases
  if (phase !== 'setup' || tab === 'interview') {
    if (phase === 'instructions' && config) {
      return <InterviewInstructions config={config} onStart={handleStartInterview} onBack={() => setPhase('setup')} />;
    }
    if (phase === 'interview' && config) {
      return <QuestionScreen config={config} questions={questions} onComplete={handleInterviewComplete} />;
    }
    if (phase === 'results' && result) {
      return <ScoreCard result={result} onBack={resetInterview} />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="interview" className="flex-1">🎯 New Interview</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">📊 Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="interview">
          <InterviewSetup onStart={handleConfigComplete} />
        </TabsContent>
        <TabsContent value="analytics">
          <InterviewAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
