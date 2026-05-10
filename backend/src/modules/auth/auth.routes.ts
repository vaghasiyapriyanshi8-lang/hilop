import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../core/middlewares/validation';
import { authSchemas } from './auth.validation';

const router = Router();

router.post('/signup', validateBody(authSchemas.signup), AuthController.signup);
router.post('/login', validateBody(authSchemas.login), AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/verify-otp', validateBody(authSchemas.verifyOtp), AuthController.verifyOtp);
router.post('/forgot-password', validateBody(authSchemas.forgotPassword), AuthController.forgotPassword);
router.post('/reset-password', validateBody(authSchemas.resetPassword), AuthController.resetPassword);

export const authRoutes = router;
