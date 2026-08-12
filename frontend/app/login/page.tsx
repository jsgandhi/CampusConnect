'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, KeyRound, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex.student@campusconnect.edu');
  const [password, setPassword] = useState('demo1234');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate auth network request
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const setDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-xl shadow-brand-900/40 mb-2">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Portal Sign In</h1>
          <p className="text-xs text-slate-400">CampusConnect Student Authentication Service</p>
        </div>

        <Card className="glass-panel border-slate-700/60 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Enter Credentials</CardTitle>
            <CardDescription>Enter student email and password to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Student Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campusconnect.edu"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider text-center">
                Quick Demo Presets
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setDemoUser('alex.student@campusconnect.edu')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 text-left transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-brand-400" />
                    <div>
                      <p className="font-semibold text-white">Alex Rivera</p>
                      <p className="text-[10px] text-slate-400">Computer Science Senior</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-brand-400 font-mono">Select</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
