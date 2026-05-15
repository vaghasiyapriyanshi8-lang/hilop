'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

export default function DashboardPage() {
  // Fetch summary data
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/overview');
      return response.data.data; // { revenue, orders, activeUsers, totalProducts, conversionRate, revenueData, categorySales }
    },
  });

  // Fetch recent orders
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/admin/recent');
      return response.data;
    },
  });

  const recentOrders = ordersResponse?.data || [];
  const revenueData = summary?.revenueData || [];
  const categorySales = summary?.categorySales || [];

  const stats = [
    {
      name: 'Total Revenue',
      value: summary?.revenue ?? null,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      name: 'Total Users',
      value: summary?.activeUsers ?? null,
      icon: Users,
      color: 'purple',
    },
    {
      name: 'Total Products',
      value: summary?.totalProducts ?? null,
      icon: Package,
      color: 'emerald',
    },
    {
      name: 'Total Orders',
      value: summary?.orders ?? null,
      icon: ShoppingCart,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className={cn(
              'p-2 rounded-lg inline-flex items-center justify-center',
              stat.color === 'blue' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
              stat.color === 'purple' && 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
              stat.color === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
              stat.color === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {stat.value !== null ? (
                  stat.name === 'Total Revenue' ? formatCurrency(stat.value) : stat.value.toLocaleString()
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">Loading...</span>
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Growth</h3>
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-72 sm:h-80">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales by Category</h3>
            <button className="text-sm text-blue-600 hover:underline">View details</button>
          </div>
          <div className="h-72 sm:h-80">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {categorySales.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No category sales data available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <Link href="/orders" className="text-sm text-blue-600 hover:underline flex items-center">
            View all <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="block sm:hidden p-6 space-y-4">
          {ordersLoading ? (
            <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order: any) => (
              <div key={order._id || order.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">#{order.orderId || order._id?.slice(-6)}</p>
                  </div>
                  <span className={cn(
                    'whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium',
                    order.status === 'delivered' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                    order.status === 'processing' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                    order.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                    order.status === 'cancelled' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Customer</p>
                    <p>{order.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Amount</p>
                    <p>{order.amount ? formatCurrency(order.amount) : 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">Date</p>
                    <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              No recent orders found.
            </div>
          )}
        </div>
        <div className="hidden sm:block overflow-x-auto">
          {ordersLoading ? (
            <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any) => (
                    <tr key={order._id || order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.orderId || order._id?.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-xs font-bold">
                            {(order.customerName || 'N').charAt(0)}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">{order.customerName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium',
                          order.status === 'delivered' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                          order.status === 'processing' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                          order.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                          order.status === 'cancelled' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                        {order.amount ? formatCurrency(order.amount) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
