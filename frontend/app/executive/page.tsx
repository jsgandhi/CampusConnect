'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type MetricKey = 'activeStudents' | 'attendance' | 'appointments' | 'uptime';
type Metric = { label: string; value: string; trend: string; suffix?: string };

const initialMetrics: Record<MetricKey, Metric> = {
  activeStudents: { label: 'Active Students', value: '1,420', trend: '+8.5%' },
  attendance: { label: 'Event Attendance Rate', value: '84.2', trend: '+5.2%', suffix: '%' },
  appointments: { label: 'Appointment Utilization', value: '91.8', trend: '+3.4%', suffix: '%' },
  uptime: { label: 'System Uptime', value: '99.94', trend: '+0.04%', suffix: '%' },
};

const metricKeys: Record<string, MetricKey> = {
  'Active Students': 'activeStudents',
  'Event Attendance Rate': 'attendance',
  'Appointment Utilization': 'appointments',
  'System Uptime': 'uptime',
};

export default function ExecutivePage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('campusconnect_user');
    if (!stored || JSON.parse(stored).role !== 'ADMIN') router.replace('/login');
  }, [router]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result).split(/\r?\n/).slice(1);
      const next = { ...initialMetrics };
      rows.forEach((row) => {
        const [label, value, , , trend] = row.split(',').map((item) => item.trim());
        const key = metricKeys[label];
        if (!key || !value || !trend) return;
        next[key] = {
          ...next[key],
          value: key === 'activeStudents' ? Number(value).toLocaleString() : value,
          trend,
        };
      });
      setMetrics(next);
      setMessage('Executive metrics updated from the CSV file.');
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-mono uppercase tracking-widest text-amber-400">CSTU steering committee</p><h1 className="mt-2 text-3xl font-bold">Executive Metrics</h1><p className="mt-2 text-sm text-slate-400">Portfolio reporting dashboard for institutional health and delivery progress.</p></div>
          <div className="flex gap-2"><a href="/dashboard_metrics_template.csv" download><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Template</Button></a><label><input className="sr-only" type="file" accept=".csv,text/csv" onChange={handleUpload} /><span className="inline-flex cursor-pointer items-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium hover:bg-brand-500"><Upload className="mr-2 h-4 w-4" />Upload CSV</span></label></div>
        </header>
        {message && <Alert variant="success" title="Metrics updated">{message}</Alert>}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.values(metrics)).map((metric) => <Card key={metric.label}><p className="text-xs text-slate-400">{metric.label}</p><p className="mt-2 text-3xl font-bold">{metric.value}{metric.suffix}</p><p className="mt-2 text-xs font-medium text-emerald-400">↑ {metric.trend}</p></Card>)}
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <Card><h2 className="font-semibold">Delivery Roadmap</h2><div className="mt-5 space-y-4 text-sm">{['Student portal workflows', 'AI assistant proxy and FERPA safeguards', 'Production authentication and RBAC'].map((item, index) => <div key={item} className="flex items-center justify-between border-b border-slate-800 pb-3"><span>{item}</span><span className="text-xs text-emerald-400">{index < 2 ? 'Complete' : 'In progress'}</span></div>)}</div></Card>
          <Card><h2 className="font-semibold">CSV Import</h2><p className="mt-3 text-sm leading-6 text-slate-400">Upload the supplied CSV template to refresh the four KPI cards. Only recognized metrics are applied, so supplemental reporting rows are safely ignored.</p></Card>
        </section>
      </div>
    </main>
  );
}
