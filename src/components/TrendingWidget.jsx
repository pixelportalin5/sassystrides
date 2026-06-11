import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';

const TrendingWidget = ({ posts = [] }) => {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="border border-ink/10 bg-porcelain p-5">
      <h3 className="micro-label mb-5 text-espresso">Trending Now</h3>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group grid grid-cols-[74px_1fr] gap-4 border-b border-ink/10 pb-4 last:border-b-0 last:pb-0"
          >
            <img
              src={post.image}
              alt={post.imageAlt}
              srcSet={post.imageSrcSet}
              sizes="74px"
              className="h-24 w-full object-cover object-top saturate-[0.72] transition duration-500 group-hover:saturate-100"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0 pr-1">
              <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-taupe">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h4 className="trending-widget__title serif-title line-clamp-3 text-xl leading-[1.1] text-espresso transition group-hover:text-bronze sm:text-2xl">
                {stripHtml(post.title.rendered)}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default memo(TrendingWidget);
