import { useEffect } from 'react';
import AdSlot from '../components/ads/AdSlot';
import LazyAdSlot from '../components/ads/LazyAdSlot';
import FeaturedStories from '../components/FeaturedStories';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import HomepageCategoryDirectory from '../components/HomepageCategoryDirectory';
import HomepageCategorySection from '../components/HomepageCategorySection';
import Navbar from '../components/Navbar';
import HomeSkeleton from '../components/skeletons/HomeSkeleton';
import StyleMoodCarousel from '../components/StyleMoodCarousel';
import { usePosts } from '../hooks/usePosts';
import { validateAllConfiguredAds } from '../services/advancedAdsService';

const Home = () => {
  const { posts, categories, loading, error } = usePosts();

  useEffect(() => {
    validateAllConfiguredAds();
  }, []);

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

        <AdSlot page="homepage" slot={1} variant="hero-billboard" />

        <HomepageCategorySection
          posts={posts.slice(3, 14)}
          categories={categories}
          blogPosts={posts.slice(0, 6)}
        />

        <div className="editorial-container homepage-featured-section">
          <FeaturedStories posts={posts.slice(8, 14)} />
        </div>

        <LazyAdSlot page="homepage" slot={3} variant="inline-banner" />

        <StyleMoodCarousel posts={posts.slice(0, 14)} />

        <LazyAdSlot page="homepage" slot={4} variant="style-mood-sponsor" />

        <HomepageCategoryDirectory posts={posts.slice(0, 5)} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
