import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { Loan } from '@/types';
import LoanStatusBadge from './LoanStatusBadge';

interface LoanCardProps {
  loan: Loan;
  onReturn: (loanId: number) => void;
  isReturning: boolean;
}

export default function LoanCard({ loan, onReturn, isReturning }: LoanCardProps) {
  const daysRemaining = dayjs(loan.dueDate).diff(dayjs(), 'day');

  return (
    <div className="flex gap-[24px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]">
      <Link to={`/books/${loan.book.id}`} className="h-[180px] w-[120px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
        {loan.book.coverImage ? (
          <img src={loan.book.coverImage} alt={loan.book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-neutral-400)]">No Image</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-[8px]">
            <LoanStatusBadge status={loan.status} />
          </div>
          <Link to={`/books/${loan.book.id}`}>
            <h3
              className="mb-[4px] text-lg font-bold transition-colors hover:text-[var(--color-primary-300)]"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            >
              {loan.book.title}
            </h3>
          </Link>
          <p
            className="mb-[12px] text-sm font-semibold"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}
          >
            {loan.book.author.name}
          </p>

          <div className="flex gap-[24px]">
            <DateInfo label="Borrow Date" value={dayjs(loan.borrowDate).format('MMM D, YYYY')} />
            <DateInfo label="Due Date" value={dayjs(loan.dueDate).format('MMM D, YYYY')} />
            {loan.returnDate && (
              <DateInfo label="Return Date" value={dayjs(loan.returnDate).format('MMM D, YYYY')} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {loan.status === 'BORROWED' && daysRemaining > 0 && (
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}
            >
              {daysRemaining} days remaining
            </p>
          )}
          {loan.status === 'LATE' && (
            <p
              className="text-sm font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-accent-red)' }}
            >
              {Math.abs(daysRemaining)} days overdue
            </p>
          )}
          {loan.status === 'BORROWED' && (
            <button
              onClick={() => onReturn(loan.id)}
              disabled={isReturning}
              className="ml-auto flex h-[40px] items-center justify-center rounded-[100px] px-[24px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary-300)',
                color: 'var(--color-neutral-25)',
                fontFamily: 'var(--font-family-quicksand)',
              }}
            >
              {isReturning ? 'Returning...' : 'Return Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DateInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-[8px]">
      <Calendar className="h-[16px] w-[16px] text-[var(--color-neutral-500)]" />
      <div>
        <p
          className="text-xs font-semibold"
          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}
        >
          {label}
        </p>
        <p
          className="text-sm font-bold"
          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
