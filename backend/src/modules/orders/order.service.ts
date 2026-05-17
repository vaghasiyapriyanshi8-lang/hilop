import { OrderModel } from './order.model';
import { UserModel } from '../users/user.model';

export class OrderService {
  static async list(userId: string) {
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return orders.map((order) => ({ ...order, id: (order as any)._id.toString() }));
  }

  static async adminListRecent(limit = 5) {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return Promise.all(
      orders.map(async (order) => {
        const user = await UserModel.findById(order.userId).select('name email').lean();
        return {
          ...order,
          id: (order as any)._id.toString(),
          customerName: user?.name || 'Unknown',
          customerEmail: user?.email || '',
        };
      })
    );
  }

  static async adminListAll(query: { page?: number; limit?: number; paymentStatus?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: any = {};
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;

    const [orders, count] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      OrderModel.countDocuments(filter),
    ]);

    const ordersWithCustomer = await Promise.all(
      orders.map(async (order) => {
        const user = await UserModel.findById(order.userId).select('name email').lean();
        return { 
          ...order, 
          id: (order as any)._id.toString(),
          customerName: user?.name || 'Unknown', 
          customerEmail: user?.email || '' 
        };
      })
    );

    return { 
      data: ordersWithCustomer, 
      total: count, 
      page, 
      limit,
      hasMore: page * limit < count
    };
  }

  static async findById(id: string) {
    const order = await OrderModel.findById(id).lean();
    if (!order) return null;
    
    // Enrich with customer data
    const user = await UserModel.findById(order.userId).select('name email').lean();
    return {
      ...order,
      id: (order as any)._id.toString(),
      customerName: user?.name || 'Unknown',
      customerEmail: user?.email || '',
    };
  }

  static async create(userId: string, payload: Partial<any>) {
    try {
      // Process items - ensure all required fields are present
      const processedItems = (payload.items || []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName || 'Unknown Product',
        productImage: item.productImage || '',
        quantity: item.quantity || 1,
        price: item.price || 0,
        variant: item.variant,
      }));

      // Create order with processed items
      const orderPayload = {
        ...payload,
        items: processedItems,
      };

      const order = await OrderModel.create({ userId, ...orderPayload });
      const orderObj = order.toObject ? order.toObject() : order;
      return { ...orderObj, id: (orderObj as any)._id.toString() };
    } catch (error: any) {
      // Handle E11000 duplicate key error (unique index violation)
      if (error.code === 11000 && error.keyPattern?.orderNumber) {
        console.error('Duplicate orderNumber - generating new one');
        // Retry with explicit order number
        const newOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const processedItems = (payload.items || []).map((item: any) => ({
          productId: item.productId,
          productName: item.productName || 'Unknown Product',
          productImage: item.productImage || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          variant: item.variant,
        }));

        try {
          const order = await OrderModel.create({ userId, orderNumber: newOrderNumber, ...payload, items: processedItems });
          return order.toObject ? order.toObject() : order;
        } catch (retryError) {
          throw retryError;
        }
      }
      
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error.message || 'Unknown error'}`);
    }
  }

  static async updateStatus(id: string, status: string) {
    const updateData: any = { status };
    if (status === 'delivered') updateData.deliveredAt = new Date();
    const order = await OrderModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!order) return null;
    return { ...order, id: (order as any)._id.toString() };
  }

  static async requestReturn(orderId: string, userId: string, payload: { reason: string; type: 'return' | 'exchange' }) {
    const order = await OrderModel.findById(orderId).lean();
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    if (order.userId.toString() !== userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 403 });
    if (order.status !== 'delivered') throw Object.assign(new Error('Only delivered orders can be returned or exchanged'), { statusCode: 400 });
    if (order.returnRequest) throw Object.assign(new Error('A return/exchange request already exists for this order'), { statusCode: 400 });

    // 7-day window from deliveredAt (fallback to updatedAt)
    const deliveredAt = (order as any).deliveredAt || order.updatedAt;
    const daysSinceDelivery = (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 7) throw Object.assign(new Error('Return/exchange window of 7 days has expired'), { statusCode: 400 });

    const updated = await OrderModel.findByIdAndUpdate(
      orderId,
      { returnRequest: { reason: payload.reason, type: payload.type, status: 'pending', requestedAt: new Date() } },
      { new: true }
    ).lean();
    return { ...updated, id: (updated as any)._id.toString() };
  }

  static async resolveReturn(orderId: string, resolution: { status: 'approved' | 'rejected'; adminNote?: string }) {
    const order = await OrderModel.findById(orderId).lean();
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    if (!order.returnRequest) throw Object.assign(new Error('No return request found'), { statusCode: 400 });

    const updateData: any = {
      'returnRequest.status': resolution.status,
      'returnRequest.resolvedAt': new Date(),
      'returnRequest.adminNote': resolution.adminNote || '',
    };
    if (resolution.status === 'approved') {
      updateData.status = order.returnRequest.type === 'return' ? 'returned' : 'processing';
      if (order.returnRequest.type === 'return') updateData.paymentStatus = 'refunded';
    }

    const updated = await OrderModel.findByIdAndUpdate(orderId, updateData, { new: true }).lean();
    return { ...updated, id: (updated as any)._id.toString() };
  }

  static async cancelOrder(orderId: string, userId: string) {
    // Find the order
    const order = await OrderModel.findById(orderId).lean();
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if the order belongs to the user
    if (order.userId.toString() !== userId) {
      throw new Error('Unauthorized: You can only cancel your own orders');
    }

    // Check if the order can be cancelled
    const nonCancellableStatuses = ['shipped', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Update order status to cancelled
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { status: 'cancelled' }, { new: true }).lean();
    if (!updatedOrder) return null;
    return { ...updatedOrder, id: (updatedOrder as any)._id.toString() };
  }
}
