import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, removeFromCart, clearCart } from '@/api/cart';
import { useDispatch } from 'react-redux';
import { setCartCount } from '@/store/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await getCart();
      dispatch(setCartCount(data.items?.length ?? 0));
      return data;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => addToCart(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
