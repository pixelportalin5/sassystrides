const getComputed = (element, property) => window.getComputedStyle(element).getPropertyValue(property);

export const inspectBannerLayout = () => {
  const banners = [...document.querySelectorAll('.ad-banner')];

  console.group('[banner-diagnostics] Layout inspection');
  console.log('Total .ad-banner elements:', banners.length);

  banners.forEach((banner, index) => {
    const image = banner.querySelector('.ad-banner-image');
    const slot = banner.querySelector('.ad-banner-slot') || banner;
    const frame = banner.querySelector('.ad-banner-frame');
    const trigger = banner.querySelector('.ad-banner-trigger');
    const parent = banner.parentElement;

    const report = {
      index: index + 1,
      id: banner.getAttribute('data-ad-id'),
      name: banner.getAttribute('data-ad-name'),
      offsetWidth: banner.offsetWidth,
      offsetHeight: banner.offsetHeight,
      display: getComputed(banner, 'display'),
      visibility: getComputed(banner, 'visibility'),
      opacity: getComputed(banner, 'opacity'),
      position: getComputed(banner, 'position'),
      overflow: getComputed(banner, 'overflow'),
      imageNaturalWidth: image?.naturalWidth ?? 0,
      imageNaturalHeight: image?.naturalHeight ?? 0,
      imageOffsetWidth: image?.offsetWidth ?? 0,
      imageOffsetHeight: image?.offsetHeight ?? 0,
      frameOffsetWidth: frame?.offsetWidth ?? 0,
      frameOffsetHeight: frame?.offsetHeight ?? 0,
      triggerOffsetWidth: trigger?.offsetWidth ?? 0,
      triggerOffsetHeight: trigger?.offsetHeight ?? 0,
      parentTag: parent?.tagName ?? null,
      parentClass: parent?.className ?? null,
      parentOverflow: parent ? getComputed(parent, 'overflow') : null,
      parentDisplay: parent ? getComputed(parent, 'display') : null,
      parentHeight: parent?.offsetHeight ?? 0,
      slotOverflow: slot ? getComputed(slot, 'overflow') : null,
      frameOverflow: frame ? getComputed(frame, 'overflow') : null,
    };

    console.table(report);

    if (report.offsetHeight === 0 || report.imageOffsetHeight === 0) {
      console.warn('[banner-diagnostics] Zero-size banner detected:', report.id, report.name);
    }
  });

  console.groupEnd();

  return banners.length;
};

if (typeof window !== 'undefined') {
  window.inspectBannerLayout = inspectBannerLayout;
}
