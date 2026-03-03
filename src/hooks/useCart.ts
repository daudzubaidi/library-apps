import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, removeFromCart, clearCart } from '@/api/cart';
import { useDispatch, useSelector } from 'react-redux';
import { setCartCount } from '@/store/cartSlice';
import type { RootState } from '@/store';

export function useCart(enabled = true) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await getCart();
      dispatch(setCartCount(data.items?.length ?? 0));
      return data;
    },
    enabled: enabled && !!token,
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
