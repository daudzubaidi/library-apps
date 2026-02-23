import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview, getBookReviews, deleteReview } from '@/api/reviews';

export function useBookReviews(bookId: number, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['reviews', bookId, params],
    queryFn: () => getBookReviews(bookId, params),
    enabled: !!bookId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: number; star: number; comment?: string }) => createReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.bookId] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
