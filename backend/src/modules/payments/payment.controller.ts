import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
  static async createStripePayment(req: Request, res: Response) {
    const session = await PaymentService.createStripeSession(req.body);
    res.status(200).json({ data: session });
  }

  static async createRazorpayPayment(req: Request, res: Response) {
    const order = await PaymentService.createRazorpayOrder(req.body);
    res.status(200).json({ data: order, key_id: (req.app.get('config')?.razorpayKeyId || process.env.RAZORPAY_KEY_ID) });
  }

  static async handleWebhook(req: Request, res: Response) {
    await PaymentService.processWebhook(req.body);
    res.status(200).send('received');
  }

  static async verifyRazorpayPayment(req: Request, res: Response) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const ok = await PaymentService.verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    if (!ok) return res.status(400).json({ message: 'Signature verification failed' })
    // Here you would mark order as paid in your DB, create order record, etc.
    res.status(200).json({ message: 'Payment verified' })
  }

  static async getAllPayments(req: Request, res: Response) {
    try {
      const payload = await PaymentService.getAllPayments({
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 10),
        paymentStatus: req.query.paymentStatus as string | undefined,
      });
      res.status(200).json(payload);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }

  static async getPaymentStats(req: Request, res: Response) {
    try {
      const stats = await PaymentService.getPaymentStats();
      res.status(200).json({ data: stats });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ error: 'Failed to fetch payment stats' });
    }
  }
}
