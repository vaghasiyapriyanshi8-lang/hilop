'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Image as ImageIcon, 
  Tag, 
  Bell, 
  ToggleLeft, 
  ToggleRight,
  Calendar,
  Percent
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('banners');
  const queryClient = useQueryClient();

  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await apiClient.get('/content/banners');
      return response.data;
    },
    enabled: activeTab === 'banners',
  });

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const response = await apiClient.get('/content/coupons');
      return response.data;
    },
    enabled: activeTab === 'coupons',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage banners, coupons, and notifications.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          {activeTab === 'banners' ? 'Add Banner' : activeTab === 'coupons' ? 'Create Coupon' : 'New Notification'}
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800">
        {[
          { id: 'banners', label: 'Banners', icon: ImageIcon },
          { id: 'coupons', label: 'Coupons', icon: Tag },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners?.map((banner: any) => (
            <div key={banner.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg text-gray-600 hover:text-blue-600 shadow-sm backdrop-blur-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg text-gray-600 hover:text-red-600 shadow-sm backdrop-blur-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{banner.title}</h3>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                    banner.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  )}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{banner.description}</p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-xs text-gray-400">Position: {banner.position}</span>
                   <button className="text-xs font-semibold text-blue-600 hover:underline">Manage Link</button>
                </div>
              </div>
            </div>
          ))}
          {(!banners || banners.length === 0) && !bannersLoading && (
            <div className="col-span-full py-20 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-gray-500">
               <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
               <p>No banners found. Start by adding one!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
           <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {coupons?.map((coupon: any) => (
                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-emerald-600">
                      <Percent className="w-4 h-4 mr-1" />
                      {coupon.discount}% Off
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {coupon.usedCount} / {coupon.limit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <button className="focus:outline-none">
                        {coupon.isActive ? (
                          <ToggleRight className="w-8 h-8 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                        )}
                     </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
