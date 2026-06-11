import { Grid2X2, List } from 'lucide-react';
import { Fragment, memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';
import { isFeaturedPage } from '../utils/featuredPages';
import AdSlot from './ads/AdSlot';

const CategoryPostCard = ({ post, view }) => {
  if (!post) {
    return null;
  }

  const isList = view === 'list';

  return (
    <article
      className={`category-post-card group min-w-0 bg-porcelain transition duration-500 hover:-translate-y-1 hover:shadow-soft ${
        isList ? 'grid gap-4 border border-ink/10 p-3 sm:grid-cols-[220px_1fr]' : 'border border-ink/10'
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
      <div
        className={
          isList
            ? 'flex min-w-0 flex-col justify-center px-3 py-2 sm:px-4'
            : 'category-post-card__body min-w-0 px-4 pb-5 pt-4 sm:px-5'
        }
      >
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-taupe">
          {post.categoryName}
        </p>
        <Link to={`/blog/${post.slug}`} className="mt-2 block">
          <h3 className="category-post-card__title serif-title line-clamp-3 text-2xl leading-[1.08] text-espresso transition group-hover:text-bronze sm:text-3xl">
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>
        <p className="category-post-card__excerpt mt-3 line-clamp-4 text-sm leading-6 text-taupe">
          {stripHtml(post.excerpt.rendered)}
        </p>
      </div>
    </article>
  );
};

const ROW_AD_SLOTS = [
  { slots: [1, 2], slotVariants: ['category-compact', 'category-medium'] },
  { slots: [3], slotVariants: ['category-compact'] },
  { slots: [5], slotVariants: ['category-inline'] },
  { slots: [6], slotVariants: ['category-compact'] },
];

const CategoryPostFeed = ({ posts, view, categorySlug }) => {
  const postsPerRow = view === 'list' ? 1 : 3;
  const rows = [];

  for (let index = 0; index < posts.length; index += postsPerRow) {
    rows.push(posts.slice(index, index + postsPerRow));
  }

  return (
    <>
      {rows.map((rowPosts, rowIndex) => (
        <Fragment key={`category-row-${rowPosts[0]?.id ?? rowIndex}`}>
          {rowPosts.map((post) => (
            <CategoryPostCard key={post.id} post={post} view={view} />
          ))}

          {ROW_AD_SLOTS[rowIndex] ? (
            <div
              className={
                view === 'list' ? 'col-span-1' : 'sm:col-span-2 xl:col-span-3'
              }
            >
              {ROW_AD_SLOTS[rowIndex].slots.map((slot, slotIndex) => (
                <AdSlot
                  key={`category-ad-${categorySlug}-${rowIndex}-${slot}`}
                  page="category"
                  slot={slot}
                  variant={ROW_AD_SLOTS[rowIndex].slotVariants[slotIndex] || 'category-compact'}
                />
              ))}
            </div>
          ) : null}
        </Fragment>
      ))}
    </>
  );
};

const CategoryPostGrid = ({
  title,
  posts = [],
  categorySlug = '',
  sort,
  onSortChange,
  view,
  onViewChange,
  isLoading = false,
  emptyMessage = 'No articles found in this category.',
}) => {
  const showCategoryAds = isFeaturedPage(categorySlug);

  return (
    <section id="category-posts" className="min-w-0">
      <h2 className="serif-title mb-5 text-5xl uppercase leading-none text-espresso">{title}</h2>

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
              className={`category-view-toggle ${view === 'grid' ? 'is-active' : ''}`}
            >
              <Grid2X2 size={15} strokeWidth={1.4} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => onViewChange('list')}
              className={`category-view-toggle ${view === 'list' ? 'is-active' : ''}`}
            >
              <List size={15} strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className={`editorial-image-grid mt-5 grid ${
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
          className={`editorial-image-grid mt-5 grid ${
            view === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {showCategoryAds ? (
            <CategoryPostFeed posts={posts} view={view} categorySlug={categorySlug} />
          ) : (
            posts.map((post) => <CategoryPostCard key={post.id} post={post} view={view} />)
          )}
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
};

export default memo(CategoryPostGrid);
