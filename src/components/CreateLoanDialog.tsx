import { useState } from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

interface CreateLoanDialogProps {
  isOpen: boolean;
  isSaving: boolean;
  onSubmit: (data: { userId: number; bookId: number; dueAt: string }) => void;
  onClose: () => void;
}

const inputClass = 'h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)]';
const labelClass = 'text-sm font-bold';
const style = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' };

export default function CreateLoanDialog({ isOpen, isSaving, onSubmit, onClose }: CreateLoanDialogProps) {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [dueAt, setDueAt] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !bookId) return;
    onSubmit({ userId: Number(userId), bookId: Number(bookId), dueAt });
  };

  const handleClose = () => {
    setUserId('');
    setBookId('');
    setDueAt(dayjs().add(7, 'day').format('YYYY-MM-DD'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[440px] rounded-[16px] bg-white p-[24px]"
        style={{ boxShadow: '0px 0px 40px 0px rgba(0,0,0,0.15)' }}>
        <div className="mb-[20px] flex items-center justify-between">
          <h2 className="text-lg font-bold" style={style}>Create Loan</h2>
          <button onClick={handleClose} className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] transition-colors hover:bg-[var(--color-neutral-100)]">
            <X className="h-[16px] w-[16px]" style={{ color: 'var(--color-neutral-600)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <label className={labelClass} style={style}>User ID</label>
            <input type="number" min={1} className={inputClass} style={style}
              value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter user ID" required />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className={labelClass} style={style}>Book ID</label>
            <input type="number" min={1} className={inputClass} style={style}
              value={bookId} onChange={e => setBookId(e.target.value)} placeholder="Enter book ID" required />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className={labelClass} style={style}>Due Date</label>
            <input type="date" className={inputClass} style={style}
              value={dueAt} onChange={e => setDueAt(e.target.value)}
              min={dayjs().add(1, 'day').format('YYYY-MM-DD')} required />
          </div>

          <div className="flex gap-[12px] pt-[4px]">
            <button type="button" onClick={handleClose}
              className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] border border-solid border-[var(--color-neutral-300)] font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] font-bold disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}>
              {isSaving ? 'Creating...' : 'Create Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
