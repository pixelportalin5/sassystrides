const stripTrailingSlash = (value = '') => value.replace(/\/$/, '');

export const WORDPRESS_SITE_URL = stripTrailingSlash(
  import.meta.env.VITE_WORDPRESS_URL || 'https://sassystrides.com',
);

const wordpressHostname = new URL(WORDPRESS_SITE_URL).hostname;

/**
 * Posts API base URL.
 * - localhost / Vercel: same-origin `/wp-json/sassy/v1` (Vite proxy or vercel.json rewrite → sassystrides.com)
 * - WordPress-hosted frontend: absolute URL on sassystrides.com
 * Banner images always use absolute wpContentUrl() — never this path.
 */
export const getSassyApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/wp-json/sassy/v1';
  }

  if (typeof window !== 'undefined' && window.location.hostname !== wordpressHostname) {
    return '/wp-json/sassy/v1';
  }

  return `${WORDPRESS_SITE_URL}/wp-json/sassy/v1`;
};

export const SASSY_API_BASE_URL = getSassyApiBaseUrl();

export const getWordPressRestBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/wp-json/wp/v2';
  }

  if (typeof window !== 'undefined' && window.location.hostname !== wordpressHostname) {
    return '/wp-json/wp/v2';
  }

  return `${WORDPRESS_SITE_URL}/wp-json/wp/v2`;
};

export const wpContentUrl = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${WORDPRESS_SITE_URL}/wp-content/uploads/${cleanPath}`;
};

export const logWordPressConfig = () => {
  const apiBaseUrl = getSassyApiBaseUrl();

  console.log('[wordpress] API base URL:', apiBaseUrl);
  console.log('[wordpress] API resolves to:', WORDPRESS_SITE_URL);
  console.log('[wordpress] Site URL:', WORDPRESS_SITE_URL);
  console.log('[wordpress] VITE_WORDPRESS_URL:', import.meta.env.VITE_WORDPRESS_URL ?? '(not set)');
  console.log('[wordpress] import.meta.env.MODE:', import.meta.env.MODE);
  console.log('[wordpress] import.meta.env.DEV:', import.meta.env.DEV);
  console.log('[wordpress] import.meta.env.PROD:', import.meta.env.PROD);

  if (typeof window !== 'undefined') {
    console.log('[wordpress] window.location.origin:', window.location.origin);

    if (apiBaseUrl.startsWith('/')) {
      console.log(
        '[wordpress] Using same-origin API proxy →',
        WORDPRESS_SITE_URL,
      );
    }
  }
};
