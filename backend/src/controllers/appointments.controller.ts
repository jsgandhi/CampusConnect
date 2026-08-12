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
    const userId = req.user?.id || 'demo-student-id';

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
      });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: { studentId: user.id },
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
    const userId = req.user?.id || 'demo-student-id';

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
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
