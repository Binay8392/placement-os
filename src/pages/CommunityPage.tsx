import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MessageSquare, Video, Briefcase, Heart, ChevronUp, Award, Trash2, Send, GraduationCap, Users, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const companyOptions = ['TCS', 'Infosys', 'Accenture', 'Wipro', 'Capgemini', 'Cognizant', 'Deloitte', 'IBM', 'Google', 'Amazon', 'Microsoft', 'Other'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('All');

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Community Hub
        </h1>
        <p className="text-muted-foreground text-sm">Share experiences, ask questions, help each other</p>
      </header>

      <main className="px-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-28 shrink-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {companyOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 h-auto flex-nowrap no-scrollbar">
            <TabsTrigger value="experiences" className="text-xs"><Briefcase className="w-3 h-3 mr-1" />Experiences</TabsTrigger>
            <TabsTrigger value="questions" className="text-xs"><MessageSquare className="w-3 h-3 mr-1" />Q&A</TabsTrigger>
            <TabsTrigger value="vlogs" className="text-xs"><Video className="w-3 h-3 mr-1" />Vlogs</TabsTrigger>
            <TabsTrigger value="eligibility" className="text-xs"><GraduationCap className="w-3 h-3 mr-1" />Eligibility</TabsTrigger>
          </TabsList>

          <TabsContent value="experiences"><ExperiencesTab search={search} companyFilter={companyFilter} /></TabsContent>
          <TabsContent value="questions"><QuestionsTab search={search} companyFilter={companyFilter} /></TabsContent>
          <TabsContent value="vlogs"><VlogsTab search={search} companyFilter={companyFilter} /></TabsContent>
          <TabsContent value="eligibility"><EligibilityTab search={search} companyFilter={companyFilter} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Helper to get current user info from Firebase auth
function useCurrentUser() {
  const { user } = useFirebaseAuth();
  return {
    userId: user?.uid || 'anonymous',
    username: user?.displayName || user?.email || 'Anonymous User',
  };
}

// ── Experiences Tab ──
function ExperiencesTab({ search, companyFilter }: { search: string; companyFilter: string }) {
  const { userId, username } = useCurrentUser();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: 'TCS', role: '', interviewDate: '', difficulty: 'Medium', rounds: '', questions: '', tips: '' });
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    const { data } = await supabase.from('community_experiences').select('*').order('created_at', { ascending: false });
    if (data) setExperiences(data);
    setLoading(false);
  }, []);

  const fetchComments = useCallback(async (expId: string) => {
    const { data } = await supabase.from('community_experience_comments').select('*').eq('experience_id', expId).order('created_at', { ascending: true });
    if (data) setComments(prev => ({ ...prev, [expId]: data }));
  }, []);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  useEffect(() => {
    if (expandedComments) fetchComments(expandedComments);
  }, [expandedComments, fetchComments]);

  const filtered = useMemo(() => experiences.filter(e => {
    if (companyFilter !== 'All' && e.company !== companyFilter) return false;
    if (search && !e.role.toLowerCase().includes(search.toLowerCase()) && !e.company.toLowerCase().includes(search.toLowerCase()) && !(e.questions || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [experiences, search, companyFilter]);

  const handleSubmit = async () => {
    if (!form.role.trim()) { toast.error('Role is required'); return; }
    const { error } = await supabase.from('community_experiences').insert({
      user_id: userId, username, company: form.company, role: form.role,
      interview_date: form.interviewDate, difficulty: form.difficulty,
      rounds: form.rounds, questions: form.questions, tips: form.tips,
    });
    if (error) { toast.error('Failed to share'); return; }
    setForm({ company: 'TCS', role: '', interviewDate: '', difficulty: 'Medium', rounds: '', questions: '', tips: '' });
    setShowForm(false);
    toast.success('Experience shared!');
    fetchExperiences();
  };

  const handleLike = async (exp: any) => {
    const likedBy: string[] = exp.liked_by || [];
    if (likedBy.includes(userId)) return;
    await supabase.from('community_experiences').update({
      likes: exp.likes + 1, liked_by: [...likedBy, userId]
    }).eq('id', exp.id);
    fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('community_experiences').delete().eq('id', id);
    toast.success('Deleted');
    fetchExperiences();
  };

  const handleComment = async (expId: string) => {
    const text = commentDrafts[expId]?.trim();
    if (!text) return;
    await supabase.from('community_experience_comments').insert({
      experience_id: expId, user_id: userId, username, text,
    });
    setCommentDrafts(d => ({ ...d, [expId]: '' }));
    toast.success('Comment posted!');
    fetchComments(expId);
  };

  const handleDeleteComment = async (expId: string, commentId: string) => {
    await supabase.from('community_experience_comments').delete().eq('id', commentId);
    toast.success('Comment deleted');
    fetchComments(expId);
  };

  if (loading) return <p className="text-center text-muted-foreground text-sm py-8">Loading...</p>;

  return (
    <div className="space-y-4 mt-4">
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="w-full"><Plus className="w-4 h-4 mr-2" />Share Interview Experience</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Share Your Interview Experience</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Select value={form.company} onValueChange={v => setForm(p => ({ ...p, company: v }))}>
              <SelectTrigger><SelectValue placeholder="Company" /></SelectTrigger>
              <SelectContent>{companyOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Role (e.g., TCS Ninja, SDE-1)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            <Input type="date" value={form.interviewDate} onChange={e => setForm(p => ({ ...p, interviewDate: e.target.value }))} />
            <Select value={form.difficulty} onValueChange={v => setForm(p => ({ ...p, difficulty: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Rounds (e.g., Aptitude, Coding, Technical, HR)" value={form.rounds} onChange={e => setForm(p => ({ ...p, rounds: e.target.value }))} />
            <Textarea placeholder="Questions asked in the interview..." value={form.questions} onChange={e => setForm(p => ({ ...p, questions: e.target.value }))} rows={3} />
            <Textarea placeholder="Tips and advice for future candidates..." value={form.tips} onChange={e => setForm(p => ({ ...p, tips: e.target.value }))} rows={2} />
            <Button onClick={handleSubmit} className="w-full">Share Experience</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No experiences yet. Be the first to share!</p>}

      {filtered.map((exp, i) => {
        const expComments = comments[exp.id] || [];
        const likedBy: string[] = exp.liked_by || [];
        return (
          <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{exp.username.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-sm font-medium">{exp.username}</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(exp.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Badge variant="outline">{exp.company}</Badge>
                  <Badge variant="secondary">{exp.difficulty}</Badge>
                </div>
              </div>
              <h3 className="font-semibold text-sm">{exp.company} — {exp.role}</h3>
              {exp.rounds && <div className="flex flex-wrap gap-1">{exp.rounds.split(',').map((r: string, ri: number) => <Badge key={ri} variant="secondary" className="text-[10px]">{r.trim()}</Badge>)}</div>}
              {exp.questions && <div><p className="text-xs font-medium text-muted-foreground mb-1">Questions:</p><p className="text-xs text-foreground whitespace-pre-line">{exp.questions}</p></div>}
              {exp.tips && <div className="bg-muted/40 rounded-lg p-2"><p className="text-xs font-medium text-muted-foreground mb-1">💡 Tips:</p><p className="text-xs">{exp.tips}</p></div>}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={() => handleLike(exp)} className={cn("flex items-center gap-1 text-xs transition-colors", likedBy.includes(userId) ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                  <Heart className={cn("w-3.5 h-3.5", likedBy.includes(userId) && "fill-primary")} /> {exp.likes}
                </button>
                <button onClick={() => setExpandedComments(expandedComments === exp.id ? null : exp.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Comments
                </button>
                {exp.user_id === userId && (
                  <button onClick={() => handleDelete(exp.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {expandedComments === exp.id && (
              <div className="border-t border-border">
                {expComments.map((c: any) => (
                  <div key={c.id} className="px-4 py-2 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{c.username.charAt(0).toUpperCase()}</div>
                        <span className="text-xs font-medium">{c.username}</span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                      </div>
                      {c.user_id === userId && (
                        <button onClick={() => handleDeleteComment(exp.id, c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs ml-7">{c.text}</p>
                  </div>
                ))}
                <div className="p-3 flex gap-2">
                  <Input placeholder="Write a comment..." value={commentDrafts[exp.id] || ''} onChange={e => setCommentDrafts(d => ({ ...d, [exp.id]: e.target.value }))}
                    className="text-xs" onKeyDown={e => e.key === 'Enter' && handleComment(exp.id)} />
                  <Button size="sm" onClick={() => handleComment(exp.id)} disabled={!commentDrafts[exp.id]?.trim()}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Questions Tab ──
function QuestionsTab({ search, companyFilter }: { search: string; companyFilter: string }) {
  const { userId, username } = useCurrentUser();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', company: 'TCS' });
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    const { data } = await supabase.from('community_questions').select('*').order('created_at', { ascending: false });
    if (data) setQuestions(data);
    setLoading(false);
  }, []);

  const fetchAnswers = useCallback(async (qId: string) => {
    const { data } = await supabase.from('community_answers').select('*').eq('question_id', qId).order('upvotes', { ascending: false });
    if (data) setAnswers(prev => ({ ...prev, [qId]: data }));
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);
  useEffect(() => { if (expandedQ) fetchAnswers(expandedQ); }, [expandedQ, fetchAnswers]);

  const filtered = useMemo(() => questions.filter(q => {
    if (companyFilter !== 'All' && q.company !== companyFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()) && !(q.description || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [questions, search, companyFilter]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Question title is required'); return; }
    await supabase.from('community_questions').insert({ user_id: userId, username, ...form });
    setForm({ title: '', description: '', company: 'TCS' });
    setShowForm(false);
    toast.success('Question posted!');
    fetchQuestions();
  };

  const handleLike = async (q: any) => {
    const likedBy: string[] = q.liked_by || [];
    if (likedBy.includes(userId)) return;
    await supabase.from('community_questions').update({ likes: q.likes + 1, liked_by: [...likedBy, userId] }).eq('id', q.id);
    fetchQuestions();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('community_questions').delete().eq('id', id);
    toast.success('Deleted');
    fetchQuestions();
  };

  const handleAnswer = async (qId: string) => {
    const text = answerDrafts[qId]?.trim();
    if (!text) return;
    await supabase.from('community_answers').insert({ question_id: qId, user_id: userId, username, answer_text: text });
    setAnswerDrafts(d => ({ ...d, [qId]: '' }));
    toast.success('Answer posted!');
    fetchAnswers(qId);
  };

  const handleUpvote = async (qId: string, a: any) => {
    const upvotedBy: string[] = a.upvoted_by || [];
    if (upvotedBy.includes(userId)) return;
    await supabase.from('community_answers').update({ upvotes: a.upvotes + 1, upvoted_by: [...upvotedBy, userId] }).eq('id', a.id);
    fetchAnswers(qId);
  };

  const handleMarkBest = async (qId: string, answerId: string) => {
    await supabase.from('community_questions').update({ best_answer_id: answerId }).eq('id', qId);
    toast.success('Marked as best answer');
    fetchQuestions();
    fetchAnswers(qId);
  };

  if (loading) return <p className="text-center text-muted-foreground text-sm py-8">Loading...</p>;

  return (
    <div className="space-y-4 mt-4">
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="w-full"><Plus className="w-4 h-4 mr-2" />Ask a Question</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Ask the Community</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Question title (e.g., How to crack TCS interview?)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <Textarea placeholder="Describe your question in detail..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            <Select value={form.company} onValueChange={v => setForm(p => ({ ...p, company: v }))}>
              <SelectTrigger><SelectValue placeholder="Related Company" /></SelectTrigger>
              <SelectContent>{companyOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleSubmit} className="w-full">Post Question</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No questions yet. Ask the first one!</p>}

      {filtered.map((q, i) => {
        const qAnswers = answers[q.id] || [];
        const likedBy: string[] = q.liked_by || [];
        return (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{q.username.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-xs font-medium">{q.username}</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(q.created_at)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">{q.company}</Badge>
              </div>
              <h3 className="font-semibold text-sm">{q.title}</h3>
              {q.description && <p className="text-xs text-muted-foreground">{q.description}</p>}
              <div className="flex items-center gap-3">
                <button onClick={() => handleLike(q)} className={cn("flex items-center gap-1 text-xs transition-colors", likedBy.includes(userId) ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                  <Heart className={cn("w-3.5 h-3.5", likedBy.includes(userId) && "fill-primary")} /> {q.likes}
                </button>
                <button onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> {qAnswers.length} answer{qAnswers.length !== 1 ? 's' : ''}
                </button>
                {q.user_id === userId && (
                  <button onClick={() => handleDelete(q.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {expandedQ === q.id && (
              <div className="border-t border-border">
                {qAnswers.map((a: any) => (
                  <div key={a.id} className={cn("p-3 border-b border-border last:border-0", q.best_answer_id === a.id && "bg-primary/5")}>
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => handleUpvote(q.id, a)} className={cn("transition-colors", (a.upvoted_by || []).includes(userId) ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold">{a.upvotes}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{a.username}</span>
                          <span className="text-[10px] text-muted-foreground">{timeAgo(a.created_at)}</span>
                          {q.best_answer_id === a.id && <Badge className="text-[10px] bg-primary/20 text-primary"><Award className="w-2.5 h-2.5 mr-0.5" />Best</Badge>}
                        </div>
                        <p className="text-xs">{a.answer_text}</p>
                        {q.user_id === userId && q.best_answer_id !== a.id && (
                          <button onClick={() => handleMarkBest(q.id, a.id)} className="text-[10px] text-primary hover:underline mt-1">Mark as best answer</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 flex gap-2">
                  <Input placeholder="Write an answer..." value={answerDrafts[q.id] || ''} onChange={e => setAnswerDrafts(d => ({ ...d, [q.id]: e.target.value }))}
                    className="text-xs" onKeyDown={e => e.key === 'Enter' && handleAnswer(q.id)} />
                  <Button size="sm" onClick={() => handleAnswer(q.id)} disabled={!answerDrafts[q.id]?.trim()}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Vlogs Tab ──
function VlogsTab({ search, companyFilter }: { search: string; companyFilter: string }) {
  const { userId, username } = useCurrentUser();
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', company: 'TCS', videoUrl: '', type: 'youtube', textContent: '' });
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVlogs = useCallback(async () => {
    const { data } = await supabase.from('community_vlogs').select('*').order('created_at', { ascending: false });
    if (data) setVlogs(data);
    setLoading(false);
  }, []);

  const fetchComments = useCallback(async (vlogId: string) => {
    const { data } = await supabase.from('community_vlog_comments').select('*').eq('vlog_id', vlogId).order('created_at', { ascending: true });
    if (data) setComments(prev => ({ ...prev, [vlogId]: data }));
  }, []);

  useEffect(() => { fetchVlogs(); }, [fetchVlogs]);
  useEffect(() => { if (expandedComments) fetchComments(expandedComments); }, [expandedComments, fetchComments]);

  const getEmbedUrl = (url: string): string | null => {
    try {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    } catch { return null; }
  };

  const filtered = useMemo(() => vlogs.filter(v => {
    if (companyFilter !== 'All' && v.company !== companyFilter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [vlogs, search, companyFilter]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (form.type === 'youtube' && !form.videoUrl.trim()) { toast.error('Video URL is required'); return; }
    await supabase.from('community_vlogs').insert({
      user_id: userId, username, title: form.title, description: form.description,
      company: form.company, video_url: form.videoUrl, type: form.type, text_content: form.textContent,
    });
    setForm({ title: '', description: '', company: 'TCS', videoUrl: '', type: 'youtube', textContent: '' });
    setShowForm(false);
    toast.success('Vlog shared!');
    fetchVlogs();
  };

  const handleLike = async (vlog: any) => {
    const likedBy: string[] = vlog.liked_by || [];
    if (likedBy.includes(userId)) return;
    await supabase.from('community_vlogs').update({ likes: vlog.likes + 1, liked_by: [...likedBy, userId] }).eq('id', vlog.id);
    fetchVlogs();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('community_vlogs').delete().eq('id', id);
    toast.success('Deleted');
    fetchVlogs();
  };

  const handleComment = async (vlogId: string) => {
    const text = commentDrafts[vlogId]?.trim();
    if (!text) return;
    await supabase.from('community_vlog_comments').insert({ vlog_id: vlogId, user_id: userId, username, text });
    setCommentDrafts(d => ({ ...d, [vlogId]: '' }));
    toast.success('Comment posted!');
    fetchComments(vlogId);
  };

  const handleDeleteComment = async (vlogId: string, commentId: string) => {
    await supabase.from('community_vlog_comments').delete().eq('id', commentId);
    toast.success('Comment deleted');
    fetchComments(vlogId);
  };

  if (loading) return <p className="text-center text-muted-foreground text-sm py-8">Loading...</p>;

  return (
    <div className="space-y-4 mt-4">
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="w-full"><Plus className="w-4 h-4 mr-2" />Upload Vlog / Video</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Share a Vlog or Mentor Talk</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <Textarea placeholder="Description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            <Select value={form.company} onValueChange={v => setForm(p => ({ ...p, company: v }))}>
              <SelectTrigger><SelectValue placeholder="Company Tag" /></SelectTrigger>
              <SelectContent>{companyOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube Link</SelectItem>
                <SelectItem value="text">Text Vlog</SelectItem>
              </SelectContent>
            </Select>
            {form.type === 'youtube' ? (
              <Input placeholder="YouTube video URL" value={form.videoUrl} onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))} />
            ) : (
              <Textarea placeholder="Write your vlog content..." value={form.textContent} onChange={e => setForm(p => ({ ...p, textContent: e.target.value }))} rows={5} />
            )}
            <Button onClick={handleSubmit} className="w-full">Share Vlog</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No vlogs yet. Share the first one!</p>}

      {filtered.map((vlog, i) => {
        const embedUrl = vlog.type === 'youtube' ? getEmbedUrl(vlog.video_url || '') : null;
        const vlogComments = comments[vlog.id] || [];
        const likedBy: string[] = vlog.liked_by || [];
        return (
          <motion.div key={vlog.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden">
            {embedUrl && (
              <div className="aspect-video w-full bg-black">
                <iframe src={embedUrl} title={vlog.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{vlog.username.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-xs font-medium">{vlog.username}</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(vlog.created_at)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">{vlog.company}</Badge>
              </div>
              <h3 className="font-semibold text-sm">{vlog.title}</h3>
              {vlog.description && <p className="text-xs text-muted-foreground">{vlog.description}</p>}
              {vlog.type === 'text' && vlog.text_content && (
                <div className="bg-muted/40 rounded-lg p-3"><p className="text-xs whitespace-pre-line">{vlog.text_content}</p></div>
              )}
              {vlog.type === 'youtube' && vlog.video_url && (
                <a href={vlog.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <ExternalLink className="w-3 h-3" /> Watch on YouTube
                </a>
              )}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={() => handleLike(vlog)} className={cn("flex items-center gap-1 text-xs transition-colors", likedBy.includes(userId) ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                  <Heart className={cn("w-3.5 h-3.5", likedBy.includes(userId) && "fill-primary")} /> {vlog.likes}
                </button>
                <button onClick={() => setExpandedComments(expandedComments === vlog.id ? null : vlog.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> {vlogComments.length} comment{vlogComments.length !== 1 ? 's' : ''}
                </button>
                {vlog.user_id === userId && (
                  <button onClick={() => handleDelete(vlog.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {expandedComments === vlog.id && (
              <div className="border-t border-border">
                {vlogComments.map((c: any) => (
                  <div key={c.id} className="px-4 py-2 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{c.username.charAt(0).toUpperCase()}</div>
                        <span className="text-xs font-medium">{c.username}</span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                      </div>
                      {c.user_id === userId && (
                        <button onClick={() => handleDeleteComment(vlog.id, c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs ml-7">{c.text}</p>
                  </div>
                ))}
                <div className="p-3 flex gap-2">
                  <Input placeholder="Write a comment..." value={commentDrafts[vlog.id] || ''} onChange={e => setCommentDrafts(d => ({ ...d, [vlog.id]: e.target.value }))}
                    className="text-xs" onKeyDown={e => e.key === 'Enter' && handleComment(vlog.id)} />
                  <Button size="sm" onClick={() => handleComment(vlog.id)} disabled={!commentDrafts[vlog.id]?.trim()}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Eligibility Tab ──
function EligibilityTab({ search, companyFilter }: { search: string; companyFilter: string }) {
  const { userId, username } = useCurrentUser();
  const [eligibilities, setEligibilities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: 'TCS', minCGPA: '', backlogs: '', branches: '', additionalInfo: '' });

  const fetchEligibilities = useCallback(async () => {
    const { data } = await supabase.from('community_eligibilities').select('*').order('created_at', { ascending: false });
    if (data) setEligibilities(data);
  }, []);

  useEffect(() => { fetchEligibilities(); }, [fetchEligibilities]);

  const filtered = useMemo(() => eligibilities.filter(e => {
    if (companyFilter !== 'All' && e.company !== companyFilter) return false;
    if (search && !e.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [eligibilities, search, companyFilter]);

  const defaultEligibility: Record<string, { cgpa: string; backlogs: string; branches: string }> = {
    TCS: { cgpa: '6.0 (Ninja) / 7.0 (Digital) / 7.5 (Prime)', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE, EEE, Mech, Civil (varies by role)' },
    Infosys: { cgpa: '6.0 (SE) / 6.5 (SP)', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE, EEE' },
    Accenture: { cgpa: '6.0', backlogs: 'No active backlogs', branches: 'All engineering branches' },
    Wipro: { cgpa: '6.0', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE, EEE' },
    Capgemini: { cgpa: '6.0 (Analyst) / 7.0 (Senior Analyst)', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE' },
    Cognizant: { cgpa: '6.0 (GenC) / 6.5 (GenC Pro)', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE, EEE' },
    Deloitte: { cgpa: '7.0', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE' },
    IBM: { cgpa: '6.5', backlogs: 'No active backlogs', branches: 'CSE, IT, ECE, EEE' },
  };

  const handleSubmit = async () => {
    if (!form.minCGPA.trim()) { toast.error('CGPA info is required'); return; }
    await supabase.from('community_eligibilities').insert({
      user_id: userId, username, company: form.company,
      min_cgpa: form.minCGPA, backlogs: form.backlogs, branches: form.branches, additional_info: form.additionalInfo,
    });
    setForm({ company: 'TCS', minCGPA: '', backlogs: '', branches: '', additionalInfo: '' });
    setShowForm(false);
    toast.success('Eligibility info shared!');
    fetchEligibilities();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('community_eligibilities').delete().eq('id', id);
    toast.success('Deleted');
    fetchEligibilities();
  };

  return (
    <div className="space-y-4 mt-4">
      <p className="text-xs font-medium text-muted-foreground">📋 Standard Eligibility Criteria (2024-25)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(defaultEligibility).map(([company, info]) => (
          <motion.div key={company} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-3 space-y-1.5">
            <h3 className="font-semibold text-sm flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />{company}</h3>
            <p className="text-[11px]"><span className="text-muted-foreground">Min CGPA:</span> {info.cgpa}</p>
            <p className="text-[11px]"><span className="text-muted-foreground">Backlogs:</span> {info.backlogs}</p>
            <p className="text-[11px]"><span className="text-muted-foreground">Branches:</span> {info.branches}</p>
          </motion.div>
        ))}
      </div>

      {filtered.length > 0 && (
        <>
          <p className="text-xs font-medium text-muted-foreground mt-4">🗣️ Community Shared Info</p>
          {filtered.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{e.username}</span>
                  <Badge variant="outline" className="text-[10px]">{e.company}</Badge>
                </div>
                {e.user_id === userId && (
                  <button onClick={() => handleDelete(e.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
              <p className="text-[11px]"><span className="text-muted-foreground">Min CGPA:</span> {e.min_cgpa}</p>
              {e.backlogs && <p className="text-[11px]"><span className="text-muted-foreground">Backlogs:</span> {e.backlogs}</p>}
              {e.branches && <p className="text-[11px]"><span className="text-muted-foreground">Branches:</span> {e.branches}</p>}
              {e.additional_info && <p className="text-[11px] text-muted-foreground">{e.additional_info}</p>}
            </motion.div>
          ))}
        </>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" />Share Eligibility Info</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Share Eligibility Information</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Select value={form.company} onValueChange={v => setForm(p => ({ ...p, company: v }))}>
              <SelectTrigger><SelectValue placeholder="Company" /></SelectTrigger>
              <SelectContent>{companyOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Minimum CGPA requirement" value={form.minCGPA} onChange={e => setForm(p => ({ ...p, minCGPA: e.target.value }))} />
            <Input placeholder="Backlog policy" value={form.backlogs} onChange={e => setForm(p => ({ ...p, backlogs: e.target.value }))} />
            <Input placeholder="Eligible branches" value={form.branches} onChange={e => setForm(p => ({ ...p, branches: e.target.value }))} />
            <Textarea placeholder="Additional info (batch year, bond, etc.)" value={form.additionalInfo} onChange={e => setForm(p => ({ ...p, additionalInfo: e.target.value }))} rows={2} />
            <Button onClick={handleSubmit} className="w-full">Share Info</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
