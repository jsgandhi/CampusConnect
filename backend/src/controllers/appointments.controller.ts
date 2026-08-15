import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { ScheduleAppointmentSchema } from '@campusconnect/shared';

const prisma = new PrismaClient();

export const getAdvisors = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const advisors = await prisma.advisor.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: advisors,
    });
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
    const userId = req.user!.id;

    const appointments = await prisma.appointment.findMany({
      where: { studentId: userId },
      include: { advisor: true },
      orderBy: { startTime: 'asc' },
    });

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
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Your session is invalid. Please log in again.' },
      });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        studentId: user.id,
        advisorId: payload.advisorId,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
        purpose: payload.purpose,
        notes: payload.notes,
        status: 'SCHEDULED',
      },
      include: { advisor: true },
    });

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
    const userId = req.user!.id;

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Appointment not found' },
      });
      return;
    }

    // Prevent one student from cancelling another student's appointment.
    if (existing.studentId !== userId) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only cancel your own appointments' },
      });
      return;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
