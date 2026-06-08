import { CATEGORY_AD_IDS, HOMEPAGE_AD_IDS } from '../constants/adSlotMappings';
import { getSassyApiBaseUrl, getWordPressRestBaseUrl } from '../config/wordpress';

const CACHE_TTL_MS = 5 * 60 * 1000;
const adCache = new Map();

const normalizeAdId = (adId) => String(adId).trim();

const extractImageUrl = (html = '') => {
  const match = String(html).match(/src=["']([^"']+)["']/i);
  return match?.[1]?.replace(/\\\//g, '/') || null;
};

const isFresh = (entry) => entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS;

const setCache = (adId, ad) => {
  adCache.set(normalizeAdId(adId), {
    ad,
    fetchedAt: Date.now(),
  });
};

const getCache = (adId) => {
  const entry = adCache.get(normalizeAdId(adId));
  return isFresh(entry) ? entry.ad : null;
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Advanced Ads request failed (${response.status}) for ${url}`);
  }

  return response.json();
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
    id: normalizeAdId(adId),
    shortcode: `[the_ad id="${normalizeAdId(adId)}"]`,
    title,
    imageUrl: sourceUrl || null,
    width,
    height,
    html: sourceUrl
      ? `<div class="wp-ad-slot" data-ad-id="${normalizeAdId(adId)}"><img src="${sourceUrl}" alt="${alt}"${widthAttr}${heightAttr} loading="lazy" decoding="async" /></div>`
      : '',
    source: 'wordpress-media',
  };
};

const normalizeSassyBanner = (banner) => {
  const html = typeof banner.html === 'string' ? banner.html.trim() : '';
  const imageUrl = extractImageUrl(html);

  return {
    id: normalizeAdId(banner.id),
    shortcode: banner.shortcode || `[the_ad id="${banner.id}"]`,
    title: banner.title || '',
    html,
    imageUrl,
    width: null,
    height: null,
    source: 'sassy-banners',
  };
};

export const getAdImageUrl = (ad) => {
  if (!ad) {
    return null;
  }

  const directUrl = typeof ad.imageUrl === 'string' ? ad.imageUrl.trim() : '';
  if (directUrl) {
    return directUrl;
  }

  return extractImageUrl(ad.html);
};

export const isRenderableAd = (ad) => Boolean(getAdImageUrl(ad));

const logAdResult = (adId, ad) => {
  const imageUrl = ad?.imageUrl || extractImageUrl(ad?.html);

  console.log('[advancedAdsService] Ad response:', {
    id: adId,
    source: ad?.source || null,
    hasHtml: Boolean(ad?.html?.trim?.()),
    imageUrl: imageUrl || null,
  });

  if (!imageUrl) {
    console.warn('[advancedAdsService] Missing image URL for ad:', adId, ad);
  }
};

let homepageBannerPromise = null;

const loadHomepageBanners = async () => {
  if (!homepageBannerPromise) {
    homepageBannerPromise = fetchJson(`${getSassyApiBaseUrl()}/banners`)
      .then((data) => {
        const banners = Array.isArray(data) ? data : [];
        const byId = new Map();

        console.log('[advancedAdsService] Homepage banners API count:', banners.length);
        console.log(
          '[advancedAdsService] Homepage banners API IDs:',
          banners.map((banner) => banner.id),
        );

        banners.forEach((banner) => {
          const normalized = normalizeSassyBanner(banner);
          if (isRenderableAd(normalized)) {
            byId.set(normalized.id, normalized);
            setCache(normalized.id, normalized);
          }
        });

        return byId;
      })
      .catch((error) => {
        homepageBannerPromise = null;
        throw error;
      });
  }

  return homepageBannerPromise;
};

const loadAdMedia = async (adId) => {
  const restBaseUrl = getWordPressRestBaseUrl();
  const mediaItems = await fetchJson(`${restBaseUrl}/media?parent=${normalizeAdId(adId)}&per_page=1`);

  console.log('[advancedAdsService] Media response for ad', adId, mediaItems);

  if (!Array.isArray(mediaItems) || !mediaItems.length) {
    return null;
  }

  let title = '';

  try {
    const adPost = await fetchJson(`${restBaseUrl}/advanced_ads/${normalizeAdId(adId)}`);
    title = adPost?.title?.rendered || '';
  } catch {
    title = '';
  }

  return buildAdFromMedia(adId, mediaItems[0], title);
};

export const fetchAdById = async (adId) => {
  const normalizedId = normalizeAdId(adId);
  const cached = getCache(normalizedId);

  if (cached) {
    logAdResult(normalizedId, cached);
    return cached;
  }

  if (CATEGORY_AD_IDS.includes(normalizedId)) {
    try {
      const mediaAd = await loadAdMedia(normalizedId);

      if (mediaAd && isRenderableAd(mediaAd)) {
        setCache(normalizedId, mediaAd);
        logAdResult(normalizedId, mediaAd);
        return mediaAd;
      }
    } catch (error) {
      console.warn('[advancedAdsService] Category media lookup failed:', normalizedId, error.message);
    }
  }

  if (HOMEPAGE_AD_IDS.includes(normalizedId)) {
    try {
      const homepageBanners = await loadHomepageBanners();
      const homepageAd = homepageBanners.get(normalizedId);

      if (homepageAd) {
        setCache(normalizedId, homepageAd);
        logAdResult(normalizedId, homepageAd);
        return homepageAd;
      }
    } catch (error) {
      console.warn('[advancedAdsService] Homepage banner lookup failed:', normalizedId, error.message);
    }
  }

  if (!CATEGORY_AD_IDS.includes(normalizedId) && !HOMEPAGE_AD_IDS.includes(normalizedId)) {
    try {
      const mediaAd = await loadAdMedia(normalizedId);

      if (mediaAd && isRenderableAd(mediaAd)) {
        setCache(normalizedId, mediaAd);
        logAdResult(normalizedId, mediaAd);
        return mediaAd;
      }
    } catch (error) {
      console.warn('[advancedAdsService] Media lookup failed:', normalizedId, error.message);
    }
  }

  console.warn('[advancedAdsService] No ad found for ID:', normalizedId);
  return null;
};

export const validateAllConfiguredAds = async () => {
  const allIds = [...HOMEPAGE_AD_IDS, ...CATEGORY_AD_IDS];

  const results = await Promise.all(
    allIds.map(async (adId) => {
      const ad = await fetchAdById(adId);
      const imageUrl = ad?.imageUrl || extractImageUrl(ad?.html);

      return {
        id: adId,
        imageUrl: imageUrl || null,
        loadedSuccessfully: Boolean(imageUrl),
      };
    }),
  );

  console.log('[advancedAdsService] Validation report:', results);

  results
    .filter((result) => !result.loadedSuccessfully)
    .forEach((result) => {
      console.warn('[advancedAdsService] Ad missing image URL:', result.id);
    });

  return results;
};

export const prefetchAdsForPage = async (page) => {
  const ids = page === 'category' ? CATEGORY_AD_IDS : HOMEPAGE_AD_IDS;

  if (page !== 'category') {
    await loadHomepageBanners();
  }

  await Promise.all(ids.map((adId) => fetchAdById(adId)));
};

export const clearAdvancedAdsCache = () => {
  adCache.clear();
  homepageBannerPromise = null;
};
