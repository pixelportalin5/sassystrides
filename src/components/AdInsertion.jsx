import { useEffect, useRef, useState } from 'react';
import { useBanners } from '../context/BannersContext';
import { isRenderableBanner } from '../services/bannerService';
import { BannerUnit } from './EditorialAds';

const AdInsertion = ({ adId, className = '' }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { getBannerById } = useBanners();
  const banner = getBannerById(adId);

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

  if (!isRenderableBanner(banner)) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`ad-insertion${isVisible ? ' ad-insertion--visible' : ''} ${className}`.trim()}
      aria-label="Advertisement"
    >
      <p className="ad-insertion__label micro-label">Advertisement</p>
      <BannerUnit adId={String(banner.id)} size="horizontal" />
    </div>
  );
};

export default AdInsertion;
