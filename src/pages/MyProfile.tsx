import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import { getProfile } from '@/api/me';
import { Mail, Phone, Calendar, BookOpen, Star, Clock } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAppSelector((state) => state.auth);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-[32px]">
      <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[32px]">
        <div className="mb-[32px] flex items-center gap-[24px]">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-700)]">
            <span className="text-display-lg font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              {user?.name}
            </h2>
            <span
              className="mt-[8px] inline-block rounded-[100px] bg-[var(--color-primary-100)] px-[16px] py-[4px] text-sm font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-primary-300)' }}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <div className="mb-[32px] h-px bg-[var(--color-neutral-200)]" />

        {/* Contact Information */}
        <h3 className="mb-[16px] text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Contact Information
        </h3>
        <div className="mb-[32px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[var(--color-neutral-100)]">
              <Mail className="h-[20px] w-[20px] text-[var(--color-neutral-700)]" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                Email Address
              </p>
              <p className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[var(--color-neutral-100)]">
              <Phone className="h-[20px] w-[20px] text-[var(--color-neutral-700)]" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                Phone Number
              </p>
              <p className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                {user?.phone || 'Not provided'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[var(--color-neutral-100)]">
              <Calendar className="h-[20px] w-[20px] text-[var(--color-neutral-700)]" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                Member Since
              </p>
              <p className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                {new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Loan Statistics */}
        {profile && (
          <>
            <div className="mb-[16px] h-px bg-[var(--color-neutral-200)]" />
            <h3 className="mb-[16px] text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Loan Statistics
            </h3>
            <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4">
              <div className="rounded-[8px] bg-[var(--color-neutral-50)] p-[16px]">
                <div className="mb-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[var(--color-primary-100)]">
                  <BookOpen className="h-[16px] w-[16px] text-[var(--color-primary-300)]" />
                </div>
                <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                  {profile.loanStats.total}
                </p>
                <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                  Total Loans
                </p>
              </div>
              <div className="rounded-[8px] bg-[var(--color-neutral-50)] p-[16px]">
                <div className="mb-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[#EFF8FF]">
                  <Clock className="h-[16px] w-[16px]" style={{ color: 'var(--color-primary-300)' }} />
                </div>
                <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                  {profile.loanStats.active}
                </p>
                <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                  Active
                </p>
              </div>
              <div className="rounded-[8px] bg-[var(--color-neutral-50)] p-[16px]">
                <div className="mb-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[6px]" style={{ backgroundColor: '#ECFDF3' }}>
                  <Star className="h-[16px] w-[16px] text-[var(--color-accent-green)]" />
                </div>
                <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                  {profile.loanStats.returned}
                </p>
                <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                  Returned
                </p>
              </div>
              <div className="rounded-[8px] bg-[var(--color-neutral-50)] p-[16px]">
                <div className="mb-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[6px]" style={{ backgroundColor: '#FEF3F2' }}>
                  <Clock className="h-[16px] w-[16px] text-[var(--color-accent-red)]" />
                </div>
                <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                  {profile.loanStats.overdue}
                </p>
                <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                  Overdue
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
