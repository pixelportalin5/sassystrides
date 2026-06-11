import { ArrowUpRight } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';
import PostImage from './PostImage';

const HeroSection = memo(({ posts = [] }) => {
  const hero = posts[0];
  const latestStories = posts.slice(1, 5);

  if (!hero) {
    return (
      <section className="hero-section editorial-container grid min-h-[360px] place-items-center border-x border-b border-ink/10 bg-paper-grain lg:min-h-0">
        <p className="micro-label text-taupe">Loading Editorial Stories</p>
      </section>
    );
  }

  return (
    <section className="hero-section editorial-container grid border-x border-b border-ink/10 bg-paper-grain lg:grid-cols-[1.02fr_1.48fr_0.82fr]">
      <div className="hero-section__content border-b border-ink/10 px-8 sm:px-10 lg:border-b-0 lg:border-r xl:px-12">
        <p className="micro-label mb-4 text-bronze sm:mb-5">Inspire. Elevate. Empower.</p>
        <Link to={`/blog/${hero.slug}`} className="hero-section__headline-link">
          <h1 className="hero-section__headline serif-title max-w-xl text-5xl font-semibold uppercase text-espresso sm:text-6xl lg:text-[clamp(2.5rem,3.8vw,4.25rem)] xl:text-[clamp(3.25rem,4.5vw,4.75rem)]">
            {stripHtml(hero.title.rendered)}
          </h1>
        </Link>
        <p className="mt-4 max-w-md text-sm leading-7 text-taupe sm:mt-5 sm:text-base">
          {stripHtml(hero.excerpt.rendered)}
        </p>
        <div className="hero-section__actions flex flex-wrap gap-3">
          <Link to={`/blog/${hero.slug}`} className="btn-cta btn-cta--primary">
            Explore Story
          </Link>
          <a href="#featured" className="btn-cta btn-cta--secondary">
            View Issues
          </a>
        </div>
      </div>

      <Link
        to={`/blog/${hero.slug}`}
        className="hero-section__image group border-b border-ink/10 lg:border-b-0 lg:border-r"
      >
        <PostImage
          src={hero.heroImage || hero.image}
          alt={hero.imageAlt}
          srcSet={hero.imageSrcSet}
          sizes="(min-width: 1024px) 48vw, 100vw"
          priority
          className="hero-section__image-el saturate-[0.82] transition duration-700 group-hover:scale-[1.02] group-hover:saturate-100"
        />
      </Link>

      <aside className="hero-section__sidebar divide-y divide-ink/10 bg-porcelain/70">
        <div className="p-5 sm:p-6">
          <p className="micro-label text-bronze">Latest Stories</p>
        </div>
        {latestStories.map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group grid grid-cols-[2rem_1fr] gap-4 p-5 transition hover:bg-parchment/70 sm:p-6"
          >
            <span className="serif-title text-2xl leading-none text-ink/55">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>
              <span className="micro-label mb-2 block text-taupe">{post.categoryName}</span>
              <span className="serif-title block text-xl leading-none text-espresso transition group-hover:text-bronze sm:text-2xl">
                {stripHtml(post.title.rendered)}
              </span>
            </span>
          </Link>
        ))}
        <a
          href="#featured"
          className="btn-cta btn-cta--secondary w-full justify-between rounded-none border-x-0 border-b-0"
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
