"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiQuerySchema = exports.ScheduleAppointmentSchema = exports.EventRsvpSchema = exports.EnrollCourseSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.EnrollCourseSchema = zod_1.z.object({
    courseId: zod_1.z.string().min(1, 'Course ID is required'),
});
exports.EventRsvpSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, 'Event ID is required'),
});
exports.ScheduleAppointmentSchema = zod_1.z.object({
    advisorId: zod_1.z.string().min(1, 'Advisor selection is required'),
    startTime: zod_1.z.string().datetime({ message: 'Valid start date and time is required' }),
    endTime: zod_1.z.string().datetime({ message: 'Valid end date and time is required' }),
    purpose: zod_1.z.string().min(5, 'Please provide a purpose of at least 5 characters'),
    notes: zod_1.z.string().optional(),
});
exports.AiQuerySchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1, 'Prompt cannot be empty'),
    context: zod_1.z.enum(['advising', 'courses', 'events', 'general']).default('general'),
});
//# sourceMappingURL=index.js.map