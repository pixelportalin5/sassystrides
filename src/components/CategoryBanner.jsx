import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';

const brandBySlot = ['Saint Laurent', 'Dior', 'Prada', 'Max Mara', 'Celine', 'Chanel'];

const CategoryBanner = ({
  post,
  slot = 1,
  variant = 'leaderboard',
  title,
  eyebrow,
  action = 'Shop Now',
}) => {
  const brand = title || brandBySlot[(slot - 1) % brandBySlot.length];
  const image = post?.image;
  const href = post ? `/blog/${post.slug}` : '#';

  if (variant === 'skyscraper') {
    return (
      <aside className="overflow-hidden border border-ink/10 bg-parchment p-5 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-espresso text-lg font-semibold text-porcelain">
          {slot}
        </div>
        <p className="micro-label mt-5 text-espresso">Ad Space {slot}</p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-taupe">
          Skyscraper
        </p>
        <h3 className="serif-title mt-8 text-4xl uppercase leading-none text-espresso">{brand}</h3>
        <Link to={href} className="btn-cta btn-cta--primary mt-5">
          {action}
        </Link>
        {image && (
          <img
            src={image}
            alt={post.imageAlt}
            srcSet={post.imageSrcSet}
            sizes="230px"
            className="mx-auto mt-8 h-44 w-full object-cover object-top saturate-[0.75]"
            loading="lazy"
            decoding="async"
          />
        )}
      </aside>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Link
        to={href}
        className="group block overflow-hidden border border-ink/10 bg-parchment text-center"
      >
        <div className="grid grid-cols-[64px_1fr] border-b border-ink/10">
          <div className="grid place-items-center bg-espresso text-lg font-semibold text-porcelain">
            {slot}
          </div>
          <div className="p-4 text-left">
            <p className="micro-label text-espresso">Ad Space {slot}</p>
            <p className="text-[0.6rem] uppercase tracking-[0.14em] text-taupe">Sidebar Rectangle</p>
          </div>
        </div>
        {image && (
          <img
            src={image}
            alt={post.imageAlt}
            srcSet={post.imageSrcSet}
            sizes="210px"
            className="h-44 w-full object-cover saturate-[0.75] transition duration-500 group-hover:saturate-100"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="p-5">
          <h3 className="serif-title text-4xl uppercase leading-none text-espresso">{brand}</h3>
          <span className="btn-cta btn-cta--primary mt-4">
            {action}
          </span>
        </div>
      </Link>
    );
  }

  const isInline = variant === 'inline';

  return (
    <section
      className={`grid overflow-hidden border border-ink/10 bg-parchment ${
        isInline ? 'min-h-[128px] grid-cols-[92px_1fr]' : 'min-h-[108px] grid-cols-[84px_1fr]'
      } md:grid-cols-[120px_1fr_245px]`}
    >
      <div className="grid place-items-center border-r border-ink/10 bg-porcelain">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-espresso text-xl font-semibold text-porcelain">
          {slot}
        </div>
      </div>
      <Link
        to={href}
        className="group grid items-center gap-5 p-5 md:grid-cols-[minmax(0,1fr)_170px]"
      >
        <div>
          <p className="micro-label text-espresso">{eyebrow || `Ad Space ${slot}`}</p>
          <h2 className="serif-title mt-1 text-4xl uppercase leading-none text-espresso sm:text-5xl">
            {brand}
          </h2>
          {post && (
            <p className="mt-1 line-clamp-1 text-[0.68rem] uppercase tracking-[0.14em] text-taupe">
              {stripHtml(post.title.rendered)}
            </p>
          )}
        </div>
        {image && (
          <img
            src={image}
            alt={post.imageAlt}
            srcSet={post.imageSrcSet}
            sizes="170px"
            className="hidden h-20 w-full object-cover object-top saturate-[0.78] transition duration-500 group-hover:saturate-100 md:block"
            loading="lazy"
            decoding="async"
          />
        )}
      </Link>
      <Link to={href} className="btn-cta btn-cta--primary hidden md:grid">
        {action}
      </Link>
    </section>
  );
};

export default memo(CategoryBanner);
