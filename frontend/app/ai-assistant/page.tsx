'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User as UserIcon, Sparkles, BookOpen, Calendar, UserCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ChatMessage } from '@campusconnect/shared';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: 'Hello Alex! I am your CampusConnect AI Assistant. How can I help you today with courses, academic advising, or campus events?',
      timestamp: new Date().toISOString(),
      category: 'general',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [contextCategory, setContextCategory] = useState<'advising' | 'courses' | 'events' | 'general'>('general');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    const response = await apiClient.askAi({
      prompt: promptToSend,
      context: contextCategory,
    });

    setLoading(false);

    if (response.success && response.data) {
      setMessages((prev) => [...prev, response.data!]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'I experienced a network delay. Please try again or check back shortly.',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const suggestions = [
    { label: 'What are the prerequisites for CS-401?', category: 'courses' as const },
    { label: 'When is the Spring 2026 Tech & AI Career Fair?', category: 'events' as const },
    { label: 'How do I book a graduation audit session with an advisor?', category: 'advising' as const },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex flex-col space-y-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Bot className="h-7 w-7 text-brand-400" /> AI Campus Assistant
              </h1>
              <p className="text-sm text-slate-400">Powered by Gemini AI via Backend Proxy</p>
            </div>

            {/* Context Selector */}
            <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
              {(['general', 'courses', 'events', 'advising'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setContextCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                    contextCategory === cat
                      ? 'bg-brand-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chat Container */}
          <Card className="flex-1 flex flex-col min-h-[500px] border-slate-800 bg-slate-950/60 p-0 overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[550px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none shadow-lg shadow-brand-900/30'
                        : 'glass-panel text-slate-100 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="block text-[10px] opacity-60 text-right mt-1 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 shrink-0 border border-slate-700">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-xl bg-brand-600/50 flex items-center justify-center text-white animate-pulse">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl glass-panel text-xs text-slate-400 flex items-center gap-2">
                    <span className="animate-pulse">Gemini AI is processing your response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-6 py-2 border-t border-slate-800/80 bg-slate-900/40 flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setContextCategory(s.category);
                    handleSend(s.label);
                  }}
                  className="px-3 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-brand-400" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={`Ask AI about ${contextCategory}...`}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button type="submit" variant="primary" isLoading={loading} className="gap-2">
                  <Send className="h-4 w-4" /> Send
                </Button>
              </form>
            </div>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}
