import { useEffect, useRef, useState } from 'react';
import AdSlot from './AdSlot';

const LazyAdSlot = ({ rootMargin = '300px', ...props }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || isVisible) {
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef} className="lazy-ad-slot">
      {isVisible ? <AdSlot {...props} /> : null}
    </div>
  );
};

export default LazyAdSlot;
