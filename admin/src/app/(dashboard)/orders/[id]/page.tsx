'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Printer, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => apiClient.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order status updated');
    },
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.orderId}</h1>
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
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h4>
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
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(order.total)}</span>
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
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID: {order.transactionId}</p>
              </div>
              <div className="ml-auto">
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                  order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                )}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Customer Details</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                  {order.customerName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                  <Link href={`/users/${order.customerId}`} className="text-xs text-blue-600 hover:underline flex items-center">
                    View profile <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {order.customerEmail}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {order.customerPhone || 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Address</h3>
              <Truck className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Shipping Method</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{order.shippingMethod || 'Standard Shipping'}</p>
              <p className="text-xs text-gray-500 mt-1">Tracking ID: {order.trackingId || 'Pending'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
