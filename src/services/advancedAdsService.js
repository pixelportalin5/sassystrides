import { CATEGORY_AD_IDS, HOMEPAGE_AD_IDS } from '../constants/adSlotMappings';
import {
  getResolvedAdsApiUrl,
  getSassyApiBaseUrl,
  getWordPressRestBaseUrl,
} from '../config/wordpress';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CATEGORY_CACHE_TTL_MS = 60 * 60 * 1000;
const adCache = new Map();

const normalizeAdId = (adId) => String(adId).trim();

const extractImageUrl = (html = '') => {
  const match = String(html).match(/src=["']([^"']+)["']/i);
  return match?.[1]?.replace(/\\\//g, '/') || null;
};

const getCacheTtl = (adId) =>
  CATEGORY_AD_IDS.includes(normalizeAdId(adId)) ? CATEGORY_CACHE_TTL_MS : CACHE_TTL_MS;

const isFresh = (entry, adId) =>
  entry && Date.now() - entry.fetchedAt < getCacheTtl(adId);

const setCache = (adId, ad) => {
  adCache.set(normalizeAdId(adId), {
    ad,
    fetchedAt: Date.now(),
  });
};

const getCache = (adId) => {
  const normalizedId = normalizeAdId(adId);
  const entry = adCache.get(normalizedId);
  return isFresh(entry, normalizedId) ? entry.ad : null;
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    redirect: 'follow',
  });

  if (!response.ok) {
    console.error('[wordpress] Ads API request failed:', {
      url,
      status: response.status,
      adsApiBase: getResolvedAdsApiUrl(),
    });
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

const isDev = import.meta.env.DEV;

const logAdResult = (adId, ad) => {
  if (!isDev) {
    return;
  }

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
let categoryAdsBatchPromise = null;

export const loadCategoryAdsBatch = async () => {
  const allCached = CATEGORY_AD_IDS.every((adId) => getCache(adId));

  if (allCached) {
    const byId = new Map();
    CATEGORY_AD_IDS.forEach((adId) => {
      const ad = getCache(adId);
      if (ad) {
        byId.set(normalizeAdId(adId), ad);
      }
    });
    return byId;
  }

  categoryAdsBatchPromise = null;

  if (!categoryAdsBatchPromise) {
    console.time('category-ads-fetch');

    categoryAdsBatchPromise = (async () => {
      const restBaseUrl = getWordPressRestBaseUrl();
      const includeIds = CATEGORY_AD_IDS.join(',');
      let advancedAds = [];

      try {
        advancedAds = await fetchJson(
          `${restBaseUrl}/advanced_ads?include=${includeIds}&per_page=${CATEGORY_AD_IDS.length}&orderby=include`,
        );
      } catch (error) {
        console.warn('[advancedAdsService] Category ads batch lookup failed:', error.message);
      }

      const advancedAdsById = new Map(
        (Array.isArray(advancedAds) ? advancedAds : []).map((adPost) => [
          normalizeAdId(adPost.id),
          adPost,
        ]),
      );

      const resolvedAds = await Promise.all(
        CATEGORY_AD_IDS.map(async (adId) => {
          const normalizedId = normalizeAdId(adId);
          const cached = getCache(normalizedId);

          if (cached) {
            return cached;
          }

          try {
            const mediaItems = await fetchJson(
              `${restBaseUrl}/media?parent=${normalizedId}&per_page=1`,
            );

            if (!Array.isArray(mediaItems) || !mediaItems.length) {
              return null;
            }

            const title = advancedAdsById.get(normalizedId)?.title?.rendered || '';
            const mediaAd = buildAdFromMedia(normalizedId, mediaItems[0], title);

            if (mediaAd && isRenderableAd(mediaAd)) {
              setCache(normalizedId, mediaAd);
              logAdResult(normalizedId, mediaAd);
              return mediaAd;
            }
          } catch (error) {
            console.warn(
              '[advancedAdsService] Category media lookup failed:',
              normalizedId,
              error.message,
            );
          }

          return null;
        }),
      );

      const byId = new Map();
      CATEGORY_AD_IDS.forEach((adId, index) => {
        const ad = resolvedAds[index];
        if (ad) {
          byId.set(normalizeAdId(adId), ad);
        }
      });

      return byId;
    })()
      .catch((error) => {
        categoryAdsBatchPromise = null;
        throw error;
      })
      .finally(() => {
        console.timeEnd('category-ads-fetch');
      });
  }

  return categoryAdsBatchPromise;
};

export const loadHomepageBanners = async () => {
  if (!homepageBannerPromise) {
    homepageBannerPromise = fetchJson(`${getSassyApiBaseUrl()}/banners`)
      .then((data) => {
        const banners = Array.isArray(data) ? data : [];
        const byId = new Map();

        if (isDev) {
          console.log('[advancedAdsService] Homepage banners API count:', banners.length);
          console.log(
            '[advancedAdsService] Homepage banners API IDs:',
            banners.map((banner) => banner.id),
          );
        }

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

  if (isDev) {
    console.log('[advancedAdsService] Media response for ad', adId, mediaItems);
  }

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
      const categoryAds = await loadCategoryAdsBatch();
      const categoryAd = categoryAds.get(normalizedId);

      if (categoryAd) {
        return categoryAd;
      }
    } catch (error) {
      console.warn('[advancedAdsService] Category batch lookup failed:', normalizedId, error.message);
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
  if (!isDev) {
    return [];
  }

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
  if (page === 'category') {
    await loadCategoryAdsBatch();
    return;
  }

  await loadHomepageBanners();
  await Promise.all(HOMEPAGE_AD_IDS.map((adId) => fetchAdById(adId)));
};

export const clearAdvancedAdsCache = () => {
  adCache.clear();
  homepageBannerPromise = null;
  categoryAdsBatchPromise = null;
};
