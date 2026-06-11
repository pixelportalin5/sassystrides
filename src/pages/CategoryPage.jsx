import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import AdSlot from '../components/ads/AdSlot';
import CategoryHero from '../components/CategoryHero';
import CategoryPostGrid from '../components/CategoryPostGrid';
import CategorySidebar from '../components/CategorySidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchCategoryPostsQuery,
  normalizePosts,
  slugify,
} from '../services/categoryQueries';
import { prefetchCategoryAds } from '../services/adQueries';
import { validateAllConfiguredAds } from '../services/advancedAdsService';
import { isFeaturedPage } from '../utils/featuredPages';
const Newsletter = lazy(() => import('../components/Newsletter'));
const TrendingWidget = lazy(() => import('../components/TrendingWidget'));

const canonicalCategories = ['fashion', 'beauty', 'lifestyle', 'trends', 'news'];
const canonicalCategoryMeta = {
  fashion: { id: 21, name: 'Fashion', slug: 'fashion', description: '' },
  beauty: { id: 19, name: 'Beauty', slug: 'beauty', description: '' },
  lifestyle: { id: 20, name: 'Lifestyle', slug: 'lifestyle', description: '' },
  trends: { id: 23, name: 'Trends', slug: 'trends', description: '' },
  news: { id: 47, name: 'News', slug: 'news', description: '' },
};
const getRouteSlug = (location, params) => {
  if (params.slug) {
    return slugify(decodeURIComponent(params.slug));
  }

  const pathnameSlug = slugify(decodeURIComponent(location.pathname.split('/').filter(Boolean)[0] || ''));
  return canonicalCategories.includes(pathnameSlug) ? pathnameSlug : 'fashion';
};

const sortPosts = (posts, sort) =>
  [...posts].sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    }

    if (sort === 'popular') {
      const aScore = Number(a.comment_count || 0) + (a.sticky ? 10 : 0);
      const bScore = Number(b.comment_count || 0) + (b.sticky ? 10 : 0);
      return bScore - aScore || new Date(b.date) - new Date(a.date);
    }

    return new Date(b.date) - new Date(a.date);
  });

const CategoryPage = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const location = useLocation();
  const routeSlug = getRouteSlug(location, params);

  const [sort, setSort] = useState('latest');
  const [view, setView] = useState('grid');
  const totalLoadLabelRef = useRef('');

  const postsQuery = useQuery({
    queryKey: categoryQueryKeys.categoryPosts(routeSlug),
    queryFn: () =>
      fetchCategoryPostsQuery({
        slug: routeSlug,
      }),
    enabled: Boolean(routeSlug),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });

  const posts = useMemo(
    () => normalizePosts(postsQuery.data?.posts || []),
    [postsQuery.data],
  );
  const categories = useMemo(
    () => {
      const apiCategory = postsQuery.data?.category;
      const fallbackCategories = Object.values(canonicalCategoryMeta);

      if (!apiCategory) {
        return fallbackCategories;
      }

      const hasApiCategory = fallbackCategories.some(
        (category) => category.slug === apiCategory.slug,
      );

      return hasApiCategory ? fallbackCategories : [apiCategory, ...fallbackCategories];
    },
    [postsQuery.data?.category],
  );
  const category = postsQuery.data?.category || canonicalCategoryMeta[routeSlug] || null;
  const activeCategory = useMemo(
    () =>
      category || {
        name: routeSlug.replace(/-/g, ' '),
        slug: routeSlug,
        description: '',
      },
    [category, routeSlug],
  );

  useEffect(() => {
    setSort('latest');
    setView('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const label = `category-page:${routeSlug}`;
    totalLoadLabelRef.current = label;
    console.time(label);
  }, [routeSlug]);

  useLayoutEffect(() => {
    if (isFeaturedPage(routeSlug)) {
      void prefetchCategoryAds(queryClient);
    }
  }, [queryClient, routeSlug]);

  useEffect(() => {
    if (isFeaturedPage(routeSlug)) {
      validateAllConfiguredAds();
    }
  }, [routeSlug]);

  useEffect(() => {
    const label = totalLoadLabelRef.current;

    if (!label) {
      return;
    }

    if (postsQuery.isSuccess || postsQuery.isError) {
      console.timeEnd(label);
      totalLoadLabelRef.current = '';
    }
  }, [postsQuery.isSuccess, postsQuery.isError]);

  const displayedPosts = useMemo(() => sortPosts(posts, sort), [posts, sort]);
  const isPostsLoading = postsQuery.isLoading && !posts.length;
  const hasApiError = postsQuery.isError;
  const trendingPosts = posts.slice(0, 5);
  const showFeaturedAds = isFeaturedPage(routeSlug);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar />
      <main className="space-y-6 pb-8">
        <CategoryHero
          category={activeCategory}
          heroPost={posts[0] || trendingPosts[0]}
          categories={categories}
          parentSlug={routeSlug}
        />

        {showFeaturedAds ? (
          <AdSlot page="category" slot={4} variant="category-billboard" className="pb-2" />
        ) : null}

        <section className="editorial-container grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_230px]">
          <CategorySidebar
            category={activeCategory}
            categories={categories}
            parentSlug={routeSlug}
          />

          <CategoryPostGrid
            title={activeCategory.name}
            posts={displayedPosts}
            categorySlug={routeSlug}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            isLoading={isPostsLoading}
            emptyMessage={
              hasApiError
                ? 'Unable to connect to WordPress.'
                : 'No articles found in this category.'
            }
          />

          <aside className="space-y-6 lg:col-span-2 xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Suspense fallback={<div className="h-80 border border-ink/10 bg-porcelain" />}>
                <TrendingWidget posts={trendingPosts} />
              </Suspense>
            </div>
          </aside>
        </section>

        {showFeaturedAds ? (
          <div className="editorial-container">
            <AdSlot page="category" slot={7} variant="category-inline" />
          </div>
        ) : null}

        <Suspense fallback={<div className="editorial-container h-64 border border-ink/10 bg-porcelain" />}>
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
