const PLACEHOLDER = (
  <div className="featured-page-ad__placeholder animate-pulse" aria-hidden="true">
    <span className="micro-label text-taupe">Advertisement</span>
  </div>
);

const AdPlaceholder = ({ variant = 'horizontal', className = '' }) => {
  if (variant === 'category-billboard') {
    return <div className={`editorial-container ${className}`.trim()}>{PLACEHOLDER}</div>;
  }

  if (variant === 'category-inline') {
    return (
      <div className={`featured-page-ad featured-page-ad--leaderboard ${className}`.trim()}>
        {PLACEHOLDER}
      </div>
    );
  }

  if (variant === 'category-compact') {
    return (
      <div className={`featured-page-ad featured-page-ad--compact ${className}`.trim()}>
        {PLACEHOLDER}
      </div>
    );
  }

  if (variant === 'category-medium') {
    return (
      <div className={`featured-page-ad featured-page-ad--medium ${className}`.trim()}>
        {PLACEHOLDER}
      </div>
    );
  }

  return <div className={className}>{PLACEHOLDER}</div>;
};

export default AdPlaceholder;
