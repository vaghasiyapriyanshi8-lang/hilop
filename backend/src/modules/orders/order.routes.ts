import { Router } from 'express';
import { OrderController } from './order.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';

const router = Router();

router.use(AuthMiddleware.requireAuth);
router.get('/admin/recent', AuthMiddleware.restrictTo('admin'), OrderController.adminGetRecentOrders);
router.get('/admin/all', AuthMiddleware.restrictTo('admin'), OrderController.adminGetAllOrders);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrder);
router.post('/', OrderController.createOrder);
router.patch('/:id/status', AuthMiddleware.restrictTo('admin'), OrderController.updateStatus);

export const orderRoutes = router;
