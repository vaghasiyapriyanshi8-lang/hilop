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
  ExternalLink
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
      return response.data;
    },
  });

  // Fetch recent orders
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders');
      return response.data;
    },
  });

  const recentOrders = ordersResponse?.data?.slice(0, 5) || [];

  const stats = [
    {
      name: 'Total Revenue',
      value: summary?.revenue || 0,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      name: 'Active Users',
      value: summary?.activeUsers || 0,
      change: '+3.2%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      name: 'Conversion Rate',
      value: summary?.conversionRate || 0,
      change: '+0.4%',
      trend: 'up',
      icon: Package,
      color: 'emerald',
    },
    {
      name: 'Total Orders',
      value: summary?.orders || 0,
      change: '-1.5%',
      trend: 'down',
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
            <div className="flex items-center justify-between">
              <div className={cn(
                'p-2 rounded-lg',
                stat.color === 'blue' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                stat.color === 'purple' && 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                stat.color === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                stat.color === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                'flex items-center text-sm font-medium',
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {stat.name.includes('Revenue') ? formatCurrency(stat.value) : stat.value.toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Growth</h3>
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-80">
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
                  tickFormatter={(value) => `$${value}`}
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
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales by Category</h3>
            <button className="text-sm text-blue-600 hover:underline">View details</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.topSellingCategories?.map((cat: string, index: number) => ({ category: cat, sales: [400, 300, 200][index] || 100 })) || []}>
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
                  {(summary?.topSellingCategories || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-xs font-bold">
                        {order.customerName.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{order.customerName}</span>
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
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && !ordersLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
