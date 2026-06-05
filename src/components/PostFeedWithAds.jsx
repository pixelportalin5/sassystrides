import { Fragment, useMemo } from 'react';
import { useBanners } from '../context/BannersContext';
import { FeedAdSlot } from './AdBanner';
import { injectAdsIntoFeed } from '../utils/adInjection';

const PostFeedWithAds = ({
  items = [],
  renderItem,
  minGap = 4,
  maxGap = 6,
  seed = 0.42,
  adClassName = '',
}) => {
  const { banners } = useBanners();

  const feed = useMemo(
    () => injectAdsIntoFeed(items, banners, { minGap, maxGap, seed }),
    [items, banners, minGap, maxGap, seed],
  );

  if (!feed.length) {
    return null;
  }

  return (
    <>
      {feed.map((entry) => {
        if (entry.type === 'ad') {
          return (
            <FeedAdSlot
              key={entry.key}
              adId={entry.ad.id}
              className={adClassName}
            />
          );
        }

        return (
          <Fragment key={entry.key}>{renderItem(entry.item, entry.index)}</Fragment>
        );
      })}
    </>
  );
};

export default PostFeedWithAds;
