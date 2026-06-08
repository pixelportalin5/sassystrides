import {
  FEATURED_PAGE_BANNER_IMAGE_FALLBACKS,
  FEATURED_PAGE_BANNER_ORDER,
} from '../constants/featuredPageAds';
import { getWordPressRestBaseUrl } from '../config/wordpress';
import { isRenderableBanner } from './bannerService';

export const normalizeBannerId = (id) => String(id).trim();

const buildBannerHtml = ({ id, imageUrl, width, height, alt = 'Advertisement' }) => {
  const widthAttr = width ? ` width="${width}"` : '';
  const heightAttr = height ? ` height="${height}"` : '';

  return `<div id="sassy-featured-${id}" class="featured-page-banner"><img src="${imageUrl}" alt="${alt}"${widthAttr}${heightAttr} loading="eager" decoding="async" /></div>`;
};

const extractImageFromMedia = (media) => {
  if (!media?.source_url) {
    return null;
  }

  const mediaDetails = media.media_details || {};

  return {
    imageUrl: media.source_url,
    width: mediaDetails.width || null,
    height: mediaDetails.height || null,
    alt: media.alt_text || media.title?.rendered || 'Advertisement',
    filename: mediaDetails.file || media.source_url,
  };
};

const matchImageByFilename = (mediaItems = [], filenameFragment = '') => {
  const needle = filenameFragment.toLowerCase();

  return mediaItems.find((media) => {
    const source = String(media?.source_url || '').toLowerCase();
    const file = String(media?.media_details?.file || '').toLowerCase();
    return source.includes(needle) || file.includes(needle);
  });
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Featured banner request failed with status ${response.status}`);
  }

  return response.json();
};

const resolveBannerImage = async (adId, restBaseUrl, mediaCache) => {
  const normalizedId = normalizeBannerId(adId);
  const fallback = FEATURED_PAGE_BANNER_IMAGE_FALLBACKS[normalizedId];

  try {
    const mediaItems = await fetchJson(`${restBaseUrl}/media?parent=${normalizedId}&per_page=1`);

    if (Array.isArray(mediaItems) && mediaItems.length) {
      mediaCache.push(...mediaItems);
      const image = extractImageFromMedia(mediaItems[0]);

      if (image?.imageUrl) {
        return { ...image, source: 'media-parent' };
      }
    }
  } catch (error) {
    console.warn('[FeaturedPageBanners] Media lookup failed for ad', normalizedId, error.message);
  }

  if (fallback?.filename) {
    const matchedMedia = matchImageByFilename(mediaCache, fallback.filename);

    if (matchedMedia) {
      const image = extractImageFromMedia(matchedMedia);

      if (image?.imageUrl) {
        return { ...image, source: 'filename-match' };
      }
    }
  }

  if (fallback?.imageUrl) {
    return {
      imageUrl: fallback.imageUrl,
      width: fallback.width || null,
      height: fallback.height || null,
      alt: 'Advertisement',
      filename: fallback.filename,
      source: 'static-fallback',
    };
  }

  return null;
};

export const fetchFeaturedPageBanners = async () => {
  const restBaseUrl = getWordPressRestBaseUrl();
  const includeIds = FEATURED_PAGE_BANNER_ORDER.map(normalizeBannerId).join(',');
  const mediaCache = [];
  const matched = [];
  const failed = [];

  let advancedAds = [];

  try {
    advancedAds = await fetchJson(
      `${restBaseUrl}/advanced_ads?include=${includeIds}&per_page=${FEATURED_PAGE_BANNER_ORDER.length}&orderby=include`,
    );
  } catch (error) {
    console.warn('[FeaturedPageBanners] Advanced Ads lookup failed:', error.message);
  }

  const advancedAdsById = new Map(
    (Array.isArray(advancedAds) ? advancedAds : []).map((ad) => [normalizeBannerId(ad.id), ad]),
  );

  const banners = await Promise.all(
    FEATURED_PAGE_BANNER_ORDER.map(async (requestedId) => {
      const adId = normalizeBannerId(requestedId);
      const adPost = advancedAdsById.get(adId);
      const image = await resolveBannerImage(adId, restBaseUrl, mediaCache);

      if (!image?.imageUrl) {
        failed.push(adId);
        return null;
      }

      const banner = {
        id: adId,
        shortcode: `[the_ad id="${adId}"]`,
        html: buildBannerHtml({
          id: adId,
          imageUrl: image.imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
        }),
        imageUrl: image.imageUrl,
        image: image.imageUrl,
        src: image.imageUrl,
        width: image.width,
        height: image.height,
        title: adPost?.title?.rendered || `Category Page Ad ${adId}`,
        source: image.source,
      };

      if (isRenderableBanner(banner)) {
        matched.push(adId);
        return banner;
      }

      failed.push(adId);
      return null;
    }),
  );

  const resolvedBanners = banners.filter(Boolean);

  console.log('[FeaturedPageBanners] WordPress REST base:', restBaseUrl);
  console.log('[FeaturedPageBanners] Requested IDs:', FEATURED_PAGE_BANNER_ORDER);
  console.log('[FeaturedPageBanners] Advanced Ads returned:', advancedAdsById.size);
  console.log('[FeaturedPageBanners] Total banners resolved:', resolvedBanners.length);
  console.log('[FeaturedPageBanners] Banner IDs found:', resolvedBanners.map((banner) => banner.id));
  console.log('[FeaturedPageBanners] Matched IDs:', matched);
  console.log('[FeaturedPageBanners] Missing IDs:', failed);
  const imageReports = await Promise.all(
    resolvedBanners.map(async (banner) => {
      try {
        const response = await fetch(banner.imageUrl, { method: 'HEAD', mode: 'no-cors' });
        return {
          id: banner.id,
          imageUrl: banner.imageUrl,
          loadedSuccessfully: response.type === 'opaque' || response.ok,
          status: response.status || 'opaque',
        };
      } catch (error) {
        return {
          id: banner.id,
          imageUrl: banner.imageUrl,
          loadedSuccessfully: false,
          status: error.message,
        };
      }
    }),
  );

  console.log('[FeaturedPageBanners] Image URLs:', imageReports);
  console.log(
    '[FeaturedPageBanners] Per-banner image report:',
    imageReports.map((report) => ({
      id: report.id,
      imageUrl: report.imageUrl,
      loadedSuccessfully: report.loadedSuccessfully,
    })),
  );

  return resolvedBanners;
};
