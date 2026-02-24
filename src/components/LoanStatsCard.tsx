interface LoanStatsCardProps {
  label: string;
  value: number;
  color: string;
}

export default function LoanStatsCard({ label, value, color }: LoanStatsCardProps) {
  return (
    <div className="flex flex-col gap-[4px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[16px]">
      <p
        className="text-display-xs font-bold"
        style={{ fontFamily: 'var(--font-family-quicksand)', color }}
      >
        {value}
      </p>
      <p
        className="text-sm font-semibold"
        style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}
      >
        {label}
      </p>
    </div>
  );
}
