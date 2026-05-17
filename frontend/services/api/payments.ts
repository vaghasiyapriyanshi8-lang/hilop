import api from '@/lib/api'

export const paymentsService = {
  async createRazorpayOrder(data: { amount: number; currency?: string; receipt: string }) {
    const response = await api.post('/payments/razorpay', data)
    return response.data
  },

  async verifyRazorpayPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const response = await api.post('/payments/razorpay/verify', payload)
    return response.data
  },
}

export default paymentsService
