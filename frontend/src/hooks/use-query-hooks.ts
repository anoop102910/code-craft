import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation as useBaseMutation,
  useQuery as useBaseQuery,
  QueryKey,
} from "@tanstack/react-query";

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface MutationResult<T, _R> {
  mutate: (data: T, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => void;
  isPending: boolean;
  error: Error | null;
}

export const useCustomQuery = <T>(
  options: UseQueryOptions<T, Error, T, QueryKey>
): QueryResult<T> => {
  const { data, isLoading, error } = useBaseQuery<T, Error>({
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    data,
    isLoading,
    error: error || null,
  };
};

export const useCustomMutation = <T, R>(
  options: UseMutationOptions<R, Error, T>
): MutationResult<T, R> => {
  const { mutate: baseMutate, isPending, error } = useBaseMutation<R, Error, T>(options);

  const mutate = (
    data: T,
    callbacks?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    baseMutate(data, {
      onSuccess: response => {
        options.onSuccess?.(response, data, undefined);
        callbacks?.onSuccess?.();
      },
      onError: error => {
        options.onError?.(error, data, undefined);
        callbacks?.onError?.(error);
      },
    });
  };

  return {
    mutate,
    isPending,
    error: error || null,
  };
};
