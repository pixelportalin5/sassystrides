import { QueryClient } from '@tanstack/react-query';
import { CATEGORY_CACHE_TIME, CATEGORY_STALE_TIME } from './categoryQueries';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CATEGORY_STALE_TIME,
      gcTime: CATEGORY_CACHE_TIME,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
