import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const EnrollCourseSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export type EnrollCourseInput = z.infer<typeof EnrollCourseSchema>;

export const EventRsvpSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
});

export type EventRsvpInput = z.infer<typeof EventRsvpSchema>;

export const ScheduleAppointmentSchema = z.object({
  advisorId: z.string().min(1, 'Advisor selection is required'),
  startTime: z.string().datetime({ message: 'Valid start date and time is required' }),
  endTime: z.string().datetime({ message: 'Valid end date and time is required' }),
  purpose: z.string().min(5, 'Please provide a purpose of at least 5 characters'),
  notes: z.string().optional(),
});

export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentSchema>;

export const AiQuerySchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  context: z.enum(['advising', 'courses', 'events', 'general']).default('general'),
});

export type AiQueryInput = z.infer<typeof AiQuerySchema>;
