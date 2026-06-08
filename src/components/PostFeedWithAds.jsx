import { Fragment, useMemo } from 'react';
import { useBanners } from '../context/BannersContext';
import AdInsertion from './AdInsertion';
import { injectEditorialAdsIntoFeed } from '../utils/adInjection';

const PostFeedWithAds = ({
  items = [],
  renderItem,
  adClassName = '',
  interval = 3,
}) => {
  const { banners } = useBanners();

  const feed = useMemo(
    () => injectEditorialAdsIntoFeed(items, banners, { interval }),
    [items, banners, interval],
  );

  if (!items.length) {
    return null;
  }

  return (
    <>
      {feed.map((entry) => {
        if (entry.type === 'ad') {
          return (
            <AdInsertion
              key={entry.key}
              adId={String(entry.ad.id)}
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
