'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  ChevronLeft,
  Loader2,
  Info,
  Layers,
  DollarSign,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/utils/cn';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be a positive number'),
  oldPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Please select a category'),
  stock: z.number().min(0, 'Stock must be at least 0'),
  sku: z.string().min(3, 'SKU is required'),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  variants: z.array(z.object({
    name: z.string().min(1, 'Variant name required'),
    options: z.string().min(1, 'Options required (comma separated)'),
  })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/products/categories/all');
      return res.data?.data ?? [];
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'active',
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // If there are images, we use FormData. Otherwise, simple JSON.
      if (images.length > 0) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'variants') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        
        images.forEach(image => {
          formData.append('images', image);
        });

        return apiClient.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Just send as JSON if no images are selected
        return apiClient.post('/products', data);
      }
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      router.push('/products');
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/products"
          className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <p className="text-gray-500 dark:text-gray-400">Fill in the details to create a new luxury product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <Info className="w-5 h-5 text-blue-500" />
              General Information
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g. Rolex Submariner Date"
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Describe the product features, history and condition..."
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none",
                    errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
             <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <Layers className="w-5 h-5 text-purple-500" />
              Inventory & Variants
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU
                </label>
                <input
                  {...register('sku')}
                  type="text"
                  placeholder="HIL-RLX-001"
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.sku ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                />
                {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Stock
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.stock ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                />
                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Variants
                </label>
                <button
                  type="button"
                  onClick={() => append({ name: '', options: '' })}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Variant
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex-1 space-y-3">
                    <input
                      {...register(`variants.₹{index}.name`)}
                      placeholder="Variant Name (e.g. Size, Color)"
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      {...register(`variants.₹{index}.options`)}
                      placeholder="Options (comma separated: S, M, L)"
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <Upload className="w-5 h-5 text-emerald-500" />
              Product Images
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] mt-1 text-gray-500">Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Pricing
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base Price (₹)
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  placeholder="0.00"
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.price ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compare Price (₹)
                </label>
                <input
                  {...register('oldPrice', { valueAsNumber: true })}
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <Package className="w-5 h-5 text-blue-500" />
              Organization
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                    errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <option value="">
                    {categoriesData?.length === 0 ? 'No categories yet — add one first' : 'Select Category'}
                  </option>
                  {(categoriesData ?? []).map((cat: any) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
