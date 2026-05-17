'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { orderService } from '@/services/orderService';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  ChevronLeft, Printer, Truck, Package, CheckCircle2, 
  Clock, CreditCard, User, Mail, Phone, MapPin, RefreshCw, XCircle, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [returnNote, setReturnNote] = useState('');
  const [returnResolution, setReturnResolution] = useState<'approved' | 'rejected'>('approved');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data?.data || response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => apiClient.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order status updated');
    },
  });

  const resolveReturnMutation = useMutation({
    mutationFn: () => orderService.resolveReturn(id as string, { status: returnResolution, adminNote: returnNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['return-requests'] });
      toast.success(`Return request ${returnResolution}`);
    },
    onError: () => toast.error('Failed to resolve return request'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const steps = [
    { name: 'Pending', icon: Clock, status: 'pending' },
    { name: 'Processing', icon: Package, status: 'processing' },
    { name: 'Shipped', icon: Truck, status: 'shipped' },
    { name: 'Delivered', icon: CheckCircle2, status: 'delivered' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.orderNumber || order._id}</h1>
            <p className="text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </button>
          <select 
            value={order.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value)}
            className="bg-blue-600 text-white border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="pending">Mark as Pending</option>
            <option value="processing">Mark as Processing</option>
            <option value="shipped">Mark as Shipped</option>
            <option value="delivered">Mark as Delivered</option>
            <option value="cancelled">Mark as Cancelled</option>
            <option value="returned">Mark as Returned</option>
          </select>
        </div>
      </div>

      {/* Order Status Progress */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.name} className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500',
                  isCompleted ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  'mt-3 text-xs font-semibold',
                  isCompleted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                )}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'absolute left-[3rem] top-6 w-[calc(100vw/4-3rem)] h-1 -z-10',
                    index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Items and Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items?.map((item: any, idx: number) => (
                <div key={`${item.productId}-${idx}`} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.productName || 'Product'}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Variant: {item.variant || 'Standard'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>{formatCurrency(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(order.total || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Information</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{order.paymentMethod || 'N/A'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status: {order.paymentStatus || 'pending'}</p>
              </div>
              <div className="ml-auto">
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                  order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                )}>
                  {order.paymentStatus || 'pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Return / Exchange Request */}
          {order.returnRequest && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-5">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Return / Exchange Request</h3>
                <span className={cn(
                  'ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
                  order.returnRequest.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                  order.returnRequest.status === 'approved' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                  order.returnRequest.status === 'rejected' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                )}>
                  {order.returnRequest.status}
                </span>
              </div>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold capitalize text-gray-900 dark:text-white">{order.returnRequest.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Reason</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">{order.returnRequest.reason}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Requested At</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatDate(order.returnRequest.requestedAt)}</span>
                </div>
                {order.returnRequest.resolvedAt && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500">Resolved At</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatDate(order.returnRequest.resolvedAt)}</span>
                  </div>
                )}
                {order.returnRequest.adminNote && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MessageSquare className="w-3 h-3" /> Admin Note</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{order.returnRequest.adminNote}</p>
                  </div>
                )}
              </div>

              {/* Resolve form — only if pending */}
              {order.returnRequest.status === 'pending' && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resolve this request</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setReturnResolution('approved')}
                      className={cn(
                        'py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2',
                        returnResolution === 'approved'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500'
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setReturnResolution('rejected')}
                      className={cn(
                        'py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2',
                        returnResolution === 'rejected'
                          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500'
                      )}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Note to customer (optional)..."
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={() => resolveReturnMutation.mutate()}
                    disabled={resolveReturnMutation.isPending}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors',
                      returnResolution === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700',
                      resolveReturnMutation.isPending && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {resolveReturnMutation.isPending ? 'Saving...' : `Confirm ${returnResolution === 'approved' ? 'Approval' : 'Rejection'}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Customer Details</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                  {order.customerName?.[0] || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{order.customerName || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {order.customerEmail || 'Not provided'}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {order.shippingAddress?.phone || 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Address</h3>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress?.line1}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.postalCode}</p>
              <p className="text-xs text-gray-500 mt-2">Phone: {order.shippingAddress?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
