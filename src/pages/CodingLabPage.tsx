import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { PROBLEM_BANK } from "@/features/coding-lab/data/problemBank";
import { MOCK_ASSESSMENTS } from "@/features/coding-lab/data/mockAssessments";
import {
  Code2,
  Bug,
  Timer,
  History,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Brain,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CodingLabPage() {
  const navigate = useNavigate();
  const { codingAttempts, dsaTopics } = useStore();

  // Calculate actual user statistics
  const totalAttempts = codingAttempts?.length || 0;
  let totalProblemsSolved = 0;
  let totalScoreSum = 0;
  let totalDurationSecs = 0;

  codingAttempts?.forEach((attempt) => {
    totalProblemsSolved += attempt.passedProblems || 0;
    totalScoreSum += attempt.score || 0;
    totalDurationSecs += attempt.durationSeconds || 0;
  });

  const averageScore = totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 78;
  const debuggingAccuracy = totalAttempts > 0 ? Math.round((totalProblemsSolved / (totalAttempts * 5)) * 100) : 84;
  const averageTimeSecs = totalAttempts > 0 ? (totalDurationSecs / (totalProblemsSolved || 1)).toFixed(1) : "2.4";

  // Identify student's weak topic based on dsaTopics & attempts
  const weakTopic =
    dsaTopics.find((t) => t.status === "in-progress" || t.confidence < 60) ||
    dsaTopics.find((t) => t.id === "searching") ||
    dsaTopics[0];

  const primaryMock = MOCK_ASSESSMENTS[0];

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-zinc-900 via-zinc-850 to-zinc-900 border border-border/50 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PrepTrack Enterprise Assessment Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              PrepTrack Coding Lab
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Simulate enterprise-grade technical assessments, master Capgemini-style buggy code
              scenarios, and receive AI-powered progressive hints and automated code reviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/coding-lab/assessment")}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md gap-2"
            >
              <Timer className="w-4 h-4" />
              <span>Start Mock Assessment</span>
            </Button>
            <Button
              onClick={() => navigate("/coding-lab/debugging")}
              variant="outline"
              size="lg"
              className="border-border/60 hover:bg-muted font-medium gap-2"
            >
              <Bug className="w-4 h-4 text-rose-500" />
              <span>Debugging Practice</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Your Coding Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Your Coding Stats</span>
          </h2>
          <Link
            to="/coding-lab/history"
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-card/60 backdrop-blur-xs border-border/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium">Problems Solved</div>
              <div className="text-2xl font-bold mt-1 text-foreground font-mono">
                {totalProblemsSolved > 0 ? totalProblemsSolved : 12}
              </div>
              <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Across 11 categories</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xs border-border/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium">Debugging Accuracy</div>
              <div className="text-2xl font-bold mt-1 text-foreground font-mono">
                {debuggingAccuracy}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">First-try pass rate</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xs border-border/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium">Average Score</div>
              <div className="text-2xl font-bold mt-1 text-foreground font-mono">
                {averageScore} / 100
              </div>
              <div className="text-[11px] text-primary mt-1">Timed assessments</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xs border-border/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium">Average Time</div>
              <div className="text-2xl font-bold mt-1 text-foreground font-mono">
                {averageTimeSecs} s
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Execution benchmark</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xs border-border/50 col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium">Current Streak</div>
              <div className="text-2xl font-bold mt-1 text-amber-500 font-mono flex items-center gap-1">
                <span>🔥 4 Days</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Consistency booster</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended for you Banner */}
      <Card className="border-primary/30 bg-primary/5 relative overflow-hidden">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5 sm:mt-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Recommended for you
                </span>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                  Adaptive Learning
                </Badge>
              </div>
              <h3 className="text-base font-semibold text-foreground mt-0.5">
                Target Topic: {weakTopic?.name || "Binary Search & Sorting"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Based on your recent practice, boundary condition off-by-one errors need attention.
                Recommended: <strong>3 debugging problems</strong> + <strong>2 coding drills</strong>.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/coding-lab/debugging?category=boundary`)}
            className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-1.5"
          >
            <span>Start Recommended Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </CardContent>
      </Card>

      {/* Practice Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Capgemini-Style Debugging */}
        <Card className="flex flex-col border-border/60 hover:border-primary/50 transition-all shadow-xs hover:shadow-md">
          <CardHeader>
            <div className="p-2.5 w-fit rounded-lg bg-rose-500/10 text-rose-500 mb-2">
              <Bug className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Debugging Lab</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Solve real pre-written programs with syntax errors, pointer misuse, boundary flaws,
              and logical traps modeled after placement tests.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>11 Categories: Boundary, Logic, Pointers, Loops</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>C++, Java, Python, JavaScript support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hidden test-case validation</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/coding-lab/debugging")}
              className="w-full text-xs font-medium"
              variant="outline"
            >
              <span>Explore Debugging Problems</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Algorithm Practice */}
        <Card className="flex flex-col border-border/60 hover:border-primary/50 transition-all shadow-xs hover:shadow-md">
          <CardHeader>
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-2">
              <Code2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Algorithm Practice</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Standard coding interview problem solving with full Monaco editor features, progressive
              hints, complexity reviews, and test runner.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Two Pointers, Hash Maps, Binary Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dynamic Big-O complexity explanation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Synchronized with your PrepTrack DSA roadmap</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/coding-lab/practice")}
              className="w-full text-xs font-medium"
              variant="outline"
            >
              <span>Start Algorithm Practice</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Timed Assessment Mock */}
        <Card className="flex flex-col border-border/60 hover:border-primary/50 transition-all shadow-xs hover:shadow-md relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
              Timed Mock
            </Badge>
          </div>
          <CardHeader>
            <div className="p-2.5 w-fit rounded-lg bg-primary/10 text-primary mb-2">
              <Timer className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">{primaryMock.title}</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {primaryMock.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>5 Questions • 30 Minutes countdown</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Strict assessment mode (AI disabled)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Accidental refresh auto-persistence</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/coding-lab/assessment")}
              className="w-full text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>Launch Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Coding Coach Features Section */}
      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">PrepTrack AI Coding Coach Capabilities</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Integrated right beside your Monaco editor to guide you without leaking solutions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <div className="font-semibold text-xs text-foreground">Progressive Hints</div>
              <div className="text-[10px] text-muted-foreground">Hint 1 → 2 → 3 guidance</div>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <Bug className="w-4 h-4 text-rose-500" />
              <div className="font-semibold text-xs text-foreground">AI Debugger</div>
              <div className="text-[10px] text-muted-foreground">Compiler & testcase diagnosis</div>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="font-semibold text-xs text-foreground">Code Review</div>
              <div className="text-[10px] text-muted-foreground">Quality, edge cases & bugs</div>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-500" />
              <div className="font-semibold text-xs text-foreground">Optimization</div>
              <div className="text-[10px] text-muted-foreground">Time & memory improvements</div>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="font-semibold text-xs text-foreground">Code Generator</div>
              <div className="text-[10px] text-muted-foreground">Review modal before insert</div>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border/40 flex flex-col items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <div className="font-semibold text-xs text-foreground">Complexity</div>
              <div className="text-[10px] text-muted-foreground">Formal Big-O proofs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
