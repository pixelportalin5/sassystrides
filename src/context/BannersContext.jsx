import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

    fetchBanners()
      .then((data) => {
        if (!cancelled) {
          setBanners(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBanners([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const bannersById = useMemo(
    () => Object.fromEntries(banners.map((banner) => [String(banner.id), banner])),
    [banners],
  );

  const getBannerById = (adId) => bannersById[String(adId)] ?? null;

  const value = useMemo(
    () => ({
      banners,
      bannersById,
      getBannerById,
      isLoading,
    }),
    [banners, bannersById, isLoading],
  );

  return <BannersContext.Provider value={value}>{children}</BannersContext.Provider>;
};

export const useBanners = () => useContext(BannersContext);
