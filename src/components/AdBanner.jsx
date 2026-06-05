import { memo } from 'react';
import { useBanners } from '../context/BannersContext';

const AdBanner = ({ adId, variant = 'default', nested = false }) => {
  const { getBannerById } = useBanners();
  const banner = getBannerById(adId);

  if (!banner?.html) {
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
  if (!adIds.length) {
    return null;
  }

  return (
    <div className="ad-banner-pair editorial-container">
      {adIds.map((adId) => (
        <AdBanner key={adId} adId={adId} variant="side-card" nested />
      ))}
    </div>
  );
});

export const FeedAdSlot = memo(({ adId, className = '' }) => (
  <div className={`col-span-full py-2 ${className}`.trim()}>
    <AdBanner adId={adId} />
  </div>
));

export default memo(AdBanner);
