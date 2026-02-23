import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login, register } from '@/api/auth';
import { setCredentials, logout as logoutAction } from '@/store/authSlice';
import type { LoginPayload, RegisterPayload } from '@/types';

export function useLogin() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
    },
  });
}

export function useRegister() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
    },
  });
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => dispatch(logoutAction());
}
