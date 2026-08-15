import { z } from 'zod';

const AuditItemSchema = z.object({ id: z.string() }).passthrough();

export const AuditStateSchema = z.object({
  courses: z.array(AuditItemSchema),
  events: z.array(AuditItemSchema),
  advisors: z.array(AuditItemSchema),
});

export type AuditState = z.infer<typeof AuditStateSchema>;

export const AUDIT_STATE_STORAGE_KEY = 'campusconnect_audit_state';

export const BASELINE_AUDIT_STATE: AuditState = {
  courses: [
    { id: 'course-cs401', code: 'CS-401', title: 'Advanced Full-Stack Engineering', registered: false },
    { id: 'course-pm320', code: 'PM-320', title: 'Agile Project Management', registered: false },
    { id: 'course-ds350', code: 'DS-350', title: 'Data Science & Predictive Analytics', registered: false },
    { id: 'course-des210', code: 'DES-210', title: 'User Experience & Design Systems', registered: false },
  ],
  events: [
    { id: 'event-career-fair', title: 'Spring Tech Career Fair', joined: false },
    { id: 'event-hackathon', title: 'Sustainable Campus AI Hackathon', joined: false },
    { id: 'event-welcome', title: 'Welcome Back Festival', joined: false },
    { id: 'event-symposium', title: 'Computer Science Research Symposium', joined: false },
  ],
  advisors: [
    { id: 'advisor-chen', name: 'Dr. Robert Chen', selected: false },
    { id: 'advisor-brooks', name: 'Maya Brooks', selected: false },
    { id: 'advisor-nair', name: 'Dr. Priya Nair', selected: false },
  ],
};

export function loadAuditState(): AuditState {
  const saved = window.localStorage.getItem(AUDIT_STATE_STORAGE_KEY);
  if (!saved) return BASELINE_AUDIT_STATE;

  try {
    const parsed: unknown = JSON.parse(saved);
    return AuditStateSchema.parse(parsed);
  } catch {
    return BASELINE_AUDIT_STATE;
  }
}

export function saveAuditState(state: AuditState): void {
  window.localStorage.setItem(AUDIT_STATE_STORAGE_KEY, JSON.stringify(state));
}
