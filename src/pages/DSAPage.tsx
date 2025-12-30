import { useState } from 'react';
import { useStore, DSATopic } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Star, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryLabels = {
  foundations: 'Foundations',
  core: 'Core Data Structures',
  advanced: 'Advanced Topics',
};

const statusConfig = {
  'not-started': { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Not Started' },
  'in-progress': { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'In Progress' },
  'mastered': { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Mastered' },
};

export default function DSAPage() {
  const { dsaTopics, updateDSATopic } = useStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('foundations');
  const [selectedTopic, setSelectedTopic] = useState<DSATopic | null>(null);

  const groupedTopics = {
    foundations: dsaTopics.filter((t) => t.category === 'foundations'),
    core: dsaTopics.filter((t) => t.category === 'core'),
    advanced: dsaTopics.filter((t) => t.category === 'advanced'),
  };

  const totalMastered = dsaTopics.filter((t) => t.status === 'mastered').length;
  const totalInProgress = dsaTopics.filter((t) => t.status === 'in-progress').length;
  const overallProgress = (totalMastered / dsaTopics.length) * 100;

  const handleUpdateTopic = (updates: Partial<DSATopic>) => {
    if (selectedTopic) {
      updateDSATopic(selectedTopic.id, updates);
      setSelectedTopic({ ...selectedTopic, ...updates });
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold">DSA Preparation</h1>
        <p className="text-muted-foreground text-sm">Master data structures & algorithms</p>
      </header>

      <main className="px-4 space-y-6">
        {/* Progress Overview */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                <span className="text-success font-medium">{totalMastered}</span>
                <span className="text-muted-foreground"> mastered</span>
              </p>
              <p className="text-sm">
                <span className="text-warning font-medium">{totalInProgress}</span>
                <span className="text-muted-foreground"> in progress</span>
              </p>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </section>

        {/* Topics by Category */}
        <section className="space-y-3">
          {(Object.keys(groupedTopics) as Array<keyof typeof groupedTopics>).map((category) => {
            const topics = groupedTopics[category];
            const isExpanded = expandedCategory === category;
            const categoryMastered = topics.filter((t) => t.status === 'mastered').length;

            return (
              <div key={category} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold">{categoryLabels[category]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {categoryMastered}/{topics.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {topics.map((topic) => {
                      const StatusIcon = statusConfig[topic.status].icon;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                          className="w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors text-left"
                        >
                          <StatusIcon className={cn("w-5 h-5", statusConfig[topic.status].color)} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{topic.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {topic.questionsSolved} questions solved
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-3 h-3",
                                  star <= topic.confidence
                                    ? "text-warning fill-warning"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
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

      {/* Topic Detail Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTopic?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTopic && (
            <div className="space-y-4 pt-2">
              {/* Status */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Status</label>
                <Select
                  value={selectedTopic.status}
                  onValueChange={(value: DSATopic['status']) => handleUpdateTopic({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="mastered">Mastered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Solved */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Questions Solved</label>
                <Input
                  type="number"
                  min={0}
                  value={selectedTopic.questionsSolved}
                  onChange={(e) => handleUpdateTopic({ questionsSolved: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Confidence */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Confidence Level ({selectedTopic.confidence}/5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleUpdateTopic({ confidence: level })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6",
                          level <= selectedTopic.confidence
                            ? "text-warning fill-warning"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Notes</label>
                <Textarea
                  placeholder="Add your notes here..."
                  value={selectedTopic.notes}
                  onChange={(e) => handleUpdateTopic({ notes: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => setSelectedTopic(null)} 
                className="w-full gradient-primary"
              >
                Save & Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
