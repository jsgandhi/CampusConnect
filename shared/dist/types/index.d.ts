export type UserRole = 'STUDENT' | 'ADMIN' | 'FACULTY';
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    studentId?: string;
    major?: string;
    term?: string;
    gpa?: number;
    createdAt: string;
    updatedAt: string;
}
export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    department: string;
    instructor: string;
    schedule: string;
    location: string;
    capacity: number;
    enrolledCount: number;
    prerequisites: string[];
}
export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    status: 'ENROLLED' | 'WAITLISTED' | 'DROPPED';
    enrolledAt: string;
    course?: Course;
}
export interface CampusEvent {
    id: string;
    title: string;
    description: string;
    category: 'ACADEMIC' | 'SOCIAL' | 'CAREER' | 'WORKSHOP' | 'SPORTS';
    location: string;
    startTime: string;
    endTime: string;
    organizer: string;
    capacity: number;
    rsvpCount: number;
    imageUrl?: string;
}
export interface EventRSVP {
    id: string;
    userId: string;
    eventId: string;
    status: 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
    event?: CampusEvent;
}
export interface Advisor {
    id: string;
    name: string;
    email: string;
    department: string;
    title: string;
    office: string;
    avatarUrl?: string;
    specialities: string[];
}
export interface Appointment {
    id: string;
    studentId: string;
    advisorId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    notes?: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    advisor?: Advisor;
    student?: User;
}
export interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    content: string;
    timestamp: string;
    category?: 'advising' | 'courses' | 'events' | 'general';
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
//# sourceMappingURL=index.d.ts.map