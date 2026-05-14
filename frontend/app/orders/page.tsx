'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utils/format'

const DUMMY_ORDERS = [
  {
    id: 'ORD-2024-001',
    date: '12 Jan 2025',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay (UPI)',
    total: 129,
    items: [
      { name: 'Hilop Dress Classic', sku: 'HIL-DRS-001', qty: 1, price: 129, image: '/images/watch-elegance.svg' },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '28 Jan 2025',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    total: 244,
    items: [
      { name: 'Hilop Luxury Chronograph', sku: 'HIL-LUX-002', qty: 1, price: 219, image: '/images/watch-midnight.svg' },
      { name: 'Hilop Leather Strap', sku: 'HIL-ACC-010', qty: 1, price: 25, image: '/images/watch-minimal.svg' },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '5 Feb 2025',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay (Net Banking)',
    total: 84,
    items: [
      { name: 'Hilop Smart Series X1', sku: 'HIL-SMT-003', qty: 1, price: 84, image: '/images/watch-digital.svg' },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '10 Feb 2025',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery',
    total: 59,
    items: [
      { name: 'Hilop Urban Steel', sku: 'HIL-URB-004', qty: 1, price: 59, image: '/images/watch-urban.svg' },
    ],
  },
  {
    id: 'ORD-2024-005',
    date: '2 Jan 2025',
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Razorpay (UPI)',
    total: 159,
    items: [
      { name: 'Hilop Aurora Limited', sku: 'HIL-AUR-005', qty: 1, price: 159, image: '/images/watch-aurora.svg' },
    ],
  },
]

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  delivered:  { label: 'Delivered',  icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  shipped:    { label: 'Shipped',    icon: Truck,        color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  processing: { label: 'Processing', icon: Package,      color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  pending:    { label: 'Pending',    icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,      color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
}

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  paid:     { label: 'Paid',     color: 'text-emerald-600' },
  pending:  { label: 'Pending',  color: 'text-amber-600' },
  refunded: { label: 'Refunded', color: 'text-purple-600' },
  failed:   { label: 'Failed',   color: 'text-red-600' },
}

const TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = activeTab === 'All'
    ? DUMMY_ORDERS
    : DUMMY_ORDERS.filter((o) => o.status === activeTab.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage all your Hilop purchases.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ₹{
                activeTab === tab
                  ? 'bg-hilop-green text-black border-hilop-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-hilop-green hover:text-hilop-green'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500 font-medium">No orders found.</p>
              <Button asChild className="bg-hilop-green text-black hover:bg-hilop-green/90">
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            filtered.map((order, index) => {
              const status = STATUS_CONFIG[order.status]
              const payment = PAYMENT_STATUS[order.paymentStatus]
              const StatusIcon = status.icon
              const isExpanded = expandedId === order.id

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <img src={order.items[0].image} alt="" className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ₹{status.bg} ₹{status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total.toLocaleString('en-US')}</p>
                        <p className={`text-xs font-medium ₹{payment.color}`}>{payment.label}</p>
                      </div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-5 space-y-4">
                        {order.items.map((item) => (
                          <div key={item.sku} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-400">SKU: {item.sku} · Qty: {item.qty}</p>
                            </div>
                            <p className="font-bold text-gray-900 text-sm flex-shrink-0">{formatPrice(item.price)}</p>
                          </div>
                        ))}

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-sm text-gray-500">Order Total</p>
                          <p className="font-bold text-hilop-green text-lg">₹{order.total.toLocaleString('en-US')}</p>
                        </div>

                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm" className="w-full border-hilop-green text-hilop-green hover:bg-hilop-green hover:text-black">
                            Write a Review
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button variant="outline" size="sm" className="w-full">
                            Track Shipment
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
