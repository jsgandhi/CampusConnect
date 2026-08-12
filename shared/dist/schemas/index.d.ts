import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof LoginSchema>;
export declare const EnrollCourseSchema: z.ZodObject<{
    courseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    courseId: string;
}, {
    courseId: string;
}>;
export type EnrollCourseInput = z.infer<typeof EnrollCourseSchema>;
export declare const EventRsvpSchema: z.ZodObject<{
    eventId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventId: string;
}, {
    eventId: string;
}>;
export type EventRsvpInput = z.infer<typeof EventRsvpSchema>;
export declare const ScheduleAppointmentSchema: z.ZodObject<{
    advisorId: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    purpose: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    advisorId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    notes?: string | undefined;
}, {
    advisorId: string;
    startTime: string;
    endTime: string;
    purpose: string;
    notes?: string | undefined;
}>;
export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentSchema>;
export declare const AiQuerySchema: z.ZodObject<{
    prompt: z.ZodString;
    context: z.ZodDefault<z.ZodEnum<["advising", "courses", "events", "general"]>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    context: "advising" | "courses" | "events" | "general";
}, {
    prompt: string;
    context?: "advising" | "courses" | "events" | "general" | undefined;
}>;
export type AiQueryInput = z.infer<typeof AiQuerySchema>;
//# sourceMappingURL=index.d.ts.map