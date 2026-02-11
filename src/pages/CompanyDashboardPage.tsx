import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, MessageSquare, Users, BookOpen, Video, Link2, ChevronRight, Plus, Trash2, Save, Play, ExternalLink, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore, type TaskCategory } from '@/lib/store';
import { companyDataMap } from '@/data/companyData';
import { fetchInterviewExperiences, fetchHRQuestions, fetchMentorVideos, clearCompanyCache } from '@/lib/companyServices';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CompanyDashboardPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = companyId ? companyDataMap[companyId] : null;

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Company not found.</p>
          <Button onClick={() => navigate('/company-readiness')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/company-readiness')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{company.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{company.name} Dashboard</h1>
            <p className="text-muted-foreground text-sm">{company.description}</p>
          </div>
        </div>
      </header>

      <main className="px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 h-auto flex-nowrap no-scrollbar">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="roadmap" className="text-xs">Roadmap</TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
            <TabsTrigger value="hr" className="text-xs">HR Questions</TabsTrigger>
            <TabsTrigger value="experiences" className="text-xs">Experiences</TabsTrigger>
            <TabsTrigger value="mentor" className="text-xs">Mentor</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab companyName={companyId!} /></TabsContent>
          <TabsContent value="roadmap"><RoadmapTab companyName={companyId!} /></TabsContent>
          <TabsContent value="tasks"><TasksTab companyName={companyId!} /></TabsContent>
          <TabsContent value="hr"><HRTab companyName={companyId!} /></TabsContent>
          <TabsContent value="experiences"><ExperiencesTab companyName={companyId!} /></TabsContent>
          <TabsContent value="mentor"><MentorTab companyName={companyId!} /></TabsContent>
          <TabsContent value="resources"><ResourcesTab companyName={companyId!} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ── Overview Tab ──
function OverviewTab({ companyName }: { companyName: string }) {
  const company = companyDataMap[companyName];
  const { trackedTasks, hrAnswers } = useStore();

  const completedTasks = trackedTasks.filter(t => t.status === 'Completed').length;
  const totalTasks = trackedTasks.length;
  const hrPracticed = hrAnswers.filter(a => a.company === companyName && a.practiced).length;
  const totalHR = company.hrQuestions.length;
  const readinessScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 70 + (hrPracticed / Math.max(totalHR, 1)) * 30) : 0;

  const getStatusLabel = (score: number) => {
    if (score >= 85) return { text: 'Highly Ready', color: 'text-green-500' };
    if (score >= 70) return { text: 'Ready', color: 'text-green-400' };
    if (score >= 50) return { text: 'Almost Ready', color: 'text-yellow-500' };
    return { text: 'Needs Work', color: 'text-red-400' };
  };
  const status = getStatusLabel(readinessScore);

  return (
    <div className="space-y-4 mt-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">{companyName} Readiness</p>
        <p className={cn("text-5xl font-bold", status.color)}>{readinessScore}%</p>
        <p className={cn("text-sm font-medium mt-1", status.color)}>{status.text}</p>
        <Progress value={readinessScore} className="mt-4 h-3" />
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Tasks Done', value: completedTasks, total: totalTasks },
          { label: 'HR Practiced', value: hrPracticed, total: totalHR },
          { label: 'Roadmap Phases', value: company.roadmap.length, total: company.roadmap.length },
          { label: 'Experiences', value: company.interviewExperiences.length, total: company.interviewExperiences.length },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{s.value}<span className="text-muted-foreground text-sm">/{s.total}</span></p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Roadmap Tab ──
function RoadmapTab({ companyName }: { companyName: string }) {
  const company = companyDataMap[companyName];
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`roadmap-${companyName}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleItem = (key: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      localStorage.setItem(`roadmap-${companyName}`, JSON.stringify([...next]));
      return next;
    });
  };

  const totalItems = company.roadmap.reduce((acc, p) => acc + p.items.length, 0);
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Roadmap Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {company.roadmap.map((phase, pi) => (
        <motion.div key={phase.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: pi * 0.1 }}
          className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{pi + 1}</div>
            <h3 className="font-semibold text-sm">{phase.title}</h3>
          </div>
          <div className="space-y-2 ml-10">
            {phase.items.map(item => {
              const key = `${pi}-${item}`;
              const done = completedItems.has(key);
              return (
                <button key={key} onClick={() => toggleItem(key)}
                  className={cn("flex items-center gap-2 w-full text-left text-sm py-1 transition-colors", done ? "text-muted-foreground line-through" : "text-foreground")}>
                  {done ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                  {item}
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Tasks Tab ──
function TasksTab({ companyName }: { companyName: string }) {
  const { trackedTasks, toggleTaskStatus } = useStore();
  const [filter, setFilter] = useState<string>('All');

  const filtered = trackedTasks.filter(t => filter === 'All' || t.category === filter);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Coding', 'Aptitude', 'CS Fundamentals', 'Interview'].map(cat => (
          <Button key={cat} size="sm" variant={filter === cat ? 'default' : 'outline'} onClick={() => setFilter(cat)} className="text-xs shrink-0">
            {cat}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No tasks found. Generate tasks from the Task Generator.</p>}
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
            <Checkbox checked={task.status === 'Completed'} onCheckedChange={() => toggleTaskStatus(task.id)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", task.status === 'Completed' && "line-through text-muted-foreground")}>{task.name}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{task.category}</Badge>
                <Badge variant="secondary" className="text-[10px]">{task.difficulty}</Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── HR Questions Tab ──
function HRTab({ companyName }: { companyName: string }) {
  const hrQuestions = useMemo(() => fetchHRQuestions(companyName), [companyName]);
  const { hrAnswers, setHRAnswer, toggleHRPracticed } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftAnswer, setDraftAnswer] = useState('');

  const getAnswer = (qId: string) => hrAnswers.find(a => a.questionId === qId && a.company === companyName);
  const practicedCount = hrQuestions.filter(q => getAnswer(q.id)?.practiced).length;

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-card border border-border rounded-2xl p-4 flex justify-between items-center">
        <span className="text-sm">Practiced</span>
        <span className="font-bold text-primary">{practicedCount}/{hrQuestions.length}</span>
      </div>

      <div className="space-y-3">
        {hrQuestions.map((q, i) => {
          const ans = getAnswer(q.id);
          const isEditing = editingId === q.id;
          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox checked={!!ans?.practiced} onCheckedChange={() => toggleHRPracticed(q.id, companyName)} className="mt-0.5" />
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", ans?.practiced && "text-muted-foreground")}>{q.question}</p>
                  {ans?.answer && !isEditing && (
                    <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-lg p-2">{ans.answer}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="ml-7 space-y-2">
                  <Textarea value={draftAnswer} onChange={(e) => setDraftAnswer(e.target.value)} placeholder="Write your answer..." className="text-sm" rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setHRAnswer(q.id, companyName, draftAnswer); setEditingId(null); toast.success('Answer saved'); }}>
                      <Save className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="ml-7 text-xs" onClick={() => { setEditingId(q.id); setDraftAnswer(ans?.answer || ''); }}>
                  {ans?.answer ? 'Edit Answer' : 'Add Answer'}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Interview Experiences Tab ──
function ExperiencesTab({ companyName }: { companyName: string }) {
  const experiences = useMemo(() => fetchInterviewExperiences(companyName), [companyName]);
  const { userInterviewExperiences, addInterviewExperience, deleteInterviewExperience } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);
  const [form, setForm] = useState({ role: '', rounds: '', questions: '', tips: '', difficulty: 'Medium' as const });

  const userExps = userInterviewExperiences.filter(e => e.company === companyName);

  const handleSubmit = () => {
    if (!form.role.trim()) { toast.error('Role is required'); return; }
    addInterviewExperience({ company: companyName, role: form.role, date: new Date().toISOString().split('T')[0], rounds: form.rounds, questions: form.questions, tips: form.tips, difficulty: form.difficulty });
    setForm({ role: '', rounds: '', questions: '', tips: '', difficulty: 'Medium' });
    setShowForm(false);
    toast.success('Experience added');
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{experiences.length} Interview Experience{experiences.length !== 1 ? 's' : ''}</p>
          <p className="text-xs text-muted-foreground">Curated from GeeksforGeeks, Glassdoor & LeetCode</p>
        </div>
        <Badge variant="secondary" className="text-xs">{companyName}</Badge>
      </div>

      {/* Curated experiences with round-wise details */}
      {experiences.map((exp, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{companyName} — {exp.role}</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{exp.difficulty}</Badge>
                {exp.source && <Badge variant="secondary" className="text-[10px]">{exp.source}</Badge>}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exp.rounds.map((r, ri) => (
                <Badge key={ri} variant="secondary" className="text-[10px]">{r}</Badge>
              ))}
            </div>
          </div>

          {/* Round-wise details */}
          {exp.roundDetails && exp.roundDetails.length > 0 && (
            <div className="divide-y divide-border">
              {exp.roundDetails.map((round, ri) => {
                const roundKey = `${i}-${ri}`;
                const isExpanded = expandedRound === roundKey;
                return (
                  <div key={ri}>
                    <button
                      onClick={() => setExpandedRound(isExpanded ? null : roundKey)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{ri + 1}</div>
                        <span className="text-sm font-medium">{round.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{round.questions.length} questions</span>
                        <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                      </div>
                    </button>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-3">
                        <ul className="space-y-1.5 ml-8">
                          {round.questions.map((q, qi) => (
                            <li key={qi} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <ChevronRight className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tips */}
          <div className="p-4 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">💡 Tips</p>
            <ul className="space-y-1">
              {exp.tips.map((t, ti) => (
                <li key={ti} className="flex items-start gap-1.5 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}

      {/* User-added experiences */}
      {userExps.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Your Experiences</p>
          {userExps.map(exp => (
            <div key={exp.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{exp.role} <Badge className="ml-2 text-[10px]">Your Experience</Badge></h3>
                <Button size="icon" variant="ghost" onClick={() => deleteInterviewExperience(exp.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
              {exp.rounds && <p className="text-xs text-muted-foreground"><strong>Rounds:</strong> {exp.rounds}</p>}
              {exp.questions && <p className="text-xs text-muted-foreground"><strong>Questions:</strong> {exp.questions}</p>}
              {exp.tips && <p className="text-xs text-muted-foreground"><strong>Tips:</strong> {exp.tips}</p>}
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <Card>
          <CardHeader><CardTitle className="text-sm">Add Your Experience</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Role (e.g., SDE-1)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            <Input placeholder="Rounds (comma-separated)" value={form.rounds} onChange={e => setForm(p => ({ ...p, rounds: e.target.value }))} />
            <Textarea placeholder="Questions asked..." value={form.questions} onChange={e => setForm(p => ({ ...p, questions: e.target.value }))} rows={2} />
            <Textarea placeholder="Tips & advice..." value={form.tips} onChange={e => setForm(p => ({ ...p, tips: e.target.value }))} rows={2} />
            <Select value={form.difficulty} onValueChange={v => setForm(p => ({ ...p, difficulty: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmit}><Plus className="w-3 h-3 mr-1" /> Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Your Interview Experience
        </Button>
      )}
    </div>
  );
}

// ── Mentor Talks Tab ──
function MentorTab({ companyName }: { companyName: string }) {
  const mentorTalks = useMemo(() => fetchMentorVideos(companyName), [companyName]);

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Mentor Talks & Videos</p>
          <p className="text-xs text-muted-foreground">Curated preparation tips and YouTube content</p>
        </div>
        <Video className="w-5 h-5 text-primary" />
      </div>

      {mentorTalks.map((talk, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Embedded YouTube Video */}
          {talk.videoUrl && (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={talk.videoUrl}
                title={talk.videoTitle || talk.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              <h3 className="font-semibold text-sm">{talk.title}</h3>
            </div>
            {talk.videoTitle && (
              <p className="text-xs text-primary/80 flex items-center gap-1">
                <Play className="w-3 h-3" /> {talk.videoTitle}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{talk.advice}</p>
            {talk.videoUrl && (
              <a href={talk.videoUrl.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1">
                <ExternalLink className="w-3 h-3" /> Watch on YouTube
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Resources Tab ──
function ResourcesTab({ companyName }: { companyName: string }) {
  const company = companyDataMap[companyName];
  const typeColors: Record<string, string> = { coding: 'bg-blue-500/10 text-blue-500', aptitude: 'bg-amber-500/10 text-amber-500', interview: 'bg-green-500/10 text-green-500' };
  return (
    <div className="space-y-3 mt-4">
      {company.resources.map((res, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{res.title}</p>
            <Badge className={cn("text-[10px] mt-1", typeColors[res.type])}>{res.type}</Badge>
          </div>
          {res.url && (
            <a href={res.url} target="_blank" rel="noopener noreferrer"><Link2 className="w-4 h-4 text-muted-foreground hover:text-primary" /></a>
          )}
        </motion.div>
      ))}
    </div>
  );
}
