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

const timedRequest = async (label, request) => {
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

export const fetchCategoryPostsQuery = async ({ slug }) => {
  console.log('Route slug:', slug);
  const result = await timedRequest(`Posts:${slug}`, () =>
    getSassyCategoryPosts(slug),
  );

  console.log('Matched category:', result.category);
  console.log('Fetched posts:', result.posts);
  return result;
};

export const fetchPostBySlugQuery = async (slug) => {
  if (!slug) {
    return null;
  }

  return getSassyPostBySlug(slug);
};

export const fetchRelatedPostsQuery = async ({ categorySlug, slug }) => {
  if (!categorySlug) {
    return [];
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
    cacheTime: CATEGORY_CACHE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });
};
