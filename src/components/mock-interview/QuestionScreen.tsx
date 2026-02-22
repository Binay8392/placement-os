import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { InterviewConfig, InterviewQuestion, InterviewAnswer } from '@/lib/interviewTypes';
import { useInterviewTimer } from '@/hooks/useInterviewTimer';
import { ChevronRight, Clock, Loader2, Mic, MicOff } from 'lucide-react';

interface Props {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  onComplete: (answers: InterviewAnswer[]) => void;
}

export default function QuestionScreen({ config, questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const timer = useInterviewTimer(config.timerPerQuestion);

  const q = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  useEffect(() => { timer.reset(config.timerPerQuestion); timer.start(); }, [currentIndex]);

  const goNext = useCallback(() => {
    const answer: InterviewAnswer = {
      questionId: q.id,
      question: q.question,
      answer: currentAnswer.trim(),
      timeSpent: timer.elapsed,
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrentAnswer('');
      setCurrentIndex(i => i + 1);
    }
  }, [currentAnswer, timer.elapsed, answers, q, isLast, onComplete]);

  useEffect(() => {
    if (timer.timeLeft === 0) goNext();
  }, [timer.timeLeft]);

  // Web Speech API
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setCurrentAnswer(prev => prev + ' ' + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const timerColor = timer.timeLeft <= 10 ? 'text-red-400' : timer.timeLeft <= 30 ? 'text-yellow-400' : 'text-primary';
  const minutes = Math.floor(timer.timeLeft / 60);
  const seconds = timer.timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1}/{questions.length}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{q?.category}</span>
        </div>
        <motion.div
          className={`flex items-center gap-1.5 font-mono text-xl font-bold ${timerColor}`}
          animate={timer.timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Clock className="w-5 h-5" />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </motion.div>
      </div>

      <Progress value={(currentIndex / questions.length) * 100} className="h-1.5 mb-8" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <div className="p-6 rounded-2xl bg-card border border-border mb-6 shadow-[0_0_20px_hsl(var(--primary)/0.05)]">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">{q?.question}</p>
          </div>

          <div className="relative flex-1 min-h-[200px]">
            <Textarea
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="h-full min-h-[200px] resize-none text-base bg-card border-border focus:border-primary"
            />
            <button
              onClick={toggleVoice}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isListening
                ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="w-full text-lg py-6" onClick={goNext}>
            {isLast ? '✅ Finish Interview' : 'Next Question'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
