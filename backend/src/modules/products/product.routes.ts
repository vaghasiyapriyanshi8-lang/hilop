import { Router } from 'express';
import { ProductController } from './product.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';

const router = Router();

router.get('/', ProductController.list);
router.get('/categories', ProductController.getCategories);
router.get('/search', ProductController.search);
router.get('/:slug', ProductController.getProduct);
router.post('/', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.createProduct);
router.patch('/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.updateProduct);
router.delete('/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.deleteProduct);

export const productRoutes = router;
