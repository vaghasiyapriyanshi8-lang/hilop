'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'sonner';
import { Trash2, Star, Loader2 } from 'lucide-react';

interface Review {
  _id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbacksPage() {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'highest' | 'lowest'>('latest');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/admin/all');
      return response.data.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });

  const reviews = reviewsData || [];

  let sortedReviews = [...reviews];
  if (sortBy === 'latest') {
    sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'oldest') {
    sortedReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === 'highest') {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'lowest') {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-hilop-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Customer Feedbacks</h1>
        <p className="mt-2 text-slate-400">Manage all customer reviews and ratings</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-300">
          Total Reviews: <span className="text-hilop-green">{reviews.length}</span>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 focus:border-hilop-green focus:outline-none focus:ring-2 focus:ring-hilop-green/20"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {sortedReviews.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-12 text-center">
          <p className="text-slate-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review: Review, index: number) => (
            <div
              key={review._id}
              className="rounded-lg border border-slate-700 bg-slate-800 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
                      {review.rating}.0 / 5
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-100">{review.title}</h3>
                  <p className="mb-4 text-slate-300">{review.content}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-200">{review.userName}</span>
                      <p className="text-slate-400">{review.userEmail}</p>
                    </div>
                    <div className="border-l border-slate-700 pl-4 text-slate-400">
                      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs">{new Date(review.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this review?')) {
                      deleteMutation.mutate(review._id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="ml-4 rounded-lg p-2 text-slate-400 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
