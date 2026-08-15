'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, Inbox, Upload, TrendingUp, Rocket, ClipboardList, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

interface Kpi {
  key: string;
  label: string;
  value: string;
  trend: string;
  target: string;
}

interface Sprint {
  label: string;
  points: string;
  percent: number;
  complete: boolean;
}

interface Milestone {
  version: string;
  date: string;
  description: string;
  status: 'done' | 'current';
}

interface BacklogItem {
  task: string;
  sprint: string;
  assignee: string;
  priority: 'HIGH' | 'MEDIUM';
  status: string;
}

const INITIAL_KPIS: Kpi[] = [
  { key: 'activeStudents', label: 'Active Students', value: '1,420', trend: '\u2191 +8.5%', target: 'Target: 1,500 enrolled' },
  { key: 'eventRate', label: 'Event Attendance Rate', value: '84.2%', trend: '\u2191 +5.2%', target: 'Target: 80.0% engagement' },
  { key: 'apptRate', label: 'Appointment Utilization', value: '91.8%', trend: '\u2191 +3.4%', target: 'Target: 85.0% capacity' },
  { key: 'uptime', label: 'System Availability', value: '99.94%', trend: '\u2191 +0.04%', target: 'SLA Standard: 99.90%' },
];

const SPRINTS: Sprint[] = [
  { label: 'Sprint 1: Foundation & Auth', points: '42 / 40 pts (100%)', percent: 100, complete: true },
  { label: 'Sprint 2: Core Workflows & Events', points: '38 / 40 pts (95%)', percent: 95, complete: true },
  { label: 'Sprint 3: AI Assistant & Grounding', points: '45 / 45 pts (100%)', percent: 100, complete: true },
  { label: 'Sprint 4: Observability & Final Demo', points: '12 / 12 pts Remaining', percent: 75, complete: false },
];

const MILESTONES: Milestone[] = [
  {
    version: 'Release v0.1 \u2014 Authentication & Architecture',
    date: 'Oct 10',
    description: 'Zero-dependency Node server, 4 persona login, and schema definitions.',
    status: 'done',
  },
  {
    version: 'Release v0.2 \u2014 Student Portal Workflows',
    date: 'Oct 18',
    description: 'Course registration, event filtering, club directory, and advising scheduler.',
    status: 'done',
  },
  {
    version: 'Release v1.0 \u2014 Grounded AI & Executive Dashboards',
    date: 'CURRENT RELEASE',
    description: 'Gemini AI policy assistant, IT Observability telemetry, and Steering Committee KPI view.',
    status: 'current',
  },
];

const BACKLOG: BacklogItem[] = [
  { task: 'Scaffold app_build folder & zero-dep server.js', sprint: 'Sprint 1', assignee: 'Hanqing Zhao (Dev)', priority: 'HIGH', status: 'COMPLETED' },
  { task: 'Implement in-memory login & 4 role personas', sprint: 'Sprint 1', assignee: 'Garick Chan (AI Lead)', priority: 'HIGH', status: 'COMPLETED' },
  { task: 'Student Portal: Courses, Events, Clubs, Advising', sprint: 'Sprint 2', assignee: 'Jeeta Gandhi (PM)', priority: 'MEDIUM', status: 'COMPLETED' },
  { task: 'Integrate Gemini API with CSTU policy grounding', sprint: 'Sprint 3', assignee: 'Himanshu Rajpal (Prod)', priority: 'HIGH', status: 'COMPLETED' },
  { task: 'Build IT Observability & Steering Dashboards', sprint: 'Sprint 4', assignee: 'Team 3 Nexus', priority: 'MEDIUM', status: 'COMPLETED' },
];

const CSV_TEMPLATE = `Metric,Value,Target,Unit,Trend
Active Students,1420,1500,count,\u2191 +8.5%
Event Attendance Rate,84.2,80.0,percent,\u2191 +5.2%
Appointment Utilization,91.8,85.0,percent,\u2191 +3.4%
System Uptime,99.94,99.90,percent,\u2191 +0.04%
`;

/**
 * Steering Committee executive dashboard — ADMIN only.
 *
 * Ported from the legacy static app_build/frontend/steering_committee_dashboard.html
 * page into the real Next.js app. The KPI values below are course-project demo
 * data (same numbers as the original static page) — the CSV upload lets you
 * override them live for a demo, same as the original.
 */
export default function ExecutiveDashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kpis, setKpis] = useState<Kpi[]>(INITIAL_KPIS);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // RBAC guard: only ADMIN may view this page.
  React.useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
    } else if (user.role !== 'ADMIN') {
      router.replace('/dashboard?unauthorized=true');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-sm">
        Checking access\u2026
      </div>
    );
  }

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = String(evt.target?.result || '');
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const updated = [...kpis];
      lines.slice(1).forEach((line) => {
        const parts = line.split(',');
        if (parts.length < 5) return;
        const metric = parts[0].trim();
        const val = parts[1].trim();
        const trend = parts[4].trim();

        const applyTo = (key: string, format: (v: string) => string) => {
          const idx = updated.findIndex((k) => k.key === key);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], value: format(val), trend };
          }
        };

        if (metric.includes('Active Students')) {
          applyTo('activeStudents', (v) => Number(v).toLocaleString());
        } else if (metric.includes('Attendance Rate')) {
          applyTo('eventRate', (v) => `${v}%`);
        } else if (metric.includes('Appointment Utilization')) {
          applyTo('apptRate', (v) => `${v}%`);
        } else if (metric.includes('System Uptime')) {
          applyTo('uptime', (v) => `${v}%`);
        }
      });

      setKpis(updated);
      setUploadMessage('Executive metrics successfully updated from CSV file.');
      setTimeout(() => setUploadMessage(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_metrics_template.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Executive Header */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight">CampusConnect Steering Committee</div>
              <div className="text-[10px] text-amber-400 font-semibold uppercase">Executive KPI & Release Governance</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs">
              <span className="text-slate-300 font-bold">{user.name}</span>
              <Badge variant="warning" className="text-[10px]">STEERING ADMIN</Badge>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* CSV Controls */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Inbox className="h-4 w-4" /> Executive Data Source Controls
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload dashboard metrics CSV file (<code className="text-brand-400">dashboard_metrics_template.csv</code>) to dynamically refresh charts.
            </p>
            {uploadMessage && <p className="text-xs text-emerald-400 mt-1.5">{uploadMessage}</p>}
          </div>

          <div className="flex items-center gap-3">
            <label className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow transition flex items-center gap-2">
              <Upload className="h-3.5 w-3.5" /> Upload CSV Metrics
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            </label>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              Download Template
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.key} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">{kpi.value}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{kpi.trend}</span>
              </div>
              <div className="text-[10px] text-slate-500">{kpi.target}</div>
            </div>
          ))}
        </div>

        {/* Sprint Burndown & Roadmap */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Agile Sprint Burndown (Story Points)
              </h2>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded font-bold">125 / 137 PTS</span>
            </div>

            <div className="space-y-4 pt-2">
              {SPRINTS.map((sprint) => (
                <div key={sprint.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{sprint.label}</span>
                    <span className={sprint.complete ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{sprint.points}</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={sprint.complete ? 'h-full bg-emerald-500' : 'h-full bg-amber-500'}
                      style={{ width: `${sprint.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <Rocket className="h-4 w-4" /> Release Roadmap & Milestones
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">RELEASE v1.0 MVP</span>
            </div>

            <div className="space-y-4">
              {MILESTONES.map((m) => (
                <div key={m.version} className="flex items-start gap-4">
                  <div
                    className={
                      m.status === 'done'
                        ? 'w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shrink-0'
                        : 'w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs border border-brand-500/30 shrink-0 animate-pulse'
                    }
                  >
                    {m.status === 'done' ? '\u2713' : '\u2605'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                      {m.version}
                      <span
                        className={
                          m.status === 'current'
                            ? 'text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded font-bold'
                            : 'text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded'
                        }
                      >
                        {m.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{m.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backlog Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Strategic Backlog & Deliverables Summary
            </h2>
            <span className="text-xs text-slate-400 font-semibold">CSTU MB668 Course Project \u2014 Team 3</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-semibold">Story / Task</th>
                  <th className="pb-3 font-semibold">Sprint</th>
                  <th className="pb-3 font-semibold">Assignee</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {BACKLOG.map((item) => (
                  <tr key={item.task}>
                    <td className="py-3 font-medium text-white">{item.task}</td>
                    <td className="py-3 text-slate-400">{item.sprint}</td>
                    <td className="py-3">{item.assignee}</td>
                    <td className="py-3">
                      <span
                        className={
                          item.priority === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold'
                            : 'bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-bold'
                        }
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
