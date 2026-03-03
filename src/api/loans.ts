import client from './client';
import type { Loan, PaginatedResponse } from '@/types';
import { mapLoan, extractPaginated } from './mappers';

export const borrowBook = (data: { bookId: number; days: number }) =>
  client.post('/api/loans', data).then((res) => mapLoan(res.data as Record<string, unknown>));

export const returnBook = (id: number) =>
  client.patch(`/api/loans/${id}/return`).then((res) => mapLoan(res.data as Record<string, unknown>));

export const getMyLoans = (params?: { status?: string; q?: string; page?: number; limit?: number }) =>
  client.get('/api/loans/my', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Loan>(d, 'loans', mapLoan) as PaginatedResponse<Loan>;
  });

export const checkoutFromCart = (data: { itemIds: number[]; days: number; borrowDate?: string }) =>
  client.post('/api/loans/from-cart', data).then((res) => res.data);
