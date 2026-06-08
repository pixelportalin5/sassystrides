const parseSrcSet = (srcSet = '') =>
  String(srcSet)
    .split(',')
    .map((entry) => entry.trim())
    .map((entry) => {
      const [url, widthToken] = entry.split(/\s+/);
      const width = Number.parseInt(widthToken, 10);
      return { url, width: Number.isFinite(width) ? width : 0 };
    })
    .filter((entry) => entry.url);

export const pickSrcSetUrl = (srcSet, targetWidth = 400) => {
  const candidates = parseSrcSet(srcSet);

  if (!candidates.length) {
    return null;
  }

  return candidates.reduce((best, candidate) => {
    if (!best) {
      return candidate;
    }

    const bestDelta = Math.abs(best.width - targetWidth);
    const candidateDelta = Math.abs(candidate.width - targetWidth);

    return candidateDelta < bestDelta ? candidate : best;
  }, null)?.url;
};

export const getCardImageProps = (post, { compact = false } = {}) => {
  const targetWidth = compact ? 370 : 480;
  const optimizedSrc = pickSrcSetUrl(post?.imageSrcSet, targetWidth);

  return {
    src: optimizedSrc || post?.image,
    srcSet: post?.imageSrcSet,
    sizes: compact
      ? '(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw'
      : post?.imageSizes || '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
  };
};
