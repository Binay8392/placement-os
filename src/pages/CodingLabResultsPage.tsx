import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "@/lib/store";
import { AssessmentAttempt } from "@/features/coding-lab/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
  Brain,
  Sparkles,
  Clock,
  RotateCcw,
  Target,
  BarChart2,
} from "lucide-react";

export default function CodingLabResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { codingAttempts } = useStore();

  // Find attempt in store or use recent fallback
  const attempt: AssessmentAttempt | undefined =
    codingAttempts?.find((a) => a.id === attemptId) || codingAttempts?.[0];

  // Fallback demo data if user accessed directly
  const score = attempt?.score ?? 80;
  const total = attempt?.totalProblems ?? 5;
  const passed = attempt?.passedProblems ?? 4;
  const accuracy = attempt?.accuracy ?? 80;
  const avgTime = attempt?.durationSeconds ? (attempt.durationSeconds / total).toFixed(1) : "1.8";

  const aiFeedback = attempt?.aiFeedback || {
    strongestArea: "Array Manipulation & Hash Maps",
    mainWeakness: "Binary-search boundary conditions & loop termination",
    nextRecommendation: "2 binary-search debugging problems + 1 medium binary-search problem",
    debuggingSkill: 80,
    algorithmSkill: 65,
    edgeCaseSkill: 55,
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      {/* Top Banner: ASSESSMENT COMPLETE */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Evaluation Finalized</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          ASSESSMENT COMPLETE
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {attempt?.assessmentTitle || "PrepTrack Technical Debugging Mock"}
        </p>
      </div>

      {/* Primary Scorecard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/70 border-border/50 text-center p-4">
          <div className="text-xs text-muted-foreground font-medium">Final Score</div>
          <div className="text-3xl font-bold mt-1 text-foreground font-mono">
            {score} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
          </div>
          <Badge
            className={`mt-2 text-[10px] ${
              score >= 70
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-500 border-amber-500/30"
            }`}
          >
            {score >= 70 ? "PASSED BENCHMARK" : "PRACTICE REQUIRED"}
          </Badge>
        </Card>

        <Card className="bg-card/70 border-border/50 text-center p-4">
          <div className="text-xs text-muted-foreground font-medium">Problems Passed</div>
          <div className="text-3xl font-bold mt-1 text-emerald-500 font-mono">
            {passed} <span className="text-sm font-normal text-muted-foreground">/ {total}</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">All test suites validated</div>
        </Card>

        <Card className="bg-card/70 border-border/50 text-center p-4">
          <div className="text-xs text-muted-foreground font-medium">Accuracy</div>
          <div className="text-3xl font-bold mt-1 text-foreground font-mono">
            {accuracy}%
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">Public & hidden tests</div>
        </Card>

        <Card className="bg-card/70 border-border/50 text-center p-4">
          <div className="text-xs text-muted-foreground font-medium">Average Time</div>
          <div className="text-3xl font-bold mt-1 text-primary font-mono flex items-center justify-center gap-1">
            <Clock className="w-5 h-5" />
            <span>{avgTime} s</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">Per test suite</div>
        </Card>
      </div>

      {/* 2-Column: Skill Analysis & AI Performance Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Analysis Progress Bars */}
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Skill Analysis</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Automated behavioral breakdown based on compilation diagnostics and boundary checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Debugging Skill */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Debugging & Diagnostics</span>
                <span className="font-mono">{aiFeedback.debuggingSkill}%</span>
              </div>
              <div className="w-full bg-muted/70 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${aiFeedback.debuggingSkill}%` }}
                />
              </div>
            </div>

            {/* Algorithms Skill */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Algorithmic Optimization</span>
                <span className="font-mono">{aiFeedback.algorithmSkill}%</span>
              </div>
              <div className="w-full bg-muted/70 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${aiFeedback.algorithmSkill}%` }}
                />
              </div>
            </div>

            {/* Edge Cases Skill */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Edge Cases & Boundaries</span>
                <span className="font-mono">{aiFeedback.edgeCaseSkill}%</span>
              </div>
              <div className="w-full bg-muted/70 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${aiFeedback.edgeCaseSkill}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Performance Feedback */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Brain className="w-4 h-4" />
              <CardTitle className="text-base">AI Performance Feedback</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Generated by PrepTrack AI Coach to align with company hiring criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="p-3 bg-background/60 rounded-lg border border-border/40">
              <div className="font-semibold text-emerald-500 text-[11px] uppercase tracking-wider mb-0.5">
                Your Strongest Area
              </div>
              <div className="text-foreground font-medium">
                {aiFeedback.strongestArea}
              </div>
            </div>

            <div className="p-3 bg-background/60 rounded-lg border border-border/40">
              <div className="font-semibold text-rose-500 text-[11px] uppercase tracking-wider mb-0.5">
                Main Weakness Identified
              </div>
              <div className="text-foreground font-medium">
                {aiFeedback.mainWeakness}
              </div>
            </div>

            <div className="p-3 bg-background/60 rounded-lg border border-border/40">
              <div className="font-semibold text-primary text-[11px] uppercase tracking-wider mb-0.5">
                Next Recommendation
              </div>
              <div className="text-foreground font-medium">
                {aiFeedback.nextRecommendation}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem by Problem Detailed Breakdown */}
      {attempt?.problemAttempts && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Assessment Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Status and execution time recorded for each scenario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/40">
              {Object.entries(attempt.problemAttempts).map(([pid, p], idx) => (
                <div key={pid} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {p.status === "ACCEPTED" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-foreground">
                        Question {idx + 1}: {pid}
                      </div>
                      <div className="text-[11px] text-muted-foreground uppercase font-mono">
                        Language: {p.language} • {p.passedTests}/{p.totalTests} tests
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">{p.executionTimeMs} ms</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        p.status === "ACCEPTED"
                          ? "text-emerald-500 border-emerald-500/30"
                          : "text-rose-500 border-rose-500/30"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button
          onClick={() => navigate("/coding-lab/debugging?category=boundary")}
          size="lg"
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-md"
        >
          <Target className="w-4 h-4" />
          <span>Start Recommended Practice</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => navigate("/coding-lab/history")}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto text-xs"
        >
          <Trophy className="w-4 h-4 mr-2 text-primary" />
          <span>View All Past Attempts</span>
        </Button>

        <Button
          onClick={() => navigate("/coding-lab")}
          variant="ghost"
          size="lg"
          className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
        >
          <span>Return to Dashboard</span>
        </Button>
      </div>
    </div>
  );
}
