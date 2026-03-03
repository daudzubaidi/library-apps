import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen } from 'lucide-react';
import { getBooks } from '@/api/books';
import { getCategories } from '@/api/categories';
import Footer from '@/components/Footer';
import { BookCardSkeleton } from '@/components/Skeleton';

export default function CategoryBooks() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [selectedCategories, setSelectedCategories] = useState<number[]>(() =>
    id && id !== 'all' ? [Number(id)] : []
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Reset when category ID in URL changes
  useEffect(() => {
    if (id && id !== 'all') {
      setSelectedCategories([Number(id)]);
    } else {
      setSelectedCategories([]);
    }
    setPage(1);
  }, [id]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: booksData, isLoading } = useQuery({
    queryKey: ['books', selectedCategories, selectedRating, urlQuery, page],
    queryFn: () =>
      getBooks({
        q: urlQuery || undefined,
        categoryId: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        minRating: selectedRating ?? undefined,
        page,
        limit: 8,
      }),
  });

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setPage(1);
  };

  return (
    <div className="flex w-full flex-col">
      <h1
        className="mb-[32px] text-display-sm font-bold"
        style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
      >
        Book List
      </h1>

      <div className="flex flex-col gap-[32px] md:flex-row">
        {/* ── Left Sidebar Filter ── */}
        <aside className="w-full shrink-0 md:w-[266px]">
          {/* Filter label */}
          <p
            className="mb-[16px] text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}
          >
            Filter
          </p>

          {/* Category checkboxes */}
          <div className="mb-[24px]">
            <p
              className="mb-[12px] text-md font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            >
              Category
            </p>
            <div className="flex flex-col gap-[8px]">
              {categories?.map((cat) => (
                <label key={cat.id} className="flex cursor-pointer items-center gap-[10px]">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-[18px] w-[18px] cursor-pointer rounded"
                    style={{ accentColor: 'var(--color-primary-300)' }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-800)' }}
                  >
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-[24px] h-px" style={{ backgroundColor: 'var(--color-neutral-200)' }} />

          {/* Rating checkboxes */}
          <div>
            <p
              className="mb-[12px] text-md font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            >
              Rating
            </p>
            <div className="flex flex-col gap-[4px]">
              {[5, 4, 3, 2, 1].map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[8px] py-[8px] transition-colors hover:bg-[var(--color-neutral-50)]">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => { setSelectedRating(r); setPage(1); }}
                    className="h-[18px] w-[18px] cursor-pointer"
                    style={{ accentColor: 'var(--color-primary-300)' }}
                  />
                  <div className="flex items-center gap-[4px]">
                    <Star className="h-[18px] w-[18px] fill-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)]" />
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-800)' }}
                    >
                      {r}
                    </span>
                  </div>
                </label>
              ))}
              {selectedRating && (
                <button
                  onClick={() => setSelectedRating(null)}
                  className="mt-[4px] text-left text-xs font-semibold underline"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}
                >
                  Clear rating
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ── Book Grid ── */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          ) : booksData?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[64px]">
              <BookOpen className="mb-[16px] h-[48px] w-[48px]" style={{ color: 'var(--color-neutral-300)' }} />
              <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                No books found
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-4">
                {booksData?.data.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="group flex flex-col overflow-hidden rounded-[12px] bg-white transition-shadow hover:shadow-md"
                    style={{ border: '1px solid var(--color-neutral-200)' }}
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-[var(--color-neutral-100)]">
                      {book.coverImage
                        ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        : <div className="flex h-full w-full items-center justify-center"><BookOpen className="h-12 w-12 text-[var(--color-neutral-300)]" /></div>
                      }
                    </div>
                    <div className="flex flex-col gap-[4px] p-[12px]">
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

              {/* Pagination */}
              {booksData && booksData.meta.totalPages > 1 && (
                <div className="mt-[32px] flex items-center justify-center gap-[8px]">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                  >
                    ←
                  </button>
                  {(() => {
                    const total = booksData.meta.totalPages;
                    const delta = 2;
                    const pages: (number | '...')[] = [];
                    const left = Math.max(2, page - delta);
                    const right = Math.min(total - 1, page + delta);
                    pages.push(1);
                    if (left > 2) pages.push('...');
                    for (let i = left; i <= right; i++) pages.push(i);
                    if (right < total - 1) pages.push('...');
                    if (total > 1) pages.push(total);
                    return pages.map((p, idx) =>
                      p === '...' ? (
                        <span key={`e-${idx}`} className="flex h-[40px] w-[40px] items-center justify-center text-sm font-semibold" style={{ color: 'var(--color-neutral-500)' }}>…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p as number)}
                          className={`flex h-[40px] w-[40px] items-center justify-center rounded-[8px] font-bold transition-colors ${page === p ? 'text-white' : 'border border-solid border-[var(--color-neutral-300)] bg-white hover:bg-[var(--color-neutral-50)]'}`}
                          style={{ fontFamily: 'var(--font-family-quicksand)', backgroundColor: page === p ? 'var(--color-primary-300)' : undefined, color: page === p ? 'white' : 'var(--color-neutral-950)' }}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}
                  <button
                    onClick={() => setPage((p) => Math.min(booksData.meta.totalPages, p + 1))}
                    disabled={page === booksData.meta.totalPages}
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
