import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AdSlot from '../components/ads/AdSlot';
import HomepageSponsorRow from '../components/ads/HomepageSponsorRow';
import BlogCard from '../components/BlogCard';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedStories from '../components/FeaturedStories';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import InstagramGallery from '../components/InstagramGallery';
import Navbar from '../components/Navbar';
import HomeSkeleton from '../components/skeletons/HomeSkeleton';
import { usePosts } from '../hooks/usePosts';
import { prefetchHomepageAds } from '../services/adQueries';
import { validateAllConfiguredAds } from '../services/advancedAdsService';
import { stripHtml } from '../services/wordpressApi';

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

const CategoryPostsSection = ({ name, posts = [], fallback = [] }) => {
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

const Home = () => {
  const queryClient = useQueryClient();
  const { posts, categories, loading, error } = usePosts();

  useEffect(() => {
    prefetchHomepageAds(queryClient);
    validateAllConfiguredAds();
  }, [queryClient]);

  if (loading && !posts.length) {
    return <HomeSkeleton />;
  }

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
        <AdSlot page="homepage" slot={1} variant="magazine" />

        <CategoryGrid posts={posts.slice(3, 14)} categories={categories} />
        <AdSlot page="homepage" slot={2} variant="magazine" />

        <div className="editorial-container editorial-section">
          <FeaturedStories posts={posts.slice(8, 14)} />
        </div>
        <AdSlot page="homepage" slot={3} variant="magazine" />

        <MoodCarousel posts={posts.slice(0, 14)} />
        <AdSlot page="homepage" slot={4} variant="magazine" />

        <div className="editorial-container editorial-section homepage-sponsor-section">
          <div className="section-ad-row homepage-sponsor-row">
            <HomepageSponsorRow />
          </div>
        </div>

        <CategoryPostsSection name="Fashion" posts={posts} fallback={posts.slice(0, 4)} />
        <CategoryPostsSection name="Beauty" posts={posts} fallback={posts.slice(4, 8)} />
        <CategoryPostsSection name="Lifestyle" posts={posts} fallback={posts.slice(8, 12)} />
        <CategoryPostsSection name="Trends" posts={posts} fallback={posts.slice(12, 16)} />
        <CategoryPostsSection name="News" posts={posts} fallback={posts.slice(2, 6)} />

        <PostGridSection title="Editor's Picks" posts={posts.slice(4, 8)} />

        <AdSlot page="homepage" slot={11} variant="magazine" />

        <AdSlot page="homepage" slot={9} variant="magazine" />
        <FashionCities posts={posts.slice(10, 16)} />
        <AdSlot page="homepage" slot={10} variant="magazine" />

        <AdSlot page="homepage" slot={13} variant="homepage-ad-centered" />

        <InstagramGallery posts={posts.slice(0, 8)} gridSlot={14} />
        <AdSlot page="homepage" slot={15} variant="magazine" />
        <AdSlot page="homepage" slot="15b" variant="magazine" />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
