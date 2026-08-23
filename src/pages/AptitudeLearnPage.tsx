import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Play, Lightbulb, Zap, AlertTriangle, Calculator, Brain, MessageSquare, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TOPIC_REGISTRY, SECTION_CONFIG } from '@/features/aptitude/config';

// Helper to generate dynamic structured learn content for any topic
function getLearnContentForTopic(topicName: string, section: string, tags: string[], companies: string[]) {
  const compStr = companies.length > 0 ? companies.slice(0, 3).join(', ') : 'top Tech & IT companies';
  return {
    overview: `${topicName} is a fundamental concept in ${section === 'quantitative' ? 'Quantitative Aptitude' : section === 'logical' ? 'Logical Reasoning' : 'Verbal Ability'}. Mastering ${topicName} allows you to solve placement questions quickly and accurately.`,
    importance: `This topic is frequently tested by ${compStr} in campus placement assessments. Questions range from direct formula applications to multi-step analytical problems.`,
    concepts: [
      { title: `Core Principles of ${topicName}`, description: `Understand the fundamental rules and definitions governing ${topicName}. Always identify given variables first before selecting an approach.` },
      { title: 'Standard Problem Patterns', description: `Questions on ${topicName} usually fall into standard templates: direct calculation, comparative analysis, and reverse calculation from given options.` },
      { title: 'Option Elimination Strategy', description: `Check for units, odd/even parity, and extreme values to eliminate obviously incorrect options quickly.` },
    ],
    formulas: tags.map((tag, idx) => ({
      name: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Rule`,
      formula: `Standard formula / identity for ${tag}`,
      note: `Used for solving ${tag}-based questions in under 60 seconds.`,
    })),
    shortcuts: [
      `Ratio Technique: Express changes as fractions to calculate ${topicName} values faster without heavy multiplication.`,
      `Option Back-substitution: Test option (C) first when options are arranged numerically to narrow down the range.`,
      `Estimation Method: Round complex numbers to simple figures to estimate the correct choice.`,
    ],
    mistakes: [
      'Misreading question constraints (e.g. at least vs at most, or speed units in km/h vs m/s).',
      'Confusing intermediate results with final answer requested by the question.',
      'Applying formulas without checking basic assumptions and constraints.',
    ],
    placementTips: [
      `Target solving ${topicName} questions within 60–90 seconds per question.`,
      `Practice eliminating 2 options within the first 15 seconds.`,
      `Review wrong attempts immediately after each practice test to strengthen conceptual gaps.`,
    ],
  };
}

export default function AptitudeLearnPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topic = TOPIC_REGISTRY.find((t) => t.id === topicId);
  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Topic not found in Aptitude Arena.</p>
        <Button onClick={() => navigate('/aptitude')} variant="outline">Back to Dashboard</Button>
      </div>
    );
  }

  const config = SECTION_CONFIG[topic.section];
  const SectionIcon = topic.section === 'quantitative' ? Calculator : topic.section === 'logical' ? Brain : MessageSquare;
  const content = getLearnContentForTopic(topic.name, topic.section, topic.tags, topic.companyRelevance);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className={cn('px-4 pt-6 pb-6 safe-top border-b border-border', config.bgColor)}>
        <div className="max-w-[900px] mx-auto">
          <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate(`/aptitude/topic/${topicId}`)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {topic.name}
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn('rounded-xl p-3', config.bgColor)}>
              <SectionIcon className={cn('h-6 w-6', config.color)} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{topic.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground capitalize">
                Learn Concepts · {config.shortLabel} Aptitude
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="concept" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1.5 rounded-xl border border-border">
            <TabsTrigger value="concept" className="text-xs md:text-sm px-3 py-1.5"><BookOpen className="h-4 w-4 mr-1.5" />Concept</TabsTrigger>
            <TabsTrigger value="formulas" className="text-xs md:text-sm px-3 py-1.5"><Calculator className="h-4 w-4 mr-1.5" />Formulas</TabsTrigger>
            <TabsTrigger value="shortcuts" className="text-xs md:text-sm px-3 py-1.5"><Zap className="h-4 w-4 mr-1.5" />Shortcuts</TabsTrigger>
            <TabsTrigger value="mistakes" className="text-xs md:text-sm px-3 py-1.5"><AlertTriangle className="h-4 w-4 mr-1.5" />Common Pitfalls</TabsTrigger>
            <TabsTrigger value="tips" className="text-xs md:text-sm px-3 py-1.5"><Lightbulb className="h-4 w-4 mr-1.5" />Placement Tips</TabsTrigger>
          </TabsList>

          {/* CONCEPT TAB */}
          <TabsContent value="concept" className="space-y-4">
            <div className={cn('rounded-2xl border p-5 md:p-6 space-y-3', config.borderColor, config.bgColor)}>
              <h2 className="text-lg font-bold">Overview</h2>
              <p className="text-sm md:text-base leading-relaxed text-foreground">{content.overview}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.importance}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Core Principles</h3>
              {content.concepts.map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-1">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    {c.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground pl-7">{c.description}</p>
                </div>
              ))}
            </div>

            {/* Relevant Companies */}
            {topic.companyRelevance.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Company Relevance</p>
                <div className="flex flex-wrap gap-2">
                  {topic.companyRelevance.map((company) => (
                    <span key={company} className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* FORMULAS TAB */}
          <TabsContent value="formulas" className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold">Important Formulas & Rules</h2>
              <div className="space-y-3">
                {content.formulas.map((f, i) => (
                  <div key={i} className="bg-muted/50 border border-border rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{f.name}</span>
                      <span className="text-[10px] text-muted-foreground">Rule #{i + 1}</span>
                    </div>
                    <p className="font-mono text-sm font-semibold bg-background border border-border rounded-lg p-2.5 text-foreground">
                      {f.formula}
                    </p>
                    <p className="text-xs text-muted-foreground">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* SHORTCUTS TAB */}
          <TabsContent value="shortcuts" className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" /> Speed Tricks & Shortcuts
              </h2>
              <div className="space-y-3">
                {content.shortcuts.map((s, i) => (
                  <div key={i} className="bg-warning/5 border border-warning/30 rounded-xl p-4 flex gap-3 items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning/20 text-xs font-bold text-warning">{i + 1}</span>
                    <p className="text-sm text-foreground leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* COMMON PITFALLS TAB */}
          <TabsContent value="mistakes" className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Common Mistakes to Avoid
              </h2>
              <div className="space-y-3">
                {content.mistakes.map((m, i) => (
                  <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-3 items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-xs font-bold text-destructive">{i + 1}</span>
                    <p className="text-sm text-foreground leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* PLACEMENT TIPS TAB */}
          <TabsContent value="tips" className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-success">
                <Lightbulb className="h-5 w-5 text-success" /> Campus Placement Tips
              </h2>
              <div className="space-y-3">
                {content.placementTips.map((tip, i) => (
                  <div key={i} className="bg-success/5 border border-success/20 rounded-xl p-4 flex gap-3 items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">{i + 1}</span>
                    <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA to Practice */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate(`/aptitude/topic/${topicId}`)}>
            Back to Topic Overview
          </Button>
          <Button className="flex-1 gradient-primary" onClick={() => navigate(`/aptitude/practice/${topicId}?count=10&mode=practice`)}>
            <Play className="h-4 w-4 mr-2" /> Start Practice ({topic.questionCount} Questions)
          </Button>
        </div>
      </div>
    </div>
  );
}
