import client from './client';
import type { AdminOverview, Book, Loan, User, PaginatedResponse } from '@/types';

export const getOverview = () =>
  client.get<AdminOverview>('/api/admin/overview').then((res) => res.data);

export const getAdminBooks = (params?: { status?: string; q?: string; categoryId?: number; authorId?: number; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Book>>('/api/admin/books', { params }).then((res) => res.data);

export const getAdminUsers = (params?: { q?: string; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<User>>('/api/admin/users', { params }).then((res) => res.data);

export const getAdminLoans = (params?: { status?: string; q?: string; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Loan>>('/api/admin/loans', { params }).then((res) => res.data);

export const createAdminLoan = (data: { userId: number; bookId: number; dueAt?: string }) =>
  client.post<Loan>('/api/admin/loans', data).then((res) => res.data);

export const updateAdminLoan = (id: number, data: { dueAt?: string; status?: string }) =>
  client.patch<Loan>(`/api/admin/loans/${id}`, data).then((res) => res.data);

export const getOverdueLoans = () =>
  client.get<Loan[]>('/api/admin/loans/overdue').then((res) => res.data);

export const createBook = (data: FormData) =>
  client.post<Book>('/api/books', data).then((res) => res.data);

export const updateBook = (id: number, data: FormData) =>
  client.put<Book>(`/api/books/${id}`, data).then((res) => res.data);

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
