import React, { useState } from "react";
import { ExecutionResult, TestCaseResult } from "../types";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Cpu,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TestResultsPanelProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  result,
  isRunning = false,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [activeView, setActiveView] = useState<"tests" | "console">("tests");

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono">Running test cases through execution sandbox...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground/60 text-center gap-2">
        <Terminal className="w-8 h-8 opacity-40" />
        <p className="text-xs font-medium">Run code to see test case outputs and execution details.</p>
        <span className="text-[11px] text-muted-foreground/50">
          Shortcut: Press <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Ctrl+Enter</kbd> to run
        </span>
      </div>
    );
  }

  const publicResults = result.testResults.filter((t) => !t.isHidden);
  const hiddenResults = result.testResults.filter((t) => t.isHidden);
  const hiddenPassed = hiddenResults.filter((t) => t.passed).length;
  const currentTestCase: TestCaseResult | undefined = publicResults[selectedTab] || publicResults[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono">ACCEPTED</Badge>;
      case "PARTIAL":
        return <Badge className="bg-amber-600 hover:bg-amber-600 text-white font-mono">PARTIAL PASS</Badge>;
      case "WRONG_ANSWER":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">WRONG ANSWER</Badge>;
      case "COMPILE_ERROR":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">COMPILE ERROR</Badge>;
      case "RUNTIME_ERROR":
        return <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-mono">RUNTIME ERROR</Badge>;
      case "TIMEOUT":
        return <Badge className="bg-amber-600 hover:bg-amber-600 text-white font-mono">TIME LIMIT EXCEEDED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#18181b] border-t border-border/50 text-foreground overflow-hidden">
      {/* Panel Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202023] border-b border-[#2e2e32] select-none text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("tests")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeView === "tests"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Test Cases ({result.passedTests}/{result.totalTests})
          </button>
          <button
            onClick={() => setActiveView("console")}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              activeView === "console"
                ? "bg-[#2d2d31] text-foreground border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="w-3 h-3 text-muted-foreground/70" />
            <span>{result.executionTimeMs} ms</span>
          </div>
          {result.memoryKb && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
              <Cpu className="w-3 h-3 text-muted-foreground/70" />
              <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
            </div>
          )}
          {getStatusBadge(result.status)}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {activeView === "console" ? (
          <div className="space-y-3 font-mono">
            {result.compileOutput && (
              <div>
                <div className="text-muted-foreground text-[11px] mb-1">Compiler Output:</div>
                <pre className="p-2.5 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-emerald-400 whitespace-pre-wrap">
                  {result.compileOutput}
                </pre>
              </div>
            )}
            {result.stdout && (
              <div>
                <div className="text-muted-foreground text-[11px] mb-1">Standard Output (stdout):</div>
                <pre className="p-2.5 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-zinc-300 whitespace-pre-wrap">
                  {result.stdout}
                </pre>
              </div>
            )}
            {result.stderr && (
              <div>
                <div className="text-rose-400 text-[11px] mb-1">Error Output (stderr):</div>
                <pre className="p-2.5 bg-rose-950/20 border border-rose-800/40 rounded text-[11px] text-rose-300 whitespace-pre-wrap">
                  {result.stderr}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Public Test Case Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2d2d31]">
              {publicResults.map((tc, idx) => (
                <button
                  key={tc.testCaseId}
                  onClick={() => setSelectedTab(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all font-mono ${
                    selectedTab === idx
                      ? "bg-[#2d2d31] text-foreground font-semibold border border-border/40"
                      : "bg-[#18181b] text-muted-foreground hover:bg-[#232327]"
                  }`}
                >
                  {tc.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span>Case {idx + 1}</span>
                </button>
              ))}

              {/* Hidden Test Case Indicator (Strict Security Protection) */}
              {hiddenResults.length > 0 && (
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {hiddenPassed}/{hiddenResults.length} Hidden Tests Passed
                  </span>
                </div>
              )}
            </div>

            {/* Active Test Case Details */}
            {currentTestCase ? (
              <div className="space-y-2.5 font-mono">
                <div>
                  <div className="text-muted-foreground text-[11px] mb-1 font-sans">Input:</div>
                  <div className="p-2 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-zinc-300">
                    {currentTestCase.input}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-muted-foreground text-[11px] mb-1 font-sans">Expected Output:</div>
                    <div className="p-2 bg-[#121214] border border-[#2d2d31] rounded text-[11px] text-emerald-400">
                      {currentTestCase.expectedOutput}
                    </div>
                  </div>

                  <div>
                    <div className="text-muted-foreground text-[11px] mb-1 font-sans">Actual Output:</div>
                    <div
                      className={`p-2 bg-[#121214] border rounded text-[11px] ${
                        currentTestCase.passed
                          ? "border-[#2d2d31] text-emerald-400"
                          : "border-rose-800/40 text-rose-400"
                      }`}
                    >
                      {currentTestCase.actualOutput || "(none)"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Execution: {currentTestCase.executionTimeMs} ms</span>
                  <span className={currentTestCase.passed ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                    {currentTestCase.passed ? "Passed" : "Wrong Answer"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No test cases executed.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
