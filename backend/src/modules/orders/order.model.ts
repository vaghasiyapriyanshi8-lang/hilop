import { Schema, model, Document } from 'mongoose';

export interface OrderDocument extends Document {
  orderNumber: string;
  userId: string;
  items: Array<{ productId: string; productName?: string; productImage?: string; quantity: number; price: number; variant?: string }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: { line1: string; city: string; country: string; postalCode: string; phone: string };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'stripe' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  trackingNumber?: string;
  returnRequest?: {
    reason: string;
    type: 'return' | 'exchange';
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: Date;
    resolvedAt?: Date;
    adminNote?: string;
  };
  deliveredAt?: Date;
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
    productName: { type: String },
    productImage: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    variant: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, unique: true, sparse: true },
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
    deliveredAt: { type: Date },
    returnRequest: {
      type: new Schema({
        reason: { type: String, required: true },
        type: { type: String, enum: ['return', 'exchange'], required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        requestedAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date },
        adminNote: { type: String },
      }, { _id: false }),
      default: undefined,
    },
  },
  { timestamps: true }
);

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Generate order number: ORD-TIMESTAMP-RANDOM
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

orderSchema.index({ userId: 1, status: 1, paymentStatus: 1 });

export const OrderModel = model<OrderDocument>('Order', orderSchema);
