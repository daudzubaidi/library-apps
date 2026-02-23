import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowBook, returnBook, getMyLoans, checkoutFromCart } from '@/api/loans';

export function useMyLoans(params?: { status?: string; q?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['my-loans', params],
    queryFn: () => getMyLoans(params),
  });
}

export function useBorrowBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: number; days: number }) => borrowBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useCheckoutFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { itemIds: number[]; days: number; borrowDate?: string }) => checkoutFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
