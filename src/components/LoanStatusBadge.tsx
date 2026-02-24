type LoanStatus = 'BORROWED' | 'RETURNED' | 'LATE';

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

const STATUS_COLORS: Record<LoanStatus, string> = {
  BORROWED: 'var(--color-primary-300)',
  RETURNED: 'var(--color-accent-green)',
  LATE: 'var(--color-accent-red)',
};

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? 'var(--color-neutral-500)';

  return (
    <span
      className="inline-block rounded-[100px] px-[12px] py-[4px] text-sm font-bold"
      style={{
        fontFamily: 'var(--font-family-quicksand)',
        backgroundColor: `${color}20`,
        color,
      }}
    >
      {status}
    </span>
  );
}
