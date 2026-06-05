import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner, { AdBannerPair } from '../components/AdBanner';
import BlogCard from '../components/BlogCard';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedStories from '../components/FeaturedStories';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import InstagramGallery from '../components/InstagramGallery';
import Navbar from '../components/Navbar';
import { homepageAds, homepageBannerSlots } from '../data/homepageAds';
import { usePosts } from '../hooks/usePosts';
import { stripHtml } from '../services/wordpressApi';
import { inspectBannerLayout } from '../utils/bannerLayoutDiagnostics';

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
  <section className="editorial-container py-6">
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

const CategorySection = ({ name, posts = [], fallback = [] }) => {
  const sectionPosts =
    posts.filter((post) => post.categoryName.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 4) || [];
  const displayPosts = sectionPosts.length >= 3 ? sectionPosts : fallback.slice(0, 4);

  if (!displayPosts.length) {
    return null;
  }

  return (
    <section id={name.toLowerCase()} className="editorial-container py-5">
      <SectionHeader title={name} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayPosts.map((post, index) => (
          <BlogCard key={`${name}-${post.id}`} post={post} variant="compact" index={index + 6} />
        ))}
      </div>
    </section>
  );
};

const PostGridSection = ({ title, posts = [] }) => {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="editorial-container py-5">
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
  <section className="editorial-container py-7">
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

  useEffect(() => {
    if (loading) {
      return;
    }

    const timer = window.setTimeout(() => {
      const renderedCount = document.querySelectorAll('.ad-banner[data-ad-id]').length;
      const imageCount = document.querySelectorAll('.ad-banner-image').length;

      console.log('Total banners rendered:', renderedCount);
      console.log('Total banner images:', imageCount);
      console.log('Total banners configured:', homepageAds.length);
      inspectBannerLayout();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [loading, posts.length]);

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

      <main className="space-y-5 pb-20 lg:pb-8">
        <HeroSection posts={posts.slice(0, 6)} />
        <AdBanner banner={homepageBannerSlots.banner1} priorityHigh />

        <CategoryGrid posts={posts.slice(3, 14)} categories={categories} />

        <FeaturedStories posts={posts.slice(8, 14)} />
        <AdBanner banner={homepageBannerSlots.banner2} priorityHigh />

        <MoodCarousel posts={posts.slice(0, 14)} />
        <AdBanner banner={homepageBannerSlots.banner3} priorityHigh />

        <CategorySection
          name="Fashion"
          posts={posts}
          fallback={posts.slice(0, 4)}
        />
        <AdBanner banner={homepageBannerSlots.banner4} priorityHigh />

        <CategorySection
          name="Beauty"
          posts={posts}
          fallback={posts.slice(4, 8)}
        />
        <AdBannerPair banners={[homepageBannerSlots.banner5, homepageBannerSlots.banner6]} />

        <CategorySection
          name="Lifestyle"
          posts={posts}
          fallback={posts.slice(8, 12)}
        />
        <AdBanner banner={homepageBannerSlots.banner7} />

        <InstagramGallery posts={posts.slice(0, 12)} />
        <AdBanner banner={homepageBannerSlots.banner8} />

        <CategorySection
          name="Trends"
          posts={posts}
          fallback={posts.slice(12, 16)}
        />
        <AdBanner banner={homepageBannerSlots.banner9} />

        <PostGridSection title="Editor's Picks" posts={posts.slice(4, 8)} />
        <AdBanner banner={homepageBannerSlots.banner10} />

        <Suspense fallback={<div className="editorial-container h-64 border border-ink/10 bg-porcelain" />}>
          <Newsletter />
        </Suspense>
        <AdBanner banner={homepageBannerSlots.banner11} />

        <PostGridSection title="Popular Stories" posts={posts.slice(8, 12)} />
        <AdBanner banner={homepageBannerSlots.banner12} />

        <FashionCities posts={posts.slice(10, 16)} />
        <AdBanner banner={homepageBannerSlots.banner13} />

        <PostGridSection title="Luxury Picks" posts={posts.slice(12, 16)} />
        <AdBanner banner={homepageBannerSlots.banner14} />

        <AdBanner banner={homepageBannerSlots.banner15} />

        <BrandStrip />
      </main>

      <AdBanner banner={homepageBannerSlots.banner15b} />
      <Footer />
    </div>
  );
};

export default Home;
