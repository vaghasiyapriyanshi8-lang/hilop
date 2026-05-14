import { Request, Response } from 'express';
import { OrderService } from './order.service';

export class OrderController {
  static async getOrders(req: Request, res: Response) {
    const orders = await OrderService.list((req as any).user.id);
    res.status(200).json({ data: orders });
  }

  static async adminGetRecentOrders(req: Request, res: Response) {
    const orders = await OrderService.adminListRecent(5);
    res.status(200).json({ data: orders });
  }

  static async adminGetAllOrders(req: Request, res: Response) {
    const payload = await OrderService.adminListAll({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      paymentStatus: req.query.paymentStatus as string | undefined,
    });
    res.status(200).json(payload);
  }

  static async getOrder(req: Request, res: Response) {
    const order = await OrderService.findById(req.params.id);
    res.status(200).json({ data: order });
  }

  static async createOrder(req: Request, res: Response) {
    const order = await OrderService.create((req as any).user.id, req.body);
    res.status(201).json({ data: order });
  }

  static async updateStatus(req: Request, res: Response) {
    const order = await OrderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ data: order });
  }
}
