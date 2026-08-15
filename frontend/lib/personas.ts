export interface StudentPersona {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'CLUB_PRESIDENT' | 'IT_DIRECTOR' | 'ADMIN';
  studentId: string;
  major: string;
  title: string;
  avatarUrl: string;
  gpa: number;
}

export const PREDEFINED_PERSONAS: StudentPersona[] = [
  {
    id: 'persona-student',
    email: 'student@cstu.edu',
    passwordHash: 'password123',
    name: 'Alex Rivera',
    role: 'STUDENT',
    studentId: 'CSTU-2026-8891',
    major: 'Computer Science & Software Engineering',
    title: 'Senior Undergraduate Student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    gpa: 3.84,
  },
  {
    id: 'persona-it-director',
    email: 'it-director@cstu.edu',
    passwordHash: 'password123',
    name: 'Marcus Vance',
    role: 'IT_DIRECTOR',
    studentId: 'CSTU-IT-0042',
    major: 'Information Technology & Security',
    title: 'Director of IT Systems & Security',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
    gpa: 4.0,
  },
  {
    id: 'persona-club-president',
    email: 'club-president@cstu.edu',
    passwordHash: 'password123',
    name: 'Jordan Lee',
    role: 'CLUB_PRESIDENT',
    studentId: 'CSTU-2026-7742',
    major: 'Artificial Intelligence & Data Science',
    title: 'President, CSTU Developer Student Club',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    gpa: 3.92,
  },
  {
    id: 'persona-admin',
    email: 'admin@cstu.edu',
    passwordHash: 'password123',
    name: 'Morgan Taylor',
    role: 'ADMIN',
    studentId: 'CSTU-ADM-1001',
    major: 'Academic Operations & Department Affairs',
    title: 'CSTU Portal System Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    gpa: 4.0,
  },
];

/**
 * Validates credentials against the predefined local student objects array.
 */
export function validatePersonaCredentials(email: string, passwordHash: string): StudentPersona | null {
  const normalizedEmail = email.trim().toLowerCase();
  const found = PREDEFINED_PERSONAS.find(
    (p) => p.email.toLowerCase() === normalizedEmail && p.passwordHash === passwordHash
  );
  return found || null;
}

/**
 * Validates fake URL parameters on the frontend for verification routines.
 */
export function validateFakePersonaUrl(searchParamsEmail: string | null): StudentPersona | null {
  if (!searchParamsEmail) return null;
  const normalizedEmail = decodeURIComponent(searchParamsEmail).trim().toLowerCase();
  return PREDEFINED_PERSONAS.find((p) => p.email.toLowerCase() === normalizedEmail) || null;
}
