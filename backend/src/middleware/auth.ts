import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Mock auth middleware for MVP development.
 *
 * This is NOT real token verification — there's no JWT signature check here.
 * It trusts the `x-user-id` / `x-user-role` headers, which the frontend sets
 * from the user object it received (and trusts) from POST /auth/login.
 *
 * IMPORTANT: this middleware requires the headers to be present. It used to
 * silently fall back to a hardcoded "demo-student-id", which meant every
 * request looked authenticated even when nobody was logged in — every
 * persona ended up reading and writing the same demo user's data. Now, a
 * missing x-user-id is treated as "not logged in" and returns 401, so the
 * frontend has to actually send the real signed-in user's identity.
 */
export const authenticateMockUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const userRole = (req.headers['x-user-role'] as string) || 'STUDENT';

  if (!userId) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'No active session. Please log in again.',
      },
    });
    return;
  }

  req.user = {
    id: userId,
    email: (req.headers['x-user-email'] as string) || '',
    name: (req.headers['x-user-name'] as string) || '',
    role: userRole,
  };

  next();
};
