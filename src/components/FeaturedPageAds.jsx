import { useQuery } from '@tanstack/react-query';
import { Fragment, useEffect, useMemo } from 'react';
import { injectEditorialAdsIntoFeed } from '../utils/adInjection';
import { isFeaturedPage } from '../utils/featuredPages';
import FeaturedPageAdInsertion from './FeaturedPageAdInsertion';
import { fetchFeaturedPageBanners } from '../services/featuredPageBannerService';

const FeaturedPageAds = ({
  items = [],
  renderItem,
  categorySlug = '',
  adClassName = '',
  interval = 3,
}) => {
  const isFeatured = isFeaturedPage(categorySlug);

  const featuredBannersQuery = useQuery({
    queryKey: ['featured-page-banners'],
    queryFn: fetchFeaturedPageBanners,
    enabled: isFeatured,
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const featuredBanners = featuredBannersQuery.data || [];

  const feed = useMemo(() => {
    if (!isFeatured) {
      return items.map((item, index) => ({
        type: 'post',
        key: `post-${item.id ?? index}`,
        item,
        index,
      }));
    }

    return injectEditorialAdsIntoFeed(items, featuredBanners, { interval });
  }, [featuredBanners, interval, isFeatured, items]);

  useEffect(() => {
    if (!isFeatured) {
      return;
    }

    const adEntries = feed.filter((entry) => entry.type === 'ad');

    console.log('[FeaturedPageAds] categorySlug:', categorySlug);
    console.log('[FeaturedPageAds] posts passed in:', items.length);
    console.log('[FeaturedPageAds] featured banners loading:', featuredBannersQuery.isLoading);
    console.log('[FeaturedPageAds] featured banners count:', featuredBanners.length);
    console.log('[FeaturedPageAds] featured banner IDs:', featuredBanners.map((banner) => banner.id));
    console.log('[FeaturedPageAds] ad slots in feed:', adEntries.length);
    console.log('[FeaturedPageAds] ads rendered:', adEntries.map((entry) => entry.ad.id));
    console.log('[FeaturedPageAds] final merged feed:', feed);
  }, [
    categorySlug,
    featuredBanners,
    featuredBannersQuery.isLoading,
    feed,
    isFeatured,
    items.length,
  ]);

  if (!items.length) {
    return null;
  }

  return (
    <>
      {feed.map((entry) => {
        if (entry.type === 'ad') {
          console.log('[FeaturedPageAds] Passing banner to insertion:', entry.ad);
          return (
            <FeaturedPageAdInsertion
              key={entry.key}
              banner={entry.ad}
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

export default FeaturedPageAds;
