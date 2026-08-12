'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { BookOpen, Calendar, UserCheck, Bot, GraduationCap, ArrowUpRight, Sparkles, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { User, Course, CampusEvent, Appointment } from '@campusconnect/shared';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, coursesRes, eventsRes, appointmentsRes] = await Promise.all([
          apiClient.getProfile(),
          apiClient.getCourses(),
          apiClient.getEvents(),
          apiClient.getAppointments(),
        ]);

        if (profileRes.data) setUser(profileRes.data);
        if (coursesRes.data) setCourses(coursesRes.data.slice(0, 2));
        if (eventsRes.data) setEvents(eventsRes.data.slice(0, 2));
        if (appointmentsRes.data) setAppointments(appointmentsRes.data);
      } catch (err: unknown) {
        setError('Failed to connect to backend server. Using local cache state.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-600/10 blur-2xl rounded-full pointer-events-none"></div>
            
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">Spring 2026</Badge>
                    <span className="text-xs text-slate-400 font-mono">GPA: {user?.gpa || '3.84'}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    Welcome back, {user?.name || 'Alex Rivera'} 👋
                  </h1>
                  <p className="text-sm text-slate-400">
                    {user?.major || 'Computer Science & Software Engineering'} • Student ID: <span className="font-mono text-brand-400">{user?.studentId || 'STU-2026-8891'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/ai-assistant">
                    <Button variant="primary" size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4" /> Ask AI Assistant
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="warning" title="Backend Status Note">
              {error}
            </Alert>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : courses.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Upcoming Events</p>
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : events.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-500/10 text-accent-500">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Advising Sessions</p>
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : appointments.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Academic Status</p>
                  <p className="text-2xl font-bold text-white mt-1">Good Standing</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Content Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Enrolled Courses & Appointments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Courses Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Registered Courses</CardTitle>
                    <CardDescription>Active course schedule for Spring 2026</CardDescription>
                  </div>
                  <Link href="/courses">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      Manage <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : courses.length > 0 ? (
                    courses.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-brand-400 font-mono">{c.code}</span>
                            <Badge variant="neutral">{c.credits} Credits</Badge>
                          </div>
                          <p className="text-sm font-medium text-white">{c.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {c.schedule} • {c.instructor}
                          </p>
                        </div>
                        <Badge variant="success">Enrolled</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">No active courses registered.</p>
                  )}
                </CardContent>
              </Card>

              {/* Advising Sessions Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Advising Sessions</CardTitle>
                    <CardDescription>Scheduled appointments with academic advisors</CardDescription>
                  </div>
                  <Link href="/appointments">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      Schedule <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : appointments.length > 0 ? (
                    appointments.map((app) => (
                      <div key={app.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{app.purpose}</p>
                          <p className="text-xs text-slate-400">Advisor: {app.advisor?.name || 'Dr. Robert Chen'}</p>
                          <p className="text-xs text-brand-400 font-mono">
                            {new Date(app.startTime).toLocaleDateString()} at {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge variant="brand">{app.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-xs text-slate-500">No advising appointments scheduled.</p>
                      <Link href="/appointments">
                        <Button variant="outline" size="sm">Book Advising Slot</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Events & AI Assistant Teaser */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Campus Events</CardTitle>
                    <CardDescription>Upcoming campus events & fairs</CardDescription>
                  </div>
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      View All <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    events.map((ev) => (
                      <div key={ev.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="brand">{ev.category}</Badge>
                          <span className="text-[10px] text-slate-400 font-mono">{ev.rsvpCount} Attending</span>
                        </div>
                        <p className="text-xs font-semibold text-white leading-snug">{ev.title}</p>
                        <p className="text-[11px] text-slate-400">{ev.location}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* AI Assistant Quick Card */}
              <div className="glass-panel rounded-xl p-5 border border-brand-500/30 space-y-3 bg-gradient-to-b from-brand-950/20 to-slate-900/60">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-brand-400" />
                  <h4 className="text-sm font-semibold text-white">Need Academic Guidance?</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ask our Gemini-powered AI Assistant about prerequisites, graduation requirements, or upcoming campus events.
                </p>
                <Link href="/ai-assistant">
                  <Button variant="primary" size="sm" className="w-full text-xs gap-2">
                    <Sparkles className="h-3.5 w-3.5" /> Launch AI Chat Proxy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
