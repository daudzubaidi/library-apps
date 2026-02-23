import { useQuery } from '@tanstack/react-query';
import { getBooks, getBook, getRecommendedBooks } from '@/api/books';

export function useBooks(params?: { q?: string; categoryId?: number; authorId?: number; minRating?: number; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => getBooks(params),
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });
}

export function useRecommendedBooks(params?: { by?: string; categoryId?: number; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['recommended-books', params],
    queryFn: () => getRecommendedBooks(params),
  });
}
