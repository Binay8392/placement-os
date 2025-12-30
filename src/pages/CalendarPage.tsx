import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Rocket
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
  isToday
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
        min-h-[100px] p-1.5 border border-border/50 cursor-pointer transition-all
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
              min-h-[200px] cursor-pointer transition-all hover:border-primary/50
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
  onClose 
}: { 
  date: Date | null; 
  events: CalendarEvent[];
  onClose: () => void;
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No events scheduled for this day
          </p>
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

export default function CalendarPage() {
  const { studySessions, applications } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  // Calculate stats
  const totalStudyTime = studySessions.reduce((acc, s) => acc + s.duration, 0);
  const upcomingInterviews = applications.filter(a => 
    a.interviewDate && parseISO(a.interviewDate) > new Date()
  ).length;
  const upcomingReminders = applications.filter(a => 
    a.reminderDate && parseISO(a.reminderDate) > new Date()
  ).length;

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64">
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
        <div className="grid grid-cols-3 gap-4 mb-6">
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
