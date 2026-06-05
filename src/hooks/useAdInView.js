import { useEffect, useRef, useState } from 'react';
import { trackAdImpression } from '../utils/adAnalytics';

export const useAdInView = (adId, { rootMargin = '120px', enabled = true } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const impressionTrackedRef = useRef(false);

  useEffect(() => {
    impressionTrackedRef.current = false;
  }, [adId]);

  useEffect(() => {
    if (!enabled || !adId) {
      return undefined;
    }

    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);

        if (entry.isIntersecting && !impressionTrackedRef.current) {
          trackAdImpression(adId);
          impressionTrackedRef.current = true;
        }
      },
      { rootMargin, threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [adId, enabled, rootMargin]);

  return { ref, inView };
};
