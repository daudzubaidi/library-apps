import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getAdminUsers } from '@/api/admin';
import UserTable from '@/components/UserTable';
import { Skeleton } from '@/components/Skeleton';

const ADMIN_TABS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Books', path: '/admin/books' },
  { label: 'Loans', path: '/admin/loans' },
  { label: 'Users', path: '/admin/users' },
];

export default function AdminUsers() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers', search, page],
    queryFn: () => getAdminUsers({ q: search || undefined, page, limit: 10 }),
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

      {/* Header */}
      <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Users
        </h1>
        <div className="flex h-[44px] items-center gap-[8px] rounded-[12px] border border-solid border-[var(--color-neutral-300)] bg-white px-[16px]">
          <Search className="h-[16px] w-[16px]" style={{ color: 'var(--color-neutral-500)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-[180px] border-none bg-transparent text-sm font-semibold outline-none"
            style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-[12px]">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[64px] w-full" />)}
        </div>
      ) : usersData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[64px]">
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>No users found</p>
        </div>
      ) : (
        <>
          <UserTable users={usersData?.data ?? []} />
          {/* Pagination */}
          {usersData && usersData.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-[8px]">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>←</button>
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                {page} / {usersData.meta.totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(usersData.meta.totalPages, p + 1))} disabled={page === usersData.meta.totalPages}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-solid border-[var(--color-neutral-300)] bg-white font-bold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
