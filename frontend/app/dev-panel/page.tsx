'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Terminal, RefreshCw, Database, ShieldAlert, CheckCircle2, Server, Cpu } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function DevPanelPage() {
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleResetData = async () => {
    setResetting(true);
    setFeedback(null);
    const res = await apiClient.resetDemoData();
    setResetting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Successfully reset transactional demo data. Database ready for testing.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Reset failed' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="warning">Developer Tools</Badge>
              <span className="text-xs text-slate-400 font-mono">Sprint 4 Demo Panel</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5 mt-1">
              <Terminal className="h-7 w-7 text-amber-400" /> Developer Testing & State Controller
            </h1>
            <p className="text-sm text-slate-400">
              Tooling to inspect backend state, trigger database re-seeding, and test mock student authentication.
            </p>
          </div>

          {feedback && (
            <Alert variant={feedback.type} title={feedback.type === 'success' ? 'Action Executed' : 'Execution Error'}>
              {feedback.message}
            </Alert>
          )}

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Express Backend</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Healthy (Port 5000)
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">PostgreSQL Database</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-brand-400"></span> Prisma ORM Connected
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">AI Proxy Gateway</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-purple-400"></span> Gemini 2.5 Flash
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions & Controllers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-amber-400" /> Reset Demo State
                </CardTitle>
                <CardDescription>
                  Purge user-created course enrollments, event RSVPs, and appointment bookings back to clean state.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="info">
                  This action clears test activity while retaining seeded courses and advisor profiles.
                </Alert>
                <Button
                  variant="danger"
                  className="w-full gap-2"
                  isLoading={resetting}
                  onClick={handleResetData}
                >
                  <ShieldAlert className="h-4 w-4" /> Reset User Activity & Mock Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-400" /> Database Seeding Info
                </CardTitle>
                <CardDescription>
                  Run seed script directly via terminal CLI to rebuild full dataset.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300">To re-seed the PostgreSQL database from command line:</p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-brand-300">
                  npm run db:seed
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
                  docker-compose up -d
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
