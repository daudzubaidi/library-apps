import client from './client';
import type { Loan, PaginatedResponse } from '@/types';

export const borrowBook = (data: { bookId: number; days: number }) =>
  client.post<Loan>('/api/loans', data).then((res) => res.data);

export const returnBook = (id: number) =>
  client.patch<Loan>(`/api/loans/${id}/return`).then((res) => res.data);

export const getMyLoans = (params?: { status?: string; q?: string; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Loan>>('/api/loans/my', { params }).then((res) => res.data);

export const checkoutFromCart = (data: { itemIds: number[]; days: number; borrowDate?: string }) =>
  client.post('/api/loans/from-cart', data).then((res) => res.data);
