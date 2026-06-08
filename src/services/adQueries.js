import { CATEGORY_AD_IDS, HOMEPAGE_AD_IDS } from '../constants/adSlotMappings';
import { fetchAdById, loadHomepageBanners, prefetchAdsForPage } from './advancedAdsService';

export const AD_STALE_TIME = 5 * 60 * 1000;
export const AD_CACHE_TIME = 10 * 60 * 1000;

export const adQueryKeys = {
  homepage: ['ads', 'homepage'],
  category: ['ads', 'category'],
  byId: (adId) => ['advanced-ad', String(adId)],
};

const hydrateHomepageAdCache = async (queryClient) => {
  const bannersById = await loadHomepageBanners();

  HOMEPAGE_AD_IDS.forEach((adId) => {
    queryClient.setQueryData(adQueryKeys.byId(adId), bannersById.get(String(adId)) ?? null);
  });
};

const hydrateCategoryAdCache = async (queryClient) => {
  await prefetchAdsForPage('category');

  await Promise.all(
    CATEGORY_AD_IDS.map(async (adId) => {
      const ad = await fetchAdById(adId);
      queryClient.setQueryData(adQueryKeys.byId(adId), ad ?? null);
    }),
  );
};

const hydrateAdCache = async (queryClient, page) => {
  if (page === 'category') {
    await hydrateCategoryAdCache(queryClient);
    return;
  }

  await hydrateHomepageAdCache(queryClient);
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
