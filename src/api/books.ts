import client from './client';
import type { Book, PaginatedResponse } from '@/types';
import { mapBook, extractPaginated } from './mappers';

interface BookListParams {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const getBooks = (params?: BookListParams) =>
  client.get('/api/books', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Book>(d, 'books', mapBook) as PaginatedResponse<Book>;
  });

export const getBook = (id: number) =>
  client.get(`/api/books/${id}`).then((res) => mapBook(res.data as Record<string, unknown>));

export const getRecommendedBooks = (params?: { by?: string; categoryId?: number; page?: number; limit?: number }) =>
  client.get('/api/books/recommend', { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return ((d?.books as Record<string, unknown>[]) ?? []).map(mapBook);
  });
