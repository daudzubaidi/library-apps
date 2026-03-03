import client from './client';
import type { Cart } from '@/types';

export const getCart = () =>
  client.get('/api/cart').then((res) => {
    const d = res.data as Record<string, unknown>;
    return {
      id: (d?.cartId as number) ?? 0,
      userId: (d?.userId as number) ?? 0,
      items: (d?.items ?? []) as Cart['items'],
    } as Cart;
  });

export const addToCart = (bookId: number) =>
  client.post('/api/cart/items', { bookId }).then((res) => res.data);

export const removeFromCart = (itemId: number) =>
  client.delete(`/api/cart/items/${itemId}`).then((res) => res.data);

export const clearCart = () =>
  client.delete('/api/cart').then((res) => res.data);

export const getCheckoutPayload = () =>
  client.get('/api/cart/checkout').then((res) => res.data);
