import client from './client';
import type { Book, PaginatedResponse } from '@/types';

interface BookListParams {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const getBooks = (params?: BookListParams) =>
  client.get<PaginatedResponse<Book>>('/api/books', { params }).then((res) => res.data);

export const getBook = (id: number) =>
  client.get<Book>(`/api/books/${id}`).then((res) => res.data);

export const getRecommendedBooks = (params?: { by?: string; categoryId?: number; page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Book>>('/api/books/recommend', { params }).then((res) => res.data);
