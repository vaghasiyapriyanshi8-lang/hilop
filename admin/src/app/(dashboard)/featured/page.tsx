'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import {
  Star,
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export default function FeaturedCollectionPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['featured-products', page],
    queryFn: () => productService.getFeaturedProducts({ page, limit: 12 }),
  });

  // Refetch every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => productService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Featured collection updated');
    },
    onError: () => {
      toast.error('Failed to update featured collection');
    },
  });

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedMutation.mutate(id);
  };

  const featuredProducts = data?.products || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Collection</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
              {totalCount} items
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage products that appear in the featured section on the homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            <Package className="w-4 h-4 mr-2" />
            Browse All Products
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {totalCount === 0 && !isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 border-dashed border-2">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Featured Products
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              Your featured collection is empty. Add products to showcase them on the homepage.
              The featured section displays handpicked products to highlight your best offerings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                Browse Products
              </Link>
              <Link
                href="/products/new"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Create New Product
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Products Grid */}
      {totalCount > 0 && (
        <>
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search featured products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts
                .filter((p: any) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
                .map((product: any) => {
                  const productId = product._id || product.id;
                  return (
                    <div key={productId} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-500 text-white">
                            <Star className="w-3 h-3 fill-white mr-1" />
                            Featured
                          </span>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                              Low Stock
                            </span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="font-semibold text-white">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{product.price?.toLocaleString('en-IN') || '0'}
                            </p>
                            {product.oldPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                ₹{product.oldPrice.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'text-xs font-medium',
                              product.stock <= 5 ? 'text-red-600' : 'text-gray-500'
                            )}>
                              {product.stock || 0} in stock
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/products/${productId}`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/products/edit/${productId}`}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => handleToggleFeatured(productId)}
                                className="sr-only peer"
                              />
                              <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-yellow-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-300 transition-colors peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all">
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">{(page - 1) * 12 + 1}</span> to{' '}
                <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * 12, totalCount)}</span> of{' '}
                <span className="font-medium text-gray-900 dark:text-white">{totalCount}</span> featured products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}