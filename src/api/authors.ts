import client from './client';
import type { Author, Book, PaginatedResponse } from '@/types';
import { mapBook, extractPaginated } from './mappers';

export const getAuthors = (params?: { q?: string }) =>
  client.get('/api/authors', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return (d?.authors ?? []) as Author[];
  });

export const getPopularAuthors = (limit?: number) =>
  client.get('/api/authors/popular', { params: { limit } }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return (d?.authors ?? []) as Author[];
  });

export const getAuthorBooks = (id: number, params?: { page?: number; limit?: number }) =>
  client.get(`/api/authors/${id}/books`, { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Book>(d, 'books', mapBook) as PaginatedResponse<Book>;
  });
