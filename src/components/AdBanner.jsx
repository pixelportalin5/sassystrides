import { useEffect, useRef } from 'react';
import { useBanners } from '../context/BannersContext';
import { isRenderableBanner } from '../services/bannerService';

const AdBanner = ({ adId, variant = 'default', nested = false }) => {
  const bannerRef = useRef(null);
  const { getBannerById } = useBanners();
  const banner = getBannerById(adId);

  useEffect(() => {
    const el = bannerRef.current;

    if (!el) {
      return;
    }

    console.log('Banner Layout', adId, {
      width: el.offsetWidth,
      height: el.offsetHeight,
    });

    const rect = el.getBoundingClientRect();
    console.log('Banner rect', adId, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      visible: rect.height > 0 && rect.width > 0,
    });
  }, [adId, banner?.html]);

  if (!isRenderableBanner(banner)) {
    return null;
  }

  console.log('Rendering banner', banner.id);

  const isSideCard = variant === 'side-card';

  return (
    <aside
      ref={bannerRef}
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

export const AdBannerPair = ({ adIds = [] }) => {
  const { getBannerById } = useBanners();

  if (!adIds.length) {
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
};

export const FeedAdSlot = ({ adId, className = '' }) => {
  const { getBannerById } = useBanners();
  const banner = getBannerById(adId);

  if (!isRenderableBanner(banner)) {
    return null;
  }

  return (
    <div className={`col-span-full py-2 ${className}`.trim()}>
      <AdBanner adId={adId} />
    </div>
  );
};

export default AdBanner;
