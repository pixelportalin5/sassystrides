const stripTrailingSlash = (value = '') => value.replace(/\/$/, '');

export const WORDPRESS_SITE_URL = stripTrailingSlash(
  import.meta.env.VITE_WORDPRESS_URL || 'https://sassystrides.com',
);

/**
 * Posts API base URL.
 * Always uses same-origin `/wp-json/sassy/v1` so Vercel rewrites (or Vite dev proxy)
 * forward to WordPress. Direct cross-origin calls to sassystrides.com are blocked
 * by CORS in production (no Access-Control-Allow-Origin header on WP API).
 */
export const getSassyApiBaseUrl = () => '/wp-json/sassy/v1';

/**
 * WordPress REST API base URL for Advanced Ads media lookups.
 * Same-origin proxy via vercel.json → sassystrides.com/wp-json/wp/v2
 */
export const getWordPressRestBaseUrl = () => '/wp-json/wp/v2';

export const wpContentUrl = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${WORDPRESS_SITE_URL}/wp-content/uploads/${cleanPath}`;
};

export const getResolvedPostsApiUrl = () => {
  const base = getSassyApiBaseUrl();

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${base}`;
  }

  return `${WORDPRESS_SITE_URL}${base}`;
};

export const getResolvedAdsApiUrl = () => {
  const base = getWordPressRestBaseUrl();

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${base}`;
  }

  return `${WORDPRESS_SITE_URL}${base}`;
};

export const logWordPressConfig = () => {
  const postsApi = getResolvedPostsApiUrl();
  const adsApi = getResolvedAdsApiUrl();

  console.log('[wordpress] WordPress base URL:', WORDPRESS_SITE_URL);
  console.log('[wordpress] Posts API URL:', postsApi);
  console.log('[wordpress] Ads API URL:', adsApi);
  console.log('[wordpress] VITE_WORDPRESS_URL:', import.meta.env.VITE_WORDPRESS_URL ?? '(not set — using https://sassystrides.com)');
  console.log('[wordpress] MODE:', import.meta.env.MODE);
  console.log('[wordpress] PROD:', import.meta.env.PROD);

  if (typeof window !== 'undefined') {
    console.log('[wordpress] window.location.origin:', window.location.origin);
    console.log('[wordpress] API strategy: same-origin proxy via /wp-json/* rewrites');
  }
};
