import React, { useState } from "react";
import { DebuggingProblem, Language } from "../types";
import { aiCoachService } from "../services/aiCoachService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Copy, ArrowDownToLine, Check, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerateCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: DebuggingProblem;
  currentLanguage: Language;
  onInsertCode: (code: string) => void;
}

export const GenerateCodeModal: React.FC<GenerateCodeModalProps> = ({
  open,
  onOpenChange,
  problem,
  currentLanguage,
  onInsertCode,
}) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>(currentLanguage);
  const [instruction, setInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync language when opened
  React.useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage, open]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await aiCoachService.requestAdvice({
        action: "generate",
        problem,
        code: "",
        language,
        mode: "practice",
        userInstruction: instruction || "Provide the cleanest, most optimal solution.",
      });

      if (res.generatedCode) {
        setGeneratedCode(res.generatedCode.code);
        setExplanation(res.generatedCode.explanation);
      } else {
        setGeneratedCode(problem.solutionCode || problem.buggyCode);
        setExplanation("Standard reference implementation.");
      }
    } catch (err) {
      toast({
        title: "Generation failed",
        description: "Could not generate code at this time.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (!generatedCode) return;
    onInsertCode(generatedCode);
    toast({
      title: "Code Inserted",
      description: "Generated code has been placed into your editor.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border/60 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Generate Code with AI</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Generate and inspect an AI-crafted solution for <strong>{problem.title}</strong> before inserting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 flex-1 overflow-y-auto">
          {/* Controls: Language and Instruction */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Target Language
              </label>
              <Select
                value={language}
                onValueChange={(val) => setLanguage(val as Language)}
              >
                <SelectTrigger className="h-8 text-xs font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpp">C++ (GCC)</SelectItem>
                  <SelectItem value="java">Java (OpenJDK)</SelectItem>
                  <SelectItem value="python">Python 3</SelectItem>
                  <SelectItem value="javascript">JavaScript (ES6)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Prompt / Custom Instructions
              </label>
              <Textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Write using two pointers with O(1) space, handle empty input..."
                className="h-16 text-xs resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="sm"
              className="h-8 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Generate Code
                </>
              )}
            </Button>
          </div>

          {/* Generated Code Review Box */}
          {generatedCode && (
            <div className="space-y-2 border border-border/40 rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Review Generated Solution ({language})
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 px-2 text-xs"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-500 mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              <pre className="p-3 bg-[#1e1e1e] text-zinc-200 border border-[#333333] rounded text-xs font-mono max-h-56 overflow-y-auto whitespace-pre-wrap">
                {generatedCode}
              </pre>

              {explanation && (
                <div className="text-[11px] text-muted-foreground bg-background/50 p-2 rounded border border-border/30">
                  <div className="flex items-center gap-1 font-semibold text-foreground mb-0.5">
                    <BookOpen className="w-3 h-3 text-primary" />
                    <span>Approach Explanation</span>
                  </div>
                  {explanation}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/40 pt-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>

          {generatedCode && (
            <Button
              onClick={handleInsert}
              size="sm"
              className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 mr-1.5" />
              Insert into Editor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
