import client from './client';
import type { UserProfile, Loan, Review, PaginatedResponse } from '@/types';
import { mapLoan, extractPaginated } from './mappers';

export const getProfile = () =>
  client.get('/api/me').then((res) => {
    const d = res.data as Record<string, unknown>;
    const profile = (d?.profile ?? {}) as Record<string, unknown>;
    const loanStats = (d?.loanStats ?? {}) as Record<string, unknown>;
    return {
      ...profile,
      loanStats: {
        total: (loanStats.total as number) ?? 0,
        active: (loanStats.borrowed as number) ?? 0,
        returned: (loanStats.returned as number) ?? 0,
        overdue: (loanStats.late as number) ?? 0,
      },
    } as UserProfile;
  });

export const updateProfile = (data: FormData) =>
  client.patch('/api/me', data).then((res) => res.data);

export const getMyLoans = (params?: { status?: string; page?: number; limit?: number }) =>
  client.get('/api/me/loans', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Loan>(d, 'loans', mapLoan) as PaginatedResponse<Loan>;
  });

export const getMyReviews = (params?: { q?: string; page?: number; limit?: number }) =>
  client.get('/api/me/reviews', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Review>(d, 'reviews') as PaginatedResponse<Review>;
  });
