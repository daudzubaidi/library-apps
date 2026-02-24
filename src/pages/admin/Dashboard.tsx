import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, ClipboardList, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { getOverview } from '@/api/admin';
import StatsCard from '@/components/StatsCard';
import { Skeleton } from '@/components/Skeleton';

const ADMIN_TABS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Books', path: '/admin/books' },
  { label: 'Loans', path: '/admin/loans' },
  { label: 'Users', path: '/admin/users' },
];

export default function Dashboard() {
  const location = useLocation();
  const { data: overview, isLoading } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: getOverview,
  });

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

      <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        Dashboard
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-[16px] rounded-[16px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px]">
              <Skeleton className="h-[48px] w-[48px] shrink-0 rounded-[12px]" />
              <div className="flex flex-col gap-[6px]">
                <Skeleton className="h-[28px] w-[50px]" />
                <Skeleton className="h-[16px] w-[90px]" />
              </div>
            </div>
          ))}
        </div>
      ) : overview && (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard label="Total Books" value={overview.totalBooks} icon={BookOpen} color="var(--color-primary-300)" />
          <StatsCard label="Total Users" value={overview.totalUsers} icon={Users} color="var(--color-brand-primary)" />
          <StatsCard label="Total Loans" value={overview.totalLoans} icon={ClipboardList} color="var(--color-neutral-700)" />
          <StatsCard label="Active Loans" value={overview.activeLoans} icon={Clock} color="var(--color-accent-yellow)" />
          <StatsCard label="Overdue Loans" value={overview.overdueLoans} icon={AlertCircle} color="var(--color-accent-red)" />
          <StatsCard label="Returned" value={overview.returnedLoans} icon={CheckCircle} color="var(--color-accent-green)" />
        </div>
      )}
    </div>
  );
}
