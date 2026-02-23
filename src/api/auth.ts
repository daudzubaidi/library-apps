import client from './client';
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '@/types';

export const login = (data: LoginPayload) =>
  client.post<LoginResponse>('/api/auth/login', data).then((res) => res.data);

export const register = (data: RegisterPayload) =>
  client.post<{ token: string; user: User }>('/api/auth/register', data).then((res) => res.data);
