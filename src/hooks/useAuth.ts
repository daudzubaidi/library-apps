import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login, register, getProfile } from '@/api/auth';
import { setCredentials, setUser, logout as logoutAction } from '@/store/authSlice';
import type { LoginPayload, RegisterPayload } from '@/types';

export { useLogin as useLoginMutation, useRegister as useRegisterMutation };

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

export function useProfile() {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => dispatch(logoutAction());
}
