import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminLoans, createAdminLoan, updateAdminLoan } from '@/api/admin';
import LoanTable from '@/components/LoanTable';
import CreateLoanDialog from '@/components/CreateLoanDialog';
import { Skeleton } from '@/components/Skeleton';

const ADMIN_TABS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Books', path: '/admin/books' },
  { label: 'Loans', path: '/admin/loans' },
  { label: 'Users', path: '/admin/users' },
];

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Borrowed', value: 'BORROWED' },
  { label: 'Returned', value: 'RETURNED' },
  { label: 'Late', value: 'LATE' },
];

export default function AdminLoans() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

  const { data: loansData, isLoading } = useQuery({
    queryKey: ['adminLoans', search, status, page],
    queryFn: () => getAdminLoans({ q: search || undefined, status: status || undefined, page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: createAdminLoan,
    onSuccess: () => {
      toast.success('Loan created!');
      queryClient.invalidateQueries({ queryKey: ['adminLoans'] });
      setShowDialog(false);
    },
    onError: () => toast.error('Failed to create loan'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAdminLoan(id, { status }),
    onSuccess: () => {
      toast.success('Loan updated!');
      queryClient.invalidateQueries({ queryKey: ['adminLoans'] });
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
    },
    onError: () => toast.error('Failed to update loan'),
  });

  const handleUpdateStatus = (id: number, status: string) => {
    updateMutation.mutate({ id, status });
  };

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

      {/* Header */}
      <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Loans
        </h1>
        <div className="flex flex-wrap items-center gap-[12px]">
          {/* Search */}
          <div className="flex h-[44px] items-center gap-[8px] rounded-[12px] border border-solid border-[var(--color-neutral-300)] bg-white px-[16px]">
            <Search className="h-[16px] w-[16px]" style={{ color: 'var(--color-neutral-500)' }} />
            <input
              type="text"
              placeholder="Search loans..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-[160px] border-none bg-transparent text-sm font-semibold outline-none"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="h-[44px] rounded-[12px] border border-solid border-[var(--color-neutral-300)] bg-white px-[12px] text-sm font-semibold outline-none"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDialog(true)}
            className="flex h-[44px] items-center gap-[8px] rounded-[100px] px-[20px] font-bold"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}>
            <Plus className="h-[16px] w-[16px]" />
            Create Loan
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-[12px]">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[64px] w-full" />)}
        </div>
      ) : loansData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>No loans found</p>
        </div>
      ) : (
        <>
          <LoanTable
            loans={loansData?.data ?? []}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateMutation.isPending}
          />
          {/* Pagination */}
          {loansData && loansData.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-[8px]">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>←</button>
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                {page} / {loansData.meta.totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(loansData.meta.totalPages, p + 1))} disabled={page === loansData.meta.totalPages}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>→</button>
            </div>
          )}
        </>
      )}

      <CreateLoanDialog
        isOpen={showDialog}
        isSaving={createMutation.isPending}
        onSubmit={(data) => createMutation.mutate(data)}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}
