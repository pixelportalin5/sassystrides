const extractSrcFromHtml = (html = '') => {
  const match = String(html).match(/src=["']([^"']+)["']/i);
  return match?.[1]?.replace(/\\\//g, '/') || null;
};

export const resolveFeaturedBannerImageSrc = (banner) => {
  if (!banner) {
    return null;
  }

  const directCandidates = [
    banner.imageUrl,
    banner.image_url,
    banner.image,
    banner.src,
    banner.banner_image,
    banner.featured_image,
    banner.media_url,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate.url === 'string' && candidate.url.trim()) {
      return candidate.url.trim();
    }

    if (candidate && typeof candidate.rendered === 'string') {
      const src = extractSrcFromHtml(candidate.rendered);
      if (src) {
        return src;
      }
    }
  }

  return extractSrcFromHtml(banner.html);
};
