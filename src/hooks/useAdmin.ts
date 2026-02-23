import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/api/admin';

export function useAdminOverview() {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: adminApi.getOverview,
  });
}

export function useAdminBooks(params?: { status?: string; q?: string; categoryId?: number; authorId?: number; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin-books', params],
    queryFn: () => adminApi.getAdminBooks(params),
  });
}

export function useAdminUsers(params?: { q?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getAdminUsers(params),
  });
}

export function useAdminLoans(params?: { status?: string; q?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin-loans', params],
    queryFn: () => adminApi.getAdminLoans(params),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => adminApi.createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => adminApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
