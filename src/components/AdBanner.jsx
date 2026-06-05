import { memo } from 'react';
import { getHomepageAd } from '../data/homepageAds';
import { trackAdClick } from '../utils/adAnalytics';

const AdBannerImage = ({ banner, priorityHigh = false }) => (
  <img
    src={banner.imageUrl}
    alt={banner.name}
    width={banner.width}
    height={banner.height}
    loading={priorityHigh ? 'eager' : 'lazy'}
    fetchPriority={priorityHigh ? 'high' : 'auto'}
    decoding="async"
    className="ad-banner-image"
    onLoad={() => {
      console.log('Banner loaded:', banner.name);
      console.log('Banner URL:', banner.imageUrl);
    }}
    onError={() => {
      console.error('Banner failed:', banner.id, banner.imageUrl);
    }}
  />
);

const AdBanner = ({ banner: bannerProp, adId, priorityHigh = false }) => {
  const banner = bannerProp || (adId ? getHomepageAd(adId) : null);

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
      aria-label={`Advertisement: ${banner.name}`}
    >
      <div className={`ad-banner-slot ${isSideCard ? 'ad-banner-side-card' : 'ad-banner-leaderboard'}`}>
        <button
          type="button"
          className="ad-banner-trigger"
          onClick={() => trackAdClick(banner.id)}
          aria-label={`Open advertisement ${banner.name}`}
        >
          <div className="ad-banner-frame">
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
          aria-label={`Advertisement: ${banner.name}`}
        >
          <button
            type="button"
            className="ad-banner-trigger"
            onClick={() => trackAdClick(banner.id)}
            aria-label={`Open advertisement ${banner.name}`}
          >
            <div className="ad-banner-frame">
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
