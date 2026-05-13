import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../utils/jwt';

interface JwtPayload {
  userId: string;
  roles: string[];
}

interface AuthUser {
  id: string;
  roles: string[];
}

class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class AuthMiddleware {
  static requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new HttpError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken<JwtPayload>(token);
    (req as any).user = { id: payload.userId, roles: payload.roles };
    next();
  }

  static restrictTo(...allowedRoles: string[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      let user = (req as any).user as AuthUser | undefined;

      if (!user) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          return next(new HttpError('Authentication required', 401));
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken<JwtPayload>(token);
        user = { id: payload.userId, roles: payload.roles };
        (req as any).user = user;
      }

      const hasRole = user.roles.some((role: string) =>
        allowedRoles.includes(role) || (role === 'superadmin' && allowedRoles.includes('admin')),
      );

      if (!hasRole) {
        return next(new HttpError('Permission denied', 403));
      }

      next();
    };
  }
}
