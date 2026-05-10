import { OrderModel } from './order.model';

export class OrderService {
  static async list(userId: string) {
    return OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
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
