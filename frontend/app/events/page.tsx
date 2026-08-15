'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Calendar, MapPin, Users, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { CampusEvent } from '@campusconnect/shared';
import { useRequireAuth } from '@/lib/auth-context';

export default function EventsPage() {
  const { user } = useRequireAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchEvents() {
      setLoading(true);
      // Real RSVP state comes from the signed-in user's profile (previously
      // this just guessed "event #1 is RSVP'd" regardless of the DB).
      const [eventsRes, profileRes] = await Promise.all([apiClient.getEvents(), apiClient.getProfile()]);

      if (eventsRes.data) setEvents(eventsRes.data);

      if (profileRes.data) {
        const activeEventIds = profileRes.data.rsvps
          .filter((r) => r.status === 'CONFIRMED')
          .map((r) => r.eventId);
        setRsvpedIds(new Set(activeEventIds));
      }

      setLoading(false);
    }
    fetchEvents();
  }, [user]);

  const handleRsvp = async (eventId: string) => {
    setActionLoading(eventId);
    setFeedback(null);
    const res = await apiClient.rsvpEvent(eventId);
    setActionLoading(null);

    if (res.success) {
      setRsvpedIds((prev) => new Set([...Array.from(prev), eventId]));
      setFeedback({ type: 'success', message: 'RSVP confirmed! Event saved to your student schedule.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'RSVP failed' });
    }
  };

  const handleCancelRsvp = async (eventId: string) => {
    setActionLoading(eventId);
    setFeedback(null);
    const res = await apiClient.cancelRsvp(eventId);
    setActionLoading(null);

    if (res.success) {
      setRsvpedIds((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
      setFeedback({ type: 'success', message: 'RSVP cancelled.' });
    } else {
      setFeedback({ type: 'danger', message: res.error?.message || 'Cancellation failed' });
    }
  };

  const categories = ['ALL', 'CAREER', 'WORKSHOP', 'SOCIAL', 'ACADEMIC'];

  const filteredEvents = events.filter(
    (ev) => categoryFilter === 'ALL' || ev.category === categoryFilter
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Calendar className="h-7 w-7 text-accent-500" /> Campus Events Directory
              </h1>
              <p className="text-sm text-slate-400">Career fairs, hackathons, workshops, and student networking</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <Alert variant={feedback.type} title={feedback.type === 'success' ? 'Confirmed' : 'Notice'}>
              {feedback.message}
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => {
                const isRsvped = rsvpedIds.has(ev.id);

                return (
                  <Card key={ev.id} className="flex flex-col justify-between hover:border-accent-500/40">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={ev.category === 'CAREER' ? 'brand' : ev.category === 'WORKSHOP' ? 'warning' : 'neutral'}>
                          {ev.category}
                        </Badge>
                        {isRsvped && <Badge variant="success">Attending</Badge>}
                      </div>
                      <CardTitle className="text-lg leading-snug">{ev.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                        {ev.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4 border-t border-slate-800/80">
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{new Date(ev.startTime).toLocaleDateString()} • {new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Organizer: {ev.organizer}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">
                          {ev.rsvpCount} Attending
                        </span>

                        {isRsvped ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            isLoading={actionLoading === ev.id}
                            onClick={() => handleCancelRsvp(ev.id)}
                          >
                            Cancel RSVP
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            isLoading={actionLoading === ev.id}
                            onClick={() => handleRsvp(ev.id)}
                          >
                            RSVP Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No events found in category &quot;{categoryFilter}&quot;.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
