import { useState, useMemo } from 'react';
import { useStore, DailyReflection } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Edit,
  Eye
} from 'lucide-react';
import { 
  format, 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isToday,
  isSameDay,
  subWeeks,
  addWeeks,
  isSameWeek
} from 'date-fns';

const reflectionPrompts = {
  learned: [
    "What new concept or skill did you learn today?",
    "What was the most interesting thing you discovered?",
    "Did you solve any challenging problems? How?",
    "What resources helped you learn today?",
  ],
  wentWrong: [
    "What challenges did you face today?",
    "Where did you get stuck or confused?",
    "What mistakes did you make?",
    "What took longer than expected?",
  ],
  improve: [
    "What will you do differently tomorrow?",
    "What topic needs more practice?",
    "How can you be more productive?",
    "What's your priority for tomorrow?",
  ],
};

function getRandomPrompt(category: keyof typeof reflectionPrompts) {
  const prompts = reflectionPrompts[category];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function ReflectionCard({ 
  reflection, 
  onView 
}: { 
  reflection: DailyReflection;
  onView: () => void;
}) {
  const isRecentDay = isToday(parseISO(reflection.date));
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${isRecentDay ? 'ring-2 ring-primary' : ''}`}
      onClick={onView}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {format(parseISO(reflection.date), 'EEEE, MMM d')}
          </CardTitle>
          {isRecentDay && <Badge className="bg-primary/20 text-primary">Today</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-1">{reflection.learned || 'No entry'}</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-1">{reflection.wentWrong || 'No entry'}</p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-1">{reflection.improve || 'No entry'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyReview({ 
  weekStart, 
  reflections 
}: { 
  weekStart: Date;
  reflections: DailyReflection[];
}) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weekReflections = reflections.filter(r => 
    isSameWeek(parseISO(r.date), weekStart, { weekStartsOn: 1 })
  );

  const completedDays = weekReflections.length;
  const allLearned = weekReflections.map(r => r.learned).filter(Boolean);
  const allWentWrong = weekReflections.map(r => r.wentWrong).filter(Boolean);
  const allImprove = weekReflections.map(r => r.improve).filter(Boolean);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Weekly Review
            </CardTitle>
            <CardDescription>
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{completedDays}/7</p>
            <p className="text-xs text-muted-foreground">Days Reflected</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week progress */}
        <div className="flex gap-1 mb-6">
          {weekDays.map((day) => {
            const hasReflection = weekReflections.some(r => 
              isSameDay(parseISO(r.date), day)
            );
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={day.toISOString()} 
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${hasReflection 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrentDay 
                      ? 'bg-primary/20 text-primary border-2 border-primary' 
                      : 'bg-muted text-muted-foreground'}
                `}>
                  {hasReflection ? <CheckCircle2 className="w-4 h-4" /> : format(day, 'd')}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(day, 'EEE')}
                </span>
              </div>
            );
          })}
        </div>

        {weekReflections.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No reflections this week yet. Start journaling!
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Key Learnings ({allLearned.length})
              </h4>
              <ScrollArea className="h-20">
                <ul className="text-sm text-muted-foreground space-y-1">
                  {allLearned.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Challenges Faced ({allWentWrong.length})
              </h4>
              <ScrollArea className="h-20">
                <ul className="text-sm text-muted-foreground space-y-1">
                  {allWentWrong.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Areas to Improve ({allImprove.length})
              </h4>
              <ScrollArea className="h-20">
                <ul className="text-sm text-muted-foreground space-y-1">
                  {allImprove.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReflectPage() {
  const { reflections, addReflection } = useStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewingReflection, setViewingReflection] = useState<DailyReflection | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tab, setTab] = useState<'today' | 'history' | 'weekly'>('today');
  
  // Form state
  const [learned, setLearned] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [improve, setImprove] = useState('');
  const [prompts, setPrompts] = useState({
    learned: getRandomPrompt('learned'),
    wentWrong: getRandomPrompt('wentWrong'),
    improve: getRandomPrompt('improve'),
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReflection = reflections.find(r => r.date === todayStr);
  
  const sortedReflections = useMemo(() => 
    [...reflections].sort((a, b) => 
      parseISO(b.date).getTime() - parseISO(a.date).getTime()
    ),
    [reflections]
  );

  const stats = useMemo(() => {
    const totalDays = reflections.length;
    const thisWeekCount = reflections.filter(r => 
      isSameWeek(parseISO(r.date), new Date(), { weekStartsOn: 1 })
    ).length;
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (reflections.some(r => r.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return { totalDays, thisWeekCount, streak };
  }, [reflections]);

  const handleSubmit = () => {
    if (!learned.trim() && !wentWrong.trim() && !improve.trim()) {
      toast({ title: "Please fill in at least one field", variant: "destructive" });
      return;
    }

    addReflection({
      date: todayStr,
      learned: learned.trim(),
      wentWrong: wentWrong.trim(),
      improve: improve.trim(),
    });

    toast({ title: "Reflection saved!", description: "Keep up the great work! 🎉" });
    setLearned('');
    setWentWrong('');
    setImprove('');
    setShowAddDialog(false);
    setPrompts({
      learned: getRandomPrompt('learned'),
      wentWrong: getRandomPrompt('wentWrong'),
      improve: getRandomPrompt('improve'),
    });
  };

  const refreshPrompts = () => {
    setPrompts({
      learned: getRandomPrompt('learned'),
      wentWrong: getRandomPrompt('wentWrong'),
      improve: getRandomPrompt('improve'),
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Daily Reflection</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Reflect on your learning journey
            </p>
          </div>
          {!todayReflection && (
            <Button onClick={() => setShowAddDialog(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Reflect Today
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalDays}</p>
                  <p className="text-xs text-muted-foreground">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeekCount}/7</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Review</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {todayReflection ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Today's Reflection Complete
                    </CardTitle>
                    <Badge className="bg-green-500/20 text-green-400">Done</Badge>
                  </div>
                  <CardDescription>
                    {format(parseISO(todayReflection.date), 'EEEE, MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      What I Learned
                    </h4>
                    <p className="text-muted-foreground">{todayReflection.learned || 'No entry'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      What Went Wrong
                    </h4>
                    <p className="text-muted-foreground">{todayReflection.wentWrong || 'No entry'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      What to Improve
                    </h4>
                    <p className="text-muted-foreground">{todayReflection.improve || 'No entry'}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Time to Reflect!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Take a few minutes to reflect on your day. What did you learn? 
                    What challenges did you face? How can you improve?
                  </p>
                  <Button onClick={() => setShowAddDialog(true)} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Today's Reflection
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            {sortedReflections.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reflections Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your reflection journey today!
                  </p>
                  <Button onClick={() => setShowAddDialog(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Reflection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {sortedReflections.map((reflection) => (
                  <ReflectionCard
                    key={reflection.id}
                    reflection={reflection}
                    onView={() => setViewingReflection(reflection)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="weekly">
            <div className="space-y-6">
              {/* Week navigation */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-medium">
                  Week of {format(currentWeek, 'MMMM d, yyyy')}
                </h3>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <WeeklyReview weekStart={currentWeek} reflections={reflections} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Reflection Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Daily Reflection
              </DialogTitle>
              <DialogDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    What I Learned Today
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  {prompts.learned}
                </p>
                <Textarea
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  placeholder="Share your key learnings..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  What Went Wrong
                </Label>
                <p className="text-sm text-muted-foreground italic">
                  {prompts.wentWrong}
                </p>
                <Textarea
                  value={wentWrong}
                  onChange={(e) => setWentWrong(e.target.value)}
                  placeholder="Reflect on challenges..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  What to Improve
                </Label>
                <p className="text-sm text-muted-foreground italic">
                  {prompts.improve}
                </p>
                <Textarea
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  placeholder="Plan for tomorrow..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshPrompts}
                className="text-muted-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New prompts
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="gradient-primary">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Reflection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Reflection Dialog */}
        <Dialog open={!!viewingReflection} onOpenChange={() => setViewingReflection(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {viewingReflection && format(parseISO(viewingReflection.date), 'EEEE, MMMM d, yyyy')}
              </DialogTitle>
            </DialogHeader>

            {viewingReflection && (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    What I Learned
                  </h4>
                  <p className="text-muted-foreground">{viewingReflection.learned || 'No entry'}</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    What Went Wrong
                  </h4>
                  <p className="text-muted-foreground">{viewingReflection.wentWrong || 'No entry'}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    What to Improve
                  </h4>
                  <p className="text-muted-foreground">{viewingReflection.improve || 'No entry'}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingReflection(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
