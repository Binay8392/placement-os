import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InterviewResult } from '@/lib/interviewTypes';
import { ProgressRing } from '@/components/ProgressRing';
import { ArrowLeft, Download, Share2, CheckCircle, AlertCircle, Lightbulb, BookOpen } from 'lucide-react';

interface Props { result: InterviewResult; onBack: () => void; }

export default function ScoreCard({ result, onBack }: Props) {
  const { scores, feedback, config } = result;

  const scoreItems = [
    { label: 'Overall', value: scores.overall, color: 'hsl(var(--primary))' },
    { label: 'Confidence', value: scores.confidence, color: '#8b5cf6' },
    { label: 'Technical', value: scores.technicalDepth, color: '#06b6d4' },
    { label: 'Communication', value: scores.communication, color: '#f59e0b' },
  ];

  const handleShare = () => {
    const text = `🎯 Mock Interview Score: ${scores.overall}/100\n📋 ${config.type} | ${config.difficulty} | ${config.role}\n\nPrepTrack OS`;
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-4 pb-24 space-y-8"
    >
      <div className="text-center space-y-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          className="text-5xl mb-2">
          {scores.overall >= 80 ? '🏆' : scores.overall >= 60 ? '👍' : scores.overall >= 40 ? '📈' : '💪'}
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground">Interview Complete!</h1>
        <p className="text-muted-foreground">{config.type.replace('-', ' ')} · {config.difficulty} · {config.role}</p>
      </div>

      {/* Score Rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scoreItems.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
            <ProgressRing progress={item.value} size={80} strokeWidth={6}>
              <span className="text-lg font-bold text-foreground">{item.value}</span>
            </ProgressRing>
            <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">{feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span> {s}
              </li>
            ))}</ul>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {feedback.weaknesses.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" /> Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">{feedback.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span> {w}
              </li>
            ))}</ul>
          </CardContent>
        </Card>
      )}

      {/* Improvements */}
      {feedback.improvements.length > 0 && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-400">
              <Lightbulb className="w-5 h-5" /> Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">{feedback.improvements.map((im, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">💡</span> {im}
              </li>
            ))}</ul>
          </CardContent>
        </Card>
      )}

      {/* Topics to Revise */}
      {feedback.topicsToRevise.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Topics to Revise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {feedback.topicsToRevise.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="w-4 h-4 mr-2" /> New Interview</Button>
        <Button variant="outline" onClick={handleShare} className="flex-1"><Share2 className="w-4 h-4 mr-2" /> Share Score</Button>
      </div>
    </motion.div>
  );
}
