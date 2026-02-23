import client from './client';
import type { Author, Book, PaginatedResponse } from '@/types';

export const getAuthors = (params?: { q?: string }) =>
  client.get<Author[]>('/api/authors', { params }).then((res) => res.data);

export const getPopularAuthors = (limit?: number) =>
  client.get<Author[]>('/api/authors/popular', { params: { limit } }).then((res) => res.data);

export const getAuthorBooks = (id: number, params?: { page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Book>>(`/api/authors/${id}/books`, { params }).then((res) => res.data);
