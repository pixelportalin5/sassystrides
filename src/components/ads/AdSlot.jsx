import { useEffect } from 'react';
import { getAdIdForSlot } from '../../constants/adSlotMappings';
import { useAd } from '../../hooks/useAd';
import { getAdImageUrl } from '../../services/advancedAdsService';

const AdBannerFrame = ({ ad, imageUrl, size = 'horizontal' }) => {
  if (!ad || !imageUrl) {
    return null;
  }

  return (
    <aside
      className={`ad-banner ad-banner--${size}`}
      data-ad-id={ad.id}
      data-ad-shortcode={ad.shortcode}
      aria-label="Advertisement"
    >
      <div className="ad-banner__frame">
        {ad.html ? (
          <div dangerouslySetInnerHTML={{ __html: ad.html }} />
        ) : (
          <img
            src={imageUrl}
            alt=""
            width={ad.width || undefined}
            height={ad.height || undefined}
            loading="lazy"
            decoding="async"
            className="ad-slot__image"
          />
        )}
      </div>
    </aside>
  );
};

const AdSlot = ({ page = 'homepage', slot, variant = 'horizontal', className = '' }) => {
  const adId = getAdIdForSlot(page, slot);

  const { data: ad, isSuccess } = useAd(adId);

  const imageUrl = getAdImageUrl(ad);

  useEffect(() => {
    if (!adId || !isSuccess) {
      return;
    }

    if (page === 'category') {
      console.log('Category ad data:', ad);
      return;
    }

    if (!import.meta.env.DEV || page !== 'homepage') {
      return;
    }

    console.log(`Slot ${slot}\nID ${adId}\nImage ${imageUrl || 'null'}`);

    if (!imageUrl) {
      console.warn('Missing ad image for slot', slot, adId);
    }
  }, [ad, adId, imageUrl, isSuccess, page, slot]);

  if (!ad || !imageUrl) {
    return null;
  }

  const frame = <AdBannerFrame ad={ad} imageUrl={imageUrl} size={variant === 'compact' ? 'compact' : variant === 'grid-card' || variant === 'grid-card-inset-span2' || variant === 'section-stack-slot' ? 'card' : 'horizontal'} />;

  if (variant === 'magazine') {
    return (
      <div className={`magazine-banner editorial-container ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'grid-card') {
    return (
      <div className={`grid-ad-card grid-ad-card--bare ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'grid-card-inset-span2') {
    return (
      <div className={`grid-ad-card grid-ad-card--inset-span2 grid-ad-card--bare col-span-2 ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'section-full') {
    return (
      <section className={`editorial-container editorial-section ${className}`.trim()}>
        <div className="section-ad-row section-ad-row--full section-ad-row--edge">
          {frame}
        </div>
      </section>
    );
  }

  if (variant === 'homepage-ad-centered') {
    return (
      <section className={`editorial-container ad-slot-centered ${className}`.trim()}>
        {frame}
      </section>
    );
  }

  if (variant === 'section-stack-slot') {
    return (
      <div className={`section-ad-row__slot section-ad-row__slot--bare ${className}`.trim()}>
        <div className="grid-ad-card grid-ad-card--bare">
          {frame}
        </div>
      </div>
    );
  }

  if (variant === 'section-single') {
    return (
      <div className={`section-ad-row section-ad-row--single ${className}`.trim()}>
        <div className="section-ad-row__slot section-ad-row__slot--bare">
          <div className="grid-ad-card grid-ad-card--bare">
            {frame}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'category-billboard') {
    return (
      <div className={`editorial-container ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'category-inline') {
    return (
      <div className={`featured-page-ad featured-page-ad--leaderboard ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'category-compact') {
    return (
      <div className={`featured-page-ad featured-page-ad--compact ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  if (variant === 'category-medium') {
    return (
      <div className={`featured-page-ad featured-page-ad--medium ${className}`.trim()}>
        {frame}
      </div>
    );
  }

  return <div className={className}>{frame}</div>;
};

export default AdSlot;
