import { useState, useMemo } from 'react';
import { useStore, AptitudeTopic } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  ChevronRight, 
  Calculator, 
  Brain, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const sectionConfig = {
  quantitative: { 
    label: 'Quantitative Aptitude', 
    icon: Calculator, 
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30'
  },
  logical: { 
    label: 'Logical Reasoning', 
    icon: Brain, 
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30'
  },
  verbal: { 
    label: 'Verbal Ability', 
    icon: MessageSquare, 
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30'
  },
};

function getAccuracy(attempted: number, correct: number): number {
  if (attempted === 0) return 0;
  return Math.round((correct / attempted) * 100);
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-success';
  if (accuracy >= 60) return 'text-warning';
  if (accuracy > 0) return 'text-destructive';
  return 'text-muted-foreground';
}

export default function AptitudePage() {
  const { aptitudeTopics, logAptitudePractice, updateAptitudeTopic } = useStore();
  const [expandedSection, setExpandedSection] = useState<string | null>('quantitative');
  const [selectedTopic, setSelectedTopic] = useState<AptitudeTopic | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceAttempted, setPracticeAttempted] = useState(5);
  const [practiceCorrect, setPracticeCorrect] = useState(3);

  // Group topics by section
  const groupedTopics = useMemo(() => ({
    quantitative: aptitudeTopics.filter((t) => t.section === 'quantitative'),
    logical: aptitudeTopics.filter((t) => t.section === 'logical'),
    verbal: aptitudeTopics.filter((t) => t.section === 'verbal'),
  }), [aptitudeTopics]);

  // Calculate section stats
  const sectionStats = useMemo(() => {
    const stats: Record<string, { attempted: number; correct: number; accuracy: number }> = {};
    
    for (const [section, topics] of Object.entries(groupedTopics)) {
      const attempted = topics.reduce((acc, t) => acc + t.attempted, 0);
      const correct = topics.reduce((acc, t) => acc + t.correct, 0);
      stats[section] = {
        attempted,
        correct,
        accuracy: getAccuracy(attempted, correct),
      };
    }
    
    return stats;
  }, [groupedTopics]);

  // Overall stats
  const overallStats = useMemo(() => {
    const attempted = aptitudeTopics.reduce((acc, t) => acc + t.attempted, 0);
    const correct = aptitudeTopics.reduce((acc, t) => acc + t.correct, 0);
    return {
      attempted,
      correct,
      accuracy: getAccuracy(attempted, correct),
    };
  }, [aptitudeTopics]);

  // Weak topics (accuracy < 60% with at least 5 attempts)
  const weakTopics = useMemo(() => {
    return aptitudeTopics
      .filter((t) => t.attempted >= 5 && getAccuracy(t.attempted, t.correct) < 60)
      .sort((a, b) => getAccuracy(a.attempted, a.correct) - getAccuracy(b.attempted, b.correct))
      .slice(0, 5);
  }, [aptitudeTopics]);

  const handleLogPractice = () => {
    if (selectedTopic && practiceAttempted > 0) {
      if (practiceCorrect > practiceAttempted) {
        toast({
          title: "Invalid input",
          description: "Correct answers can't exceed attempted questions.",
          variant: "destructive",
        });
        return;
      }
      
      logAptitudePractice(selectedTopic.id, practiceAttempted, practiceCorrect);
      toast({
        title: "Practice logged! 📝",
        description: `${practiceCorrect}/${practiceAttempted} correct in ${selectedTopic.name}`,
      });
      setPracticeMode(false);
      setPracticeAttempted(5);
      setPracticeCorrect(3);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold">Aptitude Prep</h1>
        <p className="text-muted-foreground text-sm">Master quantitative, logical & verbal skills</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Overall Progress */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">{overallStats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">{overallStats.attempted}</p>
              <p className="text-xs text-muted-foreground">Questions practiced</p>
            </div>
          </div>
          <Progress value={overallStats.accuracy} className="h-2" />
        </section>

        {/* Section Cards */}
        <section className="grid grid-cols-3 gap-2">
          {(Object.keys(sectionConfig) as Array<keyof typeof sectionConfig>).map((section) => {
            const config = sectionConfig[section];
            const stats = sectionStats[section];
            const Icon = config.icon;
            
            return (
              <button
                key={section}
                onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  expandedSection === section 
                    ? `${config.bgColor} ${config.borderColor}` 
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <Icon className={cn("w-5 h-5 mx-auto mb-1", config.color)} />
                <p className={cn("text-lg font-bold", getAccuracyColor(stats.accuracy))}>
                  {stats.accuracy}%
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {stats.attempted} Qs
                </p>
              </button>
            );
          })}
        </section>

        {/* Weak Topics Alert */}
        {weakTopics.length > 0 && (
          <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h2 className="font-semibold text-sm">Focus Areas</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setPracticeMode(true);
                  }}
                  className="px-3 py-1.5 bg-background rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-muted transition-colors"
                >
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  {topic.name}
                  <span className="text-destructive">
                    {getAccuracy(topic.attempted, topic.correct)}%
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Topics by Section */}
        <section className="space-y-3">
          {(Object.keys(groupedTopics) as Array<keyof typeof groupedTopics>).map((section) => {
            const topics = groupedTopics[section];
            const config = sectionConfig[section];
            const isExpanded = expandedSection === section;
            const Icon = config.icon;

            return (
              <div key={section} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    <Icon className={cn("w-5 h-5", config.color)} />
                    <span className="font-semibold">{config.label}</span>
                  </div>
                  <span className={cn("text-sm font-medium", getAccuracyColor(sectionStats[section].accuracy))}>
                    {sectionStats[section].accuracy}%
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {topics.map((topic) => {
                      const accuracy = getAccuracy(topic.attempted, topic.correct);
                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setSelectedTopic(topic);
                            setPracticeMode(true);
                          }}
                          className="w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{topic.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {topic.attempted > 0 
                                ? `${topic.correct}/${topic.attempted} correct`
                                : 'Not practiced yet'
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {topic.attempted > 0 && (
                              <>
                                {accuracy >= 70 ? (
                                  <TrendingUp className="w-4 h-4 text-success" />
                                ) : accuracy >= 50 ? (
                                  <TrendingUp className="w-4 h-4 text-warning" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-destructive" />
                                )}
                                <span className={cn("text-sm font-medium w-10 text-right", getAccuracyColor(accuracy))}>
                                  {accuracy}%
                                </span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Practice Dialog */}
      <Dialog open={practiceMode && !!selectedTopic} onOpenChange={(open) => {
        if (!open) {
          setPracticeMode(false);
        }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Practice - {selectedTopic?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTopic && (
            <div className="space-y-4 pt-2">
              {/* Current Stats */}
              <div className="bg-muted rounded-xl p-3 text-center">
                <p className="text-sm text-muted-foreground">Current Accuracy</p>
                <p className={cn("text-2xl font-bold", getAccuracyColor(getAccuracy(selectedTopic.attempted, selectedTopic.correct)))}>
                  {getAccuracy(selectedTopic.attempted, selectedTopic.correct)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedTopic.correct}/{selectedTopic.attempted} questions
                </p>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Questions Attempted</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPracticeAttempted(Math.max(1, practiceAttempted - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={practiceAttempted}
                      onChange={(e) => setPracticeAttempted(parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPracticeAttempted(practiceAttempted + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Correct Answers</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPracticeCorrect(Math.max(0, practiceCorrect - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      max={practiceAttempted}
                      value={practiceCorrect}
                      onChange={(e) => setPracticeCorrect(Math.min(parseInt(e.target.value) || 0, practiceAttempted))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPracticeCorrect(Math.min(practiceCorrect + 1, practiceAttempted))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">This session</p>
                  <p className={cn("text-xl font-bold", getAccuracyColor(getAccuracy(practiceAttempted, practiceCorrect)))}>
                    {getAccuracy(practiceAttempted, practiceCorrect)}%
                  </p>
                </div>
              </div>

              <Button onClick={handleLogPractice} className="w-full gradient-primary">
                Log Practice
              </Button>
              
              {/* Notes */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Notes (optional)</label>
                <Textarea
                  placeholder="Any observations or tips..."
                  value={selectedTopic.notes}
                  onChange={(e) => updateAptitudeTopic(selectedTopic.id, { notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
