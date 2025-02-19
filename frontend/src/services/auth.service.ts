import { useQueryClient } from '@tanstack/react-query';
import { apiService } from './api.service';
import { useCustomQuery, useCustomMutation } from '@/hooks/use-query-hooks';

interface AuthCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  const { mutate: login, ...rest } = useCustomMutation({
    mutationFn: apiService.auth.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { login, ...rest };
};

export const useRegister = () => {
  const { mutate: registerMutation, ...rest } = useCustomMutation({
    mutationFn: apiService.auth.register,
  });

  const register = (data: any, callbacks?: AuthCallbacks) => {
    return registerMutation(data, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { register, ...rest };
};

export const useUser = () => {
  const { data: userData, ...rest } = useCustomQuery({
    queryKey: ['user'],
    queryFn: apiService.auth.getProfile,
    enabled: !!localStorage.getItem('token'),
  });
  return { userData, ...rest };
};

export const getUser = async () => {
  const response = await apiService.auth.getProfile();
  return response;
}; 