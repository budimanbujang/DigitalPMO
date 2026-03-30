'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: 'Portfolio Status', prompt: 'Give me a portfolio status summary' },
  { label: 'At-Risk Projects', prompt: 'Which projects are currently at risk?' },
  { label: 'My Priorities Today', prompt: 'What should I focus on today?' },
];

const MOCK_RESPONSES: Record<string, string> = {
  'Give me a portfolio status summary': `Here is your portfolio summary as of 30 Mar 2026:

- **Overall Health Score**: 72/100
- **Active Projects**: 6
- **On Track**: 3 (MyGov Portal, ePenyata Gaji, SSPA Upgrade)
- **At Risk**: 2 (MYDA Phase 2, E-Perolehan Revamp)
- **Delayed**: 1 (HRMIS Upgrade)

**Budget**: MYR 12.4M spent of MYR 18.6M allocated (67% utilised)

Key concerns:
- E-Perolehan Revamp has 78% budget utilised with only 55% completion
- HRMIS Upgrade UAT milestone due in 5 days with 3 blocking tasks
- 7 tasks are overdue across the portfolio`,

  'Which projects are currently at risk?': `Two projects are flagged **At Risk**:

1. **MYDA Phase 2** (RAG: Amber)
   - 3 overdue tasks including Security Audit (5 days overdue)
   - Resource conflict: Ahmad Razif double-booked with MyGov Portal
   - Chase response rate: 60%

2. **E-Perolehan Revamp** (RAG: Red)
   - Budget drift: MYR 320K forecasted overrun
   - 3 CRITICAL risks open (vendor dependency, data migration, scope creep)
   - PM escalation recommended

**Recommended actions**:
- Review E-Perolehan scope with steering committee this week
- Reassign Ahmad Razif's MyGov tasks to reduce conflict
- Schedule risk review for both projects`,

  'What should I focus on today?': `Based on current portfolio data, here are your top priorities for today:

1. **Respond to chase**: Security Audit task (MYDA Phase 2) - Level 2 escalation pending
2. **Review milestone**: HRMIS Upgrade UAT due 04 Apr - 3 blockers need resolution
3. **Budget review**: E-Perolehan Revamp showing significant drift - prepare brief for steering committee
4. **Status updates**: ePenyata Gaji has no update for 5 days - follow up with PM Hafiz Rahman
5. **Resource conflict**: Resolve Ahmad Razif's overlapping assignments before end of week

Would you like me to generate a detailed action plan for any of these?`,
};

function getDefaultResponse(): string {
  return `I have analyzed the current portfolio data. Here are some observations:

- The portfolio health score is trending at 72/100, a slight improvement from last week
- There are 7 overdue tasks across 3 projects that need attention
- Chase response rate this week is 67%, which is below the 80% target

Would you like me to dive deeper into any specific project or metric? You can also ask about:
- Budget forecasts and variance analysis
- Resource workload and capacity
- Upcoming milestones and risk assessments`;
}

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your PMO AI Assistant. I can help you with portfolio insights, project health checks, and task prioritisation. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseContent = MOCK_RESPONSES[text.trim()] ?? getDefaultResponse();

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--ai-accent)] to-indigo-500 px-4 py-3 text-white transition-all hover:opacity-90 hover:scale-105"
          style={{ boxShadow: '0 12px 40px rgba(124,58,237,0.25)' }}
          title="AI Assistant"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-[400px] transform bg-[var(--surface-container-lowest)]/95 backdrop-blur-lg transition-transform duration-300 ease-in-out flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ boxShadow: '-12px 0 40px rgba(26,28,30,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--surface-container-high)' }}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ai-accent)]/10">
              <Bot className="h-5 w-5 text-[var(--ai-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--on-surface)]">PMO AI Assistant</h3>
              <p className="text-xs text-[var(--outline)]">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-[var(--outline)] transition-colors hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] text-white rounded-br-sm'
                    : 'bg-[var(--surface-container-low)] text-[var(--on-surface)] border-l-2 border-[var(--ai-accent)] rounded-bl-sm'
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={cn(
                    'mt-1 text-[10px]',
                    msg.role === 'user' ? 'text-white/60' : 'text-[var(--outline)]'
                  )}
                >
                  {msg.timestamp.toLocaleTimeString('en-MY', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-[var(--surface-container-low)] border-l-2 border-[var(--ai-accent)] px-4 py-3 rounded-bl-sm">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--ai-accent)] animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--ai-accent)] animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--ai-accent)] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--surface-container-high)' }}>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Sparkles className="h-3.5 w-3.5 text-[var(--ai-accent)] shrink-0" />
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                disabled={isTyping}
                className="shrink-0 rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-xs text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--ai-accent)]/10 hover:text-[var(--ai-accent)] disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--surface-container-high)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your portfolio..."
              disabled={isTyping}
              className="flex-1 rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--ai-accent)] to-indigo-500 text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
