import { CATEGORY_AD_IDS, HOMEPAGE_AD_IDS } from '../constants/adSlotMappings';
import { fetchAdById, prefetchAdsForPage } from './advancedAdsService';

export const AD_STALE_TIME = 5 * 60 * 1000;
export const AD_CACHE_TIME = 10 * 60 * 1000;

export const adQueryKeys = {
  homepage: ['ads', 'homepage'],
  category: ['ads', 'category'],
  byId: (adId) => ['advanced-ad', String(adId)],
};

const hydrateAdCache = async (queryClient, page) => {
  await prefetchAdsForPage(page);

  const ids = page === 'category' ? CATEGORY_AD_IDS : HOMEPAGE_AD_IDS;

  await Promise.all(
    ids.map(async (adId) => {
      const ad = await fetchAdById(adId);
      queryClient.setQueryData(adQueryKeys.byId(adId), ad ?? null);
    }),
  );
};

export const prefetchHomepageAds = (queryClient) =>
  queryClient.prefetchQuery({
    queryKey: adQueryKeys.homepage,
    queryFn: () => hydrateAdCache(queryClient, 'homepage'),
    staleTime: AD_STALE_TIME,
    gcTime: AD_CACHE_TIME,
  });

export const prefetchCategoryAds = (queryClient) =>
  queryClient.prefetchQuery({
    queryKey: adQueryKeys.category,
    queryFn: () => hydrateAdCache(queryClient, 'category'),
    staleTime: AD_STALE_TIME,
    gcTime: AD_CACHE_TIME,
  });

export const fetchAdQuery = (adId) => fetchAdById(adId);
