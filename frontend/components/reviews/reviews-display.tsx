'use client';

import { Star, Trash2, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsDisplayProps {
  productId: string;
  isUserReview?: boolean;
  currentUserId?: string;
}

export function ReviewsDisplay({ productId, isUserReview = false, currentUserId }: ReviewsDisplayProps) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ rating: number; title: string; content: string } | null>(null);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: isUserReview ? ['user-reviews'] : ['product-reviews', productId],
    queryFn: async () => {
      const endpoint = isUserReview ? '/reviews/user/my-reviews' : `/reviews/product/${productId}`;
      const response = await api.get(endpoint);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({
        queryKey: isUserReview ? ['user-reviews'] : ['product-reviews', productId],
      });
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: any }) => {
      const response = await api.put(`/reviews/${reviewId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Review updated');
      setEditingId(null);
      queryClient.invalidateQueries({
        queryKey: isUserReview ? ['user-reviews'] : ['product-reviews', productId],
      });
    },
    onError: () => {
      toast.error('Failed to update review');
    },
  });

  const reviews = reviewsData?.data || [];

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: Review, index: number) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          {editingId === review._id && editData ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditData({ ...editData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= editData.rating
                            ? 'fill-hilop-green text-hilop-green'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-hilop-green focus:outline-none focus:ring-2 focus:ring-hilop-green/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Content</label>
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-hilop-green focus:outline-none focus:ring-2 focus:ring-hilop-green/20"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      reviewId: review._id,
                      data: editData,
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-lg bg-hilop-green px-4 py-2 font-semibold text-white transition-all hover:bg-hilop-green/90 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditData(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 font-semibold transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-hilop-green text-hilop-green'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-900">{review.title}</h4>
                  <p className="text-xs text-gray-500">
                    by {review.userName} •{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {currentUserId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(review._id);
                        setEditData({
                          rating: review.rating,
                          title: review.title,
                          content: review.content,
                        });
                      }}
                      className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-hilop-green"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(review._id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 text-gray-500 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600">{review.content}</p>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
