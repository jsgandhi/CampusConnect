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
import { Calendar, MapPin, Users, Clock, Search } from 'lucide-react';
import { CampusEvent } from '@campusconnect/shared';

const BASELINE_EVENTS: CampusEvent[] = [
  { id: 'event-career-fair', title: 'Spring Tech Career Fair', description: 'Meet recruiters from regional technology companies and campus partners.', category: 'CAREER', location: 'Campus Center Great Hall', startTime: '2026-08-20T10:00:00.000Z', endTime: '2026-08-20T15:00:00.000Z', organizer: 'Campus Career Center', capacity: 500, rsvpCount: 312 },
  { id: 'event-hackathon', title: 'Sustainable Campus AI Hackathon', description: 'Build practical AI solutions for energy, wellness, and student life.', category: 'WORKSHOP', location: 'Innovation Hub Lab 1', startTime: '2026-08-25T09:00:00.000Z', endTime: '2026-08-25T18:00:00.000Z', organizer: 'Developer Student Club', capacity: 120, rsvpCount: 89 },
  { id: 'event-welcome', title: 'Welcome Back Festival', description: 'Food, music, games, and student organization booths on the quad.', category: 'SOCIAL', location: 'University Quad Lawn', startTime: '2026-08-28T16:00:00.000Z', endTime: '2026-08-28T20:00:00.000Z', organizer: 'Student Government Association', capacity: 1000, rsvpCount: 650 },
  { id: 'event-symposium', title: 'Computer Science Research Symposium', description: 'Faculty and senior students share research through talks and posters.', category: 'ACADEMIC', location: 'Engineering Auditorium A', startTime: '2026-09-05T13:00:00.000Z', endTime: '2026-09-05T18:00:00.000Z', organizer: 'Computer Science Department', capacity: 250, rsvpCount: 178 },
  { id: 'event-basketball', title: 'Intramural 3×3 Basketball Tournament', description: 'Register a team and compete for trophies and campus-store prizes.', category: 'SPORTS', location: 'Campus Recreation Center', startTime: '2026-09-06T10:00:00.000Z', endTime: '2026-09-06T17:00:00.000Z', organizer: 'Campus Recreation', capacity: 96, rsvpCount: 64 },
  { id: 'event-linkedin', title: 'Resume & LinkedIn Masterclass', description: 'Build a stronger resume and professional profile with Career Services.', category: 'WORKSHOP', location: 'Student Union Conference Room B', startTime: '2026-09-10T14:00:00.000Z', endTime: '2026-09-10T16:00:00.000Z', organizer: 'Campus Career Center', capacity: 80, rsvpCount: 55 },
];

type CategoryFilter = 'ALL' | CampusEvent['category'];

export default function EventsPage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const refetchedEvents = BASELINE_EVENTS.filter((event) => {
      const matchesCategory = categoryFilter === 'ALL' || event.category === categoryFilter;
      const matchesKeyword = !query || [event.title, event.description, event.organizer, event.location]
        .some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesKeyword;
    });

    setEvents(refetchedEvents);
    setLoading(false);
  }, [categoryFilter, search]);

  const handleRsvp = (eventId: string) => {
    setFeedback(null);
    setRsvpedIds((previous) => new Set([...previous, eventId]));
    setFeedback({ type: 'success', message: 'RSVP confirmed! Event saved to your student schedule.' });
  };

  const handleCancelRsvp = (eventId: string) => {
    setFeedback(null);
    setRsvpedIds((previous) => new Set([...previous].filter((id) => id !== eventId)));
    setFeedback({ type: 'success', message: 'RSVP cancelled.' });
  };

  const categories: CategoryFilter[] = ['ALL', 'CAREER', 'SOCIAL', 'ACADEMIC', 'WORKSHOP', 'SPORTS'];

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

            <div className="flex w-full flex-col gap-3 md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
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
                  {cat === 'ALL' ? 'All' : `${cat[0]}${cat.slice(1).toLowerCase()}`}
                </button>
              ))}
            </div>
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
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => {
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
                            onClick={() => handleCancelRsvp(ev.id)}
                          >
                            Cancel RSVP
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
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
              <p className="text-sm text-slate-400">No events match the selected category and keyword filters.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
