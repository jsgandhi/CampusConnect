'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { UserCheck, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Advisor, Appointment } from '@campusconnect/shared';

interface AdvisorSlot {
  id: string;
  advisorId: string;
  startTime: string;
  label: string;
  available: boolean;
}

const INITIAL_SLOTS: AdvisorSlot[] = [
  { id: 'slot-1', advisorId: 'advisor-chen', startTime: '2026-08-25T10:00:00.000Z', label: 'Mon, Aug 25 · 10:00 AM', available: true },
  { id: 'slot-2', advisorId: 'advisor-chen', startTime: '2026-08-25T14:00:00.000Z', label: 'Mon, Aug 25 · 2:00 PM', available: true },
  { id: 'slot-3', advisorId: 'advisor-brooks', startTime: '2026-08-26T11:00:00.000Z', label: 'Tue, Aug 26 · 11:00 AM', available: true },
  { id: 'slot-4', advisorId: 'advisor-brooks', startTime: '2026-08-26T15:30:00.000Z', label: 'Tue, Aug 26 · 3:30 PM', available: true },
  { id: 'slot-5', advisorId: 'advisor-nair', startTime: '2026-08-27T09:30:00.000Z', label: 'Wed, Aug 27 · 9:30 AM', available: true },
  { id: 'slot-6', advisorId: 'advisor-nair', startTime: '2026-08-27T13:00:00.000Z', label: 'Wed, Aug 27 · 1:00 PM', available: true },
];

export default function AppointmentsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [slots, setSlots] = useState<AdvisorSlot[]>(INITIAL_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState<AdvisorSlot | null>(null);

  // Form State
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [advisorsRes, appRes] = await Promise.all([
        apiClient.getAdvisors(),
        apiClient.getAppointments(),
      ]);

      if (advisorsRes.data) setAdvisors(advisorsRes.data);
      if (appRes.data) setAppointments(appRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSelectSlot = (slot: AdvisorSlot) => {
    const advisor = advisors.find((item) => item.id === slot.advisorId);
    if (!advisor) return;
    setSelectedAdvisor(advisor);
    setSelectedSlot(slot);
    setPurpose('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !selectedSlot || !purpose) return;

    setSubmitting(true);
    setFeedback(null);
    const endTime = new Date(new Date(selectedSlot.startTime).getTime() + 30 * 60 * 1000).toISOString();
    setAppointments((previous) => [...previous, {
      id: `appointment-${selectedSlot.id}`,
      studentId: 'demo-student-id',
      advisorId: selectedAdvisor.id,
      startTime: selectedSlot.startTime,
      endTime,
      purpose,
      notes,
      status: 'SCHEDULED',
      advisor: selectedAdvisor,
    }]);
    setSlots((previous) => previous.map((slot) =>
      slot.id === selectedSlot.id ? { ...slot, available: false } : slot
    ));
    setSubmitting(false);
    setIsModalOpen(false);
    setFeedback({ type: 'success', message: `Appointment scheduled with ${selectedAdvisor.name}!` });
    setSelectedSlot(null);
    setPurpose('');
    setNotes('');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((previous) => previous.map((appointment) =>
      appointment.id === id ? { ...appointment, status: 'CANCELLED' as const } : appointment
    ));
    const slotId = id.replace('appointment-', '');
    setSlots((previous) => previous.map((slot) => slot.id === slotId ? { ...slot, available: true } : slot));
    setFeedback({ type: 'success', message: 'Appointment cancelled and time slot reopened.' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <UserCheck className="h-7 w-7 text-emerald-400" /> Academic Advisor Scheduler
            </h1>
            <p className="text-sm text-slate-400">Book 1-on-1 consultations for degree planning, capstone projects, and career counseling</p>
          </div>

          {feedback && (
            <Alert variant={feedback.type} title={feedback.type === 'success' ? 'Appointment Scheduled' : 'Notice'}>
              {feedback.message}
            </Alert>
          )}

          {/* Section 1: Scheduled Appointments */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-brand-400" /> Your Scheduled Appointments
            </h2>

            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((app) => (
                  <Card key={app.id} className="border-slate-800">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant={app.status === 'SCHEDULED' ? 'brand' : 'neutral'}>{app.status}</Badge>
                        <h4 className="font-semibold text-white text-base mt-2">{app.purpose}</h4>
                        <p className="text-xs text-slate-400">Advisor: {app.advisor?.name || 'Academic Advisor'}</p>
                        <p className="text-xs text-brand-400 font-mono flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(app.startTime).toLocaleDateString()} at {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {app.status === 'SCHEDULED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-rose-400 hover:bg-rose-950/40"
                          onClick={() => handleCancelAppointment(app.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">No active appointments scheduled.</p>
            )}
          </div>

          {/* Section 2: Available advisor time slots */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Available Time Slots</h2>
              <p className="mt-1 text-xs text-slate-400">Select an available slot to review and confirm your appointment.</p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const advisor = advisors.find((item) => item.id === slot.advisorId);
                  return (
                    <button key={slot.id} type="button" disabled={!slot.available} onClick={() => handleSelectSlot(slot)} className={`rounded-xl border p-4 text-left transition ${slot.available ? 'border-emerald-700/60 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/40' : 'cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-50'}`}>
                      <p className="text-xs font-semibold text-white">{advisor?.name ?? 'Advisor unavailable'}</p>
                      <p className="mt-1 text-xs text-slate-400">{slot.label}</p>
                      <p className={`mt-3 text-[11px] font-medium ${slot.available ? 'text-emerald-400' : 'text-slate-500'}`}>{slot.available ? 'Available — select to book' : 'Reserved'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Department Advisors Directory */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">Available Department Advisors</h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advisors.map((advisor) => (
                  <Card key={advisor.id} className="flex flex-col justify-between hover:border-emerald-500/40">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                        {advisor.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={advisor.avatarUrl} alt={advisor.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-brand-400">
                            {advisor.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{advisor.name}</CardTitle>
                        <CardDescription>{advisor.title} • {advisor.department}</CardDescription>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-slate-400" /> {advisor.office}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {advisor.specialities.map((spec, i) => (
                          <Badge key={i} variant="neutral" className="text-[10px]">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-xs text-slate-400">Choose one of this advisor&apos;s time slots above to book.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book Session with ${selectedAdvisor?.name}`}
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
            <p className="font-semibold text-white">{selectedSlot?.label}</p>
            <p className="mt-1">Advisor: {selectedAdvisor?.name}</p>
          </div>

          <Input
            label="Purpose of Session"
            placeholder="e.g. Degree Audit & Spring 2026 Course Planning"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Additional Notes (Optional)</label>
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
