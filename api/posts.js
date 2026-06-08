import { CACHE_CONTROL, getCached, setCached } from './_lib/cache.js';
import { fetchWordPress } from './_lib/fetchWordPress.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const category = typeof request.query.category === 'string' ? request.query.category.trim() : '';
  const cacheKey = category ? `posts:category:${category}` : 'posts:homepage';
  const cached = getCached(cacheKey);

  if (cached) {
    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'HIT');
    response.status(200).json(cached);
    return;
  }

  try {
    const path = category
      ? `/wp-json/sassy/v1/category/${encodeURIComponent(category)}?v=20260601`
      : '/wp-json/sassy/v1/homepage?v=20260601';

    const wpResponse = await fetchWordPress(path);

    if (!wpResponse.ok) {
      response.status(wpResponse.status).json({
        error: `WordPress posts request failed (${wpResponse.status})`,
      });
      return;
    }

    const data = await wpResponse.json();
    setCached(cacheKey, data);

    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'MISS');
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message || 'Posts proxy failed' });
  }
}
