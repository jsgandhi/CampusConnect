import type { Advisor, Appointment, CampusEvent, Course, Enrollment, EventRSVP } from '@campusconnect/shared';

export const mockCourses: Course[] = [
  { id: 'course-cs401', code: 'CS-401', title: 'Advanced Full-Stack Engineering', description: 'Build reliable web applications with React, Node.js, and cloud services.', credits: 4, department: 'Computer Science', instructor: 'Dr. Sarah Jenkins', schedule: 'Mon / Wed 10:00 AM – 11:45 AM', location: 'Engineering Building 302', capacity: 35, enrolledCount: 28, prerequisites: ['CS-201 Data Structures'] },
  { id: 'course-pm320', code: 'PM-320', title: 'Agile Project Management', description: 'Plan, deliver, and evaluate software projects with modern agile practices.', credits: 3, department: 'Project Management', instructor: 'Prof. Jeeta Gandhi', schedule: 'Friday 09:00 AM – 12:00 PM', location: 'Business Center Hall A', capacity: 50, enrolledCount: 42, prerequisites: [] },
  { id: 'course-ds350', code: 'DS-350', title: 'Data Science & Predictive Analytics', description: 'Apply statistical modeling and machine learning to real-world datasets.', credits: 4, department: 'Data Science', instructor: 'Dr. Priya Nair', schedule: 'Tue / Thu 10:00 AM – 11:45 AM', location: 'Math & Science Hall 220', capacity: 45, enrolledCount: 31, prerequisites: ['MATH-201 Statistics'] },
  { id: 'course-des210', code: 'DES-210', title: 'User Experience & Design Systems', description: 'Create accessible interfaces and reusable component systems.', credits: 3, department: 'Digital Design', instructor: 'Elena Rostova', schedule: 'Mon / Wed 01:00 PM – 02:30 PM', location: 'Design Studio 12', capacity: 25, enrolledCount: 20, prerequisites: [] },
];

export const mockEvents: CampusEvent[] = [
  { id: 'event-career-fair', title: 'Spring Tech Career Fair', description: 'Meet recruiters from regional technology companies and campus partners.', category: 'CAREER', location: 'Campus Center Great Hall', startTime: '2026-08-20T10:00:00.000Z', endTime: '2026-08-20T15:00:00.000Z', organizer: 'Campus Career Center', capacity: 500, rsvpCount: 312 },
  { id: 'event-hackathon', title: 'Sustainable Campus AI Hackathon', description: 'Build practical AI solutions for energy, wellness, and student life.', category: 'WORKSHOP', location: 'Innovation Hub Lab 1', startTime: '2026-08-25T09:00:00.000Z', endTime: '2026-08-25T18:00:00.000Z', organizer: 'Developer Student Club', capacity: 120, rsvpCount: 89 },
  { id: 'event-welcome', title: 'Welcome Back Festival', description: 'Food, music, games, and student organization booths on the quad.', category: 'SOCIAL', location: 'University Quad Lawn', startTime: '2026-08-28T16:00:00.000Z', endTime: '2026-08-28T20:00:00.000Z', organizer: 'Student Government Association', capacity: 1000, rsvpCount: 650 },
  { id: 'event-symposium', title: 'Computer Science Research Symposium', description: 'Faculty and senior students share research through talks and posters.', category: 'ACADEMIC', location: 'Engineering Auditorium A', startTime: '2026-09-05T13:00:00.000Z', endTime: '2026-09-05T18:00:00.000Z', organizer: 'Computer Science Department', capacity: 250, rsvpCount: 178 },
];

export const mockAdvisors: Advisor[] = [
  { id: 'advisor-chen', name: 'Dr. Robert Chen', email: 'r.chen@cstu.edu', department: 'Computer Science', title: 'Senior Academic Advisor', office: 'Engineering Hall 405', specialities: ['Degree Audits', 'Senior Capstones'] },
  { id: 'advisor-brooks', name: 'Maya Brooks', email: 'm.brooks@cstu.edu', department: 'Career Services', title: 'Career & Internship Counselor', office: 'Student Union 210', specialities: ['Resume Reviews', 'Interview Preparation'] },
  { id: 'advisor-nair', name: 'Dr. Priya Nair', email: 'p.nair@cstu.edu', department: 'Data Science', title: 'Faculty Advisor', office: 'Math & Science Hall 118', specialities: ['Research Planning', 'Graduate School'] },
];

export const mockEnrollments: Enrollment[] = [];
export const mockRsvps: EventRSVP[] = [];
export const mockAppointments: Appointment[] = [];
