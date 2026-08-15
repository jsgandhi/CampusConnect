'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Calendar,
  UserCheck,
  Bot,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Course, CampusEvent, Appointment, Advisor } from '@campusconnect/shared';
import { validateFakePersonaUrl, PREDEFINED_PERSONAS, StudentPersona } from '@/lib/personas';

// ─── Category badge variant helper ───────────────────────────────────────────
type BadgeVariant = 'brand' | 'warning' | 'neutral' | 'success' | 'danger';

function categoryVariant(cat: CampusEvent['category']): BadgeVariant {
  const map: Record<CampusEvent['category'], BadgeVariant> = {
    CAREER: 'brand',
    WORKSHOP: 'warning',
    SOCIAL: 'neutral',
    ACADEMIC: 'success',
    SPORTS: 'neutral',
  };
  return map[cat] ?? 'neutral';
}

// ─── Dashboard Content ────────────────────────────────────────────────────────
function DashboardContent() {
  const searchParams = useSearchParams();

  // ── Persona state ──
  const [loading, setLoading] = useState(true);
  const [activePersona, setActivePersona] = useState<StudentPersona>(PREDEFINED_PERSONAS[0]);
  const [isUrlVerified, setIsUrlVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Data state ──
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  // ── Interaction state ──
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());
  const [courseActionLoading, setCourseActionLoading] = useState<string | null>(null);
  const [eventActionLoading, setEventActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // ── Advisor booking modal state ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('2026-08-25');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Auto-dismiss feedback after 4s ──
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  // ── Load data on mount ──
  useEffect(() => {
    const personaQuery = searchParams.get('persona');
    const isVerifiedQuery = searchParams.get('verified') === 'true';

    let matchedPersona: StudentPersona | null = null;
    if (personaQuery) matchedPersona = validateFakePersonaUrl(personaQuery);

    if (!matchedPersona && typeof window !== 'undefined') {
      const stored = localStorage.getItem('campusconnect_user');
      if (stored) {
        try { matchedPersona = JSON.parse(stored); } catch (_) {}
      }
    }

    if (matchedPersona) setActivePersona(matchedPersona);
    if (isVerifiedQuery) setIsUrlVerified(true);

    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [coursesRes, eventsRes, appointmentsRes, advisorsRes] = await Promise.all([
          apiClient.getCourses(),
          apiClient.getEvents(),
          apiClient.getAppointments(),
          apiClient.getAdvisors(),
        ]);

        if (coursesRes.data) {
          setCourses(coursesRes.data);
          // Default enrolled: first two courses (CS-401 + PM-320 in seed)
          const defaultEnrolled = new Set(
            coursesRes.data.slice(0, 2).map((c) => c.id)
          );
          setEnrolledIds(defaultEnrolled);
        }
        if (eventsRes.data) {
          setEvents(eventsRes.data);
          // Default RSVP'd: first event (Tech Career Fair in seed)
          const defaultRsvp = new Set(
            eventsRes.data.slice(0, 1).map((e) => e.id)
          );
          setRsvpedIds(defaultRsvp);
        }
        if (appointmentsRes.data) setAppointments(appointmentsRes.data);
        if (advisorsRes.data) setAdvisors(advisorsRes.data);
      } catch (_) {
        setError('Failed to connect to backend server. Using local persona cache state.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [searchParams]);

  // ── Course actions ──
  const handleEnroll = async (courseId: string) => {
    setCourseActionLoading(courseId);
    const res = await apiClient.enrollCourse(courseId);
    setCourseActionLoading(null);
    if (res.success) {
      setEnrolledIds((prev) => new Set([...Array.from(prev), courseId]));
      setFeedback({ type: 'success', message: 'Successfully enrolled in course!' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Enrollment failed.' });
    }
  };

  const handleDrop = async (courseId: string) => {
    setCourseActionLoading(courseId);
    const res = await apiClient.dropCourse(courseId);
    setCourseActionLoading(null);
    if (res.success) {
      setEnrolledIds((prev) => { const s = new Set(prev); s.delete(courseId); return s; });
      setFeedback({ type: 'success', message: 'Course dropped successfully.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Drop failed.' });
    }
  };

  // ── Event actions ──
  const handleRsvp = async (eventId: string) => {
    setEventActionLoading(eventId);
    const res = await apiClient.rsvpEvent(eventId);
    setEventActionLoading(null);
    if (res.success) {
      setRsvpedIds((prev) => new Set([...Array.from(prev), eventId]));
      setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e));
      setFeedback({ type: 'success', message: 'RSVP confirmed! Event added to your schedule.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'RSVP failed.' });
    }
  };

  const handleCancelRsvp = async (eventId: string) => {
    setEventActionLoading(eventId);
    const res = await apiClient.cancelRsvp(eventId);
    setEventActionLoading(null);
    if (res.success) {
      setRsvpedIds((prev) => { const s = new Set(prev); s.delete(eventId); return s; });
      setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, rsvpCount: Math.max(0, e.rsvpCount - 1) } : e));
      setFeedback({ type: 'success', message: 'RSVP cancelled.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Cancellation failed.' });
    }
  };

  // ── Advisor booking ──
  const handleOpenBooking = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setPurpose('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !purpose) return;
    setSubmitting(true);

    const startISO = new Date(`${appointmentDate}T${appointmentTime}:00Z`).toISOString();
    const endISO = new Date(new Date(startISO).getTime() + 30 * 60000).toISOString();

    const res = await apiClient.scheduleAppointment({
      advisorId: selectedAdvisor.id,
      startTime: startISO,
      endTime: endISO,
      purpose,
      notes,
    });

    setSubmitting(false);
    if (res.success && res.data) {
      setAppointments((prev) => [...prev, res.data!]);
      setIsModalOpen(false);
      setFeedback({ type: 'success', message: `Appointment booked with ${selectedAdvisor.name}!` });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Booking failed.' });
    }
  };

  // ── Derived counts for quick metrics ──
  const enrolledCount = enrolledIds.size;
  const rsvpCount = rsvpedIds.size;
  const appointmentCount = appointments.filter((a) => a.status === 'SCHEDULED').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl">

          {/* ── Welcome Banner ──────────────────────────────────────────── */}
          <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-600/10 blur-2xl rounded-full pointer-events-none" />
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
                      {activePersona.role}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">GPA: {activePersona.gpa}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Welcome back, {activePersona.name} 👋
                  </h1>
                  <p className="text-sm text-slate-400">
                    {activePersona.title} • {activePersona.major} • ID:{' '}
                    <span className="font-mono text-brand-400">{activePersona.studentId}</span>
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

          {/* ── Alerts ──────────────────────────────────────────────────── */}
          {isUrlVerified && (
            <Alert variant="success" title="Fake URL Persona Validation Passed">
              Validated persona credential:{' '}
              <strong className="font-mono">{activePersona.email}</strong> via frontend URL verification pipeline.
            </Alert>
          )}
          {error && (
            <Alert variant="warning" title="Backend Status Note">{error}</Alert>
          )}
          {feedback && (
            <Alert variant={feedback.type} title={feedback.type === 'success' ? 'Success' : 'Notice'}>
              {feedback.message}
            </Alert>
          )}

          {/* ── Quick Metrics Grid ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : enrolledCount}</p>
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
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : rsvpCount}</p>
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
                  <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : appointmentCount}</p>
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

          {/* ── Main Content Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left Column: Courses + Appointments ─────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Courses Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Course Catalog</CardTitle>
                    <CardDescription>Spring 2026 — enroll or drop directly from your dashboard</CardDescription>
                  </div>
                  <Link href="/courses">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      Full Catalog <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : courses.length > 0 ? (
                    courses.map((c) => {
                      const isEnrolled = enrolledIds.has(c.id);
                      const isFull = c.enrolledCount >= c.capacity;
                      return (
                        <div
                          key={c.id}
                          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-brand-500/30 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-brand-400 font-mono">{c.code}</span>
                              <Badge variant="neutral">{c.credits} cr</Badge>
                              {isEnrolled && <Badge variant="success">Enrolled</Badge>}
                              {!isEnrolled && isFull && <Badge variant="danger">Full</Badge>}
                            </div>
                            <p className="text-sm font-medium text-white truncate">{c.title}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3 shrink-0" />
                              {c.schedule} • {c.instructor}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {isEnrolled ? (
                              <Button
                                variant="danger"
                                size="sm"
                                isLoading={courseActionLoading === c.id}
                                onClick={() => handleDrop(c.id)}
                              >
                                Drop
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={isFull}
                                isLoading={courseActionLoading === c.id}
                                onClick={() => handleEnroll(c.id)}
                              >
                                {isFull ? 'Full' : 'Enroll'}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">No courses available.</p>
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
                    <div className="space-y-3">
                      {appointments.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">{app.purpose}</p>
                            <p className="text-xs text-slate-400">
                              Advisor: {app.advisor?.name ?? 'Dr. Robert Chen'}
                            </p>
                            <p className="text-xs text-brand-400 font-mono">
                              {new Date(app.startTime).toLocaleDateString()} at{' '}
                              {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Badge variant="brand">{app.status}</Badge>
                        </div>
                      ))}
                    </div>
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

            {/* ── Right Column: Events + Advisors + AI ────────────────── */}
            <div className="space-y-6">

              {/* Events Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Campus Events</CardTitle>
                    <CardDescription>RSVP to upcoming events</CardDescription>
                  </div>
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      View All <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : (
                    events.slice(0, 4).map((ev) => {
                      const isRsvped = rsvpedIds.has(ev.id);
                      return (
                        <div
                          key={ev.id}
                          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-accent-500/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant={categoryVariant(ev.category)}>{ev.category}</Badge>
                            {isRsvped && (
                              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                <CheckCircle2 className="h-3 w-3" /> Attending
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white leading-snug">{ev.title}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {ev.rsvpCount} attending
                            </span>
                            {isRsvped ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-[11px] h-7 px-2.5"
                                isLoading={eventActionLoading === ev.id}
                                onClick={() => handleCancelRsvp(ev.id)}
                              >
                                Cancel RSVP
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-[11px] h-7 px-2.5"
                                isLoading={eventActionLoading === ev.id}
                                onClick={() => handleRsvp(ev.id)}
                              >
                                RSVP
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Advisors Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Academic Advisors</CardTitle>
                    <CardDescription>Book a 1-on-1 session</CardDescription>
                  </div>
                  <Link href="/appointments">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      All Advisors <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    advisors.slice(0, 3).map((advisor) => (
                      <div
                        key={advisor.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                          {advisor.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={advisor.avatarUrl}
                              alt={advisor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-brand-400 font-bold text-sm">
                              {advisor.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{advisor.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{advisor.department}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px] h-7 px-2.5 shrink-0 gap-1"
                          onClick={() => handleOpenBooking(advisor)}
                        >
                          <Plus className="h-3 w-3" /> Book
                        </Button>
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

      {/* ── Advisor Booking Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book Session with ${selectedAdvisor?.name ?? 'Advisor'}`}
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          <Input
            label="Purpose of Session"
            placeholder="e.g. Degree Audit & Spring 2026 Course Planning"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={3}
              placeholder="Any specific questions or topics you wish to cover..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
          <Skeleton className="h-48 w-full max-w-xl" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
