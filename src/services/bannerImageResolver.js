const WP_MEDIA_API = '/wp-json/wp/v2/media?search=Home-Page-Banner&per_page=100';

let mediaLibraryCache = null;
let mediaLibraryPromise = null;
const resolvedBannerCache = new Map();

const decodeHtml = (value = '') =>
  value
    .replace(/&#215;/g, 'x')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .toLowerCase();

export const probeImageUrl = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve({ ok: false, status: 0 });
      return;
    }

    const image = new Image();
    image.onload = () => resolve({ ok: true, status: 200 });
    image.onerror = () => resolve({ ok: false, status: 404 });
    image.src = url;
  });

export const fetchBannerMediaLibrary = async () => {
  if (mediaLibraryCache) {
    return mediaLibraryCache;
  }

  if (!mediaLibraryPromise) {
    mediaLibraryPromise = fetch(WP_MEDIA_API)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Media library request failed (${response.status})`);
        }

        const items = await response.json();
        mediaLibraryCache = Array.isArray(items) ? items : [];
        return mediaLibraryCache;
      })
      .catch((error) => {
        mediaLibraryPromise = null;
        console.error('[banners] Failed to load WordPress media library:', error.message);
        return [];
      });
  }

  return mediaLibraryPromise;
};

const findMediaUrl = (banner, mediaItems = []) => {
  const token = banner.mediaSearchToken.toLowerCase();
  const orderLabel = String(banner.order).toLowerCase();

  const ranked = mediaItems
    .map((item) => {
      const sourceUrl = item.source_url || item.guid?.rendered || '';
      const title = decodeHtml(item.title?.rendered || '');
      const fileName = sourceUrl.split('/').pop()?.toLowerCase() || '';

      let score = 0;

      if (fileName.includes(token)) {
        score += 100;
      }

      if (sourceUrl.toLowerCase().includes(token)) {
        score += 80;
      }

      if (title.includes(`banner ${orderLabel}`)) {
        score += 60;
      }

      if (orderLabel === '15(2)' && (title.includes('15(2)') || fileName.includes('152'))) {
        score += 90;
      }

      return { sourceUrl, score };
    })
    .filter((entry) => entry.score > 0 && entry.sourceUrl)
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.sourceUrl || null;
};

export const resolveBannerImage = async (banner, mediaItems = []) => {
  const cacheKey = banner.id;

  if (resolvedBannerCache.has(cacheKey)) {
    return resolvedBannerCache.get(cacheKey);
  }

  const expectedUrl = banner.expectedUrl || banner.image;
  let resolvedImageUrl = null;
  let status = 404;
  let source = 'none';

  const expectedProbe = await probeImageUrl(expectedUrl);

  if (expectedProbe.ok) {
    resolvedImageUrl = expectedUrl;
    status = expectedProbe.status;
    source = 'expected';
  } else {
    const mediaUrl = findMediaUrl(banner, mediaItems);

    if (mediaUrl) {
      const mediaProbe = await probeImageUrl(mediaUrl);

      if (mediaProbe.ok) {
        resolvedImageUrl = mediaUrl;
        status = mediaProbe.status;
        source = 'media-library';
      } else {
        status = mediaProbe.status;
      }
    }
  }

  const resolved = {
    ...banner,
    image: resolvedImageUrl || expectedUrl,
    resolvedImageUrl,
    status,
    source,
    isResolved: Boolean(resolvedImageUrl),
  };

  resolvedBannerCache.set(cacheKey, resolved);
  return resolved;
};

export const resolveHomepageBanners = async (banners = []) => {
  const mediaItems = await fetchBannerMediaLibrary();
  const resolvedBanners = await Promise.all(
    banners.map((banner) => resolveBannerImage(banner, mediaItems)),
  );

  const workingBanners = [];
  const brokenBanners = [];

  resolvedBanners.forEach((banner) => {
    console.table({
      banner: banner.name,
      expectedUrl: banner.expectedUrl,
      actualUrl: banner.resolvedImageUrl || '(unresolved)',
      status: banner.status,
    });

    if (banner.isResolved) {
      workingBanners.push(banner.name);
    } else {
      brokenBanners.push(banner.name);
    }
  });

  console.log('Working banners:', workingBanners);
  console.log('Broken banners:', brokenBanners);

  return {
    resolvedBanners,
    workingBanners,
    brokenBanners,
  };
};

export const resolveBannerById = async (adId) => {
  const { homepageAdsById } = await import('../data/homepageAds');
  const banner = homepageAdsById[String(adId)];

  if (!banner) {
    return null;
  }

  const mediaItems = await fetchBannerMediaLibrary();
  return resolveBannerImage(banner, mediaItems);
};
