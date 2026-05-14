import { OrderModel } from './order.model';
import { UserModel } from '../users/user.model';

export class OrderService {
  static async list(userId: string) {
    return OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
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
        return { ...order, customerName: user?.name || 'Unknown', customerEmail: user?.email || '' };
      })
    );

    return { orders: ordersWithCustomer, count, page, limit };
  }

  static async findById(id: string) {
    return OrderModel.findById(id).lean();
  }

  static async create(userId: string, payload: Partial<any>) {
    return OrderModel.create({ userId, ...payload });
  }

  static async updateStatus(id: string, status: string) {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
}
