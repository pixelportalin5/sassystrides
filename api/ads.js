import { CACHE_CONTROL, getCached, setCached } from './_lib/cache.js';
import { fetchWordPress } from './_lib/fetchWordPress.js';

const CATEGORY_AD_IDS = ['1600', '1602', '1605', '1607', '1609', '1611', '1613'];

const extractImageUrl = (html = '') => {
  const match = String(html).match(/src=["']([^"']+)["']/i);
  return match?.[1]?.replace(/\\\//g, '/') || null;
};

const buildAdFromMedia = (adId, media, title = '') => {
  const sourceUrl = media?.source_url;
  const mediaDetails = media?.media_details || {};
  const width = mediaDetails.width || null;
  const height = mediaDetails.height || null;
  const alt = media?.alt_text || media?.title?.rendered || title || 'Advertisement';
  const widthAttr = width ? ` width="${width}"` : '';
  const heightAttr = height ? ` height="${height}"` : '';

  return {
    id: String(adId),
    shortcode: `[the_ad id="${adId}"]`,
    title,
    imageUrl: sourceUrl || null,
    width,
    height,
    html: sourceUrl
      ? `<div class="wp-ad-slot" data-ad-id="${adId}"><img src="${sourceUrl}" alt="${alt}"${widthAttr}${heightAttr} loading="lazy" decoding="async" /></div>`
      : '',
    source: 'wordpress-media',
  };
};

const normalizeSassyBanner = (banner) => {
  const html = typeof banner.html === 'string' ? banner.html.trim() : '';
  const imageUrl = extractImageUrl(html);

  return {
    id: String(banner.id),
    shortcode: banner.shortcode || `[the_ad id="${banner.id}"]`,
    title: banner.title || '',
    html,
    imageUrl,
    width: null,
    height: null,
    source: 'sassy-banners',
  };
};

const fetchCategoryAds = async () => {
  const includeIds = CATEGORY_AD_IDS.join(',');
  const adsResponse = await fetchWordPress(
    `/wp-json/wp/v2/advanced_ads?include=${includeIds}&per_page=${CATEGORY_AD_IDS.length}&orderby=include`,
  );

  if (!adsResponse.ok) {
    throw new Error(`advanced_ads request failed (${adsResponse.status})`);
  }

  const advancedAds = await adsResponse.json();
  const advancedAdsById = new Map(
    (Array.isArray(advancedAds) ? advancedAds : []).map((adPost) => [String(adPost.id), adPost]),
  );

  const entries = await Promise.all(
    CATEGORY_AD_IDS.map(async (adId) => {
      const mediaResponse = await fetchWordPress(
        `/wp-json/wp/v2/media?parent=${adId}&per_page=1`,
      );

      if (!mediaResponse.ok) {
        return [adId, null];
      }

      const mediaItems = await mediaResponse.json();

      if (!Array.isArray(mediaItems) || !mediaItems.length) {
        return [adId, null];
      }

      const title = advancedAdsById.get(String(adId))?.title?.rendered || '';
      const ad = buildAdFromMedia(adId, mediaItems[0], title);

      return [adId, ad?.imageUrl ? ad : null];
    }),
  );

  return Object.fromEntries(entries.filter(([, ad]) => ad));
};

const fetchHomepageBanners = async () => {
  const bannersResponse = await fetchWordPress('/wp-json/sassy/v1/banners');

  if (!bannersResponse.ok) {
    throw new Error(`banners request failed (${bannersResponse.status})`);
  }

  const banners = await bannersResponse.json();
  const byId = {};

  (Array.isArray(banners) ? banners : []).forEach((banner) => {
    const normalized = normalizeSassyBanner(banner);

    if (normalized.imageUrl || normalized.html) {
      byId[normalized.id] = normalized;
    }
  });

  return byId;
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const scope = typeof request.query.scope === 'string' ? request.query.scope : 'all';
  const cacheKey = `ads:${scope}`;
  const cached = getCached(cacheKey);

  if (cached) {
    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'HIT');
    response.status(200).json(cached);
    return;
  }

  try {
    const payload = {};

    if (scope === 'category' || scope === 'all') {
      payload.category = await fetchCategoryAds();
    }

    if (scope === 'homepage' || scope === 'all') {
      payload.homepage = await fetchHomepageBanners();
    }

    setCached(cacheKey, payload);

    response.setHeader('Cache-Control', CACHE_CONTROL);
    response.setHeader('X-Cache', 'MISS');
    response.status(200).json(payload);
  } catch (error) {
    response.status(500).json({ error: error.message || 'Ads proxy failed' });
  }
}
