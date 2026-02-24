import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminBooks, createBook, updateBook, deleteBook } from '@/api/admin';
import AdminBookTable from '@/components/AdminBookTable';
import BookForm from '@/components/BookForm';
import { Skeleton } from '@/components/Skeleton';
import type { Book } from '@/types';

const ADMIN_TABS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Books', path: '/admin/books' },
  { label: 'Loans', path: '/admin/loans' },
  { label: 'Users', path: '/admin/users' },
];

export default function AdminBooks() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const { data: booksData, isLoading } = useQuery({
    queryKey: ['adminBooks', search, page],
    queryFn: () => getAdminBooks({ q: search || undefined, page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      toast.success('Book created!');
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create book'),
  });

  const updateMutation = useMutation({
    mutationFn: (fd: FormData) => updateBook(editBook!.id, fd),
    onSuccess: () => {
      toast.success('Book updated!');
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      setEditBook(null);
    },
    onError: () => toast.error('Failed to update book'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast.success('Book deleted');
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
    },
    onError: () => toast.error('Failed to delete book'),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Delete this book?')) return;
    deleteMutation.mutate(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex w-full flex-col gap-[32px]">
      {/* Admin Tab Nav */}
      <div className="flex flex-wrap gap-[4px] border-b border-solid border-[var(--color-neutral-200)]">
        {ADMIN_TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link key={tab.path} to={tab.path}
              className="flex h-[40px] items-center px-[16px] pb-[12px] text-md font-bold transition-colors"
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                color: isActive ? 'var(--color-primary-300)' : 'var(--color-neutral-600)',
                borderBottom: isActive ? '2px solid var(--color-primary-300)' : '2px solid transparent',
              }}>
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Form Panel */}
      {(showForm || editBook) && (
        <div className="rounded-[16px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]"
          style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}>
          <h2 className="mb-[20px] text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
            {editBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <BookForm
            initial={editBook ?? undefined}
            isSaving={isSaving}
            onSubmit={(fd) => editBook ? updateMutation.mutate(fd) : createMutation.mutate(fd)}
            onCancel={() => { setShowForm(false); setEditBook(null); }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Books
        </h1>
        <div className="flex items-center gap-[12px]">
          {/* Search */}
          <div className="flex h-[44px] items-center gap-[8px] rounded-[12px] border border-solid border-[var(--color-neutral-300)] bg-white px-[16px]">
            <Search className="h-[16px] w-[16px]" style={{ color: 'var(--color-neutral-500)' }} />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-[180px] border-none bg-transparent text-sm font-semibold outline-none"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            />
          </div>
          <button
            onClick={() => { setShowForm(true); setEditBook(null); }}
            className="flex h-[44px] items-center gap-[8px] rounded-[100px] px-[20px] font-bold"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}>
            <Plus className="h-[16px] w-[16px]" />
            Add Book
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-[12px]">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[64px] w-full" />)}
        </div>
      ) : booksData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>No books found</p>
        </div>
      ) : (
        <>
          <AdminBookTable
            books={booksData?.data ?? []}
            onEdit={(book) => { setEditBook(book); setShowForm(false); }}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
          {/* Pagination */}
          {booksData && booksData.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-[8px]">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>←</button>
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                {page} / {booksData.meta.totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(booksData.meta.totalPages, p + 1))} disabled={page === booksData.meta.totalPages}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
