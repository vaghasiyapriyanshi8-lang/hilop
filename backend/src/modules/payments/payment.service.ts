import Razorpay from 'razorpay'
import crypto from 'crypto'
import { config } from '../../config'
import { OrderModel } from '../orders/order.model'
import { UserModel } from '../users/user.model'

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
})

export class PaymentService {
  static async createStripeSession(payload: {
    amount: number;
    currency: string;
    userId: string;
  }): Promise<unknown> {
    // Stripe still supported elsewhere; keep stub if Stripe configured
    return null
  }

  static async createRazorpayOrder(payload: { amount: number; currency: string; receipt: string }): Promise<any> {
    // Razorpay expects amount in smallest currency unit (e.g., paise)
    const options = {
      amount: payload.amount,
      currency: payload.currency || 'INR',
      receipt: payload.receipt,
      payment_capture: 1,
    }

    const order: any = await (razorpay.orders as any).create(options)
    return order
  }

  static async verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const generated = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    return generated === razorpay_signature
  }

  static async processWebhook(_body: any) {
    // implement webhook processing as needed (payment events, refunds, etc.)
    return true
  }

  static async getAllPayments(query: { page?: number; limit?: number; paymentStatus?: string }) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const filter: any = {}
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus

    const [payments, count] = await Promise.all([
      OrderModel.find(filter)
        .select('_id orderNumber total paymentMethod paymentStatus createdAt userId shippingAddress')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments(filter),
    ])

    const paymentsWithCustomer = await Promise.all(
      payments.map(async (payment: any) => {
        const user = await UserModel.findById(payment.userId).select('name email').lean()
        return {
          ...payment,
          customerName: user?.name || 'Unknown',
          customerEmail: user?.email || '',
        }
      })
    )

    return {
      data: paymentsWithCustomer,
      total: count,
      page,
      limit,
      hasMore: page * limit < count,
    }
  }

  static async getPaymentStats() {
    const [totalRevenue, paidCount, pendingCount, failedCount] = await Promise.all([
      OrderModel.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      OrderModel.countDocuments({ paymentStatus: 'paid' }),
      OrderModel.countDocuments({ paymentStatus: 'pending' }),
      OrderModel.countDocuments({ paymentStatus: { $in: ['failed', 'refunded'] } }),
    ])

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      paidCount,
      pendingCount,
      failedCount,
    }
  }
}
