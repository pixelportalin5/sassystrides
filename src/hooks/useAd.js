import { useQuery } from '@tanstack/react-query';
import { CATEGORY_AD_IDS } from '../constants/adSlotMappings';
import { AD_CACHE_TIME, AD_STALE_TIME, adQueryKeys, fetchAdQuery } from '../services/adQueries';

export const useAd = (adId) => {
  const normalizedId = adId ? String(adId) : '';
  const isCategoryAd = CATEGORY_AD_IDS.includes(normalizedId);

  return useQuery({
    queryKey: adQueryKeys.byId(normalizedId),
    queryFn: () => fetchAdQuery(normalizedId),
    enabled: Boolean(normalizedId),
    staleTime: AD_STALE_TIME,
    gcTime: AD_CACHE_TIME,
    retry: isCategoryAd ? 2 : false,
    placeholderData: (previousData) => previousData,
  });
};
