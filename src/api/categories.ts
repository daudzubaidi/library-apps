import client from './client';
import type { Category } from '@/types';

export const getCategories = () =>
  client.get('/api/categories').then((res) => {
    const d = res.data as Record<string, unknown>;
    return (d?.categories ?? []) as Category[];
  });
