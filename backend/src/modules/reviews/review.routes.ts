import express, { NextFunction, Request, Response } from 'express';
import { ReviewController } from './review.controller';
import { authenticate } from '../../core/middlewares/authenticate';

const reviewRoutes = express.Router();

const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

// Public routes
reviewRoutes.get('/product/:productId', asyncHandler(ReviewController.getProductReviews));
reviewRoutes.get('/stats/:productId', asyncHandler(ReviewController.getReviewStats));
reviewRoutes.get('/latest', asyncHandler(ReviewController.getLatestReviews));

// Protected routes (require authentication)
reviewRoutes.post('/', authenticate, asyncHandler(ReviewController.createReview));
reviewRoutes.get('/user/my-reviews', authenticate, asyncHandler(ReviewController.getUserReviews));
reviewRoutes.put('/:reviewId', authenticate, asyncHandler(ReviewController.updateReview));
reviewRoutes.delete('/:reviewId', authenticate, asyncHandler(ReviewController.deleteReview));

// Admin routes
reviewRoutes.get('/admin/all', authenticate, asyncHandler(ReviewController.getAllReviews));

export { reviewRoutes };
