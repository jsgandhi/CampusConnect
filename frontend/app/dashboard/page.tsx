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
import { apiClient, UserProfile } from '@/lib/api-client';
import { useRequireAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        // getProfile returns THIS user's real enrollments/RSVPs/appointments
        // (previously the dashboard just sliced the first 2 items out of the
        // whole course/event catalog, regardless of who was signed in).
        const profileRes = await apiClient.getProfile();
        if (profileRes.data) {
          setProfile(profileRes.data);
        } else {
          setError(profileRes.error?.message || 'Failed to load your profile from the backend.');
        }
      } catch (_err) {
        setError('Failed to connect to backend server.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <Skeleton className="h-48 w-full max-w-xl" />
      </div>
    );
  }

  const activeEnrollments = (profile?.enrollments || []).filter((e) => e.status === 'ENROLLED');
  const confirmedRsvps = (profile?.rsvps || []).filter((r) => r.status === 'CONFIRMED');
  const scheduledAppointments = (profile?.appointments || []).filter((a) => a.status === 'SCHEDULED');

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
                    <Badge variant="neutral" className="font-mono text-[11px]">
                      {user.role}
                    </Badge>
                    {user.gpa != null && <span className="text-xs text-slate-400 font-mono">GPA: {user.gpa}</span>}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Welcome back, {user.name} 👋
                  </h1>
                  <p className="text-sm text-slate-400">
                    {user.major} • ID: <span className="font-mono text-brand-400">{user.studentId}</span>
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
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : activeEnrollments.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Events You&apos;re Attending</p>
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : confirmedRsvps.length}</p>
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
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : scheduledAppointments.length}</p>
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
                    <CardDescription>Your active course schedule for Spring 2026</CardDescription>
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
                  ) : activeEnrollments.length > 0 ? (
                    activeEnrollments.map((enr) => (
                      <div key={enr.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-brand-400 font-mono">{enr.course?.code}</span>
                            <Badge variant="neutral">{enr.course?.credits} Credits</Badge>
                          </div>
                          <p className="text-sm font-medium text-white">{enr.course?.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {enr.course?.schedule} • {enr.course?.instructor}
                          </p>
                        </div>
                        <Badge variant="success">Enrolled</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-xs text-slate-500">No active courses registered.</p>
                      <Link href="/courses">
                        <Button variant="outline" size="sm">Browse Courses</Button>
                      </Link>
                    </div>
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
                  ) : scheduledAppointments.length > 0 ? (
                    scheduledAppointments.map((app) => (
                      <div key={app.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{app.purpose}</p>
                          <p className="text-xs text-slate-400">Advisor: {app.advisor?.name || 'Academic Advisor'}</p>
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
                    <CardTitle>Your Campus Events</CardTitle>
                    <CardDescription>Events you&apos;ve RSVP&apos;d to</CardDescription>
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
                  ) : confirmedRsvps.length > 0 ? (
                    confirmedRsvps.map((rsvp) => (
                      <div key={rsvp.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="brand">{rsvp.event?.category}</Badge>
                          <span className="text-[10px] text-slate-400 font-mono">{rsvp.event?.rsvpCount} Attending</span>
                        </div>
                        <p className="text-xs font-semibold text-white leading-snug">{rsvp.event?.title}</p>
                        <p className="text-[11px] text-slate-400">{rsvp.event?.location}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-xs text-slate-500">No events RSVP&apos;d yet.</p>
                      <Link href="/events">
                        <Button variant="outline" size="sm">Browse Events</Button>
                      </Link>
                    </div>
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
