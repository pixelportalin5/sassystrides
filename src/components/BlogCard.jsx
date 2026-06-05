import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';

const BlogCard = ({ post, variant = 'default', index = 1 }) => {
  if (!post) {
    return null;
  }

  const isLarge = variant === 'large';
  const isCompact = variant === 'compact';
  const isHorizontal = variant === 'horizontal';

  return (
    <article
      className={`group relative overflow-hidden border border-ink/10 bg-porcelain shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-editorial ${
        isHorizontal ? 'grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]' : ''
      }`}
    >
      <Link to={`/blog/${post.slug}`} aria-label={stripHtml(post.title.rendered)}>
        <div
          className={`relative overflow-hidden bg-champagne ${
            isLarge
              ? 'aspect-[1.55/1]'
              : isCompact
                ? 'aspect-[1.18/1]'
                : isHorizontal
                  ? 'h-full min-h-32'
                  : 'aspect-[1.12/1]'
          }`}
        >
          <img
            src={post.image}
            alt={post.imageAlt}
            srcSet={post.imageSrcSet}
            sizes={post.imageSizes}
            className="h-full w-full object-cover saturate-[0.82] transition duration-700 group-hover:scale-105 group-hover:saturate-100"
            loading={index <= 4 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index <= 2 ? 'high' : 'auto'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/8 to-transparent opacity-80" />
          {!isHorizontal && (
            <span className="micro-label absolute left-3 top-3 bg-porcelain/90 px-3 py-2 text-espresso backdrop-blur">
              {post.categoryName}
            </span>
          )}
        </div>
      </Link>

      <div className={`${isHorizontal ? 'p-4 sm:p-5' : 'p-4 sm:p-5'} relative`}>
        <div className="mb-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-bronze">
          <span>{post.categoryName}</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3
            className={`serif-title text-ink transition duration-300 group-hover:text-bronze ${
              isLarge
                ? 'text-4xl leading-[0.92] md:text-5xl'
                : isCompact
                  ? 'text-2xl leading-none'
                  : 'text-3xl leading-[0.95]'
            }`}
          >
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>
        {!isCompact && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-taupe">
            {stripHtml(post.excerpt.rendered)}
          </p>
        )}
        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-espresso transition hover:text-bronze"
        >
          Read More
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
