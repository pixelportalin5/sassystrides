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
