import { memo } from 'react';
import { useBanners } from '../context/BannersContext';
import { isRenderableBanner } from '../services/bannerService';

const AdBanner = ({ adId, variant = 'default', nested = false }) => {
  const { getBannerById, isLoading } = useBanners();
  const banner = getBannerById(adId);

  if (isLoading || !isRenderableBanner(banner)) {
    return null;
  }

  const isSideCard = variant === 'side-card';

  return (
    <aside
      className={`ad-banner ${nested ? '' : 'editorial-container'}`.trim()}
      data-ad-id={banner.id}
      data-ad-shortcode={banner.shortcode}
      aria-label="Advertisement"
    >
      <div className={`ad-banner-slot ${isSideCard ? 'ad-banner-side-card' : 'ad-banner-leaderboard'}`}>
        <div className="ad-banner-trigger">
          <div className="ad-banner-frame">
            <div dangerouslySetInnerHTML={{ __html: banner.html }} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export const AdBannerPair = memo(({ adIds = [] }) => {
  const { getBannerById, isLoading } = useBanners();

  if (isLoading || !adIds.length) {
    return null;
  }

  const validIds = adIds.filter((adId) => isRenderableBanner(getBannerById(adId)));

  if (!validIds.length) {
    return null;
  }

  if (validIds.length === 1) {
    return <AdBanner adId={validIds[0]} variant="side-card" />;
  }

  return (
    <div className="ad-banner-pair editorial-container">
      {validIds.map((adId) => (
        <AdBanner key={adId} adId={adId} variant="side-card" nested />
      ))}
    </div>
  );
});

export const FeedAdSlot = memo(({ adId, className = '' }) => {
  const { getBannerById, isLoading } = useBanners();
  const banner = getBannerById(adId);

  if (isLoading || !isRenderableBanner(banner)) {
    return null;
  }

  return (
    <div className={`col-span-full py-2 ${className}`.trim()}>
      <AdBanner adId={adId} />
    </div>
  );
});

export default memo(AdBanner);
