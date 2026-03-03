import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { duration } = (location.state as { duration?: number }) ?? {};
  const returnDate = dayjs().add(duration ?? 3, 'day');

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center">
      <div className="flex max-w-[638px] w-full flex-col items-center gap-[32px]">
        {/* Check icon with ripple rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[142px] w-[142px] rounded-full" style={{ backgroundColor: 'rgba(75, 108, 248, 0.08)' }} />
          <div className="absolute h-[116px] w-[116px] rounded-full" style={{ backgroundColor: 'rgba(75, 108, 248, 0.12)' }} />
          <div
            className="relative flex h-[90px] w-[90px] items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-primary-300)' }}
          >
            <CheckCircle className="h-[48px] w-[48px] text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-[8px] text-center">
          <h1
            className="text-display-sm font-bold"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
          >
            Borrowing Successful!
          </h1>
          <p
            className="text-md font-semibold"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}
          >
            Your book has been successfully borrowed. Please return it by{' '}
            <span style={{ color: 'var(--color-accent-red)', fontWeight: 700 }}>
              {returnDate.format('D MMMM YYYY')}
            </span>
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/my-loans')}
          className="flex h-[48px] items-center justify-center rounded-[100px] px-[48px] font-bold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary-300)',
            color: 'white',
            fontFamily: 'var(--font-family-quicksand)',
            fontSize: 'var(--font-size-text-md)',
          }}
        >
          See Borrowed List
        </button>
      </div>
    </div>
  );
}
