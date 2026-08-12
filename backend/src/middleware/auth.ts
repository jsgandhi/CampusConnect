import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Mock auth middleware for MVP development
export const authenticateMockUser = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = (req.headers['x-user-role'] as string) || 'STUDENT';

  // Attach mock authenticated user from header or default demo user
  req.user = {
    id: userId || 'demo-student-id',
    email: 'alex.student@campusconnect.edu',
    name: 'Alex Rivera',
    role: userRole,
  };

  next();
};
