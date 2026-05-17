'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const PAYMENT_STATUS_ICONS: Record<string, React.ElementType> = {
  paid: CheckCircle2,
  pending: Clock,
  failed: XCircle,
  refunded: RefreshCw,
};

const METHOD_LABELS: Record<string, string> = {
  razorpay: 'Razorpay',
  stripe: 'Stripe',
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Credit / Debit Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('all');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, paymentStatus],
    queryFn: async () => {
      const res = await apiClient.get('/orders/admin/all', {
        params: { page, limit, paymentStatus: paymentStatus === 'all' ? undefined : paymentStatus },
      });
      return res.data;
    },
  });

  const orders: any[] = data?.data ?? [];
  const total: number = data?.total ?? 0;

  // Summary stats derived from current page — ideally from a dedicated analytics endpoint
  const { data: analytics } = useQuery({
    queryKey: ['payment-analytics'],
    queryFn: async () => {
      const res = await apiClient.get('/analytics/overview');
      return res.data?.data;
    },
  });

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(analytics?.revenue ?? 0),
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Successful Payments',
      value: orders.filter((o) => o.paymentStatus === 'paid').length,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: 'Pending Payments',
      value: orders.filter((o) => o.paymentStatus === 'pending').length,
      icon: Clock,
      color: 'amber',
    },
    {
      label: 'Failed / Refunded',
      value: orders.filter((o) => ['failed', 'refunded'].includes(o.paymentStatus)).length,
      icon: XCircle,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-500 dark:text-gray-400">Track all transactions, payment statuses and refunds.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className={cn(
              'p-2 rounded-lg inline-flex items-center justify-center mb-4',
              stat.color === 'blue' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
              stat.color === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
              stat.color === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
              stat.color === 'red' && 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            )}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
          {['all', 'paid', 'pending', 'failed', 'refunded'].map((s) => (
            <button
              key={s}
              onClick={() => { setPaymentStatus(s); setPage(1); }}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                paymentStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Payment Status', 'Payment Method', 'Transaction ID', 'Date'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">No payment records found.</td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const StatusIcon = PAYMENT_STATUS_ICONS[order.paymentStatus] ?? Clock;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        #{String(order._id).slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail || ''}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total ?? 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          PAYMENT_STATUS_STYLES[order.paymentStatus] ?? 'bg-gray-100 text-gray-600'
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {order.paymentStatus ?? 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          {METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod ?? 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                        {order.trackingNumber ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        }) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
            <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-white">{total}</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= total}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
