'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Package, Clock, CheckCircle2, Truck, XCircle,
  ChevronDown, ChevronUp, ShoppingBag, RefreshCw, AlertCircle, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utils/format'
import { ordersService } from '@/services/api/orders'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  delivered:  { label: 'Delivered',  icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  shipped:    { label: 'Shipped',    icon: Truck,        color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  processing: { label: 'Processing', icon: Package,      color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  pending:    { label: 'Pending',    icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,      color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  returned:   { label: 'Returned',   icon: RefreshCw,    color: 'text-gray-700',    bg: 'bg-gray-50 border-gray-200' },
}

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  paid:     { label: 'Paid',     color: 'text-emerald-600' },
  pending:  { label: 'Pending',  color: 'text-amber-600' },
  refunded: { label: 'Refunded', color: 'text-purple-600' },
  failed:   { label: 'Failed',   color: 'text-red-600' },
}

const RETURN_REASONS = [
  'Wrong item received',
  'Item damaged or defective',
  'Item not as described',
  'Changed my mind',
  'Size or fit issue',
  'Other',
]

function getDaysLeft(order: any): number | null {
  if (order.status !== 'delivered') return null
  const deliveredAt = order.deliveredAt || order.updatedAt
  const days = 7 - (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24)
  return Math.ceil(days)
}

function ReturnModal({ order, onClose, onSuccess }: { order: any; onClose: () => void; onSuccess: () => void }) {
  const [type, setType] = useState<'return' | 'exchange'>('return')
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      ordersService.requestReturn(order._id || order.id, {
        type,
        reason: reason === 'Other' ? customReason : reason,
      }),
    onSuccess: () => {
      toast.success(`${type === 'return' ? 'Return' : 'Exchange'} request submitted successfully`)
      onSuccess()
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit request')
    },
  })

  const daysLeft = getDaysLeft(order)
  const finalReason = reason === 'Other' ? customReason : reason
  const canSubmit = finalReason.trim().length > 0 && !mutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Return / Exchange Request</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Order #{order.orderNumber || String(order._id || order.id).slice(-8).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 7-day warning */}
          {daysLeft !== null && daysLeft <= 3 && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-medium">
                {daysLeft <= 0
                  ? 'Return window has expired.'
                  : `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your 7-day return window.`}
              </p>
            </div>
          )}

          {/* Type selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Request Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(['return', 'exchange'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
                    type === t
                      ? 'border-hilop-green bg-hilop-green/5 text-hilop-green'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {t === 'return' ? '↩ Return' : '🔄 Exchange'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {type === 'return'
                ? 'Get a full refund to your original payment method.'
                : 'Swap for a different item or variant.'}
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
            <div className="space-y-2">
              {RETURN_REASONS.map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-hilop-green"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{r}</span>
                </label>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea
                rows={3}
                placeholder="Please describe your reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hilop-green/30 focus:border-hilop-green resize-none"
              />
            )}
          </div>

          {/* Policy note */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-500 leading-5">
              <span className="font-semibold text-gray-700">7-Day Return Policy:</span> Requests must be submitted within 7 days of delivery. Items must be unworn and in original packaging with all accessories.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold"
            disabled={!canSubmit}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await ordersService.getOrders()
      return response.data || []
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  })

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => ordersService.updateOrderStatus(orderId, 'cancelled'),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
      setCancellingOrderId(null)
    },
    onError: () => {
      toast.error('Failed to cancel order')
      setCancellingOrderId(null)
    },
  })

  const orders = data || []
  const returnOrder = orders.find((o: any) => (o._id || o.id) === returnOrderId)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage all your Hilop purchases.</p>
        </motion.div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-hilop-green animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading your orders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-red-100">
              <XCircle className="w-12 h-12 text-red-400" />
              <p className="text-red-600 font-medium">Failed to load orders. Please try again later.</p>
              <Button onClick={() => window.location.reload()} className="bg-hilop-green text-black hover:bg-hilop-green/90">
                Try Again
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500 font-medium">No orders found.</p>
              <Button asChild className="bg-hilop-green text-black hover:bg-hilop-green/90">
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            orders.map((order: any, index: number) => {
              const orderId = order._id || order.id
              const statusKey = order.status in STATUS_CONFIG ? order.status : 'pending'
              const status = STATUS_CONFIG[statusKey]
              const payment = PAYMENT_STATUS[order.paymentStatus] || { label: order.paymentStatus, color: 'text-gray-500' }
              const StatusIcon = status.icon
              const isExpanded = expandedId === orderId
              const firstItem = order.items[0]
              const daysLeft = getDaysLeft(order)
              const canReturn = order.status === 'delivered' && !order.returnRequest && daysLeft !== null && daysLeft > 0

              return (
                <motion.div
                  key={orderId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        {firstItem?.productImage ? (
                          <img src={firstItem.productImage} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {firstItem?.productName || 'Order'}
                          {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          #{order.orderNumber || String(orderId).slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total.toLocaleString('en-US')}</p>
                        <p className={`text-xs font-medium ${payment.color}`}>{payment.label}</p>
                      </div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : orderId)}
                        className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-5 space-y-4">
                        {order.items.map((item: any, itemIndex: number) => (
                          <div key={`${item.productId}-${itemIndex}`} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName || 'Product'} className="w-10 h-10 object-contain" />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{item.productName || 'Product'}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900 text-sm flex-shrink-0">{formatPrice(item.price)}</p>
                          </div>
                        ))}

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-sm text-gray-500">Order Total</p>
                          <p className="font-bold text-hilop-green text-lg">₹{order.total.toLocaleString('en-US')}</p>
                        </div>

                        {/* Return request status badge */}
                        {order.returnRequest && (
                          <div className={`rounded-xl p-3 border text-sm flex items-start gap-2 ${
                            order.returnRequest.status === 'approved' ? 'bg-green-50 border-green-200' :
                            order.returnRequest.status === 'rejected' ? 'bg-red-50 border-red-200' :
                            'bg-amber-50 border-amber-200'
                          }`}>
                            <RefreshCw className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              order.returnRequest.status === 'approved' ? 'text-green-600' :
                              order.returnRequest.status === 'rejected' ? 'text-red-500' : 'text-amber-600'
                            }`} />
                            <div>
                              <p className="font-semibold capitalize text-gray-800">
                                {order.returnRequest.type} Request — {order.returnRequest.status}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">Reason: {order.returnRequest.reason}</p>
                              {order.returnRequest.adminNote && (
                                <p className="text-xs text-gray-600 mt-1">Note: {order.returnRequest.adminNote}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2">
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm" className="w-full border-hilop-green text-hilop-green hover:bg-hilop-green hover:text-black">
                              Write a Review
                            </Button>
                          )}

                          {canReturn && (
                            <Button
                              size="sm"
                              className="w-full bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold gap-2"
                              onClick={() => setReturnOrderId(orderId)}
                            >
                              <RefreshCw className="w-4 h-4" />
                              Return / Exchange
                              {daysLeft !== null && daysLeft <= 3 && (
                                <span className="ml-1 bg-black/10 text-black text-xs px-1.5 py-0.5 rounded-full">
                                  {daysLeft}d left
                                </span>
                              )}
                            </Button>
                          )}

                          {order.status === 'delivered' && !order.returnRequest && daysLeft !== null && daysLeft <= 0 && (
                            <p className="text-xs text-center text-gray-400">Return window expired (7-day policy)</p>
                          )}

                          {order.status === 'shipped' && (
                            <Button variant="outline" size="sm" className="w-full">Track Shipment</Button>
                          )}

                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              onClick={() => {
                                setCancellingOrderId(orderId)
                                cancelOrderMutation.mutate(orderId)
                              }}
                              disabled={cancelOrderMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              {cancellingOrderId === orderId && cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Return Modal */}
      <AnimatePresence>
        {returnOrderId && returnOrder && (
          <ReturnModal
            order={returnOrder}
            onClose={() => setReturnOrderId(null)}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['user-orders'] })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
