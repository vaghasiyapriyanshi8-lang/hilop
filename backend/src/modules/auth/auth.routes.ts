import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../core/middlewares/validation';
import { authSchemas } from './auth.validation';

const router = Router();

const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

router.post('/signup', validateBody(authSchemas.signup), asyncHandler(AuthController.signup));
router.post('/register', validateBody(authSchemas.signup), asyncHandler(AuthController.signup));
router.post('/login', validateBody(authSchemas.login), asyncHandler(AuthController.login));
router.post('/google-login', asyncHandler(AuthController.googleLogin));
router.post('/refresh', asyncHandler(AuthController.refreshToken));
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/verify-otp', validateBody(authSchemas.verifyOtp), asyncHandler(AuthController.verifyOtp));
router.post('/forgot-password', validateBody(authSchemas.forgotPassword), asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', validateBody(authSchemas.resetPassword), asyncHandler(AuthController.resetPassword));

export const authRoutes = router;
