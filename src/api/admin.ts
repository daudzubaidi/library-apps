import client from './client';
import type { AdminOverview, Book, Loan, User, PaginatedResponse } from '@/types';
import { mapBook, mapLoan, extractPaginated } from './mappers';

export const getOverview = () =>
  client.get('/api/admin/overview').then((res) => {
    const d = res.data as Record<string, unknown>;
    const totals = (d?.totals ?? {}) as Record<string, number>;
    const loans = (d?.loans ?? {}) as Record<string, number>;
    return {
      totalBooks: totals.books ?? 0,
      totalUsers: totals.users ?? 0,
      totalLoans: totals.loans ?? 0,
      activeLoans: loans.borrowed ?? 0,
      overdueLoans: loans.late ?? 0,
      returnedLoans: loans.returned ?? 0,
    } as AdminOverview;
  });

export const getAdminBooks = (params?: { status?: string; q?: string; categoryId?: number; authorId?: number; page?: number; limit?: number }) =>
  client.get('/api/admin/books', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Book>(d, 'books', mapBook) as PaginatedResponse<Book>;
  });

export const getAdminUsers = (params?: { q?: string; page?: number; limit?: number }) =>
  client.get('/api/admin/users', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<User>(d, 'users') as PaginatedResponse<User>;
  });

export const getAdminLoans = (params?: { status?: string; q?: string; page?: number; limit?: number }) =>
  client.get('/api/admin/loans', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Loan>(d, 'loans', mapLoan) as PaginatedResponse<Loan>;
  });

export const createAdminLoan = (data: { userId: number; bookId: number; dueAt?: string }) =>
  client.post('/api/admin/loans', data).then((res) => mapLoan((res.data ?? {}) as Record<string, unknown>));

export const updateAdminLoan = (id: number, data: { dueAt?: string; status?: string }) =>
  client.patch(`/api/admin/loans/${id}`, data).then((res) => mapLoan((res.data ?? {}) as Record<string, unknown>));

export const getOverdueLoans = () =>
  client.get('/api/admin/loans/overdue').then((res) => {
    const d = res.data;
    const loans = Array.isArray(d) ? d : ((d as Record<string, unknown>)?.loans ?? []) as Record<string, unknown>[];
    return (loans as Record<string, unknown>[]).map(mapLoan);
  });

export const createBook = (data: FormData) =>
  client.post('/api/books', data).then((res) => mapBook((res.data ?? {}) as Record<string, unknown>));

export const updateBook = (id: number, data: FormData) =>
  client.put(`/api/books/${id}`, data).then((res) => mapBook((res.data ?? {}) as Record<string, unknown>));

export const deleteBook = (id: number) =>
  client.delete(`/api/books/${id}`).then((res) => res.data);

export const createCategory = (data: { name: string }) =>
  client.post('/api/categories', data).then((res) => res.data);

export const updateCategory = (id: number, data: { name: string }) =>
  client.put(`/api/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id: number) =>
  client.delete(`/api/categories/${id}`).then((res) => res.data);

export const createAuthor = (data: { name: string; bio?: string }) =>
  client.post('/api/authors', data).then((res) => res.data);

export const updateAuthor = (id: number, data: { name: string; bio?: string }) =>
  client.put(`/api/authors/${id}`, data).then((res) => res.data);

export const deleteAuthor = (id: number) =>
  client.delete(`/api/authors/${id}`).then((res) => res.data);
