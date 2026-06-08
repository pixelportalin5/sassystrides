import { useQuery } from '@tanstack/react-query';
import { AD_CACHE_TIME, AD_STALE_TIME, adQueryKeys, fetchAdQuery } from '../services/adQueries';

export const useAd = (adId) =>
  useQuery({
    queryKey: adQueryKeys.byId(adId),
    queryFn: () => fetchAdQuery(adId),
    enabled: Boolean(adId),
    staleTime: AD_STALE_TIME,
    gcTime: AD_CACHE_TIME,
  });
