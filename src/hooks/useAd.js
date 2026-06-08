import { useQuery } from '@tanstack/react-query';
import { CATEGORY_AD_IDS } from '../constants/adSlotMappings';
import {
  AD_CACHE_TIME,
  AD_STALE_TIME,
  CATEGORY_AD_CACHE_TIME,
  CATEGORY_AD_STALE_TIME,
  adQueryKeys,
  fetchAdQuery,
  fetchCategoryAdQuery,
} from '../services/adQueries';

export const useAd = (adId) => {
  const normalizedId = adId ? String(adId) : '';
  const isCategoryAd = CATEGORY_AD_IDS.includes(normalizedId);

  return useQuery({
    queryKey: adQueryKeys.byId(normalizedId),
    queryFn: () => (isCategoryAd ? fetchCategoryAdQuery(normalizedId) : fetchAdQuery(normalizedId)),
    enabled: Boolean(normalizedId),
    staleTime: isCategoryAd ? CATEGORY_AD_STALE_TIME : AD_STALE_TIME,
    gcTime: isCategoryAd ? CATEGORY_AD_CACHE_TIME : AD_CACHE_TIME,
    retry: isCategoryAd ? 1 : false,
    placeholderData: (previousData) => previousData,
  });
};
