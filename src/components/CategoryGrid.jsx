import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';

const desiredCategories = ['Fashion', 'Beauty', 'Lifestyle', 'Trends', 'News'];

const CategoryGrid = ({ posts = [], categories = [] }) => {
  const categoryTiles = desiredCategories.map((name, index) => {
    const category = categories.find((item) =>
      item.name.toLowerCase().includes(name.toLowerCase()),
    );
    const post =
      posts.find((item) =>
        item.categoryName.toLowerCase().includes(name.toLowerCase()),
      ) || posts[index];

    return {
      name: category?.name || name,
      href: category?.slug ? `/${category.slug}` : `/${name.toLowerCase()}`,
      post,
    };
  });

  return (
    <section className="editorial-container grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-3 xl:grid-cols-5">
      {categoryTiles.map((tile, index) => (
        <Link
          key={`${tile.name}-${index}`}
          to={tile.href}
          className={`group relative min-h-[230px] overflow-hidden bg-espresso ${
            index === 0 ? 'md:col-span-2 xl:col-span-1' : ''
          }`}
        >
          {tile.post && (
            <img
              src={tile.post.image}
              alt={tile.post.imageAlt}
              srcSet={tile.post.imageSrcSet}
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover opacity-72 saturate-[0.72] transition duration-700 group-hover:scale-105 group-hover:opacity-88"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
          <div className="relative flex h-full min-h-[230px] flex-col justify-end p-6 text-porcelain">
            <p className="serif-title text-4xl uppercase leading-none">{tile.name}</p>
            <p className="mt-3 line-clamp-2 max-w-xs text-xs leading-5 text-porcelain/72">
              {tile.post
                ? stripHtml(tile.post.excerpt.rendered)
                : 'Curated elegance, selected by Sassy Strides.'}
            </p>
            <span className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-champagne">
              Explore
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default CategoryGrid;
