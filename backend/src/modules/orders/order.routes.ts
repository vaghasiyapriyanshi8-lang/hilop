import { Router } from 'express';
import { OrderController } from './order.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';

const router = Router();

router.use(AuthMiddleware.requireAuth);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrder);
router.post('/', OrderController.createOrder);
router.patch('/:id/status', AuthMiddleware.restrictTo('admin'), OrderController.updateStatus);

export const orderRoutes = router;
