import { ReviewModel, ReviewDocument } from './review.model';
import { ProductModel } from '../products/product.model';

export class ReviewService {
  static async createReview(reviewData: {
    productId: string;
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    content: string;
  }): Promise<ReviewDocument> {
    const review = new ReviewModel(reviewData);
    const saved = await review.save();

    // Recalculate product rating and reviews count
    const stats = await this.getReviewStats(reviewData.productId);
    await ProductModel.findByIdAndUpdate(reviewData.productId, {
      rating: stats.averageRating,
      reviewsCount: stats.totalReviews,
    }).catch(() => null);

    return saved;
  }

  static async getProductReviews(productId: string): Promise<ReviewDocument[]> {
    return await ReviewModel.find({ productId, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getLatestReviews(limit = 4): Promise<ReviewDocument[]> {
    return await ReviewModel.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async getAllReviews(): Promise<ReviewDocument[]> {
    return await ReviewModel.find()
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getUserReviews(userId: string): Promise<ReviewDocument[]> {
    return await ReviewModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getReviewById(reviewId: string): Promise<ReviewDocument | null> {
    return await ReviewModel.findById(reviewId).lean();
  }

  static async updateReview(
    reviewId: string,
    updateData: {
      rating?: number;
      title?: string;
      content?: string;
    }
  ): Promise<ReviewDocument | null> {
    const updated = await ReviewModel.findByIdAndUpdate(reviewId, updateData, {
      new: true,
      runValidators: true,
    });

    if (updated) {
      const stats = await this.getReviewStats(updated.productId);
      await ProductModel.findByIdAndUpdate(updated.productId, {
        rating: stats.averageRating,
        reviewsCount: stats.totalReviews,
      }).catch(() => null);
    }

    return updated;
  }

  static async deleteReview(reviewId: string): Promise<ReviewDocument | null> {
    const deleted = await ReviewModel.findByIdAndDelete(reviewId);
    if (deleted) {
      const stats = await this.getReviewStats(deleted.productId);
      await ProductModel.findByIdAndUpdate(deleted.productId, {
        rating: stats.averageRating,
        reviewsCount: stats.totalReviews,
      }).catch(() => null);
    }
    return deleted;
  }

  static async getAverageRating(productId: string): Promise<number> {
    const result = await ReviewModel.aggregate([
      { $match: { productId, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    return result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
  }

  static async getReviewStats(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await ReviewModel.find({ productId, isApproved: true });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    return { averageRating, totalReviews, ratingDistribution };
  }
}
