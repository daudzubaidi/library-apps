import client from './client';
import type { UserProfile, Loan, Review, PaginatedResponse } from '@/types';

export const getProfile = () =>
  client.get<UserProfile>('/api/me').then((res) => res.data);

export const updateProfile = (data: FormData) =>
  client.patch('/api/me', data).then((res) => res.data);

export const getMyLoans = (params?: { status?: string; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Loan>>('/api/me/loans', { params }).then((res) => res.data);

export const getMyReviews = (params?: { q?: string; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Review>>('/api/me/reviews', { params }).then((res) => res.data);
