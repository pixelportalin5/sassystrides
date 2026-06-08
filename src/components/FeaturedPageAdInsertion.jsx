import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FEATURED_PAGE_BANNER_IMAGE_FALLBACKS,
  FEATURED_PAGE_BANNER_LAYOUT,
} from '../constants/featuredPageAds';
import { normalizeBannerId } from '../services/featuredPageBannerService';
import { resolveFeaturedBannerImageSrc } from '../utils/featuredBannerImage';

const layoutToBannerSize = {
  compact: 'compact',
  medium: 'horizontal',
  leaderboard: 'horizontal',
  billboard: 'horizontal',
};

const FeaturedPageAdInsertion = ({ banner, className = '' }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const adId = normalizeBannerId(banner?.id);
  const layout = FEATURED_PAGE_BANNER_LAYOUT[adId] || FEATURED_PAGE_BANNER_LAYOUT[Number(adId)] || 'leaderboard';
  const bannerSize = layoutToBannerSize[layout] || 'horizontal';
  const fallback = FEATURED_PAGE_BANNER_IMAGE_FALLBACKS[adId];

  const primaryImageSrc = useMemo(
    () => resolveFeaturedBannerImageSrc(banner),
    [banner],
  );

  const [imageSrc, setImageSrc] = useState(primaryImageSrc || fallback?.imageUrl || '');
  const [loadStatus, setLoadStatus] = useState(primaryImageSrc || fallback?.imageUrl ? 'pending' : 'missing');
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    const nextSrc = primaryImageSrc || fallback?.imageUrl || '';
    setImageSrc(nextSrc);
    setLoadStatus(nextSrc ? 'pending' : 'missing');
    setHasTriedFallback(false);
  }, [fallback?.imageUrl, primaryImageSrc]);

  useEffect(() => {
    console.log('[FeaturedPageAdInsertion] Complete banner object:', banner);
    console.log('[FeaturedPageAdInsertion] Image property audit:', {
      id: adId,
      imageUrl: banner?.imageUrl,
      image: banner?.image,
      image_url: banner?.image_url,
      src: banner?.src,
      banner_image: banner?.banner_image,
      featured_image: banner?.featured_image,
      media_url: banner?.media_url,
      resolvedSrc: primaryImageSrc,
      fallbackSrc: fallback?.imageUrl || null,
    });
  }, [adId, banner, fallback?.imageUrl, primaryImageSrc]);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [adId]);

  const handleImageLoad = () => {
    setLoadStatus('loaded');
    console.log('[FeaturedPageAdInsertion] Banner image report:', {
      id: adId,
      imageUrl: imageSrc,
      loadedSuccessfully: true,
    });
  };

  const handleImageError = () => {
    console.error('[FeaturedPageAdInsertion] Banner image failed:', {
      id: adId,
      imageUrl: imageSrc,
      loadedSuccessfully: false,
    });

    if (!hasTriedFallback && fallback?.imageUrl && imageSrc !== fallback.imageUrl) {
      setHasTriedFallback(true);
      setImageSrc(fallback.imageUrl);
      setLoadStatus('pending');
      console.warn('[FeaturedPageAdInsertion] Retrying with fallback URL:', {
        id: adId,
        imageUrl: fallback.imageUrl,
      });
      return;
    }

    setLoadStatus('error');
    console.error('[FeaturedPageAdInsertion] Banner image report:', {
      id: adId,
      imageUrl: imageSrc,
      loadedSuccessfully: false,
    });
  };

  const showPlaceholder = !imageSrc || loadStatus === 'missing' || loadStatus === 'error';

  return (
    <div
      ref={containerRef}
      className={[
        'ad-insertion',
        'featured-page-ad',
        `featured-page-ad--${layout}`,
        isVisible ? 'ad-insertion--visible' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Advertisement"
      data-ad-id={adId}
    >
      <p className="ad-insertion__label micro-label">Advertisement</p>
      <aside className={`ad-banner ad-banner--${bannerSize}`} data-ad-id={adId} aria-label="Advertisement">
        <div className="ad-banner__frame featured-page-ad__frame">
          {showPlaceholder ? (
            <div className="featured-page-ad__placeholder" role="img" aria-label={`Advertisement ${adId}`}>
              <p className="micro-label text-bronze">Advertisement Placeholder</p>
              <p className="mt-2 text-sm text-espresso">{banner?.title || `Banner ${adId}`}</p>
              <p className="mt-1 text-xs text-taupe">ID: {adId}</p>
              {imageSrc ? (
                <p className="mt-2 break-all text-[0.65rem] text-taupe">Failed URL: {imageSrc}</p>
              ) : null}
            </div>
          ) : (
            <img
              key={`${adId}-${imageSrc}`}
              src={imageSrc}
              alt={banner?.title || 'Advertisement'}
              className="featured-page-ad__image"
              width={banner?.width || fallback?.width || undefined}
              height={banner?.height || fallback?.height || undefined}
              loading="eager"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
      </aside>
    </div>
  );
};

export default FeaturedPageAdInsertion;
