import dayjs from 'dayjs';
import type { Loan } from '@/types';
import LoanStatusBadge from './LoanStatusBadge';

interface LoanTableProps {
  loans: Loan[];
  onUpdateStatus: (id: number, status: string) => void;
  isUpdating: boolean;
}

const th = 'px-[16px] py-[12px] text-left text-xs font-bold uppercase tracking-wide';
const td = 'px-[16px] py-[14px] text-sm font-semibold align-middle';
const thStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' };
const tdStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' };

export default function LoanTable({ loans, onUpdateStatus, isUpdating }: LoanTableProps) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-solid border-[var(--color-neutral-200)]">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            <th className={th} style={thStyle}>Book</th>
            <th className={th} style={thStyle}>User</th>
            <th className={th} style={thStyle}>Borrow Date</th>
            <th className={th} style={thStyle}>Due Date</th>
            <th className={th} style={thStyle}>Status</th>
            <th className={th} style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b border-[var(--color-neutral-100)] transition-colors hover:bg-[var(--color-neutral-50)]">
              <td className={td} style={tdStyle}>
                <div className="flex items-center gap-[10px]">
                  <div className="h-[40px] w-[28px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--color-neutral-100)]">
                    {loan.book.coverImage
                      ? <img src={loan.book.coverImage} alt={loan.book.title} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-[9px]" style={{ color: 'var(--color-neutral-400)' }}>N/A</div>
                    }
                  </div>
                  <span className="line-clamp-2 max-w-[160px]">{loan.book.title}</span>
                </div>
              </td>
              <td className={td}>
                <div>
                  <p className="font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{loan.user?.name ?? `User #${loan.userId}`}</p>
                  <p className="text-xs" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>{loan.user?.email}</p>
                </div>
              </td>
              <td className={td} style={{ ...tdStyle, color: 'var(--color-neutral-600)' }}>
                {dayjs(loan.borrowDate).format('MMM D, YYYY')}
              </td>
              <td className={td}>
                <span style={{ fontFamily: 'var(--font-family-quicksand)', fontWeight: 700, fontSize: '14px', color: dayjs().isAfter(loan.dueDate) && loan.status === 'BORROWED' ? 'var(--color-accent-red)' : 'var(--color-neutral-950)' }}>
                  {dayjs(loan.dueDate).format('MMM D, YYYY')}
                </span>
              </td>
              <td className={td}>
                <LoanStatusBadge status={loan.status} />
              </td>
              <td className={td}>
                {loan.status === 'BORROWED' && (
                  <button onClick={() => onUpdateStatus(loan.id, 'RETURNED')} disabled={isUpdating}
                    className="h-[32px] rounded-[8px] px-[12px] text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-accent-green)', color: 'white', fontFamily: 'var(--font-family-quicksand)' }}>
                    Mark Returned
                  </button>
                )}
                {loan.status === 'LATE' && (
                  <button onClick={() => onUpdateStatus(loan.id, 'RETURNED')} disabled={isUpdating}
                    className="h-[32px] rounded-[8px] px-[12px] text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-accent-red)', color: 'white', fontFamily: 'var(--font-family-quicksand)' }}>
                    Mark Returned
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
