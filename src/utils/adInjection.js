import { homepageAds } from '../data/homepageAds';

export const AD_SIZE_GROUPS = {
  large: [
    { width: 1200, height: 200 },
    { width: 1170, height: 250 },
    { width: 970, height: 250 },
    { width: 1140, height: 150 },
  ],
  sidebar: [
    { width: 300, height: 250 },
    { width: 300, height: 600 },
  ],
  mobile: [{ width: 728, height: 90 }],
};

const sizeKey = (width, height) => `${width}x${height}`;

export const adsBySize = homepageAds.reduce((groups, ad) => {
  const key = sizeKey(ad.width, ad.height);
  if (!groups[key]) {
    groups[key] = [];
  }
  groups[key].push(ad);
  return groups;
}, {});

export const getAdSizeCategory = (ad) => {
  const key = sizeKey(ad.width, ad.height);

  if (AD_SIZE_GROUPS.mobile.some((size) => sizeKey(size.width, size.height) === key)) {
    return 'mobile';
  }

  if (AD_SIZE_GROUPS.sidebar.some((size) => sizeKey(size.width, size.height) === key)) {
    return 'sidebar';
  }

  return 'large';
};

export const getAdsForContainer = (containerWidth = 1200, { excludeId } = {}) => {
  let pool = homepageAds;

  if (containerWidth < 640) {
    pool = homepageAds.filter((ad) => {
      const category = getAdSizeCategory(ad);
      return category === 'mobile' || category === 'sidebar';
    });
  } else if (containerWidth < 1024) {
    pool = homepageAds.filter((ad) => getAdSizeCategory(ad) !== 'sidebar' || ad.width <= 300);
  }

  if (excludeId) {
    pool = pool.filter((ad) => ad.id !== excludeId);
  }

  return pool.length ? pool : homepageAds.filter((ad) => ad.id !== excludeId);
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pickRandomAd = ({ excludeId, containerWidth = 1200, seed = Math.random() } = {}) => {
  const pool = getAdsForContainer(containerWidth, { excludeId });

  if (!pool.length) {
    return homepageAds[0];
  }

  const index = Math.floor(seed * pool.length) % pool.length;
  return pool[index];
};

export const injectAdsIntoFeed = (
  items = [],
  { minGap = 4, maxGap = 6, containerWidth = 1200, seed = 0.5 } = {},
) => {
  if (!items.length) {
    return [];
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
      const ad = pickRandomAd({
        excludeId: lastAdId,
        containerWidth,
        seed: nextSeed(),
      });

      result.push({
        type: 'ad',
        key: `ad-after-${item.id ?? index}-${ad.id}`,
        ad,
        afterIndex: index,
      });

      if (import.meta.env.DEV) {
        console.log('Ad injected after post:', index, ad.id);
      }

      lastAdId = ad.id;
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
