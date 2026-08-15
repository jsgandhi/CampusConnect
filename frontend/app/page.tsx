import React from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, Calendar, UserCheck, Bot, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-800/60 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">Campus<span className="text-brand-400">Connect</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" size="sm">Mock Student Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">Launch Portal</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 lg:px-12 py-16 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono">
            <SparklesIcon /> CSTU MB668 Project Management with AI — Team 3 MVP
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            One Unified Portal for Your Entire <span className="bg-gradient-to-r from-brand-400 via-accent-500 to-brand-300 bg-clip-text text-transparent">Campus Experience</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            CampusConnect consolidates course registration, campus events, academic advising, and AI assistance into a single modern dashboard.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Enter Student Portal <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dev-panel">
              <Button variant="secondary" size="lg">
                Developer Panel
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:-translate-y-1">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-brand-400 mb-2" />
              <CardTitle>Course Registration</CardTitle>
              <CardDescription>Browse course catalogs, prerequisites, real-time seat availability, and enroll effortlessly.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:-translate-y-1">
            <CardHeader>
              <Calendar className="h-8 w-8 text-accent-500 mb-2" />
              <CardTitle>Campus Events</CardTitle>
              <CardDescription>Discover tech career fairs, hackathons, and social events with instant RSVP confirmation.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:-translate-y-1">
            <CardHeader>
              <UserCheck className="h-8 w-8 text-emerald-400 mb-2" />
              <CardTitle>Advisor Scheduler</CardTitle>
              <CardDescription>Book 1-on-1 sessions with department advisors for degree audits and capstone guidance.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:-translate-y-1">
            <CardHeader>
              <Bot className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Interactive campus assistant powered by backend proxy integration to Gemini AI.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack Banner */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Enterprise Monorepo Architecture
          </div>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Built with <strong>Next.js 15 App Router</strong>, <strong>React 19</strong>, <strong>TypeScript</strong>, <strong>TailwindCSS</strong>, <strong>Express.js</strong>, and <strong>Prisma ORM</strong> with PostgreSQL.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 CampusConnect — CSTU Academic Project
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-brand-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2" />
    </svg>
  );
}
