import dayjs from 'dayjs';
import type { User } from '@/types';

interface UserTableProps {
  users: User[];
}

const th = 'px-[16px] py-[12px] text-left text-xs font-bold uppercase tracking-wide';
const td = 'px-[16px] py-[14px] text-sm font-semibold align-middle';
const thStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' };
const tdStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' };

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-solid border-[var(--color-neutral-200)]">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            <th className={th} style={thStyle}>User</th>
            <th className={th} style={thStyle}>Phone</th>
            <th className={th} style={thStyle}>Role</th>
            <th className={th} style={thStyle}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[var(--color-neutral-100)] transition-colors hover:bg-[var(--color-neutral-50)]">
              <td className={td}>
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-700))' }}>
                    {user.profilePhoto
                      ? <img src={user.profilePhoto} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      : <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                    }
                  </div>
                  <div>
                    <p className="font-bold" style={tdStyle}>{user.name}</p>
                    <p className="text-xs" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>{user.email}</p>
                  </div>
                </div>
              </td>
              <td className={td} style={{ ...tdStyle, color: 'var(--color-neutral-600)' }}>{user.phone ?? '-'}</td>
              <td className={td}>
                <span className="rounded-[100px] px-[10px] py-[2px] text-xs font-bold"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    backgroundColor: user.role === 'ADMIN' ? `var(--color-brand-primary)15` : `var(--color-primary-300)15`,
                    color: user.role === 'ADMIN' ? 'var(--color-brand-primary)' : 'var(--color-primary-300)',
                  }}>
                  {user.role}
                </span>
              </td>
              <td className={td} style={{ ...tdStyle, color: 'var(--color-neutral-600)' }}>
                {dayjs(user.createdAt).format('MMM D, YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
