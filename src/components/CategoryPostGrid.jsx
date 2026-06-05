import { Grid2X2, List } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';
import CategoryBanner from './CategoryBanner';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));

const CategoryPostCard = ({ post, view }) => {
  if (!post) {
    return null;
  }

  const isList = view === 'list';

  return (
    <article
      className={`group bg-porcelain transition duration-500 hover:-translate-y-1 hover:shadow-soft ${
        isList ? 'grid gap-4 border border-ink/10 p-3 sm:grid-cols-[220px_1fr]' : ''
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={`block overflow-hidden bg-champagne ${isList ? 'min-h-44' : 'aspect-[0.92/1]'}`}
      >
        <img
          src={post.image}
          alt={post.imageAlt}
          srcSet={post.imageSrcSet}
          sizes={post.imageSizes}
          className="h-full w-full object-cover object-top saturate-[0.78] transition duration-700 group-hover:scale-105 group-hover:saturate-100"
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className={isList ? 'flex flex-col justify-center p-2' : 'pt-4'}>
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-taupe">
          {post.categoryName}
        </p>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="serif-title mt-2 line-clamp-2 text-3xl leading-[0.92] text-espresso transition group-hover:text-bronze">
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-xs leading-5 text-taupe">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <p className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-taupe">
          {formatDate(post.date)}
        </p>
      </div>
    </article>
  );
};

const CategoryPostGrid = ({
  title,
  posts = [],
  adPost,
  sort,
  onSortChange,
  view,
  onViewChange,
  isLoading = false,
  emptyMessage = 'No articles found in this category.',
}) => (
  <section id="category-posts" className="min-w-0">
    <h2 className="serif-title mb-5 text-5xl uppercase leading-none text-espresso">{title}</h2>
    <CategoryBanner post={adPost || posts[0]} slot={4} variant="inline" title="Max Mara" action="Discover" />

    <div className="mt-5 flex flex-col gap-4 border-y border-ink/10 py-4 text-[0.62rem] uppercase tracking-[0.16em] text-taupe sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span>Sort By:</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="bg-transparent font-semibold text-espresso outline-none"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>
          Showing 1-{posts.length} of {posts.length} results
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => onViewChange('grid')}
            className={`grid h-8 w-8 place-items-center border border-ink/10 ${
              view === 'grid' ? 'bg-espresso text-porcelain' : 'bg-porcelain text-espresso'
            }`}
          >
            <Grid2X2 size={15} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => onViewChange('list')}
            className={`grid h-8 w-8 place-items-center border border-ink/10 ${
              view === 'list' ? 'bg-espresso text-porcelain' : 'bg-porcelain text-espresso'
            }`}
          >
            <List size={15} strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </div>

    {isLoading ? (
      <div
        className={`mt-5 grid gap-x-6 gap-y-8 ${
          view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="space-y-4">
            <div className="aspect-[0.92/1] animate-pulse bg-champagne/70" />
            <div className="h-3 w-20 animate-pulse bg-espresso/10" />
            <div className="h-8 w-full animate-pulse bg-espresso/10" />
            <div className="h-3 w-3/4 animate-pulse bg-espresso/10" />
          </div>
        ))}
      </div>
    ) : posts.length ? (
      <div
        className={`mt-5 grid gap-x-6 gap-y-8 ${
          view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {posts.map((post) => (
          <CategoryPostCard key={post.id} post={post} view={view} />
        ))}
      </div>
    ) : (
      <div className="mt-5 border border-ink/10 bg-porcelain p-10 text-center">
        <p className="micro-label text-bronze">No Stories Found</p>
        <h3 className="serif-title mt-3 text-4xl leading-none text-espresso">
          {emptyMessage}
        </h3>
      </div>
    )}
  </section>
);

export default memo(CategoryPostGrid);
