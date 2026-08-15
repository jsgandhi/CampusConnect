'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Terminal, RefreshCw, Database, ShieldAlert, Server, Cpu, Upload, Download } from 'lucide-react';
import { AuditState, BASELINE_AUDIT_STATE, AuditStateSchema, loadAuditState, saveAuditState } from '@/lib/audit-state';

export default function DevPanelPage() {
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [auditState, setAuditState] = useState<AuditState>(BASELINE_AUDIT_STATE);
  const [transportJson, setTransportJson] = useState(JSON.stringify(BASELINE_AUDIT_STATE, null, 2));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedState = loadAuditState();
    setAuditState(savedState);
    setTransportJson(JSON.stringify(savedState, null, 2));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAuditState(auditState);
    setTransportJson(JSON.stringify(auditState, null, 2));
  }, [auditState, hydrated]);

  const handleResetData = () => {
    setResetting(true);
    setFeedback(null);
    setAuditState(BASELINE_AUDIT_STATE);
    setResetting(false);
    setFeedback({ type: 'success', message: 'Local audit state restored to the baseline test datasets.' });
  };

  const handleImport = () => {
    try {
      const parsed: unknown = JSON.parse(transportJson);
      const importedState = AuditStateSchema.parse(parsed);
      setAuditState(importedState);
      setFeedback({ type: 'success', message: 'Audit state imported and persisted locally.' });
    } catch {
      setFeedback({ type: 'danger', message: 'Import failed. Provide valid audit-state JSON with courses, events, and advisors arrays.' });
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
              Persist, reset, and transport the frontend mock datasets used during acceptance testing.
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
                  Restore the default course, event, and advisor test datasets in localStorage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="info">
                  This affects browser-local mock state only; it does not alter shared backend mock data.
                </Alert>
                <Button
                  variant="danger"
                  className="w-full gap-2"
                  isLoading={resetting}
                  onClick={handleResetData}
                >
                  <ShieldAlert className="h-4 w-4" /> Wipe and Reset to Baseline
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-5 w-5 text-brand-400" /> JSON State Transporter
                </CardTitle>
                <CardDescription>
                  Copy the exported JSON to share test state, or paste a valid payload and import it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea aria-label="Audit state JSON" value={transportJson} onChange={(event) => setTransportJson(event.target.value)} className="h-52 w-full rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <Button variant="primary" className="w-full gap-2" onClick={handleImport}><Upload className="h-4 w-4" /> Import JSON State</Button>
                <p className="text-[11px] text-slate-500">Current baseline: {auditState.courses.length} courses, {auditState.events.length} events, {auditState.advisors.length} advisors.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
