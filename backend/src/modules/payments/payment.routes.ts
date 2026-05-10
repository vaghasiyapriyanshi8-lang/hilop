import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/stripe', PaymentController.createStripePayment);
router.post('/razorpay', PaymentController.createRazorpayPayment);
router.post('/webhook', PaymentController.handleWebhook);

export const paymentRoutes = router;
