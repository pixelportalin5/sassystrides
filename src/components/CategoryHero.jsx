import { memo } from 'react';
import { Link } from 'react-router-dom';

const fallbackSubcategories = {
  fashion: ['Clothing', 'Fashion Week', 'Look of the Day', 'Accessories', 'Shoes'],
  beauty: ['Hair', 'Skin', 'Makeup', 'Fragrance', 'Wellness'],
  lifestyle: ['Culture', 'Travel', 'Interiors', 'Parties', 'Wellbeing'],
  trends: ['Spring', 'Summer', 'Autumn', 'Winter', 'Runway'],
  news: ['Awards & Events', 'Entertainment', 'Interviews', 'Magazine', 'Shopping'],
};

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

const CategoryHero = ({ category, heroPost, categories = [] }) => {
  const slug = category?.slug || 'fashion';
  const title = category?.name || slug.replace(/-/g, ' ');
  const description =
    category?.description ||
    defaultDescriptions[slug] ||
    `A curated edit of the newest ${title.toLowerCase()} stories from Sassy Strides.`;
  const subcategories = fallbackSubcategories[slug] || fallbackSubcategories.fashion;

  const resolveSubcategory = (name) => {
    const normalizedName = name.toLowerCase();
    return categories.find(
      (item) =>
        item.slug === normalizedName.replace(/\s+/g, '-') ||
        item.name.toLowerCase() === normalizedName ||
        item.name.toLowerCase().includes(normalizedName),
    );
  };

  return (
    <section className="editorial-container overflow-hidden border border-ink/10 bg-paper-grain">
      <div className="grid min-h-[265px] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center border-b border-ink/10 bg-porcelain/70 p-7 sm:p-10 lg:border-b-0 lg:border-r">
          <h1 className="serif-title text-6xl font-semibold uppercase leading-[0.84] text-espresso sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-ink/78">{description}</p>
        </div>

        <Link to={heroPost ? `/blog/${heroPost.slug}` : '#'} className="group relative min-h-[265px]">
          {heroPost && (
            <img
              src={heroPost.image}
              alt={heroPost.imageAlt}
              srcSet={heroPost.imageSrcSet}
              sizes="(min-width: 1024px) 800px, 100vw"
              className="absolute inset-0 h-full w-full object-cover object-top saturate-[0.78] transition duration-700 group-hover:scale-[1.025] group-hover:saturate-100"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/10 via-transparent to-transparent" />
        </Link>
      </div>

      <nav className="flex overflow-x-auto border-t border-ink/10 bg-ivory">
        {subcategories.map((item) => {
          const matchedCategory = resolveSubcategory(item);
          return (
            <Link
              key={item}
              to={matchedCategory ? `/category/${matchedCategory.slug}` : '#category-posts'}
              className="min-w-max border-r border-ink/10 px-6 py-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-espresso transition hover:bg-espresso hover:text-porcelain"
            >
              {item}
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default memo(CategoryHero);
