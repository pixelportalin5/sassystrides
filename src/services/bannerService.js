import { getSassyApiBaseUrl } from '../config/wordpress';

export const fetchBanners = async () => {
  const response = await fetch(`${getSassyApiBaseUrl()}/banners`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Banner request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const isRenderableBanner = (banner) => {
  const html = typeof banner?.html === 'string' ? banner.html.trim() : '';
  return html.length > 0;
};

export const getRenderableBanners = (banners = []) =>
  banners.filter(isRenderableBanner);
