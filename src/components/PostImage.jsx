import { memo } from 'react';

const PostImage = memo(({
  src,
  alt = '',
  srcSet,
  sizes,
  className = '',
  priority = false,
  aspectClassName = '',
}) => {
  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      className={`${aspectClassName} ${className}`.trim()}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
});

PostImage.displayName = 'PostImage';

export default PostImage;
