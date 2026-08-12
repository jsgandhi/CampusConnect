'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Bell, User as UserIcon, Code2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Campus<span className="text-brand-400">Connect</span>
            </span>
            <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              CSTU Student Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/ai-assistant">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-brand-500/40 text-brand-300 hover:bg-brand-500/10">
            <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
            AI Assistant
          </Button>
        </Link>

        <Link href="/dev-panel">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400">
            <Code2 className="h-4 w-4 text-amber-500" />
            <span className="hidden md:inline">Dev Panel</span>
          </Button>
        </Link>

        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-slate-950"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-white">Alex Rivera</p>
            <p className="text-[11px] text-slate-400 font-mono">STU-2026-8891</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-slate-700 p-0.5 shadow-md">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-slate-200 font-semibold text-xs">
              <UserIcon className="h-4 w-4 text-brand-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
