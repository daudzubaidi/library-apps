import client from './client';
import type { Review, PaginatedResponse } from '@/types';
import { extractPaginated } from './mappers';

export const createReview = (data: { bookId: number; star: number; comment?: string }) =>
  client.post('/api/reviews', data).then((res) => res.data as Review);

export const getBookReviews = (bookId: number, params?: { page?: number; limit?: number }) =>
  client.get(`/api/reviews/book/${bookId}`, { params }).then((res) => {
    const d = res.data as Record<string, unknown>;
    return extractPaginated<Review>(d, 'reviews') as PaginatedResponse<Review>;
  });

export const deleteReview = (id: number) =>
  client.delete(`/api/reviews/${id}`).then((res) => res.data);
