import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBook } from '@/api/books';
import { getBookReviews, createReview } from '@/api/reviews';
import { addToCart } from '@/api/cart';
import { useAppDispatch } from '@/store';
import { setCartCount } from '@/store/cartSlice';
import { ChevronRight, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BookDetailSkeleton } from '@/components/Skeleton';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [reviewStar, setReviewStar] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(Number(id)),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getBookReviews(Number(id), { limit: 6 }),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(Number(id)),
    onSuccess: () => {
      toast.success('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Optimistically bump cart badge
      const current = queryClient.getQueryData<{ items: unknown[] }>(['cart']);
      if (current) dispatch(setCartCount(current.items.length + 1));
    },
    onError: () => toast.error('Failed to add to cart'),
  });

  const createReviewMutation = useMutation({
    mutationFn: () => createReview({ bookId: Number(id), star: reviewStar, comment: reviewComment }),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewStar(5);
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
    onError: () => toast.error('Failed to submit review'),
  });

  if (isLoading) return <BookDetailSkeleton />;

  if (isError || !book) return (
    <div className="flex flex-col items-center justify-center gap-[16px] py-[64px]">
      <AlertCircle className="h-[48px] w-[48px] text-[var(--color-accent-red)]" />
      <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
        Failed to load book
      </p>
      <Link
        to="/books"
        className="flex h-[40px] items-center justify-center rounded-[100px] px-[24px] text-sm font-bold"
        style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}
      >
        Back to Books
      </Link>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-[64px]">
      {/* Breadcrumb + Book Info */}
      <div className="flex flex-col gap-[24px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-[4px]">
          <Link to="/books" className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>Home</Link>
          <ChevronRight className="h-4 w-4 text-[var(--color-neutral-500)]" />
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{book.category.name}</span>
          <ChevronRight className="h-4 w-4 text-[var(--color-neutral-500)]" />
          <span className="line-clamp-1 text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{book.title}</span>
        </div>

        {/* Book main info — responsive: stacked on mobile, side-by-side on md+ */}
        <div className="flex flex-col gap-[24px] md:flex-row md:gap-[36px]">
          {/* Cover image */}
          <div className="h-[300px] w-full overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)] md:h-[498px] md:w-[337px] md:shrink-0">
            {book.coverImage
              ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
              : <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-neutral-400)]">No Image</div>
            }
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <span className="w-fit rounded-[100px] border border-[var(--color-neutral-300)] px-[16px] py-[4px] text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                {book.category.name}
              </span>
              <h1 className="text-display-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                {book.title}
              </h1>
              <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                {book.author.name}
              </p>
              <div className="flex items-center gap-[8px]">
                <Star className="h-6 w-6 fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]" />
                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex gap-[20px] border-y border-[var(--color-neutral-200)] py-[16px]">
              <div>
                <span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.stock}</span>
                <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Stock</span>
              </div>
              <div className="h-full w-px bg-[var(--color-neutral-300)]" />
              <div>
                <span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.averageRating.toFixed(1)}</span>
                <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Rating</span>
              </div>
              <div className="h-full w-px bg-[var(--color-neutral-300)]" />
              <div>
                <span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.totalReviews}</span>
                <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Reviews</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-[12px] text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>Description</h3>
              <p className="text-md" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)', lineHeight: '1.7' }}>
                {book.description || 'No description available.'}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => addToCartMutation.mutate()}
              disabled={book.availableStock === 0 || addToCartMutation.isPending}
              className="h-[48px] w-fit rounded-[100px] bg-[var(--color-primary-300)] px-[32px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-family-quicksand)' }}
            >
              {addToCartMutation.isPending ? 'Adding...' : book.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-[var(--color-neutral-200)] pt-[32px]">
        <h2 className="mb-[24px] text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>Reviews</h2>

        {/* Review Form */}
        <div className="mb-[24px] rounded-[12px] border border-[var(--color-neutral-200)] p-[24px]">
          <p className="mb-[12px] text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
            Write a Review
          </p>
          <div className="mb-[16px] flex gap-[8px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setReviewStar(s)}>
                <Star className={`h-6 w-6 transition-colors ${s <= reviewStar ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-neutral-300)]'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            className="mb-[16px] w-full rounded-[12px] border border-[var(--color-neutral-300)] p-[16px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)]"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
          />
          <button
            onClick={() => createReviewMutation.mutate()}
            disabled={createReviewMutation.isPending}
            className="h-[48px] rounded-[100px] bg-[var(--color-primary-300)] px-[32px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-family-quicksand)' }}
          >
            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {/* Review list */}
        {reviewsData?.data.length === 0 ? (
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
            {reviewsData?.data.map((r) => (
              <div key={r.id} className="rounded-[12px] border border-[var(--color-neutral-200)] bg-white p-[24px]">
                <div className="mb-[12px] flex items-center gap-[12px]">
                  {/* User avatar */}
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-700))' }}>
                    {r.user.profilePhoto
                      ? <img src={r.user.profilePhoto} alt={r.user.name} className="h-full w-full rounded-full object-cover" />
                      : <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                          {r.user.name.charAt(0).toUpperCase()}
                        </span>
                    }
                  </div>
                  <div>
                    <p className="font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                      {r.user.name}
                    </p>
                    <div className="flex gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-[14px] w-[14px] ${i < r.star ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-neutral-300)]'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
