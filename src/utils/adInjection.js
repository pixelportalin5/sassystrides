import { getRenderableBanners } from '../services/bannerService';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const countEditorialAdSlots = (itemCount, interval = 3) => {
  let count = 0;

  for (let index = 0; index < itemCount; index += 1) {
    if ((index + 1) % interval === 0 && index < itemCount - 1) {
      count += 1;
    }
  }

  return count;
};

export const injectEditorialAdsIntoFeed = (
  items = [],
  banners = [],
  { interval = 3 } = {},
) => {
  if (!items.length) {
    return [];
  }

  const renderableBanners = getRenderableBanners(banners);

  if (!renderableBanners.length) {
    return items.map((item, index) => ({
      type: 'post',
      key: `post-${item.id ?? index}`,
      item,
      index,
    }));
  }

  const totalSlots = countEditorialAdSlots(items.length, interval);
  const shouldCycle = renderableBanners.length > totalSlots;
  const result = [];

  items.forEach((item, index) => {
    result.push({
      type: 'post',
      key: `post-${item.id ?? index}`,
      item,
      index,
    });

    if ((index + 1) % interval === 0 && index < items.length - 1) {
      const slotIndex = (index + 1) / interval - 1;
      let ad = null;

      if (shouldCycle) {
        ad = renderableBanners[slotIndex % renderableBanners.length];
      } else if (slotIndex < renderableBanners.length) {
        ad = renderableBanners[slotIndex];
      }

      if (ad) {
        result.push({
          type: 'ad',
          key: `ad-after-${item.id ?? index}-${ad.id}-${slotIndex}`,
          ad,
          afterIndex: index,
          slotIndex,
        });
      }
    }
  });

  return result;
};

export const pickRandomAd = (banners = [], { excludeId, seed = Math.random() } = {}) => {
  let pool = banners;

  if (excludeId) {
    pool = banners.filter((banner) => String(banner.id) !== String(excludeId));
  }

  if (!pool.length) {
    pool = banners;
  }

  if (!pool.length) {
    return null;
  }

  const index = Math.floor(seed * pool.length) % pool.length;
  return pool[index];
};

export const injectAdsIntoFeed = (
  items = [],
  banners = [],
  { minGap = 4, maxGap = 6, seed = 0.5 } = {},
) => {
  if (!items.length) {
    return [];
  }

  if (!banners.length) {
    return items.map((item, index) => ({
      type: 'post',
      key: `post-${item.id ?? index}`,
      item,
      index,
    }));
  }

  const result = [];
  let postsSinceLastAd = 0;
  let nextGap = randomInt(minGap, maxGap);
  let lastAdId = null;
  let seedCursor = seed;

  const nextSeed = () => {
    seedCursor = (seedCursor * 9301 + 49297) % 233280;
    return seedCursor / 233280;
  };

  items.forEach((item, index) => {
    result.push({ type: 'post', key: `post-${item.id ?? index}`, item, index });

    postsSinceLastAd += 1;

    if (postsSinceLastAd >= nextGap && index < items.length - 1) {
      const ad = pickRandomAd(banners, {
        excludeId: lastAdId,
        seed: nextSeed(),
      });

      if (ad) {
        result.push({
          type: 'ad',
          key: `ad-after-${item.id ?? index}-${ad.id}`,
          ad,
          afterIndex: index,
        });

        lastAdId = ad.id;
      }

      postsSinceLastAd = 0;
      nextGap = randomInt(minGap, maxGap);
    }
  });

  return result;
};

export const splitArticleParagraphs = (html = '') => {
  if (!html.trim()) {
    return [];
  }

  const segments = html.split(/(?=<\/p>)/i);
  const paragraphs = [];
  let buffer = '';

  segments.forEach((segment) => {
    buffer += segment;

    if (/<\/p>/i.test(segment)) {
      paragraphs.push(buffer);
      buffer = '';
    }
  });

  if (buffer.trim()) {
    paragraphs.push(buffer);
  }

  return paragraphs;
};

export const getArticleAdParagraphIndexes = (paragraphCount) => {
  const indexes = [1, 4].filter((index) => index < paragraphCount - 1);
  return indexes;
};
