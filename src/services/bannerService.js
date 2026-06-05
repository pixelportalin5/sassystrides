import { getSassyApiBaseUrl } from '../config/wordpress';

export const fetchBanners = async () => {
  const response = await fetch(`${getSassyApiBaseUrl()}/banners`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Banner request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const isRenderableBanner = (banner) => {
  const html = typeof banner?.html === 'string' ? banner.html.trim() : '';

  if (!html) {
    return false;
  }

  return /<img\b|iframe\b|picture\b|video\b|svg\b/i.test(html);
};
