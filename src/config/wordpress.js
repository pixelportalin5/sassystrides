const stripTrailingSlash = (value = '') => value.replace(/\/$/, '');

export const WORDPRESS_SITE_URL = stripTrailingSlash(
  import.meta.env.VITE_WORDPRESS_URL || 'https://sassystrides.com',
);

const useProxyApi = () => !import.meta.env.DEV;

/** @deprecated Use apiClient.getPostsUrl() — kept for dev proxy only */
export const getSassyApiBaseUrl = () =>
  useProxyApi() ? '/api' : '/wp-json/sassy/v1';

/** @deprecated Use apiClient.getAdsUrl() — kept for dev proxy only */
export const getWordPressRestBaseUrl = () => '/wp-json/wp/v2';

export const wpContentUrl = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${WORDPRESS_SITE_URL}/wp-content/uploads/${cleanPath}`;
};

export const getResolvedPostsApiUrl = () => {
  if (typeof window === 'undefined') {
    return `${WORDPRESS_SITE_URL}/api/posts`;
  }

  return useProxyApi()
    ? `${window.location.origin}/api/posts`
    : `${window.location.origin}/wp-json/sassy/v1`;
};

export const getResolvedAdsApiUrl = () => {
  if (typeof window === 'undefined') {
    return `${WORDPRESS_SITE_URL}/api/ads`;
  }

  return useProxyApi()
    ? `${window.location.origin}/api/ads`
    : `${window.location.origin}/wp-json/wp/v2`;
};

export const logWordPressConfig = () => {
  console.log('[wordpress] WordPress base URL:', WORDPRESS_SITE_URL);
  console.log('[wordpress] Posts API URL:', getResolvedPostsApiUrl());
  console.log('[wordpress] Ads API URL:', getResolvedAdsApiUrl());
  console.log('[wordpress] API mode:', useProxyApi() ? 'vercel-proxy (/api/*)' : 'dev-proxy (/wp-json/*)');
  console.log('[wordpress] VITE_WORDPRESS_URL:', import.meta.env.VITE_WORDPRESS_URL ?? '(not set)');

  if (typeof window !== 'undefined') {
    console.log('[wordpress] window.location.origin:', window.location.origin);
  }
};
