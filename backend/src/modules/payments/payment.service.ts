import Stripe from 'stripe';
import { config } from '../../config';

const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-08-01' });

export class PaymentService {
  static async createStripeSession(payload: { amount: number; currency: string; userId: string }) {
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: payload.currency, product_data: { name: 'Hilop order' }, unit_amount: payload.amount }, quantity: 1 }],
      success_url: `${config.frontendUrl}/checkout/success`,
      cancel_url: `${config.frontendUrl}/checkout/failure`,
    });
  }

  static async createRazorpayOrder(payload: { amount: number; currency: string; receipt: string }) {
    return { id: `rzp_order_${payload.receipt}`, amount: payload.amount, currency: payload.currency };
  }

  static async processWebhook(_body: any) {
    return true;
  }
}
