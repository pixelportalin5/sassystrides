import { Fragment, useMemo } from 'react';
import { FeedAdSlot } from './AdBanner';
import { injectAdsIntoFeed } from '../utils/adInjection';

const PostFeedWithAds = ({
  items = [],
  renderItem,
  minGap = 4,
  maxGap = 6,
  containerWidth = 1200,
  seed = 0.42,
  adVariant = 'default',
  adClassName = '',
}) => {
  const feed = useMemo(
    () => injectAdsIntoFeed(items, { minGap, maxGap, containerWidth, seed }),
    [items, minGap, maxGap, containerWidth, seed],
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
              variant={adVariant}
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
