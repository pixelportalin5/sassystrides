import { useBanners } from '../context/BannersContext';
import { isRenderableBanner } from '../services/bannerService';

const filterRenderableIds = (adIds, getBannerById) =>
  adIds.filter((adId) => isRenderableBanner(getBannerById(adId)));

const BannerUnit = ({ adId, size = 'horizontal' }) => {
  const { getBannerById } = useBanners();
  const banner = getBannerById(adId);

  if (!isRenderableBanner(banner)) {
    return null;
  }

  return (
    <aside
      className={`ad-banner ad-banner--${size}`}
      data-ad-id={banner.id}
      data-ad-shortcode={banner.shortcode}
      aria-label="Advertisement"
    >
      <div className="ad-banner__frame">
        <div dangerouslySetInnerHTML={{ __html: banner.html }} />
      </div>
    </aside>
  );
};

const adShellClass = ({ type, compact, nested }) =>
  [
    'editorial-ad',
    `editorial-ad--${type}`,
    nested ? '' : 'editorial-container',
    compact ? 'editorial-ad--compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

export const MagazineBanner = ({ adId }) => {
  const { getBannerById } = useBanners();

  if (!isRenderableBanner(getBannerById(adId))) {
    return null;
  }

  return (
    <div className="magazine-banner editorial-container">
      <BannerUnit adId={adId} size="horizontal" />
    </div>
  );
};

export const GridAdCard = ({ adId, variant = 'default' }) => {
  const { getBannerById } = useBanners();

  if (!isRenderableBanner(getBannerById(adId))) {
    return null;
  }

  const variantClass =
    variant === 'inset'
      ? ' grid-ad-card--inset'
      : variant === 'inset-span2'
        ? ' grid-ad-card--inset-span2 col-span-2'
        : '';

  return (
    <div className={`grid-ad-card${variantClass}`}>
      <BannerUnit adId={adId} size="card" />
    </div>
  );
};

export const HeroBanner = ({ adId, compact = false, nested = false }) => {
  const { getBannerById } = useBanners();

  if (!isRenderableBanner(getBannerById(adId))) {
    return null;
  }

  return (
    <section
      className={adShellClass({ type: 'hero', compact, nested })}
      aria-label="Sponsored placement"
    >
      <BannerUnit adId={adId} size="horizontal" />
    </section>
  );
};

export const InlineBanner = ({ adId, compact = false, nested = false }) => {
  const { getBannerById } = useBanners();

  if (!isRenderableBanner(getBannerById(adId))) {
    return null;
  }

  return (
    <section
      className={adShellClass({ type: 'inline', compact, nested })}
      aria-label="Sponsored placement"
    >
      <BannerUnit adId={adId} size="horizontal" />
    </section>
  );
};

export const AdGrid2 = ({ adIds = [], compact = false, nested = false }) => {
  const { getBannerById } = useBanners();
  const validIds = filterRenderableIds(adIds, getBannerById);

  if (validIds.length < 2) {
    return null;
  }

  return (
    <section
      className={adShellClass({ type: 'grid2', compact, nested })}
      aria-label="Sponsored placements"
    >
      <div className="ad-grid ad-grid--2">
        {validIds.slice(0, 2).map((id) => (
          <BannerUnit key={id} adId={id} size="card" />
        ))}
      </div>
    </section>
  );
};

export const AdGrid3 = ({ adIds = [], compact = false, nested = false }) => {
  const { getBannerById } = useBanners();
  const validIds = filterRenderableIds(adIds, getBannerById);

  if (validIds.length < 3) {
    return null;
  }

  return (
    <section
      className={adShellClass({ type: 'grid3', compact, nested })}
      aria-label="Sponsored placements"
    >
      <div className="ad-grid ad-grid--3">
        {validIds.slice(0, 3).map((id) => (
          <BannerUnit key={id} adId={id} size="compact" />
        ))}
      </div>
    </section>
  );
};

export { BannerUnit };
