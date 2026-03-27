import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errors';
import { ErrorCode } from '../errors/root';
import { config } from '../config';
import { UserService } from '../services/userService';
import { UserRole } from '../entities/enums';

const authService = new UserService();

type Decoded = {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      (req.cookies && req.cookies.accessToken) ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : undefined);

    if (!token) {
      throw new UnauthorizedError('Missing authorization token', ErrorCode.UNAUTHORIZED);
    }

    let decoded: Decoded;
    try {
      decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as Decoded;
    } catch {
      throw new UnauthorizedError('Invalid or expired token', ErrorCode.UNAUTHORIZED);
    }

    if (!decoded?.id) {
      throw new UnauthorizedError('Invalid token payload', ErrorCode.UNAUTHORIZED);
    }

    const user = await authService.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User not found', ErrorCode.NOT_FOUND);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    next(err);
  }
};