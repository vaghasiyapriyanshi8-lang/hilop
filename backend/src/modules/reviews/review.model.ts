import { Schema, model, Document } from 'mongoose';

export interface ReviewDocument extends Document {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    indexes: [
      { fields: { productId: 1, createdAt: -1 } },
      { fields: { userId: 1, createdAt: -1 } },
    ],
  }
);

export const ReviewModel = model<ReviewDocument>('Review', reviewSchema);
