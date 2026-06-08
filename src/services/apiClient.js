import { trackRequest } from '../utils/requestTracker';

const CACHE_TTL_MS = 60 * 60 * 1000;
const clientCache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCached = (key) => {
  const entry = clientCache.get(key);

  if (!entry || Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    clientCache.delete(key);
    return null;
  }

  return entry.data;
};

const setCached = (key, data) => {
  clientCache.set(key, {
    data,
    fetchedAt: Date.now(),
  });
};

export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 429 && attempt < maxRetries) {
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      console.warn('[apiClient] 429 received, retrying', { url, attempt: attempt + 1, delay });
      await sleep(delay);
      continue;
    }

    return response;
  }

  throw new Error(`Request exhausted retries: ${url}`);
};

const requestJson = async (label, url, { cacheKey } = {}) => {
  trackRequest(label, url);

  if (cacheKey) {
    const cached = getCached(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const response = await fetchWithRetry(url);

  if (!response.ok) {
    console.error('[apiClient] request failed', {
      label,
      url,
      status: response.status,
    });
    throw new Error(`${label} failed with status ${response.status}`);
  }

  const data = await response.json();

  if (cacheKey) {
    setCached(cacheKey, data);
  }

  return data;
};

const useProxyApi = () => !import.meta.env.DEV;

export const getPostsUrl = (category) => {
  if (useProxyApi()) {
    return category
      ? `/api/posts?category=${encodeURIComponent(category)}`
      : '/api/posts';
  }

  return category
    ? `/wp-json/sassy/v1/category/${encodeURIComponent(category)}?v=20260601`
    : '/wp-json/sassy/v1/homepage?v=20260601';
};

export const getPostUrl = (slug) => {
  if (useProxyApi()) {
    return `/api/post/${encodeURIComponent(slug)}`;
  }

  return `/wp-json/sassy/v1/post/${encodeURIComponent(slug)}?v=20260601`;
};

export const getAdsUrl = (scope = 'category') => {
  if (useProxyApi()) {
    return `/api/ads?scope=${encodeURIComponent(scope)}`;
  }

  return null;
};

export const fetchPostsApi = async (category) => {
  const url = getPostsUrl(category);
  const cacheKey = category ? `posts:category:${category}` : 'posts:homepage';
  return requestJson(category ? 'category-posts' : 'homepage-posts', url, { cacheKey });
};

export const fetchPostApi = async (slug) => {
  const url = getPostUrl(slug);
  return requestJson('article-post', url, { cacheKey: `post:${slug}` });
};

export const fetchAdsApi = async (scope = 'category') => {
  const url = getAdsUrl(scope);

  if (!url) {
    return null;
  }

  return requestJson(`ads-${scope}`, url, { cacheKey: `ads:${scope}` });
};
