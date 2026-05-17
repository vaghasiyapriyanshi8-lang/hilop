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
    try {
      const order = await OrderService.create((req as any).user.id, req.body);
      res.status(201).json({ data: order });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create order' 
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const order = await OrderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ data: order });
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const userId = (req as any).user.id;
      const order = await OrderService.cancelOrder(orderId, userId);
      res.status(200).json({ data: order });
    } catch (error) {
      console.error('Order cancellation error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to cancel order' });
    }
  }

  static async requestReturn(req: Request, res: Response) {
    try {
      const { reason, type } = req.body;
      if (!reason || !type) return res.status(400).json({ message: 'Reason and type are required' });
      if (!['return', 'exchange'].includes(type)) return res.status(400).json({ message: 'Type must be return or exchange' });
      const order = await OrderService.requestReturn(req.params.id, (req as any).user.id, { reason, type });
      res.status(200).json({ data: order });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message || 'Failed to submit request' });
    }
  }

  static async resolveReturn(req: Request, res: Response) {
    try {
      const { status, adminNote } = req.body;
      if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected' });
      const order = await OrderService.resolveReturn(req.params.id, { status, adminNote });
      res.status(200).json({ data: order });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message || 'Failed to resolve request' });
    }
  }
}
