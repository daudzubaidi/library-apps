import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen } from 'lucide-react';
import { getAuthorBooks, getPopularAuthors } from '@/api/authors';
import Footer from '@/components/Footer';
import { BookCardSkeleton, Skeleton } from '@/components/Skeleton';

export default function AuthorBooks() {
  const { id } = useParams<{ id: string }>();

  const { data: booksData, isLoading: loadingBooks } = useQuery({
    queryKey: ['authorBooks', id],
    queryFn: () => getAuthorBooks(Number(id), { limit: 20 }),
    enabled: !!id,
  });

  // Get author info from popular authors list as fallback
  const { data: popularAuthors } = useQuery({
    queryKey: ['popularAuthors'],
    queryFn: () => getPopularAuthors(50),
  });

  const author = popularAuthors?.find((a) => a.id === Number(id));
  const books = booksData?.data ?? [];

  return (
    <div className="flex w-full flex-col">
      {/* ── Author Card ── */}
      {author ? (
        <div
          className="mb-[32px] flex items-center gap-[16px] rounded-[16px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px]"
          style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}
        >
          <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full">
            {author.photoUrl
              ? <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />
              : (
                <div className="flex h-full w-full items-center justify-center rounded-full"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary-300), #6B9BF8)' }}>
                  <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )
            }
          </div>
          <div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              {author.name}
            </p>
            <div className="flex items-center gap-[4px]">
              <BookOpen className="h-[14px] w-[14px]" style={{ color: 'var(--color-neutral-500)' }} />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                {books.length} books
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-[32px] flex items-center gap-[16px] rounded-[16px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px]">
          <Skeleton className="h-[64px] w-[64px] rounded-full" />
          <div className="flex flex-col gap-[8px]">
            <Skeleton className="h-[24px] w-[160px]" />
            <Skeleton className="h-[16px] w-[80px]" />
          </div>
        </div>
      )}

      {/* ── Book List title ── */}
      <h1
        className="mb-[24px] text-display-sm font-bold"
        style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
      >
        Book List
      </h1>

      {/* ── Book Grid ── */}
      {loadingBooks ? (
        <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <BookOpen className="mb-[16px] h-[48px] w-[48px]" style={{ color: 'var(--color-neutral-300)' }} />
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            No books found for this author
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
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
      )}

      <Footer />
    </div>
  );
}
