import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="flex items-center gap-[16px] rounded-[16px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px]"
      style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}>
      <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: `${color}15` }}>
        <Icon className="h-[24px] w-[24px]" style={{ color }} />
      </div>
      <div>
        <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color }}>
          {value.toLocaleString()}
        </p>
        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}
