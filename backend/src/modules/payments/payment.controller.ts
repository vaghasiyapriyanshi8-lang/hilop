import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
  static async createStripePayment(req: Request, res: Response) {
    const session = await PaymentService.createStripeSession(req.body);
    res.status(200).json({ data: session });
  }

  static async createRazorpayPayment(req: Request, res: Response) {
    const order = await PaymentService.createRazorpayOrder(req.body);
    res.status(200).json({ data: order });
  }

  static async handleWebhook(req: Request, res: Response) {
    await PaymentService.processWebhook(req.body);
    res.status(200).send('received');
  }
}
