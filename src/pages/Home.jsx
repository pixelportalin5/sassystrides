import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { BannerUnit, GridAdCard, MagazineBanner } from '../components/EditorialAds';
import BlogCard from '../components/BlogCard';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedStories from '../components/FeaturedStories';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import InstagramGallery from '../components/InstagramGallery';
import Navbar from '../components/Navbar';
import { HOMEPAGE_BANNER_IDS } from '../constants/bannerPlacements';
import { usePosts } from '../hooks/usePosts';
import { stripHtml } from '../services/wordpressApi';

const Newsletter = lazy(() => import('../components/Newsletter'));

const brandNames = ['Louis Vuitton', 'Gucci', 'Prada', 'Dior', 'Chanel', 'Saint Laurent', 'Cartier'];
const cities = ['Paris', 'Milan', 'London', 'New York', 'Los Angeles'];

const SectionHeader = ({ title, action = 'View All' }) => (
  <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
    <h2 className="micro-label text-espresso">{title}</h2>
    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-taupe">
      {action}
    </span>
  </div>
);

const MoodCarousel = ({ posts = [] }) => (
  <section className="editorial-container editorial-section">
    <SectionHeader title="Browse By Style Mood" action="Swipe" />
    <div className="luxury-scrollbar flex gap-3 overflow-x-auto pb-3">
      {posts.slice(0, 12).map((post) => (
        <Link
          key={post.id}
          to={`/blog/${post.slug}`}
          className="group min-w-[160px] border border-ink/10 bg-porcelain p-2 sm:min-w-[205px]"
        >
          <div className="aspect-[1.08/1] overflow-hidden bg-champagne">
            <img
              src={post.image}
              alt={post.imageAlt}
              srcSet={post.imageSrcSet}
              sizes="205px"
              className="h-full w-full object-cover saturate-[0.8] transition duration-500 group-hover:scale-105 group-hover:saturate-100"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="micro-label mt-3 text-bronze">{post.categoryName}</p>
          <h3 className="serif-title mt-1 line-clamp-2 text-2xl leading-none">
            {stripHtml(post.title.rendered)}
          </h3>
        </Link>
      ))}
    </div>
  </section>
);

const SectionAdRow = ({ adIds = [], layout = 'pair' }) => {
  const validAdIds = adIds.filter(Boolean);

  if (!validAdIds.length) {
    return null;
  }

  if (layout === 'full') {
    return (
      <div className="section-ad-row section-ad-row--full section-ad-row--edge">
        <BannerUnit adId={validAdIds[0]} size="horizontal" />
      </div>
    );
  }

  if (layout === 'stack' && validAdIds.length >= 2) {
    return (
      <div className="section-ad-row section-ad-row--stack">
        {validAdIds.slice(0, 2).map((adId) => (
          <div key={adId} className="section-ad-row__slot">
            <GridAdCard adId={adId} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'pair' && validAdIds.length >= 2) {
    return (
      <div className="section-ad-row">
        <div className="section-ad-row__slot">
          <GridAdCard adId={validAdIds[0]} />
        </div>
        <div className="section-ad-row__slot">
          <GridAdCard adId={validAdIds[1]} />
        </div>
      </div>
    );
  }

  return (
    <div className="section-ad-row section-ad-row--single">
      <div className="section-ad-row__slot">
        <GridAdCard adId={validAdIds[0]} />
      </div>
    </div>
  );
};

const CategorySectionWithAds = ({
  name,
  posts = [],
  fallback = [],
  adIds = [],
  adLayout = 'pair',
}) => {
  const sectionPosts =
    posts.filter((post) => post.categoryName.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 4) || [];
  const displayPosts = sectionPosts.length >= 3 ? sectionPosts : fallback.slice(0, 4);

  if (!displayPosts.length) {
    return null;
  }

  return (
    <section id={name.toLowerCase()} className="editorial-container editorial-section">
      <SectionHeader title={name} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayPosts.map((post, index) => (
          <BlogCard key={`${name}-${post.id}`} post={post} variant="compact" index={index + 6} />
        ))}
      </div>
      <SectionAdRow adIds={adIds} layout={adLayout} />
    </section>
  );
};

const PostGridSection = ({ title, posts = [] }) => {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="editorial-container editorial-section">
      <SectionHeader title={title} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {posts.map((post, index) => (
          <BlogCard key={`${title}-${post.id}`} post={post} variant="compact" index={index + 6} />
        ))}
      </div>
    </section>
  );
};

const FashionCities = ({ posts = [] }) => (
  <section className="editorial-container editorial-section">
    <SectionHeader title="Fashion Cities" action="View All Cities" />
    <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-5">
      {cities.map((city, index) => {
        const post = posts[index];
        return (
          <Link
            key={city}
            to={post ? `/blog/${post.slug}` : '#'}
            className="group relative min-h-40 overflow-hidden bg-espresso"
          >
            {post && (
              <img
                src={post.image}
                alt={post.imageAlt}
                srcSet={post.imageSrcSet}
                sizes="20vw"
                className="absolute inset-0 h-full w-full object-cover opacity-72 saturate-[0.65] transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent" />
            <div className="relative flex h-full min-h-40 flex-col justify-end p-5 text-center text-porcelain">
              <p className="serif-title text-4xl uppercase leading-none">{city}</p>
              <span className="micro-label mt-2 text-champagne">City Guide</span>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

const BrandStrip = () => (
  <section className="editorial-container border-y border-ink/10 bg-espresso px-4 py-5 text-porcelain">
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
      {brandNames.map((brand) => (
        <span
          key={brand}
          className="serif-title text-2xl uppercase leading-none tracking-[0.04em] text-porcelain/90"
        >
          {brand}
        </span>
      ))}
    </div>
  </section>
);

const Home = () => {
  const { posts, categories, loading, error } = usePosts();

  if (!loading && (error || !posts.length)) {
    return (
      <div className="min-h-screen bg-ivory">
        <Navbar />
        <main className="editorial-container grid min-h-[70vh] place-items-center text-center">
          <div>
            <p className="micro-label mb-4 text-bronze">Editorial Desk</p>
            <h1 className="serif-title text-6xl leading-none text-espresso">
              Stories are temporarily unavailable.
            </h1>
            <p className="mt-5 text-taupe">
              Please check the WordPress API connection and try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar />

      <main className="homepage-magazine pb-20 lg:pb-8">
        <HeroSection posts={posts.slice(0, 6)} />
        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.afterHero} />

        <CategoryGrid posts={posts.slice(3, 14)} categories={categories} />
        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.afterCategoryGrid} />

        <div className="editorial-container editorial-section">
          <FeaturedStories posts={posts.slice(8, 14)} />
        </div>
        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.afterFeaturedStories} />

        <MoodCarousel posts={posts.slice(0, 14)} />
        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.afterMoodCarousel} />

        <CategorySectionWithAds
          name="Fashion"
          posts={posts}
          fallback={posts.slice(0, 4)}
          adIds={[
            HOMEPAGE_BANNER_IDS.fashionGridPrimary,
            HOMEPAGE_BANNER_IDS.fashionGridSecondary,
          ]}
          adLayout="pair"
        />

        <CategorySectionWithAds
          name="Beauty"
          posts={posts}
          fallback={posts.slice(4, 8)}
          adIds={[HOMEPAGE_BANNER_IDS.beautyGridSecondary]}
          adLayout="full"
        />

        <CategorySectionWithAds
          name="Lifestyle"
          posts={posts}
          fallback={posts.slice(8, 12)}
          adIds={[HOMEPAGE_BANNER_IDS.lifestyleGrid]}
          adLayout="single"
        />

        <CategorySectionWithAds
          name="Trends"
          posts={posts}
          fallback={posts.slice(12, 16)}
          adIds={[HOMEPAGE_BANNER_IDS.trendsGrid]}
          adLayout="single"
        />

        <CategorySectionWithAds
          name="News"
          posts={posts}
          fallback={posts.slice(2, 6)}
          adIds={[
            HOMEPAGE_BANNER_IDS.newsGridPrimary,
            HOMEPAGE_BANNER_IDS.newsGridSecondary,
          ]}
        />

        <PostGridSection title="Editor's Picks" posts={posts.slice(4, 8)} />

        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.beforeFashionCities} />
        <FashionCities posts={posts.slice(10, 16)} />

        <Suspense
          fallback={
            <div className="editorial-container editorial-section h-64 border border-ink/10 bg-porcelain" />
          }
        >
          <Newsletter
            topAdId={HOMEPAGE_BANNER_IDS.newsletterTop}
            rightAdId={HOMEPAGE_BANNER_IDS.newsletterRight}
          />
        </Suspense>

        <InstagramGallery
          posts={posts.slice(0, 8)}
          gridAdId={HOMEPAGE_BANNER_IDS.beautyGridPrimary}
        />
        <MagazineBanner adId={HOMEPAGE_BANNER_IDS.instagramBelow} />

        <BrandStrip />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
