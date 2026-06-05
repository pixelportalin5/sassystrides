import axios from 'axios';

export const SASSY_API_BASE_URL = '/wp-json/sassy/v1';
export const REQUEST_TIMEOUT_MS = 5000;

const sassyApi = axios.create({
  baseURL: SASSY_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  params: {
    v: '20260601',
  },
});

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

const getImageUrl = (post) =>
  post?.image?.url ||
  post?.hero ||
  post?.image?.hero ||
  post?.thumbnail ||
  '';

const normalizeSassyCard = (post) => ({
  id: post?.id,
  slug: post?.slug || '',
  date: post?.date || '',
  title: toRendered(post?.title),
  excerpt: toRendered(post?.excerpt),
  categories: post?.category?.id ? [post.category.id] : [],
  tags: [],
  category: post?.category || null,
  categoryName: post?.category?.name || 'Editorial',
  categorySlug: post?.category?.slug || '',
  image: getImageUrl(post),
  heroImage: post?.hero || post?.image?.hero || post?.image?.full || getImageUrl(post),
  imageAlt: post?.image?.alt || post?.title || 'Sassy Strides editorial feature',
  imageSrcSet: post?.image?.srcset || undefined,
  imageSizes:
    post?.image?.sizes || '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
  authorName: post?.author?.name || 'Sassy Strides',
  tagNames: post?.tags?.map((tag) => tag.name) || [],
  tagSlugs: post?.tags?.map((tag) => tag.slug) || [],
  authorAvatar: post?.author?.avatar || '',
});

const normalizeSassyArticle = (post) => ({
  ...normalizeSassyCard(post),
  content: toRendered(post?.content),
  authorName: post?.author?.name || 'Sassy Strides',
  authorAvatar: post?.author?.avatar || '',
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

export const getSassyHomepage = async () => {
  const { data } = await sassyApi.get('/homepage');
  const parsedPosts = parsePostsResponse(data);
  return parsedPosts.map(normalizeSassyCard);
};

export const getSassyCategoryPosts = async (slug) => {
  const { data } = await sassyApi.get(`/category/${slug}`);
  return {
    category: data?.category || null,
    posts: (data?.posts || []).map(normalizeSassyCard),
  };
};

export const getSassyPostBySlug = async (slug) => {
  if (!slug) {
    return null;
  }

  const { data } = await sassyApi.get(`/post/${slug}`);
  const post = parsePostResponse(data);

  return post ? normalizeSassyArticle(post) : null;
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
