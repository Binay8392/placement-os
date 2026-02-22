import { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatRobot } from '@/components/ChatRobot';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ChatMessage, streamChat } from '@/lib/chatService';
import { useNavigate } from 'react-router-dom';

export function FloatingChat() {
  const [open, setOpen] = useState(false);
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

  const send = async () => {
    if (!input.trim() || isLoading || !user) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
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
    <>
      {/* Floating robot button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-16 h-16 rounded-full bg-card border-2 border-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChatRobot size={44} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[340px] h-[480px] rounded-2xl border border-border bg-card shadow-lg flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatRobot size={28} />
              <span className="font-semibold text-primary-foreground text-sm">PrepTrack AI</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { navigate('/ai-chat'); setOpen(false); }} className="p-1 rounded hover:bg-primary-foreground/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-primary-foreground/20 transition-colors">
                <X className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-xs mt-4 space-y-2">
                <ChatRobot size={64} />
                <p>Ask me anything about DSA, interviews, coding, or placements!</p>
                <p className="text-[10px]">10 free messages/day</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn("max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed",
                  m.role === 'user' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-foreground')}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-muted px-3 py-2 rounded-xl text-xs text-muted-foreground animate-pulse">Thinking...</div>
              </div>
            )}
            {error && (
              <div className="text-center">
                <p className="text-xs text-destructive">{error}</p>
                {limitReached && (
                  <Button size="sm" variant="outline" className="mt-2 text-xs" onClick={() => { navigate('/support-us'); setOpen(false); }}>
                    ❤️ Support Us for Unlimited
                  </Button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 text-xs bg-muted rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-8 w-8 rounded-lg" disabled={isLoading || !input.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
