import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userSchema, type LoginInput, type RegisterInput, type User } from '@wos/shared';
import { api, ApiError } from '@/lib/api';

export const meQueryKey = ['me'] as const;

/** Usuario con sesión, o `null` si no la hay. Es la única fuente de verdad de la sesión en el front. */
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: async ({ signal }): Promise<User | null> => {
      try {
        return await api('/me', { schema: userSchema, signal });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginInput) => api('/auth/login', { method: 'POST', body, schema: userSchema }),
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterInput) => api('/auth/register', { method: 'POST', body, schema: userSchema }),
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey, null);
      // Nada de lo cacheado con la sesión anterior debe sobrevivir
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== meQueryKey[0] });
    },
  });
}
