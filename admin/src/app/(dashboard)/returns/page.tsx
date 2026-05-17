'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  RefreshCw, CheckCircle2, XCircle, Clock, Eye,
  Package, ChevronDown, ChevronUp, MessageSquare,
} from 'lucide-react';

const REQUEST_STATUS = {
  pending:  { label: 'Pending',  color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

function ResolveModal({
  order,
  onClose,
  onSuccess,
}: {
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState<'approved' | 'rejected'>('approved');
  const [adminNote, setAdminNote] = useState('');

  const mutation = useMutation({
    mutationFn: () => orderService.resolveReturn(order._id, { status: resolution, adminNote }),
    onSuccess: () => {
      toast.success(`Request ${resolution} successfully`);
      onSuccess();
      onClose();
    },
    onError: () => toast.error('Failed to resolve request'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resolve Request</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Order #{order.orderNumber || String(order._id).slice(-8).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Request summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold capitalize text-gray-900 dark:text-white">{order.returnRequest?.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reason</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">{order.returnRequest?.reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Requested</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatDate(order.returnRequest?.requestedAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-semibold text-gray-900 dark:text-white">{order.customerName}</span>
            </div>
          </div>

          {/* Resolution selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResolution('approved')}
                className={cn(
                  'py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2',
                  resolution === 'approved'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                )}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => setResolution('rejected')}
                className={cn(
                  'py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2',
                  resolution === 'rejected'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                )}
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {resolution === 'approved'
                ? order.returnRequest?.type === 'return'
                  ? 'Order will be marked as returned and payment status set to refunded.'
                  : 'Order will be moved back to processing for exchange.'
                : 'Request will be rejected. Order status remains unchanged.'}
            </p>
          </div>

          {/* Admin note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Note to Customer <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Approved — please ship the item back within 3 days..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors',
              resolution === 'approved'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-red-600 hover:bg-red-700',
              mutation.isPending && 'opacity-60 cursor-not-allowed'
            )}
          >
            {mutation.isPending ? 'Saving...' : `Confirm ${resolution === 'approved' ? 'Approval' : 'Rejection'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReturnsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolveOrder, setResolveOrder] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['return-requests'],
    queryFn: () => orderService.getReturnRequests(),
    refetchInterval: 10000,
  });

  const filtered = filter === 'all' ? orders : orders.filter((o: any) => o.returnRequest?.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o: any) => o.returnRequest?.status === 'pending').length,
    approved: orders.filter((o: any) => o.returnRequest?.status === 'approved').length,
    rejected: orders.filter((o: any) => o.returnRequest?.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Returns & Exchanges</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Review and resolve customer return and exchange requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all',
              filter === s
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
            )}
          >
            <p className={cn(
              'text-2xl font-bold',
              filter === s ? 'text-blue-600' : 'text-gray-900 dark:text-white'
            )}>
              {counts[s]}
            </p>
            <p className="text-sm text-gray-500 capitalize mt-0.5">{s === 'all' ? 'Total' : s}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500 font-medium">No {filter === 'all' ? '' : filter} requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((order: any) => {
              const req = order.returnRequest;
              const statusCfg = REQUEST_STATUS[req.status as keyof typeof REQUEST_STATUS];
              const isExpanded = expandedId === order._id;

              return (
                <div key={order._id}>
                  {/* Row */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={cn(
                        'p-2.5 rounded-xl flex-shrink-0',
                        req.type === 'return' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
                      )}>
                        <RefreshCw className={cn(
                          'w-5 h-5',
                          req.type === 'return' ? 'text-red-500' : 'text-blue-500'
                        )} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            #{order.orderNumber || String(order._id).slice(-8).toUpperCase()}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', statusCfg.color)}>
                            {statusCfg.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                            {req.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">{order.customerName} · {order.customerEmail}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Reason: {req.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-400">{formatDate(req.requestedAt)}</p>
                      </div>

                      {req.status === 'pending' && (
                        <button
                          onClick={() => setResolveOrder(order)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                          Resolve
                        </button>
                      )}

                      <Link
                        href={`/orders/${order._id}`}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Order items */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
                          <div className="space-y-2">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {item.productImage
                                    ? <img src={item.productImage} alt="" className="w-8 h-8 object-contain" />
                                    : <Package className="w-4 h-4 text-gray-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.productName}</p>
                                  <p className="text-xs text-gray-400">Qty: {item.quantity} · {formatCurrency(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Request details */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type</span>
                              <span className="font-semibold capitalize text-gray-900 dark:text-white">{req.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status</span>
                              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', statusCfg.color)}>
                                {statusCfg.label}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Requested</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{formatDate(req.requestedAt)}</span>
                            </div>
                            {req.resolvedAt && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Resolved</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{formatDate(req.resolvedAt)}</span>
                              </div>
                            )}
                            {req.adminNote && (
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" /> Admin Note
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 text-xs">{req.adminNote}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolveOrder && (
        <ResolveModal
          order={resolveOrder}
          onClose={() => setResolveOrder(null)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['return-requests'] })}
        />
      )}
    </div>
  );
}
