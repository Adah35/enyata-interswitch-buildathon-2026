import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../errors/errors';
import { UserRole } from '../entities/enums';

/**
 * Usage: authorize('ADMIN') or authorize('TASKER', 'BOTH')
 * Must be used after authMiddleware.
 */
export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as UserRole | undefined;

    if (!userRole || !roles.includes(userRole)) {
      return next(new ForbiddenException('You do not have permission to access this resource'));
    }

    next();
  };
