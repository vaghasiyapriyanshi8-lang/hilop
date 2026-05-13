'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
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
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Variant name required'),
        options: z.string().min(1, 'Options required (comma separated)'),
      })
    )
    .optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/admin/by-id/${id}`);
      return res.data?.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: 'active', variants: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description,
        price: data.price,
        oldPrice: data.oldPrice,
        category: data.category,
        stock: data.stock,
        sku: data.sku,
        status: data.status,
        variants: data.variants ?? [],
      });
      setExistingImages(data.images ?? []);
    }
  }, [data, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMutation = useMutation({
    mutationFn: async (formData: ProductFormValues) => {
      if (newImages.length > 0) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'variants') fd.append(key, JSON.stringify(value ?? []));
          else if (value !== undefined) fd.append(key, String(value));
        });
        existingImages.forEach((url) => fd.append('existingImages', url));
        newImages.forEach((img) => fd.append('images', img));
        return apiClient.patch(`/products/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return apiClient.patch(`/products/${id}`, {
        ...formData,
        variants: formData.variants ?? [],
        existingImages,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success('Product updated successfully');
      router.push('/products');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/products" className="text-blue-600 hover:underline text-sm">
          Back to Products
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-500 dark:text-gray-400">Update the product details.</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <Info className="w-5 h-5 text-blue-500" />
              General Information
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all',
                    errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none',
                    errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                <input
                  {...register('sku')}
                  type="text"
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all',
                    errors.sku ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
                {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all',
                    errors.stock ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Variants</label>
                <button
                  type="button"
                  onClick={() => append({ name: '', options: '' })}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Variant
                </button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex-1 space-y-3">
                    <input
                      {...register(`variants.${index}.name`)}
                      placeholder="Variant Name (e.g. Size, Color)"
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      {...register(`variants.${index}.options`)}
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
              {existingImages.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group"
                >
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {newPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group"
                >
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] mt-1 text-gray-500">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold pb-2 border-b border-gray-100 dark:border-gray-800">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Pricing
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price ($)</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all',
                    errors.price ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compare Price ($)</label>
                <input
                  {...register('oldPrice', { valueAsNumber: true })}
                  type="number"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  {...register('category')}
                  className={cn(
                    'w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all',
                    errors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <option value="">Select Category</option>
                  <option value="dress-watches">Dress Watches</option>
                  <option value="luxury-collection">Luxury Collection</option>
                  <option value="smart-watches">Smart Watches</option>
                  <option value="digital-watches">Digital Watches</option>
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
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
            disabled={updateMutation.isPending}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {updateMutation.isPending && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
