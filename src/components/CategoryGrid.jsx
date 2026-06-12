import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryTiles = [
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Runway, Street Style & Luxury Looks',
    span: 'third',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Expert Tips, Reviews & New Trends',
    span: 'third',
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Style for Every Part of Your Life',
    span: 'third',
  },
  {
    name: 'Trends',
    slug: 'trends',
    description: "What's New, What's Next",
    span: 'wide',
  },
  {
    name: 'News',
    slug: 'news',
    description: 'Events, Celebrities & Industry Updates',
    span: 'narrow',
  },
];

const CategoryGrid = ({ posts = [], categories = [] }) => {
  const tiles = categoryTiles.map((tile, index) => {
    const category = categories.find((item) =>
      item.name.toLowerCase().includes(tile.slug),
    );
    const post =
      posts.find((item) => item.categoryName.toLowerCase().includes(tile.slug)) ||
      posts[index];

    return {
      ...tile,
      href: category?.slug ? `/${category.slug}` : `/${tile.slug}`,
      post,
    };
  });

  return (
    <div className="homepage-category-grid">
      {tiles.map((tile) => (
        <Link
          key={tile.slug}
          to={tile.href}
          className={`homepage-category-grid__tile homepage-category-grid__tile--${tile.span} group`}
        >
          {tile.post && (
            <img
              src={tile.post.image}
              alt={tile.post.imageAlt}
              srcSet={tile.post.imageSrcSet}
              sizes="(min-width: 1280px) 28vw, (min-width: 768px) 33vw, 100vw"
              className="homepage-category-grid__image"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="homepage-category-grid__overlay" />
          <div className="homepage-category-grid__content">
            <p className="homepage-category-grid__title serif-title text-3xl uppercase leading-none text-porcelain sm:text-4xl">
              {tile.name}
            </p>
            <p className="homepage-category-grid__description mt-3 max-w-xs text-xs leading-5 text-porcelain/82">
              {tile.description}
            </p>
            <span className="homepage-category-grid__cta">
              Explore
              <ArrowUpRight size={13} strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
