'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Subject } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface AskAIProps {
  subject?: Subject | null;
  level?: number;
}

const SUGGESTED_QUESTIONS = [
  'What is a CSS selector?',
  'How do I center a div?',
  'What is the difference between let and var?',
  'How does the HTML DOM work?',
];

const AskAIComponent: React.FC<AskAIProps> = ({ subject, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: `👋 Hi! I'm your AI tutor. Ask me anything about ${subject ?? 'web development'}!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleAsk = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject: subject ?? undefined, level: level ?? 1 }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: data.answer ?? 'Sorry, I could not answer that right now.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: 'Something went wrong. Please try again!' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] hover:scale-110 transition-all flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Open AI tutor chat"
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
          role="dialog"
          aria-label="Ask AI tutor"
          style={{ maxHeight: '70vh' }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border-b border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="text-sm font-bold text-white">AI Tutor</div>
              <div className="text-[10px] text-violet-400">Ask me anything about {subject ?? 'coding'}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ minHeight: 200, maxHeight: 300 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl rounded-bl-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 2).map(q => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="text-[10px] px-2 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-violet-300 hover:border-violet-500 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-700 flex gap-2 bg-slate-900">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAsk(input); }}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
              aria-label="Ask AI a question"
            />
            <button
              onClick={() => handleAsk(input)}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Send question"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const AskAI = React.memo(AskAIComponent);
