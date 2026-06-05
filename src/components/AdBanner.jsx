import { AdGrid2, InlineBanner } from './EditorialAds';

const AdBanner = ({ adId }) => <InlineBanner adId={adId} />;

export const AdBannerPair = ({ adIds = [] }) => <AdGrid2 adIds={adIds} />;

export const FeedAdSlot = ({ adId, className = '' }) => {
  if (!adId) {
    return null;
  }

  return (
    <div className={`col-span-full ${className}`.trim()}>
      <InlineBanner adId={adId} />
    </div>
  );
};

export default AdBanner;
