import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // retry: (failureCount, error) => {
      //   if (
      //     isAxiosError(error) &&
      //     (error.response?.status === STATUS_CODES.NOT_FOUND ||
      //       error.response?.status === STATUS_CODES.FORBIDDEN)
      //   )
      //     return false;

      //   return failureCount < 3;
      // },
      staleTime: 1 * 60 * 1000, // 1 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable automatic refetching when window regains focus
      refetchOnReconnect: 'always', // Always refetch on reconnect
      throwOnError: false,
    },
    mutations: {
      retry: 0,
      // If true, failed mutations will throw errors which can be caught by error boundaries
      // If false, errors will be handled silently and only trigger the onError callback
      throwOnError: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error, query) => {
      console.error('Query error:', error, query);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error, _variables, _context, mutation) => {
      console.error('Mutation error:', error, mutation);
    },
  }),
});
