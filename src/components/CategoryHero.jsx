import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  getSubcategoriesByParent,
  getSubcategoryPath,
  PARENT_CATEGORY_SLUGS,
} from '../constants/subcategories';

const defaultDescriptions = {
  fashion:
    'Stay ahead with the latest in clothing, runway trends, street style, accessories and more.',
  beauty:
    'Discover refined beauty notes, skincare rituals, fragrance edits, hair stories and modern makeup.',
  lifestyle:
    'Explore culture, interiors, travel, gatherings and the elevated rituals of everyday living.',
  trends:
    'Track the season-defining silhouettes, colors, accessories and editorial ideas shaping style now.',
  news:
    'Read the latest fashion headlines, celebrity moments, runway notes, interviews and events.',
};

const CategoryHero = ({
  category,
  heroPost,
  categories = [],
  subcategories: subcategoriesProp,
  activeSubSlug,
  parentSlug: parentSlugProp,
}) => {
  const parentSlug =
    parentSlugProp ||
    (PARENT_CATEGORY_SLUGS.includes(category?.slug) ? category.slug : 'fashion');
  const slug = category?.slug || parentSlug;
  const title = category?.name || slug.replace(/-/g, ' ');
  const description =
    category?.description ||
    defaultDescriptions[parentSlug] ||
    `A curated edit of the newest ${title.toLowerCase()} stories from Sassy Strides.`;
  const subcategories = subcategoriesProp || getSubcategoriesByParent(parentSlug);

  return (
    <section className="editorial-container border border-ink/10 bg-paper-grain">
      <div className="grid min-h-[220px] lg:min-h-[280px] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center border-b border-ink/10 bg-porcelain/70 p-7 sm:p-10 lg:border-b-0 lg:border-r">
          <h1 className="serif-title text-6xl font-semibold uppercase leading-[0.84] text-espresso sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-ink/78">{description}</p>
        </div>

        <Link
          to={heroPost ? `/blog/${heroPost.slug}` : '#'}
          className="category-hero__image group relative min-h-[220px] lg:min-h-[280px]"
        >
          {heroPost && (
            <img
              src={heroPost.image}
              alt={heroPost.imageAlt}
              srcSet={heroPost.imageSrcSet}
              sizes="(min-width: 1024px) 640px, 100vw"
              className="category-hero__image-el absolute inset-0 h-full w-full object-cover object-center saturate-[0.78] transition duration-700 group-hover:scale-[1.02] group-hover:saturate-100"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/10 via-transparent to-transparent" />
        </Link>
      </div>

      <nav className="category-subnav flex overflow-x-auto border-t border-ink/10 bg-ivory">
        <Link
          to={`/${parentSlug}`}
          className={`category-subnav__link ${!activeSubSlug ? 'is-active' : ''}`}
          aria-current={!activeSubSlug ? 'page' : undefined}
        >
          All {parentSlug.charAt(0).toUpperCase() + parentSlug.slice(1)}
        </Link>
        {subcategories.map((item) => (
          <Link
            key={item.slug}
            to={getSubcategoryPath(parentSlug, item.slug)}
            className={`category-subnav__link ${activeSubSlug === item.slug ? 'is-active' : ''}`}
            aria-current={activeSubSlug === item.slug ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </section>
  );
};

export default memo(CategoryHero);
