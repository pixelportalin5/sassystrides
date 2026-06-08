import { loadHomepageBanners } from './advancedAdsService';

export const fetchBanners = async () => {
  const bannersById = await loadHomepageBanners();

  return Array.from(bannersById.values()).map((banner) => ({
    id: banner.id,
    html: banner.html,
    shortcode: banner.shortcode,
    title: banner.title,
  }));
};

export const isRenderableBanner = (banner) => {
  const html = typeof banner?.html === 'string' ? banner.html.trim() : '';
  return html.length > 0;
};

export const getRenderableBanners = (banners = []) =>
  banners.filter(isRenderableBanner);
