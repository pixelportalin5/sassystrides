import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchHomepagePostsQuery,
  normalizePosts,
} from '../services/categoryQueries';

export const usePosts = () => {
  const homepageTimerRef = useRef(false);

  const postsQuery = useQuery({
    queryKey: categoryQueryKeys.homepagePosts,
    queryFn: fetchHomepagePostsQuery,
    staleTime: CATEGORY_STALE_TIME,
    cacheTime: CATEGORY_CACHE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });

  const normalizedPosts = useMemo(
    () => normalizePosts(postsQuery.data || []),
    [postsQuery.data],
  );
  const loading = postsQuery.isLoading;
  const error = postsQuery.error || null;

  useEffect(() => {
    if (!homepageTimerRef.current) {
      console.time('homepage');
      console.log('Fetching homepage');
      homepageTimerRef.current = true;
    }

    if (!loading && homepageTimerRef.current) {
      console.timeEnd('homepage');
      homepageTimerRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    console.log('Homepage query state', {
      status: postsQuery.status,
      isLoading: postsQuery.isLoading,
      isFetching: postsQuery.isFetching,
      isError: postsQuery.isError,
      postCount: normalizedPosts.length,
      error: postsQuery.error?.message || null,
    });
  }, [
    normalizedPosts.length,
    postsQuery.error,
    postsQuery.isError,
    postsQuery.isFetching,
    postsQuery.isLoading,
    postsQuery.status,
  ]);

  return {
    categories: [],
    error,
    loading,
    posts: normalizedPosts,
  };
};
