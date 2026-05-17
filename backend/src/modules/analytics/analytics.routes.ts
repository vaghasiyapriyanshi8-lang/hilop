import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';

const router = Router();

// Public route — no auth required
router.get('/public-stats', AnalyticsController.publicStats);

router.use(AuthMiddleware.requireAuth);
router.get('/overview', AuthMiddleware.restrictTo('admin'), AnalyticsController.overview);

export const analyticsRoutes = router;
