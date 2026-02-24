import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSearchQuery, setSelectedCategoryId } from '@/store/uiSlice';
import { getBooks } from '@/api/books';
import { getCategories } from '@/api/categories';
import { Search, AlertCircle } from 'lucide-react';
import { BookCardSkeleton } from '@/components/Skeleton';

export default function Books() {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategoryId } = useAppSelector((state) => state.ui);
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: booksData, isLoading, isError, refetch } = useQuery({
    queryKey: ['books', { q: searchQuery, categoryId: selectedCategoryId, page }],
    queryFn: () => getBooks({ q: searchQuery, categoryId: selectedCategoryId || undefined, page, limit: 12 }),
  });

  return (
    <div className="flex w-full flex-col gap-[32px]">
      {/* Search Bar */}
      <div className="flex w-full items-center gap-[12px] rounded-[12px] border border-solid border-[var(--color-neutral-300)] bg-white px-[16px] py-[12px]">
        <Search className="h-[20px] w-[20px] text-[var(--color-neutral-500)]" />
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="flex-1 border-none bg-transparent outline-none text-sm font-semibold"
          style={{
            fontFamily: 'var(--font-family-quicksand)',
            fontSize: 'var(--font-size-text-sm)',
            lineHeight: 'var(--line-height-text-sm)',
            color: 'var(--color-neutral-950)',
            letterSpacing: '-0.28px',
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-[12px]">
        <button
          onClick={() => dispatch(setSelectedCategoryId(null))}
          className={`flex items-center justify-center rounded-[100px] px-[16px] py-[8px] transition-colors ${
            selectedCategoryId === null
              ? 'bg-[var(--color-primary-300)] text-white'
              : 'border border-solid border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-950)]'
          }`}
          style={{
            fontFamily: 'var(--font-family-quicksand)',
            fontSize: 'var(--font-size-text-sm)',
            lineHeight: 'var(--line-height-text-sm)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.28px',
          }}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setSelectedCategoryId(cat.id))}
            className={`flex items-center justify-center rounded-[100px] px-[16px] py-[8px] transition-colors ${
              selectedCategoryId === cat.id
                ? 'bg-[var(--color-primary-300)] text-white'
                : 'border border-solid border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-950)]'
            }`}
            style={{
              fontFamily: 'var(--font-family-quicksand)',
              fontSize: 'var(--font-size-text-sm)',
              lineHeight: 'var(--line-height-text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.28px',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-[16px] py-[64px]">
          <AlertCircle className="h-[48px] w-[48px] text-[var(--color-accent-red)]" />
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            Failed to load books
          </p>
          <button
            onClick={() => refetch()}
            className="flex h-[40px] items-center justify-center rounded-[100px] px-[24px] text-sm font-bold"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}
          >
            Try again
          </button>
        </div>
      ) : booksData?.data.length === 0 ? (
        <div className="flex items-center justify-center py-[64px]">
          <div className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            No books found
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {booksData?.data.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex w-full flex-col gap-[12px] overflow-hidden rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[16px] transition-shadow hover:shadow-lg"
              >
                {/* Book Cover */}
                <div className="relative h-[240px] w-full overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--color-neutral-400)]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex flex-col gap-[4px]">
                  <h3
                    className="line-clamp-2 font-bold"
                    style={{
                      fontFamily: 'var(--font-family-quicksand)',
                      fontSize: 'var(--font-size-text-md)',
                      lineHeight: 'var(--line-height-text-md)',
                      color: 'var(--color-neutral-950)',
                      letterSpacing: '-0.32px',
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    className="font-semibold"
                    style={{
                      fontFamily: 'var(--font-family-quicksand)',
                      fontSize: 'var(--font-size-text-sm)',
                      lineHeight: 'var(--line-height-text-sm)',
                      color: 'var(--color-neutral-600)',
                      letterSpacing: '-0.28px',
                    }}
                  >
                    {book.author.name}
                  </p>
                  <div className="flex items-center justify-between mt-[4px]">
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: 'var(--font-family-quicksand)',
                        fontSize: 'var(--font-size-text-sm)',
                        lineHeight: 'var(--line-height-text-sm)',
                        color: 'var(--color-primary-300)',
                        letterSpacing: '-0.28px',
                      }}
                    >
                      ⭐ {book.averageRating.toFixed(1)}
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--font-family-quicksand)',
                        fontSize: 'var(--font-size-text-xs)',
                        lineHeight: 'var(--line-height-text-xs)',
                        color: book.availableStock > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                      }}
                    >
                      {book.availableStock > 0 ? `${book.availableStock} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {booksData && booksData.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-[8px]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold transition-colors hover:bg-[var(--color-neutral-50)] disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  fontSize: 'var(--font-size-text-sm)',
                  color: 'var(--color-neutral-950)',
                }}
              >
                ←
              </button>
              {Array.from({ length: booksData.meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-[40px] w-[40px] items-center justify-center rounded-[8px] font-bold transition-colors ${
                    page === pageNum
                      ? 'bg-[var(--color-primary-300)] text-white'
                      : 'border border-solid border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-950)] hover:bg-[var(--color-neutral-50)]'
                  }`}
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    fontSize: 'var(--font-size-text-sm)',
                  }}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(booksData.meta.totalPages, p + 1))}
                disabled={page === booksData.meta.totalPages}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold transition-colors hover:bg-[var(--color-neutral-50)] disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  fontSize: 'var(--font-size-text-sm)',
                  color: 'var(--color-neutral-950)',
                }}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
