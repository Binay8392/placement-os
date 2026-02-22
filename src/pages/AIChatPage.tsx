import { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatRobot } from '@/components/ChatRobot';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ChatMessage, streamChat } from '@/lib/chatService';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  "Explain binary search with an example",
  "How to prepare for TCS NQT?",
  "Give me a DSA study plan for 30 days",
  "Tips for HR interview rounds",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isLoading || !user) return;
    const userMsg: ChatMessage = { role: 'user', content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    let assistantSoFar = '';
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        firebaseUid: user.uid,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err, limit) => {
          setError(err);
          if (limit) setLimitReached(true);
          setIsLoading(false);
        },
      });
    } catch {
      setError('Failed to connect');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChatRobot size={48} />
          <div>
            <h1 className="text-lg font-bold text-foreground">PrepTrack AI</h1>
            <p className="text-xs text-muted-foreground">Your placement prep assistant • 10 free messages/day</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMessages([])} title="Clear chat">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <ChatRobot size={100} />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-foreground">Hi! I'm PrepTrack AI 👋</h2>
              <p className="text-sm text-muted-foreground max-w-md">I can help with DSA, coding interviews, aptitude, resume tips, and everything placement-related.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-xs p-3 rounded-xl border border-border bg-card hover:bg-accent/10 hover:border-primary/30 transition-all text-muted-foreground">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn("max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
              m.role === 'user' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground')}>
              {m.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>pre]:my-2">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-2xl text-sm text-muted-foreground animate-pulse">Thinking...</div>
          </div>
        )}

        {error && (
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            {limitReached && (
              <Button variant="outline" onClick={() => navigate('/support-us')}>
                ❤️ Support Us for Unlimited Access
              </Button>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about DSA, interviews, coding..."
            className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button type="submit" size="lg" className="rounded-xl px-6" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
