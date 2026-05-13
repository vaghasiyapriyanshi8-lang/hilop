import { Router } from 'express';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';

const router = Router();

router.use(AuthMiddleware.requireAuth);
router.get('/', AuthMiddleware.restrictTo('admin'), UserController.listUsers);
router.get('/me', UserController.getCurrentUser);
router.patch('/me', UserController.updateProfile);
router.patch('/:id/block', AuthMiddleware.restrictTo('admin'), UserController.blockUser);
router.post('/:id/email', AuthMiddleware.restrictTo('admin'), UserController.sendEmail);
router.delete('/:id', AuthMiddleware.restrictTo('admin'), UserController.deleteUser);

export const userRoutes = router;
