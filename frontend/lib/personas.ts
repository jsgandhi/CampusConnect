/**
 * Demo account quick-fill list for the login page.
 *
 * IMPORTANT: this is a UI convenience only — it does NOT perform any
 * authentication itself. It just fills in the email/password fields so
 * a demo audience can switch personas with one click. The actual login
 * always goes through POST /api/v1/auth/login and is verified against the
 * real (bcrypt-hashed) users created by `backend/prisma/seed.ts`.
 *
 * `email` and `demoPassword` here must match seed.ts exactly, or the
 * quick-fill buttons will pre-fill credentials that the backend rejects.
 */
export interface QuickFillPersona {
  email: string;
  demoPassword: string;
  name: string;
  /** Cosmetic label only — the backend's actual Role enum is STUDENT/ADMIN/FACULTY. */
  displayLabel: string;
  avatarUrl: string;
}

export const PREDEFINED_PERSONAS: QuickFillPersona[] = [
  {
    email: 'student@cstu.edu',
    demoPassword: 'password123',
    name: 'Alex Rivera',
    displayLabel: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  },
  {
    email: 'club-president@cstu.edu',
    demoPassword: 'password123',
    name: 'Jordan Lee',
    displayLabel: 'CLUB PRESIDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  },
  {
    email: 'admin@cstu.edu',
    demoPassword: 'password123',
    name: 'Morgan Taylor',
    displayLabel: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  },
];
