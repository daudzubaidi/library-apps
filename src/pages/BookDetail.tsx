import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBook } from '@/api/books';
import { getBookReviews, createReview } from '@/api/reviews';
import { addToCart } from '@/api/cart';
import { ChevronRight, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [reviewStar, setReviewStar] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { data: book, isLoading } = useQuery({
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
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: () => createReview({ bookId: Number(id), star: reviewStar, comment: reviewComment }),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
  });

  if (isLoading || !book) return <div>Loading...</div>;

  return (
    <div className="flex w-full flex-col gap-[64px]">
      {/* Breadcrumb + Book Info */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-center gap-[4px]">
          <Link to="/books" className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{book.category.name}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{book.title}</span>
        </div>

        <div className="flex gap-[36px]">
          <div className="h-[498px] w-[337px] overflow-hidden rounded-[8px]">
            {book.coverImage ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[var(--color-neutral-100)]">No Image</div>}
          </div>

          <div className="flex flex-1 flex-col gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <span className="w-fit rounded-[100px] border border-[var(--color-neutral-300)] px-[16px] py-[4px] text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{book.category.name}</span>
              <h1 className="text-display-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{book.title}</h1>
              <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{book.author.name}</p>
              <div className="flex items-center gap-[8px]">
                <Star className="h-6 w-6 fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]" />
                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.averageRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex gap-[20px] border-y border-[var(--color-neutral-200)] py-[16px]">
              <div><span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.stock}</span><span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Stock</span></div>
              <div className="h-full w-px bg-[var(--color-neutral-300)]" />
              <div><span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.averageRating.toFixed(1)}</span><span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Rating</span></div>
              <div className="h-full w-px bg-[var(--color-neutral-300)]" />
              <div><span className="block text-display-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.totalReviews}</span><span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>Reviews</span></div>
            </div>

            <div>
              <h3 className="mb-[12px] text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>Description</h3>
              <p className="text-md" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{book.description || 'No description.'}</p>
            </div>

            <div className="flex gap-[12px]">
              <button onClick={() => addToCartMutation.mutate()} disabled={book.availableStock === 0} className="h-[48px] rounded-[100px] bg-[var(--color-primary-300)] px-[32px] font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{book.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-[var(--color-neutral-200)] pt-[32px]">
        <h2 className="mb-[24px] text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>Reviews</h2>
        <div className="mb-[24px] rounded-[12px] border border-[var(--color-neutral-200)] p-[24px]">
          <div className="mb-[16px] flex gap-[8px]">
            {[1,2,3,4,5].map(s => <button key={s} onClick={() => setReviewStar(s)}><Star className={`h-6 w-6 ${s <= reviewStar ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-neutral-300)]'}`} /></button>)}
          </div>
          <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write your review..." rows={4} className="mb-[16px] w-full rounded-[12px] border border-[var(--color-neutral-300)] p-[16px]" style={{ fontFamily: 'var(--font-family-quicksand)' }} />
          <button onClick={() => createReviewMutation.mutate()} className="h-[48px] rounded-[100px] bg-[var(--color-primary-300)] px-[32px] font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>Submit</button>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          {reviewsData?.data.map(r => (
            <div key={r.id} className="rounded-[12px] border border-[var(--color-neutral-200)] p-[24px]">
              <p className="mb-[8px] font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{r.user.name}</p>
              <div className="mb-[8px] flex gap-[4px]">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.star ? 'fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]' : 'text-[var(--color-neutral-300)]'}`} />)}</div>
              <p className="text-sm" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
