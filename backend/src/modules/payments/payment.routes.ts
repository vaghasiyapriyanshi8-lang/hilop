import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/stripe', PaymentController.createStripePayment);
router.post('/razorpay', PaymentController.createRazorpayPayment);
router.post('/razorpay/verify', PaymentController.verifyRazorpayPayment);
router.post('/webhook', PaymentController.handleWebhook);

export const paymentRoutes = router;
