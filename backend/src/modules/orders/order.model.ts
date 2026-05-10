import { Schema, model, Document } from 'mongoose';

export interface OrderDocument extends Document {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number; variant?: string }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: { line1: string; city: string; country: string; postalCode: string; phone: string };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'stripe' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema(
  {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    variant: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: 'ObjectId' as any, ref: 'User', required: true, index: true },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    status: { type: String, default: 'pending', index: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending', index: true },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, status: 1, paymentStatus: 1 });

export const OrderModel = model<OrderDocument>('Order', orderSchema);
