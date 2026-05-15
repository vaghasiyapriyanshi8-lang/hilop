import { Router } from 'express';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../../core/middlewares/auth';
import multer from 'multer';
import os from 'os';

const upload = multer({ dest: os.tmpdir() });

const router = Router();

// Category routes
router.get('/categories/list', CategoryController.list);
router.get('/categories/all', CategoryController.getAll);
router.get('/categories/:id', CategoryController.getById);
router.post('/categories', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), CategoryController.create);
router.patch('/categories/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), CategoryController.update);
router.delete('/categories/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), CategoryController.delete);

// Product routes
router.get('/', ProductController.list);
router.get('/admin/all', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.adminList);
router.get('/admin/by-id/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.getProductById);
router.get('/featured', ProductController.getFeatured);
router.get('/admin/featured', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.getFeaturedList);
router.get('/search', ProductController.search);
router.get('/:slug', ProductController.getProduct);
router.post('/', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), upload.array('images'), ProductController.createProduct);
router.patch('/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), upload.array('images'), ProductController.updateProduct);
router.patch('/:id/featured', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.setFeatured);
router.post('/:id/toggle-featured', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.toggleFeatured);
router.delete('/:id', AuthMiddleware.requireAuth, AuthMiddleware.restrictTo('admin'), ProductController.deleteProduct);

export const productRoutes = router;
