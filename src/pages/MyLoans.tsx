import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMyLoans } from '@/api/me';
import { returnBook } from '@/api/loans';
import { Calendar, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function MyLoans() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return 'var(--color-primary-300)';
      case 'RETURNED':
        return 'var(--color-accent-green)';
      case 'LATE':
        return 'var(--color-accent-red)';
      default:
        return 'var(--color-neutral-500)';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          My Loans
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
          {loansData?.data.map((loan) => {
            const daysRemaining = getDaysRemaining(loan.dueDate);
            return (
              <div key={loan.id} className="flex gap-[24px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]">
                <Link to={`/books/${loan.book.id}`} className="h-[180px] w-[120px] overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
                  {loan.book.coverImage ? (
                    <img src={loan.book.coverImage} alt={loan.book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-neutral-400)]">No Image</div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <span
                      className="mb-[8px] inline-block rounded-[100px] px-[12px] py-[4px] text-sm font-bold"
                      style={{
                        fontFamily: 'var(--font-family-quicksand)',
                        backgroundColor: `${getStatusColor(loan.status)}20`,
                        color: getStatusColor(loan.status),
                      }}
                    >
                      {loan.status}
                    </span>
                    <Link to={`/books/${loan.book.id}`}>
                      <h3 className="mb-[4px] text-lg font-bold transition-colors hover:text-[var(--color-primary-300)]" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                        {loan.book.title}
                      </h3>
                    </Link>
                    <p className="mb-[12px] text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                      {loan.book.author.name}
                    </p>

                    <div className="flex gap-[24px]">
                      <div className="flex items-center gap-[8px]">
                        <Calendar className="h-[16px] w-[16px] text-[var(--color-neutral-500)]" />
                        <div>
                          <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                            Borrow Date
                          </p>
                          <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                            {new Date(loan.borrowDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <Calendar className="h-[16px] w-[16px] text-[var(--color-neutral-500)]" />
                        <div>
                          <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                            Due Date
                          </p>
                          <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {loan.returnDate && (
                        <div className="flex items-center gap-[8px]">
                          <Calendar className="h-[16px] w-[16px] text-[var(--color-neutral-500)]" />
                          <div>
                            <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                              Return Date
                            </p>
                            <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                              {new Date(loan.returnDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {loan.status === 'BORROWED' && daysRemaining > 0 && (
                      <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                        {daysRemaining} days remaining
                      </p>
                    )}
                    {loan.status === 'LATE' && (
                      <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-accent-red)' }}>
                        {Math.abs(daysRemaining)} days overdue
                      </p>
                    )}
                    {loan.status === 'BORROWED' && (
                      <button
                        onClick={() => returnBookMutation.mutate(loan.id)}
                        disabled={returnBookMutation.isPending}
                        className="ml-auto flex h-[40px] items-center justify-center rounded-[100px] px-[24px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}
                      >
                        {returnBookMutation.isPending ? 'Returning...' : 'Return Book'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
