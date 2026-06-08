import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchBanners } from '../services/bannerService';

const BannersContext = createContext({
  banners: [],
  bannersById: {},
  getBannerById: () => null,
  isLoading: true,
});

export const BannersProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadBanners = () => {
      fetchBanners()
        .then((data) => {
          if (cancelled) {
            return;
          }

          const nextBanners = Array.isArray(data) ? data : [];
          setBanners(nextBanners);
          setIsLoading(false);

          if (import.meta.env.DEV) {
            console.log('Total banners from API:', nextBanners.length);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setBanners([]);
            setIsLoading(false);
          }
        });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(loadBanners, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timerId = window.setTimeout(loadBanners, 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, []);

  const bannersById = useMemo(
    () => Object.fromEntries(banners.map((banner) => [String(banner.id), banner])),
    [banners],
  );

  const getBannerById = useCallback(
    (adId) => bannersById[String(adId)] ?? null,
    [bannersById],
  );

  const value = useMemo(
    () => ({
      banners,
      bannersById,
      getBannerById,
      isLoading,
    }),
    [banners, bannersById, getBannerById, isLoading],
  );

  return <BannersContext.Provider value={value}>{children}</BannersContext.Provider>;
};

export const useBanners = () => useContext(BannersContext);
