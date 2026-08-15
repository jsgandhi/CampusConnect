import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ScheduleAppointmentSchema } from '@campusconnect/shared';
import { mockAdvisors, mockAppointments } from '../data/mock-data.js';

export const getAdvisors = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ success: true, data: mockAdvisors });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo-student-id';

    const appointments = mockAppointments
      .filter((appointment) => appointment.studentId === userId)
      .sort((first, second) => first.startTime.localeCompare(second.startTime));

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const scheduleAppointment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = ScheduleAppointmentSchema.parse(req.body);
    const userId = req.user?.id || 'demo-student-id';

    const advisor = mockAdvisors.find((item) => item.id === payload.advisorId);
    if (!advisor) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Advisor not found' } });
      return;
    }
    const appointment = {
      id: `appointment-${Date.now()}`,
      studentId: userId,
      advisorId: advisor.id,
      startTime: payload.startTime,
      endTime: payload.endTime,
      purpose: payload.purpose,
      notes: payload.notes,
      status: 'SCHEDULED' as const,
      advisor,
    };
    mockAppointments.push(appointment);

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = mockAppointments.find((item) => item.id === id);
    if (!appointment) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
      return;
    }
    appointment.status = 'CANCELLED';

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
