import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { ProductModel } from '../products/product.model';

export class ReviewController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, rating, title, content } = req.body;
      const userId = req.userId;
      const userName = req.userName;
      const userEmail = req.userEmail;

      if (!productId || !rating || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const review = await ReviewService.createReview({
        productId,
        userId,
        userName,
        userEmail,
        rating,
        title,
        content,
      });

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const reviews = await ReviewService.getProductReviews(productId);
      const stats = await ReviewService.getReviewStats(productId);

      res.status(200).json({ success: true, data: reviews, stats });
    } catch (error) {
      next(error);
    }
  }

  static async getUserReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const reviews = await ReviewService.getUserReviews(userId);
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }

  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      // Admin only - check if user has admin role
      if (!req.roles?.includes('admin')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const reviews = await ReviewService.getAllReviews();
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const { rating, title, content } = req.body;
      const userId = req.userId;

      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updatedReview = await ReviewService.updateReview(reviewId, {
        rating,
        title,
        content,
      });

      res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const userId = req.userId;
      const isAdmin = req.roles?.includes('admin');

      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // User can only delete their own review, admin can delete any
      if (review.userId !== userId && !isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await ReviewService.deleteReview(reviewId);
      res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getReviewStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const stats = await ReviewService.getReviewStats(productId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  static async getLatestReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit ?? 4);
      const reviews = await ReviewService.getLatestReviews(limit);

      // attach product name/slug if available
      const enriched = await Promise.all(
        reviews.map(async (r) => {
          let productName = '';
          let productSlug = '';
          try {
            const p = await ProductModel.findById(r.productId).lean();
            if (p) {
              productName = p.name;
              productSlug = p.slug;
            }
          } catch (e) {
            // ignore
          }
          return { ...r, productName, productSlug };
        })
      );

      res.status(200).json({ success: true, data: enriched });
    } catch (error) {
      next(error);
    }
  }
}
