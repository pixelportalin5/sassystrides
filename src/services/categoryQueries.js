import {
  getSassyCategoryPosts,
  getSassyHomepage,
  getSassyPostBySlug,
} from './wordpressApi';

export const CATEGORY_STALE_TIME = 10 * 60 * 1000;
export const CATEGORY_CACHE_TIME = 30 * 60 * 1000;

export const categoryQueryKeys = {
  homepagePosts: ['sassy', 'homepage'],
  trendingPosts: ['sassy', 'homepage', 'trending'],
  categoryPosts: (slug) => ['sassy', 'category', slug],
  postBySlug: (slug) => ['sassy', 'post', slug],
  relatedPosts: (categorySlug, slug) => ['sassy', 'related', categorySlug, slug],
};

export const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const isDev = import.meta.env.DEV;

const timedRequest = async (label, request) => {
  if (!isDev) {
    return request();
  }

  console.time(label);
  try {
    return await request();
  } finally {
    console.timeEnd(label);
  }
};

export const fetchHomepagePostsQuery = async () =>
  timedRequest('Homepage Posts', () => getSassyHomepage());

export const fetchTrendingPostsQuery = async () =>
  timedRequest('Trending Posts', async () => {
    const posts = await getSassyHomepage();
    return posts.slice(0, 5);
  });

export const fetchCategoryPostsQuery = async ({ slug }) =>
  timedRequest(`Posts:${slug}`, () => getSassyCategoryPosts(slug));

export const fetchPostBySlugQuery = async (slug) => {
  if (!slug) {
    if (import.meta.env.DEV) {
      console.debug('[fetchPostBySlugQuery] skipped — empty slug');
    }
    return null;
  }

  if (import.meta.env.DEV) {
    console.debug('[fetchPostBySlugQuery] start', { slug });
  }

  const article = await getSassyPostBySlug(slug);

  if (import.meta.env.DEV) {
    console.debug('[fetchPostBySlugQuery] result', {
      slug,
      found: Boolean(article),
      id: article?.id ?? null,
    });
  }

  return article;
};

export const fetchRelatedPostsQuery = async ({ categorySlug, slug }, queryClient) => {
  if (!categorySlug) {
    return [];
  }

  const cached = queryClient?.getQueryData(categoryQueryKeys.categoryPosts(categorySlug));

  if (cached?.posts?.length) {
    return cached.posts.filter((post) => post.slug !== slug);
  }

  const result = await timedRequest(`Related:${categorySlug}`, () =>
    getSassyCategoryPosts(categorySlug),
  );

  return (result.posts || []).filter((post) => post.slug !== slug);
};

export const normalizePosts = (posts = []) => posts;

export const prefetchCategoryData = (queryClient, slug) => {
  const normalizedSlug = slugify(slug);

  queryClient.prefetchQuery({
    queryKey: categoryQueryKeys.categoryPosts(normalizedSlug),
    queryFn: () =>
      fetchCategoryPostsQuery({
        slug: normalizedSlug,
      }),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });
};

export const prefetchPostData = (queryClient, slug) => {
  const normalizedSlug = String(slug || '').trim();

  if (!normalizedSlug) {
    return;
  }

  queryClient.prefetchQuery({
    queryKey: categoryQueryKeys.postBySlug(normalizedSlug),
    queryFn: () => fetchPostBySlugQuery(normalizedSlug),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });
};

export const prefetchHomepageData = (queryClient) => {
  queryClient.prefetchQuery({
    queryKey: categoryQueryKeys.homepagePosts,
    queryFn: fetchHomepagePostsQuery,
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });
};
