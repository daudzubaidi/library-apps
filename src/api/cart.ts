import client from './client';
import type { Cart } from '@/types';

export const getCart = () =>
  client.get<Cart>('/api/cart').then((res) => res.data);

export const addToCart = (bookId: number) =>
  client.post('/api/cart/items', { bookId }).then((res) => res.data);

export const removeFromCart = (itemId: number) =>
  client.delete(`/api/cart/items/${itemId}`).then((res) => res.data);

export const clearCart = () =>
  client.delete('/api/cart').then((res) => res.data);

export const getCheckoutPayload = () =>
  client.get('/api/cart/checkout').then((res) => res.data);
