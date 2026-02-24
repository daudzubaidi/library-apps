import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { getMyLoans } from '@/api/me';
import { returnBook } from '@/api/loans';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import LoanCard from '@/components/LoanCard';

const TABS = [
  { label: 'Profile', path: '/my-profile' },
  { label: 'Borrowed List', path: '/my-loans' },
  { label: 'Reviews', path: '/my-reviews' },
];

export default function MyLoans() {
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'BORROWED' | 'RETURNED' | 'LATE'>('all');
  const queryClient = useQueryClient();

  const { data: loansData, isLoading } = useQuery({
    queryKey: ['myLoans', statusFilter],
    queryFn: () => getMyLoans({ status: statusFilter === 'all' ? undefined : statusFilter }),
  });

  const returnBookMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      toast.success('Book returned successfully!');
      queryClient.invalidateQueries({ queryKey: ['myLoans'] });
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
      {/* Tab Navigation */}
      <div className="flex h-[56px] items-center gap-[8px] rounded-[16px] p-[8px]" style={{ backgroundColor: 'var(--color-neutral-100)', width: 'fit-content' }}>
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex h-[40px] w-[175px] items-center justify-center rounded-[12px] px-[12px] py-[8px] transition-all"
              style={{
                backgroundColor: isActive ? 'white' : 'transparent',
                boxShadow: isActive ? '0px 0px 20px 0px rgba(203,202,202,0.25)' : 'none',
                fontFamily: 'var(--font-family-quicksand)',
                fontSize: 'var(--font-size-text-md)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-neutral-950)' : 'var(--color-neutral-600)',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Borrowed List
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-[12px] border-b border-solid border-[var(--color-neutral-200)]">
        {(['all', 'BORROWED', 'RETURNED', 'LATE'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-[12px] text-md font-bold transition-colors ${
              statusFilter === status ? 'border-b-2 border-solid border-[var(--color-primary-300)]' : ''
            }`}
            style={{
              fontFamily: 'var(--font-family-quicksand)',
              color: statusFilter === status ? 'var(--color-primary-300)' : 'var(--color-neutral-600)',
            }}
          >
            {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Loans List */}
      {loansData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <BookOpen className="mb-[16px] h-[48px] w-[48px] text-[var(--color-neutral-300)]" />
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
            No loans found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[24px]">
          {loansData?.data.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onReturn={(id) => returnBookMutation.mutate(id)}
              isReturning={returnBookMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
