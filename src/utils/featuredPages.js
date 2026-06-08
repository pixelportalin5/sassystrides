import { FEATURED_PAGE_SLUGS } from '../constants/featuredPageAds';
import { isRenderableBanner } from '../services/bannerService';

const normalizeSlug = (slug = '') =>
  String(slug)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

export const isFeaturedPage = (slug) => FEATURED_PAGE_SLUGS.includes(normalizeSlug(slug));

export const resolveFeaturedPageBanners = (adIds = [], getBannerById) =>
  adIds.map((adId) => getBannerById(adId)).filter(isRenderableBanner);
