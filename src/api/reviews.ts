import client from './client';
import type { Review, PaginatedResponse } from '@/types';

export const createReview = (data: { bookId: number; star: number; comment?: string }) =>
  client.post<Review>('/api/reviews', data).then((res) => res.data);

export const getBookReviews = (bookId: number, params?: { page?: number; limit?: number }) =>
  client.get<PaginatedResponse<Review>>(`/api/reviews/book/${bookId}`, { params }).then((res) => res.data);

export const deleteReview = (id: number) =>
  client.delete(`/api/reviews/${id}`).then((res) => res.data);
