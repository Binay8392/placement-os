import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Language } from "../types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Copy, Check, Play, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  onOpenAIGenerate?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  readOnly?: boolean;
  allowLanguageChange?: boolean;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  problemTitle?: string;
  statusBadge?: React.ReactNode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  onOpenAIGenerate,
  onReset,
  isRunning = false,
  isSubmitting = false,
  readOnly = false,
  allowLanguageChange = true,
  isFocusMode = false,
  onToggleFocusMode,
  problemTitle,
  statusBadge,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Map our internal language identifier to Monaco's syntax language
  const monacoLanguage = React.useMemo(() => {
    switch (language) {
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      case "python":
        return "python";
      case "javascript":
        return "javascript";
      default:
        return "plaintext";
    }
  }, [language]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Keyboard Shortcuts: Ctrl/Cmd + Enter -> Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun && !isRunning) {
        onRun();
      }
    });

    // Keyboard Shortcuts: Ctrl/Cmd + S -> Save draft notification
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      toast({
        title: "Draft Saved",
        description: "Your code changes have been auto-saved to local state.",
      });
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border border-border/40 rounded-lg overflow-hidden shadow-sm">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333333] select-none text-xs text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          {isFocusMode && problemTitle && (
            <div className="flex items-center gap-2 truncate mr-2">
              <span className="font-semibold text-foreground truncate max-w-[220px] sm:max-w-[340px]">
                {problemTitle}
              </span>
              {statusBadge}
            </div>
          )}

          {allowLanguageChange ? (
            <Select
              value={language}
              onValueChange={(val) => onLanguageChange?.(val as Language)}
            >
              <SelectTrigger className="h-7 w-28 sm:w-32 bg-[#1e1e1e] border-[#3e3e42] text-xs text-foreground font-mono">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-[#3e3e42] text-foreground">
                <SelectItem value="cpp">C++ (GCC)</SelectItem>
                <SelectItem value="java">Java (OpenJDK)</SelectItem>
                <SelectItem value="python">Python 3</SelectItem>
                <SelectItem value="javascript">JavaScript (Node)</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="font-mono uppercase font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              {language}
            </span>
          )}

          {!isFocusMode && (
            <span className="hidden sm:inline text-xs text-muted-foreground/60 border-l border-[#3e3e42] pl-2">
              Ctrl+Enter to Run
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenAIGenerate && !isFocusMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAIGenerate}
              className="h-7 px-2.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
              title="Generate code with AI assistance"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span className="hidden md:inline">Generate</span>
            </Button>
          )}

          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[#333333]"
              title="Reset code to default template"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden md:inline">Reset</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[#333333]"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>

          {onToggleFocusMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFocusMode}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[#333333]"
              title={isFocusMode ? "Exit Focus Mode" : "Maximize Editor (Focus Mode)"}
            >
              {isFocusMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 mr-1 text-primary" />
                  <span className="text-xs">Exit Focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden md:inline">Focus</span>
                </>
              )}
            </Button>
          )}

          {onRun && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRun}
              disabled={isRunning || isSubmitting}
              className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-medium"
            >
              <Play className="w-3.5 h-3.5 mr-1 fill-current" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          )}

          {onSubmit && (
            <Button
              variant="default"
              size="sm"
              onClick={onSubmit}
              disabled={isRunning || isSubmitting}
              className="h-7 px-3 text-xs font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 w-full min-h-[300px]">
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            renderLineHighlight: "all",
            overviewRulerBorder: false,
            folding: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-mono">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-[11px] font-mono select-none">
        <div className="flex items-center gap-3">
          <span>PrepTrack Coding Environment</span>
          <span className="opacity-80">UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Spaces: 4</span>
          <span className="uppercase">{language}</span>
        </div>
      </div>
    </div>
  );
};
