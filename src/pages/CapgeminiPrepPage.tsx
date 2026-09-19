import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CAPGEMINI_QUESTION_PACK,
  CAPGEMINI_CATEGORIES,
  CAPGEMINI_PACK_STATS,
  CapgeminiQuestion,
  CapgeminiCategory,
  CapgeminiQuestionType,
} from "@/features/coding-lab/data/capgemini";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Bug,
  Code2,
  Terminal,
  Brain,
  Database,
  Layers,
  Cpu,
  Globe,
  Sparkles,
  Timer,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Filter,
  Lightbulb,
  ExternalLink,
  Award,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function CapgeminiPrepPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useFirebaseAuth();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<CapgeminiCategory | "all">("all");
  const [selectedType, setSelectedType] = useState<CapgeminiQuestionType | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // User answers state (questionId -> selectedOptionId)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("preptrack_capg_answers");
    return saved ? JSON.parse(saved) : {};
  });

  // Expanded explanations state
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    const updated = { ...userAnswers, [questionId]: optionId };
    setUserAnswers(updated);
    localStorage.setItem("preptrack_capg_answers", JSON.stringify(updated));

    // Automatically expand explanation after answering
    setExpandedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleToggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleResetProgress = () => {
    setUserAnswers({});
    setExpandedExplanations({});
    localStorage.removeItem("preptrack_capg_answers");
    toast({ title: "Practice progress reset" });
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return CAPGEMINI_QUESTION_PACK.filter((q) => {
      if (selectedCategory !== "all" && q.category !== selectedCategory) return false;
      if (selectedType !== "all" && q.type !== selectedType) return false;
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTag = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTopic && !matchesQuestion && !matchesTag) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedType, selectedDifficulty, searchQuery]);

  // Performance metrics
  const totalAttempted = Object.keys(userAnswers).length;
  const totalCorrect = Object.entries(userAnswers).filter(([qId, answer]) => {
    const q = CAPGEMINI_QUESTION_PACK.find((item) => item.id === qId);
    return q && q.correctAnswer === answer;
  }).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const progressPercent = Math.round((totalAttempted / CAPGEMINI_QUESTION_PACK.length) * 100);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Easy</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">Medium</Badge>;
      case "Hard":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30">Hard</Badge>;
      default:
        return <Badge variant="outline">{diff}</Badge>;
    }
  };

  const getTypeBadge = (type: CapgeminiQuestionType) => {
    switch (type) {
      case "debugging":
        return (
          <Badge variant="outline" className="text-rose-400 border-rose-800/40 bg-rose-950/20 gap-1 text-[10px]">
            <Bug className="w-3 h-3" />
            <span>Debugging</span>
          </Badge>
        );
      case "output-prediction":
        return (
          <Badge variant="outline" className="text-cyan-400 border-cyan-800/40 bg-cyan-950/20 gap-1 text-[10px]">
            <Terminal className="w-3 h-3" />
            <span>Output Prediction</span>
          </Badge>
        );
      case "coding":
        return (
          <Badge variant="outline" className="text-emerald-400 border-emerald-800/40 bg-emerald-950/20 gap-1 text-[10px]">
            <Code2 className="w-3 h-3" />
            <span>Coding</span>
          </Badge>
        );
      case "sql":
        return (
          <Badge variant="outline" className="text-amber-400 border-amber-800/40 bg-amber-950/20 gap-1 text-[10px]">
            <Database className="w-3 h-3" />
            <span>SQL</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[10px]">
            {type.toUpperCase()}
          </Badge>
        );
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/coding-lab")}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Coding Lab</span>
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Preparation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Capgemini Placement Preparation Pack
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
            Master 73 original enterprise-grade technical challenges, output-prediction traps, live debugging drills, SQL writing queries, and scenario-based AI/GenAI assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => navigate("/coding-lab/assessment")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-sm"
            size="sm"
          >
            <Timer className="w-4 h-4" />
            <span>Take Technical Mock</span>
          </Button>
        </div>
      </div>

      {/* Progress & Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">Total Questions</div>
          <div className="text-2xl font-bold mt-1 text-foreground font-mono">
            {CAPGEMINI_PACK_STATS.totalQuestions}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Curated placement pack</div>
        </Card>

        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">Debugging Drills</div>
          <div className="text-2xl font-bold mt-1 text-rose-400 font-mono">
            {CAPGEMINI_PACK_STATS.debuggingCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">C++, Java, Python, JS, SQL</div>
        </Card>

        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">Output Prediction</div>
          <div className="text-2xl font-bold mt-1 text-cyan-400 font-mono">
            {CAPGEMINI_PACK_STATS.outputPredictionCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Loops, pointers, precedence</div>
        </Card>

        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">Coding Problems</div>
          <div className="text-2xl font-bold mt-1 text-emerald-400 font-mono">
            {CAPGEMINI_PACK_STATS.codingCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">4 Easy, 4 Med, 2 Hard</div>
        </Card>

        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">SQL & Queries</div>
          <div className="text-2xl font-bold mt-1 text-amber-400 font-mono">
            {CAPGEMINI_PACK_STATS.sqlCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Joins, GROUP BY, window</div>
        </Card>

        <Card className="bg-card/60 border-border/50 p-3.5">
          <div className="text-[11px] text-muted-foreground font-medium">Your Accuracy</div>
          <div className="text-2xl font-bold mt-1 text-primary font-mono">
            {totalAttempted > 0 ? `${overallAccuracy}%` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {totalAttempted}/{CAPGEMINI_PACK_STATS.totalQuestions} attempted
          </div>
        </Card>
      </div>

      {/* Progress Bar & Reset */}
      <div className="p-4 bg-card/60 border border-border/50 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            Pack Completion: <span className="text-foreground font-semibold">{totalAttempted} of {CAPGEMINI_PACK_STATS.totalQuestions} Questions</span> ({progressPercent}%)
          </span>
          {totalAttempted > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetProgress}
              className="h-6 text-[11px] text-muted-foreground hover:text-rose-400 gap-1 px-2"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset My Answers</span>
            </Button>
          )}
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, topic (e.g. pointers, ACID, sliding window, RAG)..."
              className="pl-9 h-9 text-xs bg-card border-border/60"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={(val) => setSelectedType(val as CapgeminiQuestionType | "all")}>
            <SelectTrigger className="w-full md:w-44 h-9 text-xs bg-card border-border/60">
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debugging">Debugging (11)</SelectItem>
              <SelectItem value="output-prediction">Output Prediction (14)</SelectItem>
              <SelectItem value="coding">Coding (10)</SelectItem>
              <SelectItem value="sql">SQL (5)</SelectItem>
              <SelectItem value="mcq">MCQ & Concept</SelectItem>
              <SelectItem value="scenario">Scenario Based</SelectItem>
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-36 h-9 text-xs bg-card border-border/60">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Horizontal Pill Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CAPGEMINI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors text-xs shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredQuestions.length} of {CAPGEMINI_QUESTION_PACK.length} questions</span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/40 space-y-2">
            <Filter className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <h3 className="font-semibold text-sm text-foreground">No questions match your filter criteria</h3>
            <p className="text-xs text-muted-foreground">Try clearing your search query or selecting "All Questions".</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedType("all");
                setSelectedDifficulty("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isAnswered = Boolean(userAnswer);
            const isCorrect = isAnswered && userAnswer === q.correctAnswer;
            const isExpanded = Boolean(expandedExplanations[q.id]);

            return (
              <Card key={q.id} className="border-border/60 bg-card/70 transition-all hover:border-border">
                <CardHeader className="p-4 sm:p-5 pb-2 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-muted-foreground">
                        #{idx + 1}
                      </span>
                      {getTypeBadge(q.type)}
                      {getDifficultyBadge(q.difficulty)}
                      <Badge variant="outline" className="text-[10px]">
                        {q.categoryLabel}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">• {q.topic}</span>
                    </div>

                    {isAnswered && (
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    {q.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0 space-y-4 text-xs">
                  {/* Question Text */}
                  <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                    {q.question}
                  </p>

                  {/* Code Snippet (if applicable) */}
                  {q.codeSnippet && (
                    <div className="font-mono text-xs bg-[#121214] border border-[#2d2d31] rounded-lg p-3 overflow-x-auto text-zinc-300">
                      <pre className="whitespace-pre-wrap">{q.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Coding Question Details */}
                  {q.type === "coding" && q.codingDetails && (
                    <div className="p-3 bg-muted/20 border border-border/50 rounded-lg space-y-2.5 font-sans">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Examples</span>
                        <div className="mt-1 space-y-1 font-mono text-[11px]">
                          {q.codingDetails.examples.map((ex, i) => (
                            <div key={i} className="p-2 bg-background border border-border/40 rounded">
                              <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                              <div className="text-emerald-400"><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                              {ex.explanation && <div className="text-muted-foreground text-[10px] font-sans mt-0.5">{ex.explanation}</div>}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-muted-foreground font-mono">
                          Target: {q.codingDetails.expectedComplexity.time} time, {q.codingDetails.expectedComplexity.space} space
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate("/coding-lab/workspace/debug-cpp-01")}
                          className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Practice in IDE</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Options (for MCQ, Output Prediction, Debugging choices) */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = userAnswer === opt.id;
                        const isRightAnswer = isAnswered && opt.id === q.correctAnswer;
                        const isWrongChoice = isAnswered && isSelected && !isCorrect;

                        let btnClass = "border-border/50 bg-background text-foreground hover:bg-muted/40";
                        if (isRightAnswer) {
                          btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                        } else if (isWrongChoice) {
                          btnClass = "border-rose-500 bg-rose-500/10 text-rose-400 line-through";
                        } else if (isSelected) {
                          btnClass = "border-primary bg-primary/10 text-primary font-medium";
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectAnswer(q.id, opt.id)}
                            className={`flex items-start text-left p-2.5 rounded-lg border transition-all text-xs font-sans gap-2.5 ${btnClass}`}
                          >
                            <span className="font-mono font-bold text-muted-foreground uppercase shrink-0">
                              {opt.id}.
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SQL Question Reveal Section */}
                  {q.type === "sql" && (
                    <div className="space-y-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleExplanation(q.id)}
                        className="h-7 text-xs gap-1 border-border/60"
                      >
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isExpanded ? "Hide SQL Query Solution" : "Reveal SQL Query Solution"}</span>
                      </Button>
                      {isExpanded && (
                        <div className="font-mono text-xs bg-[#121214] border border-amber-500/30 rounded-lg p-3 text-emerald-400 whitespace-pre-wrap">
                          {q.correctAnswer}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation Toggle & Detailed Breakdown */}
                  <div className="pt-2 border-t border-border/40">
                    <button
                      onClick={() => handleToggleExplanation(q.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? "Hide Detailed Explanation & Interview Takeaway" : "View Explanation & Interview Takeaway"}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3.5 bg-muted/20 border border-border/50 rounded-lg space-y-2.5 text-xs">
                        <div>
                          <span className="font-semibold text-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct Answer Analysis
                          </span>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            {q.explanation.correctReason}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold text-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider text-primary">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Core Placement Concept
                          </span>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            {q.explanation.concept}
                          </p>
                        </div>

                        <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-md">
                          <span className="font-semibold text-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider text-primary">
                            <Award className="w-3.5 h-3.5" />
                            Interview Takeaway
                          </span>
                          <p className="mt-0.5 text-foreground/90 leading-relaxed text-[11px]">
                            {q.explanation.takeaway}
                          </p>
                        </div>

                        {q.explanation.wrongOptionsAnalysis && (
                          <div className="text-[11px] text-muted-foreground/80 italic pt-0.5">
                            Common Traps: {q.explanation.wrongOptionsAnalysis}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
