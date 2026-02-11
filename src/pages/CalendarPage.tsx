import { useState, useMemo } from 'react';
import { useStore, StudySession } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Bell,
  BookOpen,
  Code2,
  Cpu,
  Rocket,
  Plus
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  parseISO,
  isToday,
  isFuture
} from 'date-fns';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'study' | 'interview' | 'reminder' | 'oa';
  category?: string;
  duration?: number;
  company?: string;
};

const categoryIcons: Record<string, React.ElementType> = {
  dsa: Code2,
  aptitude: BookOpen,
  'core-cs': Cpu,
  development: Rocket,
};

const categoryColors: Record<string, string> = {
  dsa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  aptitude: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'core-cs': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  development: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const eventTypeColors: Record<string, string> = {
  study: 'bg-primary/20 text-primary',
  interview: 'bg-red-500/20 text-red-400',
  reminder: 'bg-yellow-500/20 text-yellow-400',
  oa: 'bg-cyan-500/20 text-cyan-400',
};

function EventBadge({ event }: { event: CalendarEvent }) {
  const Icon = event.category ? categoryIcons[event.category] : 
    event.type === 'interview' ? Building2 : 
    event.type === 'oa' ? Clock :
    Bell;
  
  return (
    <div className={`
      flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate
      ${event.category ? categoryColors[event.category] : eventTypeColors[event.type]}
      border
    `}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{event.title}</span>
    </div>
  );
}

function DayCell({ 
  date, 
  events, 
  isCurrentMonth,
  onSelect 
}: { 
  date: Date; 
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onSelect: (date: Date) => void;
}) {
  const today = isToday(date);
  
  return (
    <div 
      onClick={() => onSelect(date)}
      className={`
        min-h-[60px] md:min-h-[100px] p-1 md:p-1.5 border border-border/50 cursor-pointer transition-all
        hover:bg-accent/50
        ${!isCurrentMonth ? 'bg-muted/30 opacity-50' : 'bg-card'}
        ${today ? 'ring-2 ring-primary ring-inset' : ''}
      `}
    >
      <div className={`
        text-sm font-medium mb-1
        ${today ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
      `}>
        {format(date, 'd')}
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <EventBadge key={event.id} event={event} />
        ))}
        {events.length > 3 && (
          <div className="text-xs text-muted-foreground px-1">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

function WeekView({ 
  currentDate, 
  events,
  onSelectDate 
}: { 
  currentDate: Date; 
  events: Map<string, CalendarEvent[]>;
  onSelectDate: (date: Date) => void;
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="grid grid-cols-7 gap-2">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEvents = events.get(dateKey) || [];
        const today = isToday(day);
        
        return (
          <Card 
            key={dateKey} 
            className={`
              min-h-[120px] md:min-h-[200px] cursor-pointer transition-all hover:border-primary/50
              ${today ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => onSelectDate(day)}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <div className={`text-lg font-bold ${today ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEEE')}
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <EventBadge key={event.id} event={event} />
                ))}
                {dayEvents.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function MonthView({ 
  currentDate, 
  events,
  onSelectDate 
}: { 
  currentDate: Date; 
  events: Map<string, CalendarEvent[]>;
  onSelectDate: (date: Date) => void;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = events.get(dateKey) || [];
          
          return (
            <DayCell
              key={dateKey}
              date={day}
              events={dayEvents}
              isCurrentMonth={isSameMonth(day, currentDate)}
              onSelect={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayDetail({ 
  date, 
  events,
  onClose,
  onAddEvent
}: { 
  date: Date | null; 
  events: CalendarEvent[];
  onClose: () => void;
  onAddEvent: () => void;
}) {
  if (!date) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {format(date, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAddEvent}>
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No events scheduled for this day</p>
            <Button variant="outline" onClick={onAddEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first event
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const Icon = event.category ? categoryIcons[event.category] : 
                event.type === 'interview' ? Building2 : 
                event.type === 'oa' ? Clock :
                Bell;
              
              return (
                <div 
                  key={event.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border
                    ${event.category ? categoryColors[event.category] : eventTypeColors[event.type]}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{event.title}</p>
                    {event.company && (
                      <p className="text-sm opacity-80">{event.company}</p>
                    )}
                    {event.duration && (
                      <p className="text-sm opacity-80">
                        {Math.floor(event.duration / 60)} min studied
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type EventType = 'study' | 'interview' | 'oa' | 'reminder';

function AddEventDialog({
  open,
  onOpenChange,
  selectedDate,
  onAddStudySession,
  onAddApplication
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onAddStudySession: (session: Omit<StudySession, 'id'>) => void;
  onAddApplication: (data: { company: string; role: string; type: 'interview' | 'oa' | 'reminder'; date: string }) => void;
}) {
  const [eventType, setEventType] = useState<EventType>('study');
  const [studyCategory, setStudyCategory] = useState<StudySession['category']>('dsa');
  const [hours, setHours] = useState('1');
  const [minutes, setMinutes] = useState('0');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = () => {
    if (!selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    if (eventType === 'study') {
      const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
      if (totalMinutes < 1) {
        toast({ title: "Please enter at least 1 minute", variant: "destructive" });
        return;
      }
      onAddStudySession({
        category: studyCategory,
        duration: totalMinutes * 60,
        date: dateStr,
      });
      toast({ title: "Study session logged!" });
    } else {
      if (!company.trim() || !role.trim()) {
        toast({ title: "Please fill in company and role", variant: "destructive" });
        return;
      }
      onAddApplication({
        company: company.trim(),
        role: role.trim(),
        type: eventType as 'interview' | 'oa' | 'reminder',
        date: dateStr,
      });
      toast({ title: `${eventType === 'interview' ? 'Interview' : eventType === 'oa' ? 'Online Assessment' : 'Follow-up'} scheduled!` });
    }

    // Reset form
    setEventType('study');
    setStudyCategory('dsa');
    setHours('1');
    setMinutes('0');
    setCompany('');
    setRole('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Event
          </DialogTitle>
          <DialogDescription>
            {selectedDate ? `Add an event for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date first'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Study Session
                  </div>
                </SelectItem>
                <SelectItem value="interview">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Interview
                  </div>
                </SelectItem>
                <SelectItem value="oa">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Online Assessment
                  </div>
                </SelectItem>
                <SelectItem value="reminder">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Follow-up Reminder
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {eventType === 'study' ? (
            <>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={studyCategory} onValueChange={(v) => setStudyCategory(v as StudySession['category'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dsa">DSA</SelectItem>
                    <SelectItem value="aptitude">Aptitude</SelectItem>
                    <SelectItem value="core-cs">Core CS</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="Hours"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Hours</p>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="Minutes"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minutes</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., SDE Intern"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const { studySessions, applications, addStudySession, addApplication } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);

  // Build events map from store data
  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    
    // Add study sessions
    studySessions.forEach((session) => {
      const dateKey = session.date;
      const events = map.get(dateKey) || [];
      events.push({
        id: session.id,
        title: session.category.toUpperCase().replace('-', ' '),
        date: session.date,
        type: 'study',
        category: session.category,
        duration: session.duration,
      });
      map.set(dateKey, events);
    });

    // Add application events (interviews, OAs, reminders)
    applications.forEach((app) => {
      if (app.interviewDate) {
        const dateKey = app.interviewDate;
        const events = map.get(dateKey) || [];
        events.push({
          id: `interview-${app.id}`,
          title: `Interview: ${app.company}`,
          date: app.interviewDate,
          type: 'interview',
          company: `${app.role}`,
        });
        map.set(dateKey, events);
      }

      if (app.oaDate) {
        const dateKey = app.oaDate;
        const events = map.get(dateKey) || [];
        events.push({
          id: `oa-${app.id}`,
          title: `OA: ${app.company}`,
          date: app.oaDate,
          type: 'oa',
          company: `${app.role}`,
        });
        map.set(dateKey, events);
      }

      if (app.reminderDate) {
        const dateKey = app.reminderDate;
        const events = map.get(dateKey) || [];
        events.push({
          id: `reminder-${app.id}`,
          title: `Follow up: ${app.company}`,
          date: app.reminderDate,
          type: 'reminder',
          company: `${app.role}`,
        });
        map.set(dateKey, events);
      }
    });

    return map;
  }, [studySessions, applications]);

  const selectedDateEvents = selectedDate 
    ? eventsMap.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : [];

  const navigatePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleOpenAddEvent = () => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setAddEventDialogOpen(true);
  };

  const handleAddStudySession = (session: Omit<StudySession, 'id'>) => {
    addStudySession({
      id: Date.now().toString(),
      ...session,
    });
  };

  const handleAddApplication = (data: { company: string; role: string; type: 'interview' | 'oa' | 'reminder'; date: string }) => {
    // Add a new application with the appropriate date field set
    const appData: any = {
      company: data.company,
      role: data.role,
      type: 'placement' as const,
      status: 'applied' as const,
      result: 'pending' as const,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
    };

    if (data.type === 'interview') {
      appData.interviewDate = data.date;
      appData.status = 'interview';
    } else if (data.type === 'oa') {
      appData.oaDate = data.date;
      appData.status = 'oa';
    } else {
      appData.reminderDate = data.date;
    }

    addApplication(appData);
  };

  // Calculate stats
  const totalStudyTime = studySessions.reduce((acc, s) => acc + s.duration, 0);
  const upcomingInterviews = applications.filter(a => 
    a.interviewDate && parseISO(a.interviewDate) > new Date()
  ).length;
  const upcomingReminders = applications.filter(a => 
    a.reminderDate && parseISO(a.reminderDate) > new Date()
  ).length;

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your study schedule and important dates
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week')}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{Math.floor(totalStudyTime / 3600)}h</p>
                  <p className="text-xs text-muted-foreground">Total Study</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold">{upcomingInterviews}</p>
                  <p className="text-xs text-muted-foreground">Upcoming Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{upcomingReminders}</p>
                  <p className="text-xs text-muted-foreground">Follow-ups</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {view === 'month' 
              ? format(currentDate, 'MMMM yyyy')
              : `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
            }
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        <Card>
          <CardContent className="p-4">
            {view === 'month' ? (
              <MonthView 
                currentDate={currentDate} 
                events={eventsMap}
                onSelectDate={setSelectedDate}
              />
            ) : (
              <WeekView 
                currentDate={currentDate} 
                events={eventsMap}
                onSelectDate={setSelectedDate}
              />
            )}
          </CardContent>
        </Card>

        {/* Selected Day Detail */}
        <DayDetail 
          date={selectedDate} 
          events={selectedDateEvents}
          onClose={() => setSelectedDate(null)}
          onAddEvent={handleOpenAddEvent}
        />

        {/* Add Event Dialog */}
        <AddEventDialog
          open={addEventDialogOpen}
          onOpenChange={setAddEventDialogOpen}
          selectedDate={selectedDate}
          onAddStudySession={handleAddStudySession}
          onAddApplication={handleAddApplication}
        />

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-blue-500/40" />
            <span className="text-muted-foreground">DSA</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-purple-500/40" />
            <span className="text-muted-foreground">Aptitude</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-red-500/40" />
            <span className="text-muted-foreground">Interview</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-cyan-500/40" />
            <span className="text-muted-foreground">Online Assessment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-yellow-500/40" />
            <span className="text-muted-foreground">Follow-up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
