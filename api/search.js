import { CACHE_CONTROL, getCached, setCached } from './_lib/cache.js';
import { fetchWordPress } from './_lib/fetchWordPress.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';

  if (query.length < 2) {
    response.status(200).json({ posts: [] });
    return;
  }

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);

  if (cached) {
    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'HIT');
    response.status(200).json(cached);
    return;
  }

  try {
    const path =
      `/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}` +
      '&per_page=8&_fields=id,slug,title';

    const wpResponse = await fetchWordPress(path);

    if (!wpResponse.ok) {
      response.status(wpResponse.status).json({
        error: `WordPress search request failed (${wpResponse.status})`,
      });
      return;
    }

    const items = await wpResponse.json();
    const posts = (Array.isArray(items) ? items : []).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title?.rendered || '',
    }));

    const payload = { posts };
    setCached(cacheKey, payload);

    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'MISS');
    response.status(200).json(payload);
  } catch (error) {
    response.status(500).json({ error: error.message || 'Search proxy failed' });
  }
}
