'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  onSuccess?: (data?: any) => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setContent('');
      setIsOpen(false);
      onSuccess?.(data);
    },
    onError: (error: any) => {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to submit review');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !title || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    mutation.mutate({
      productId,
      rating,
      title,
      content,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-hilop-green px-6 py-3 font-semibold text-white transition-all hover:bg-hilop-green/90"
      >
        <Star className="h-5 w-5" />
        Add Review
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-6 text-lg font-bold">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-hilop-green text-hilop-green'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your review"
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-hilop-green focus:outline-none focus:ring-2 focus:ring-hilop-green/20"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Detailed Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={5}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-hilop-green focus:outline-none focus:ring-2 focus:ring-hilop-green/20"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 rounded-lg bg-hilop-green px-4 py-2 font-semibold text-white transition-all hover:bg-hilop-green/90 disabled:opacity-50"
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 font-semibold transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
