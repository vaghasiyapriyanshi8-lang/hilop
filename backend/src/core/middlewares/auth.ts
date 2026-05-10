import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../utils/jwt';
import { UserModel } from '../../modules/users/user.model';

interface JwtPayload {
  userId: string;
  roles: string[];
}

export class AuthMiddleware {
  static requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new Error('Authentication required'));
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken<JwtPayload>(token);
    req.user = { id: payload.userId, roles: payload.roles } as any;
    next();
  }

  static restrictTo(...allowedRoles: string[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const { user } = req as any;
      if (!user || !user.roles.some((role: string) => allowedRoles.includes(role))) {
        return next(new Error('Permission denied'));
      }
      next();
    };
  }
}
