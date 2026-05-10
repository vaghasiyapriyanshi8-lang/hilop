'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, status],
    queryFn: () => orderService.getOrders(),
  });

  const orders = data?.data || [];
  const filteredOrders = status === 'all' 
    ? orders 
    : orders.filter((o: any) => o.status === status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage customer orders and shipments.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 flex items-center gap-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                      status === s 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Order ID or customer..."
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
            <button className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white">{formatDate(order.createdAt)}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      order.status === 'delivered' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                      order.status === 'processing' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                      order.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                      order.status === 'cancelled' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                      order.status === 'shipped' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'text-xs font-medium',
                      order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                    )}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * 10, data?.total || 0)}</span> of <span className="font-medium text-gray-900 dark:text-white">{data?.total || 0}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data?.hasMore}
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
