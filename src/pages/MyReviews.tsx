import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMyReviews } from '@/api/me';
import { deleteReview } from '@/api/reviews';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function MyReviews() {
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => getMyReviews(),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[32px]">
      <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        My Reviews
      </h1>

      {reviewsData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <MessageSquare className="mb-[16px] h-[48px] w-[48px] text-[var(--color-neutral-300)]" />
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            No reviews yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
          {reviewsData?.data.map((review) => (
            <div key={review.id} className="rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]">
              <div className="mb-[16px] flex gap-[16px]">
                <Link to={`/books/${review.book?.id}`} className="h-[100px] w-[66px] overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
                  {review.book?.coverImage ? (
                    <img src={review.book.coverImage} alt={review.book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-neutral-400)]">No Image</div>
                  )}
                </Link>
                <div className="flex-1">
                  <Link to={`/books/${review.book?.id}`}>
                    <h3 className="mb-[4px] text-md font-bold transition-colors hover:text-[var(--color-primary-300)]" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                      {review.book?.title}
                    </h3>
                  </Link>
                  <div className="mb-[8px] flex gap-[4px]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-[16px] w-[16px] ${i < review.star ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-neutral-300)]'}`} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {review.comment && (
                <p className="mb-[16px] text-sm font-regular" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                  {review.comment}
                </p>
              )}

              <button
                onClick={() => deleteReviewMutation.mutate(review.id)}
                disabled={deleteReviewMutation.isPending}
                className="flex items-center gap-[8px] text-sm font-bold transition-opacity hover:opacity-70 disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-accent-red)' }}
              >
                <Trash2 className="h-[16px] w-[16px]" />
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
