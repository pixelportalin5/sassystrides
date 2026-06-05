import { memo, useEffect, useState } from 'react';
import { getHomepageAd } from '../data/homepageAds';
import { resolveBannerById } from '../services/bannerImageResolver';
import { trackAdClick } from '../utils/adAnalytics';

const AdBannerImage = ({ banner, priorityHigh = false }) => {
  if (!banner.isResolved || !banner.resolvedImageUrl) {
    return (
      <div
        className="ad-banner-reserved"
        style={{
          width: banner.width,
          height: banner.height,
          maxWidth: '100%',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={banner.resolvedImageUrl}
      alt={banner.name}
      width={banner.width}
      height={banner.height}
      loading={priorityHigh ? 'eager' : 'lazy'}
      fetchPriority={priorityHigh ? 'high' : 'auto'}
      decoding="async"
      className="ad-banner-image"
      onLoad={() => {
        console.log('Banner loaded:', banner.name);
        console.log('Banner URL:', banner.resolvedImageUrl);
      }}
      onError={() => {
        console.error('Banner failed after resolution:', banner.id, banner.resolvedImageUrl);
      }}
    />
  );
};

const AdBanner = ({ banner: bannerProp, adId, priorityHigh = false }) => {
  const [banner, setBanner] = useState(bannerProp || null);

  useEffect(() => {
    if (bannerProp?.isResolved) {
      setBanner(bannerProp);
      return;
    }

    if (bannerProp) {
      setBanner(bannerProp);
      return;
    }

    if (!adId) {
      setBanner(null);
      return;
    }

    let cancelled = false;

    resolveBannerById(adId).then((resolved) => {
      if (!cancelled) {
        setBanner(resolved);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [bannerProp, adId]);

  if (!banner) {
    return null;
  }

  const isSideCard = banner.layout === 'side-card';

  return (
    <aside
      className="ad-banner editorial-container"
      data-ad-id={banner.id}
      data-ad-name={banner.name}
      data-ad-shortcode={banner.shortcode}
      data-ad-resolved={banner.isResolved ? 'true' : 'false'}
      aria-label={`Advertisement: ${banner.name}`}
    >
      <div className={`ad-banner-slot ${isSideCard ? 'ad-banner-side-card' : 'ad-banner-leaderboard'}`}>
        <button
          type="button"
          className="ad-banner-trigger"
          onClick={() => trackAdClick(banner.id)}
          aria-label={`Open advertisement ${banner.name}`}
        >
          <div
            className="ad-banner-frame"
            style={{
              maxWidth: '100%',
              minHeight: banner.height,
            }}
          >
            <AdBannerImage banner={banner} priorityHigh={priorityHigh} />
          </div>
        </button>
      </div>
      <template data-wp-shortcode={banner.shortcode} />
    </aside>
  );
};

export const AdBannerPair = memo(({ banners = [] }) => {
  if (!banners.length) {
    return null;
  }

  return (
    <div className="ad-banner-pair editorial-container">
      {banners.map((banner) => (
        <aside
          key={banner.id}
          className="ad-banner ad-banner-side-card"
          data-ad-id={banner.id}
          data-ad-name={banner.name}
          data-ad-resolved={banner.isResolved ? 'true' : 'false'}
          aria-label={`Advertisement: ${banner.name}`}
        >
          <button
            type="button"
            className="ad-banner-trigger"
            onClick={() => trackAdClick(banner.id)}
            aria-label={`Open advertisement ${banner.name}`}
          >
            <div
              className="ad-banner-frame"
              style={{
                maxWidth: '100%',
                minHeight: banner.height,
              }}
            >
              <AdBannerImage banner={banner} />
            </div>
          </button>
        </aside>
      ))}
    </div>
  );
});

export const FeedAdSlot = memo(({ adId, banner }) => (
  <div className="col-span-full py-2">
    <AdBanner banner={banner} adId={adId} />
  </div>
));

export default memo(AdBanner);
