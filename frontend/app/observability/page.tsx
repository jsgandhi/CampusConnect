'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

type LogLevel = 'INFO' | 'WARN' | 'SECURITY';
type Log = { id: number; level: LogLevel; message: string; time: string };

const audits = [
  ['alex.rivera@cstu.edu', 'VIEW_SCHEDULE', '/courses/my-schedule', '192.168.1.104'],
  ['jordan.lee@cstu.edu', 'POST_EVENT', '/events/create', '192.168.1.112'],
  ['marcus.vance@cstu.edu', 'INSPECT_TELEMETRY', '/observability', '10.0.4.12'],
];

export default function ObservabilityPage() {
  const router = useRouter();
  const [cpu, setCpu] = useState(24.5);
  const [memory, setMemory] = useState(41.2);
  const [filter, setFilter] = useState<'ALL' | LogLevel>('ALL');
  const [logs, setLogs] = useState<Log[]>([{ id: 1, time: '17:42:01', level: 'INFO', message: 'HTTP GET /dashboard — 200 OK (18ms)' }, { id: 2, time: '17:42:10', level: 'SECURITY', message: 'FERPA audit entry recorded for telemetry access' }]);

  useEffect(() => {
    const stored = localStorage.getItem('campusconnect_user');
    if (!stored || JSON.parse(stored).role !== 'IT_DIRECTOR') { router.replace('/login'); return; }
    const interval = window.setInterval(() => {
      setCpu(Number((20 + Math.random() * 10).toFixed(1)));
      setMemory(Number((40 + Math.random() * 5).toFixed(1)));
      setLogs((current) => [...current.slice(-19), { id: Date.now(), time: new Date().toLocaleTimeString(), level: Math.random() > 0.75 ? 'WARN' : 'INFO', message: 'Service health sample received from CampusConnect API' }]);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [router]);

  const visibleLogs = filter === 'ALL' ? logs : logs.filter((log) => log.level === filter);
  return (
    <main className="min-h-screen bg-slate-950 p-6 font-mono text-slate-100 lg:p-10"><div className="mx-auto max-w-6xl space-y-7"><header><p className="text-xs uppercase tracking-widest text-cyan-400">System health & FERPA compliance hub</p><h1 className="mt-2 text-3xl font-bold">IT Observability</h1></header><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['CPU load', `${cpu}%`], ['Memory allocation', `${memory}%`], ['Active sessions', '1,420'], ['Throughput', '148 req/s']].map(([label, value]) => <Card key={label}><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-cyan-300">{value}</p></Card>)}</section><section className="grid gap-6 lg:grid-cols-2"><Card><h2 className="font-sans font-semibold">FERPA Access Audit Logs</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-slate-500"><tr><th>User</th><th>Action</th><th>Resource</th><th>IP</th></tr></thead><tbody>{audits.map((audit) => <tr key={audit[0]} className="border-t border-slate-800"><td className="py-3">{audit[0]}</td><td className="py-3 text-cyan-400">{audit[1]}</td><td className="py-3">{audit[2]}</td><td className="py-3">{audit[3]}</td></tr>)}</tbody></table></div></Card><Card><div className="flex items-center justify-between"><h2 className="font-sans font-semibold">Live service telemetry</h2><select aria-label="Filter log level" value={filter} onChange={(event) => setFilter(event.target.value as 'ALL' | LogLevel)} className="bg-slate-900 text-xs text-slate-300"><option>ALL</option><option>INFO</option><option>WARN</option><option>SECURITY</option></select></div><div className="mt-4 h-52 space-y-2 overflow-y-auto rounded-lg bg-slate-950 p-3 text-xs">{visibleLogs.map((log) => <p key={log.id}><span className="text-slate-500">[{log.time}]</span> <span className={log.level === 'WARN' ? 'text-amber-400' : log.level === 'SECURITY' ? 'text-emerald-400' : 'text-cyan-400'}>[{log.level}]</span> {log.message}</p>)}</div></Card></section></div></main>
  );
}
