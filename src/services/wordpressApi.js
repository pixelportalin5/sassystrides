import axios from 'axios';
import { getSassyApiBaseUrl } from '../config/wordpress';

export const SASSY_API_BASE_URL = getSassyApiBaseUrl();
export const REQUEST_TIMEOUT_MS = 15000;
export const DEFAULT_ARTICLE_IMAGE =
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80';
export const DEFAULT_AUTHOR_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80';

const isDev = import.meta.env.DEV;

const sanitizeSlug = (slug = '') => {
  const decoded = decodeURIComponent(String(slug)).trim();

  if (!decoded || decoded === 'undefined' || decoded === 'null') {
    return '';
  }

  return decoded.replace(/^\/+|\/+$/g, '');
};

const buildApiPath = (segment, slug = '') => {
  const cleanSlug = sanitizeSlug(slug);

  if (!cleanSlug) {
    return null;
  }

  return `/${segment}/${encodeURIComponent(cleanSlug)}`.replace(/\/{2,}/g, '/');
};

const logDebug = (label, payload) => {
  if (isDev) {
    console.debug(`[sassy-api] ${label}`, payload);
  }
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  const raw = await response.text();

  if (!raw.trim()) {
    return null;
  }

  if (!contentType.includes('json') && raw.trim().startsWith('<')) {
    throw new Error('API returned HTML instead of JSON. Check proxy configuration.');
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('API returned malformed JSON.');
  }
};

const browserFetchAdapter = async (config) => {
  const url = axios.getUri(config);
  const method = (config.method || 'get').toUpperCase();

  logDebug('request', { method, url });

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...config.headers,
    },
    signal: config.signal,
    redirect: 'manual',
  });

  logDebug('response', {
    url,
    status: response.status,
    redirected: response.redirected,
    location: response.headers.get('location'),
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location') || 'unknown';
    throw new Error(
      `API redirect blocked (${response.status} → ${location}). Disable redirecting browser extensions and verify the Vite proxy.`,
    );
  }

  if (!response.ok) {
    throw new Error(`Article request failed with status ${response.status}.`);
  }

  const data = await parseResponseBody(response);

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config,
    request: response,
  };
};

const sassyApi = axios.create({
  baseURL: SASSY_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  params: {
    v: '20260601',
  },
  headers: {
    Accept: 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
  ...(typeof window !== 'undefined' ? { adapter: browserFetchAdapter } : {}),
});

sassyApi.interceptors.request.use((config) => {
  const url = axios.getUri(config);
  logDebug('axios-request', { method: config.method, url });
  return config;
});

sassyApi.interceptors.response.use(
  (response) => {
    logDebug('axios-response', {
      url: axios.getUri(response.config),
      status: response.status,
      dataType: typeof response.data,
    });
    return response;
  },
  (error) => {
    const url = error.config ? axios.getUri(error.config) : 'unknown';
    logDebug('axios-error', {
      url,
      message: error.message,
      status: error.response?.status ?? null,
      location: error.response?.headers?.location ?? null,
    });
    return Promise.reject(error);
  },
);

const toRendered = (value = '') => {
  if (value && typeof value === 'object' && 'rendered' in value) {
    return { rendered: value.rendered || '' };
  }

  return { rendered: value || '' };
};

const parsePostResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  if (data.post && typeof data.post === 'object') {
    return data.post;
  }

  if (data.id || data.slug) {
    return data;
  }

  return null;
};

const getCardImageUrl = (post) =>
  post?.image?.medium_large ||
  post?.image?.medium ||
  post?.image?.url ||
  post?.thumbnail ||
  post?.image?.large ||
  DEFAULT_ARTICLE_IMAGE;

const getHeroImageUrl = (post) =>
  post?.hero ||
  post?.image?.hero ||
  post?.image?.large ||
  post?.image?.full ||
  post?.image?.url ||
  post?.thumbnail ||
  DEFAULT_ARTICLE_IMAGE;

const getTitleText = (post) => {
  const title = post?.title;

  if (typeof title === 'string') {
    return title;
  }

  if (title && typeof title === 'object' && 'rendered' in title) {
    return title.rendered || '';
  }

  return '';
};

const normalizeSassyCard = (post) => {
  const image = getCardImageUrl(post);
  const heroImage = getHeroImageUrl(post);

  return {
    id: post?.id,
    slug: post?.slug || '',
    date: post?.date || '',
    title: toRendered(post?.title),
    excerpt: toRendered(post?.excerpt),
    categories: post?.category?.id ? [post.category.id] : [],
    tags: Array.isArray(post?.tags) ? post.tags : [],
    category: post?.category || null,
    categoryName: post?.category?.name || 'Editorial',
    categorySlug: post?.category?.slug || 'fashion',
    image,
    heroImage,
    imageAlt: post?.image?.alt || getTitleText(post) || 'Sassy Strides editorial feature',
    imageSrcSet: post?.image?.srcset || undefined,
    imageSizes:
      post?.image?.sizes || '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
    authorName: post?.author?.name || 'Sassy Strides',
    tagNames: Array.isArray(post?.tags)
      ? post.tags.map((tag) => tag?.name).filter(Boolean)
      : [],
    tagSlugs: Array.isArray(post?.tags)
      ? post.tags.map((tag) => tag?.slug).filter(Boolean)
      : [],
    authorAvatar: post?.author?.avatar || DEFAULT_AUTHOR_AVATAR,
  };
};

const normalizeSassyArticle = (post) => ({
  ...normalizeSassyCard(post),
  content: toRendered(post?.content),
  authorName: post?.author?.name || 'Sassy Strides',
  authorAvatar: post?.author?.avatar || DEFAULT_AUTHOR_AVATAR,
});

const parsePostsResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.posts)) {
    return data.posts;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

const requestSassy = async (path) => {
  if (!path) {
    return null;
  }

  const { data } = await sassyApi.get(path);
  return data;
};

export const getSassyHomepage = async () => {
  const data = await requestSassy('/homepage');
  const parsedPosts = parsePostsResponse(data);
  return parsedPosts.map(normalizeSassyCard);
};

export const getSassyCategoryPosts = async (slug) => {
  const path = buildApiPath('category', slug);

  if (!path) {
    return { category: null, posts: [] };
  }

  const data = await requestSassy(path);

  return {
    category: data?.category || null,
    posts: (data?.posts || []).map(normalizeSassyCard),
  };
};

export const getSassyPostBySlug = async (slug) => {
  const cleanSlug = sanitizeSlug(slug);

  if (!cleanSlug) {
    logDebug('post-skipped', { reason: 'empty-slug', slug });
    return null;
  }

  const path = buildApiPath('post', cleanSlug);

  if (!path) {
    logDebug('post-skipped', { reason: 'invalid-path', slug: cleanSlug });
    return null;
  }

  try {
    logDebug('post-fetch-start', { slug: cleanSlug, path });

    const data = await requestSassy(path);
    const post = parsePostResponse(data);
    const normalized = post ? normalizeSassyArticle(post) : null;

    logDebug('post-fetch-result', {
      slug: cleanSlug,
      rawId: post?.id ?? null,
      normalizedId: normalized?.id ?? null,
      hasContent: Boolean(normalized?.content?.rendered),
    });

    return normalized;
  } catch (error) {
    const status = error?.response?.status;
    const message = status
      ? `Article request failed with status ${status}.`
      : error?.message || 'Article request failed.';

    logDebug('post-fetch-error', { slug: cleanSlug, message });
    throw new Error(message);
  }
};

export const normalizePost = (post) => post;

export const stripHtml = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

export const getReadingTime = (html = '') => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

export default sassyApi;
