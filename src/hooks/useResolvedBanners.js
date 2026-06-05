import { useEffect, useState } from 'react';
import { resolveHomepageBanners } from '../services/bannerImageResolver';

export const useResolvedBanners = (banners = []) => {
  const [resolvedBanners, setResolvedBanners] = useState([]);
  const [isResolving, setIsResolving] = useState(true);
  const [workingBanners, setWorkingBanners] = useState([]);
  const [brokenBanners, setBrokenBanners] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      setIsResolving(true);

      const result = await resolveHomepageBanners(banners);

      if (cancelled) {
        return;
      }

      setResolvedBanners(result.resolvedBanners);
      setWorkingBanners(result.workingBanners);
      setBrokenBanners(result.brokenBanners);
      setIsResolving(false);
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [banners]);

  const resolvedById = Object.fromEntries(
    resolvedBanners.map((banner) => [banner.id, banner]),
  );

  return {
    resolvedBanners,
    resolvedById,
    isResolving,
    workingBanners,
    brokenBanners,
  };
};
