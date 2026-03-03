import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen, ChevronRight } from 'lucide-react';
import { getRecommendedBooks } from '@/api/books';
import { getCategories } from '@/api/categories';
import { getPopularAuthors } from '@/api/authors';
import Footer from '@/components/Footer';
import { BookCardSkeleton } from '@/components/Skeleton';

// Category → emoji icon mapping
const CATEGORY_ICONS: Record<string, string> = {
  fiction: '🪄',
  'non-fiction': '📰',
  nonfiction: '📰',
  'self-improve': '🌱',
  'self-improvement': '🌱',
  self: '🌱',
  finance: '💰',
  science: '🔬',
  technology: '🔬',
  education: '📚',
  history: '🏛️',
  biography: '👤',
  mystery: '🔍',
  romance: '❤️',
  fantasy: '⚔️',
  default: '📖',
};

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

// Carousel dots
function CarouselDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-[8px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === active ? '20px' : '8px',
            height: '8px',
            backgroundColor: i === active ? 'white' : 'rgba(255,255,255,0.5)',
          }}
        />
      ))}
    </div>
  );
}

export default function Books() {
  const [shownCount, setShownCount] = useState(10);

  const { data: recommendations, isLoading: loadingRec, error: recError } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendedBooks({ limit: 20 }),
  });

  const { data: categories, error: catError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: popularAuthors, error: authError } = useQuery({
    queryKey: ['popularAuthors'],
    queryFn: () => getPopularAuthors(4),
  });

  const booksList = recommendations?.data ?? [];
  const visibleBooks = booksList.slice(0, shownCount);
  const hasMore = booksList.length > shownCount;

  // Show error state if any query fails
  if (recError || catError || authError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-[16px]">
        <BookOpen className="h-[48px] w-[48px]" style={{ color: 'var(--color-neutral-300)' }} />
        <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Failed to load content. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      {/* ── Welcome Banner ── */}
      <div
        className="relative mb-[32px] overflow-hidden rounded-[16px]"
        style={{
          background: 'linear-gradient(135deg, #4B6CF8 0%, #6B9BF8 60%, #93C5FD 100%)',
          minHeight: '160px',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-[200px] w-[200px] rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute -bottom-12 right-20 h-[160px] w-[160px] rounded-full opacity-10" style={{ background: 'white' }} />

        <div className="relative flex h-full min-h-[160px] flex-col items-center justify-center gap-[12px] px-[24px] py-[32px]">
          <h1
            className="text-center text-display-lg font-bold text-white drop-shadow-sm"
            style={{ fontFamily: 'var(--font-family-quicksand)', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            Welcome to Booky
          </h1>
          <CarouselDots total={3} active={0} />
        </div>
      </div>

      {/* ── Category Icons ── */}
      {categories && categories.length > 0 && (
        <div className="mb-[40px] flex flex-wrap justify-center gap-[16px]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="flex flex-col items-center gap-[8px] transition-transform hover:scale-105"
            >
              <div
                className="flex h-[56px] w-[56px] items-center justify-center rounded-[12px] text-2xl"
                style={{ backgroundColor: 'var(--color-primary-50, #EEF2FF)' }}
              >
                {getCategoryIcon(cat.name)}
              </div>
              <span
                className="max-w-[72px] text-center text-xs font-semibold"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Recommendation ── */}
      <section className="mb-[48px]">
        <h2
          className="mb-[24px] text-display-sm font-bold"
          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
        >
          Recommendation
        </h2>

        {loadingRec ? (
          <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visibleBooks.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="group flex flex-col gap-[10px] overflow-hidden rounded-[12px] bg-white transition-shadow hover:shadow-md" style={{ border: '1px solid var(--color-neutral-200)' }}>
                  <div className="aspect-[2/3] w-full overflow-hidden bg-[var(--color-neutral-100)]">
                    {book.coverImage
                      ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      : <div className="flex h-full w-full items-center justify-center"><BookOpen className="h-12 w-12 text-[var(--color-neutral-300)]" /></div>
                    }
                  </div>
                  <div className="flex flex-col gap-[4px] px-[12px] pb-[12px]">
                    <p className="line-clamp-2 text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{book.title}</p>
                    <p className="line-clamp-1 text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>{book.author.name}</p>
                    <div className="flex items-center gap-[4px]">
                      <Star className="h-[12px] w-[12px] fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]" />
                      <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{book.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-[32px] flex justify-center">
                <button
                  onClick={() => setShownCount((c) => c + 10)}
                  className="flex h-[44px] items-center gap-[8px] rounded-[100px] border border-solid border-[var(--color-neutral-300)] bg-white px-[32px] font-bold transition-colors hover:bg-[var(--color-neutral-50)]"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Popular Authors ── */}
      {popularAuthors && popularAuthors.length > 0 && (
        <section className="mb-[48px]">
          <h2
            className="mb-[24px] text-display-sm font-bold"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
          >
            Popular Authors
          </h2>
          <div className="flex flex-wrap gap-[20px]">
            {popularAuthors.filter((a) => a && a.id && a.name).map((author) => (
              <Link
                key={author.id}
                to={`/authors/${author.id}`}
                className="flex items-center gap-[12px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white px-[16px] py-[12px] transition-shadow hover:shadow-sm"
              >
                {/* Avatar */}
                <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full">
                  {author.photoUrl
                    ? <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    : (
                      <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--color-primary-300), #6B9BF8)' }}>
                        <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )
                  }
                </div>
                <div>
                  <p className="font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{author.name}</p>
                  {author.bio && (
                    <p className="line-clamp-1 text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>{author.bio}</p>
                  )}
                </div>
                <ChevronRight className="ml-[8px] h-[16px] w-[16px]" style={{ color: 'var(--color-neutral-400)' }} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
