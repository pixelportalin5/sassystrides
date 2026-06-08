import { ArrowUpRight } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';
import PostImage from './PostImage';

const HeroSection = memo(({ posts = [] }) => {
  const hero = posts[0];
  const latest = posts.slice(1, 5);

  if (!hero) {
    return (
      <section className="editorial-container grid min-h-[520px] place-items-center border-x border-b border-ink/10 bg-paper-grain">
        <p className="micro-label text-taupe">Loading Editorial Stories</p>
      </section>
    );
  }

  return (
    <section className="editorial-container grid border-x border-b border-ink/10 bg-paper-grain lg:grid-cols-[1.02fr_1.48fr_0.82fr]">
      <div className="flex min-h-[520px] flex-col justify-center border-b border-ink/10 p-8 sm:p-12 lg:border-b-0 lg:border-r">
        <p className="micro-label mb-5 text-bronze">Inspire. Elevate. Empower.</p>
        <Link to={`/blog/${hero.slug}`}>
          <h1 className="serif-title max-w-xl text-6xl font-semibold uppercase leading-[0.82] text-espresso sm:text-7xl xl:text-8xl">
            {stripHtml(hero.title.rendered)}
          </h1>
        </Link>
        <p className="mt-6 max-w-md text-sm leading-7 text-taupe sm:text-base">
          {stripHtml(hero.excerpt.rendered)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/blog/${hero.slug}`}
            className="bg-espresso px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-porcelain transition hover:bg-bronze"
          >
            Explore Story
          </Link>
          <a
            href="#featured"
            className="border border-ink/20 px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition hover:border-espresso hover:bg-espresso hover:text-porcelain"
          >
            View Issues
          </a>
        </div>
      </div>

      <Link
        to={`/blog/${hero.slug}`}
        className="group relative min-h-[520px] overflow-hidden border-b border-ink/10 lg:border-b-0 lg:border-r"
      >
        <PostImage
          src={hero.heroImage || hero.image}
          alt={hero.imageAlt}
          srcSet={hero.imageSrcSet}
          sizes="(min-width: 1024px) 48vw, 100vw"
          priority
          className="h-full w-full object-cover object-center saturate-[0.82] transition duration-700 group-hover:scale-[1.025] group-hover:saturate-100"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent p-8 text-porcelain">
          <p className="micro-label mb-3 text-champagne">{hero.categoryName}</p>
          <p className="serif-title text-4xl leading-none">The New Editorial Mood</p>
        </div>
      </Link>

      <aside className="divide-y divide-ink/10 bg-porcelain/70">
        <div className="p-6">
          <p className="micro-label text-bronze">Latest Stories</p>
        </div>
        {latest.map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group grid grid-cols-[2rem_1fr] gap-4 p-6 transition hover:bg-parchment/70"
          >
            <span className="serif-title text-2xl leading-none text-ink/55">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>
              <span className="micro-label mb-2 block text-taupe">{post.categoryName}</span>
              <span className="serif-title block text-2xl leading-none text-espresso transition group-hover:text-bronze">
                {stripHtml(post.title.rendered)}
              </span>
            </span>
          </Link>
        ))}
        <a
          href="#featured"
          className="inline-flex w-full items-center justify-between p-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-espresso transition hover:bg-espresso hover:text-porcelain"
        >
          View All Stories
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </a>
      </aside>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
