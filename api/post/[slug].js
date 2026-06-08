import { CACHE_CONTROL, getCached, setCached } from '../_lib/cache.js';
import { fetchWordPress } from '../_lib/fetchWordPress.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const slug = typeof request.query.slug === 'string' ? request.query.slug.trim() : '';

  if (!slug) {
    response.status(400).json({ error: 'Missing slug' });
    return;
  }

  const cacheKey = `post:${slug}`;
  const cached = getCached(cacheKey);

  if (cached) {
    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'HIT');
    response.status(200).json(cached);
    return;
  }

  try {
    const path = `/wp-json/sassy/v1/post/${encodeURIComponent(slug)}?v=20260601`;
    const wpResponse = await fetchWordPress(path);

    if (!wpResponse.ok) {
      response.status(wpResponse.status).json({
        error: `WordPress post request failed (${wpResponse.status})`,
      });
      return;
    }

    const data = await wpResponse.json();
    setCached(cacheKey, data);

    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'MISS');
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message || 'Post proxy failed' });
  }
}
