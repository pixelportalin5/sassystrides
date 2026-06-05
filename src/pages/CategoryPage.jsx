import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import CategoryBanner from '../components/CategoryBanner';
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
import {
  stripHtml,
} from '../services/wordpressApi';

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
const brandOptions = ['Dior', 'Prada', 'Chanel', 'Celine', 'Max Mara', 'Gucci', 'Saint Laurent', 'Zara', 'Mango'];
const colorOptions = [
  { label: 'Cream', value: 'cream', hex: '#f4ead8' },
  { label: 'Black', value: 'black', hex: '#14110f' },
  { label: 'Beige', value: 'beige', hex: '#d9c2a2' },
  { label: 'White', value: 'white', hex: '#fffaf1' },
  { label: 'Gray', value: 'gray', hex: '#7b7770' },
];

const initialFilters = {
  categories: [],
  brands: [],
  colors: [],
  tags: [],
};

const getRouteSlug = (location, params) => {
  if (params.slug) {
    return slugify(decodeURIComponent(params.slug));
  }

  const pathnameSlug = slugify(decodeURIComponent(location.pathname.split('/').filter(Boolean)[0] || ''));
  return canonicalCategories.includes(pathnameSlug) ? pathnameSlug : 'fashion';
};

const getPostSearchText = (post) =>
  [
    post?.title?.rendered,
    post?.excerpt?.rendered,
    post?.content?.rendered,
    post?.categoryName,
    ...(post?.tagNames || []),
  ]
    .map(stripHtml)
    .join(' ')
    .toLowerCase();

const postMatchesTerm = (post, value) => {
  const text = getPostSearchText(post);
  return text.includes(value) || slugify(text).includes(value);
};

const createTextOptions = (items, posts) =>
  items
    .map((item) => {
      const value = typeof item === 'string' ? slugify(item) : item.value;
      const label = typeof item === 'string' ? item : item.label;
      const count = posts.filter((post) => postMatchesTerm(post, value)).length;
      return { ...(typeof item === 'string' ? {} : item), label, value, count };
    })
    .filter((item) => item.count > 0 || ['cream', 'black', 'beige', 'white', 'gray'].includes(item.value));

const createFilterOptions = (posts) => {
  const categoryMap = new Map();
  const tagMap = new Map();

  posts.forEach((post) => {
    if (post.categoryName) {
      const value = post.categorySlug || slugify(post.categoryName);
      const current = categoryMap.get(value) || { label: post.categoryName, value, count: 0 };
      current.count += 1;
      categoryMap.set(value, current);
    }

    (post.tagNames || []).forEach((tagName) => {
      const value = slugify(tagName);
      const current = tagMap.get(value) || { label: tagName, value, count: 0 };
      current.count += 1;
      tagMap.set(value, current);
    });
  });

  return {
    categories: [...categoryMap.values()].slice(0, 8),
    brands: createTextOptions(brandOptions, posts),
    colors: createTextOptions(colorOptions, posts),
    tags: [...tagMap.values()].slice(0, 10),
  };
};

const filterPosts = (posts, filters) =>
  posts.filter((post) => {
    const categoryValue = post.categorySlug || slugify(post.categoryName);
    const tagValues = post.tagSlugs?.length ? post.tagSlugs : (post.tagNames || []).map(slugify);

    if (filters.categories.length && !filters.categories.includes(categoryValue)) {
      return false;
    }

    if (filters.brands.length && !filters.brands.some((brand) => postMatchesTerm(post, brand))) {
      return false;
    }

    if (filters.colors.length && !filters.colors.some((color) => postMatchesTerm(post, color))) {
      return false;
    }

    if (filters.tags.length && !filters.tags.some((tag) => tagValues.includes(tag))) {
      return false;
    }

    return true;
  });

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
  const params = useParams();
  const location = useLocation();
  const routeSlug = getRouteSlug(location, params);

  const [filters, setFilters] = useState(initialFilters);
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
    cacheTime: CATEGORY_CACHE_TIME,
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
    setFilters(initialFilters);
    setSort('latest');
    setView('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const label = `category-page:${routeSlug}`;
    totalLoadLabelRef.current = label;
    console.time(label);
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

  const filterOptions = useMemo(() => createFilterOptions(posts), [posts]);
  const displayedPosts = useMemo(
    () => sortPosts(filterPosts(posts, filters), sort),
    [posts, filters, sort],
  );
  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((values) => values.length > 0),
    [filters],
  );

  useEffect(() => {
    console.log('Category query state', {
      slug: routeSlug,
      categoryId: postsQuery.data?.category?.id || category?.id || null,
      categorySlug: postsQuery.data?.category?.slug || category?.slug || routeSlug,
      status: postsQuery.status,
      isLoading: postsQuery.isLoading,
      isFetching: postsQuery.isFetching,
      isError: postsQuery.isError,
      postCount: posts.length,
      filteredPostCount: displayedPosts.length,
      category: postsQuery.data?.category || null,
      error: postsQuery.error?.message || null,
    });
  }, [
    category?.id,
    category?.slug,
    displayedPosts.length,
    posts.length,
    postsQuery.data?.category,
    postsQuery.error,
    postsQuery.isError,
    postsQuery.isFetching,
    postsQuery.isLoading,
    postsQuery.status,
    routeSlug,
  ]);

  const toggleFilter = useCallback((group, value) => {
    setFilters((current) => {
      const values = current[group];
      return {
        ...current,
        [group]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  }, []);

  const clearFilters = useCallback(() => setFilters(initialFilters), []);
  const isPostsLoading = postsQuery.isLoading && !posts.length;
  const hasApiError = postsQuery.isError;
  const trendingPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar />
      <main className="space-y-6 pb-8">
        <div className="editorial-container pt-4">
          <CategoryBanner post={posts[0] || trendingPosts[0]} slot={1} variant="leaderboard" title="Saint Laurent" />
        </div>

        <CategoryHero category={activeCategory} heroPost={posts[0] || trendingPosts[0]} categories={categories} />

        <section className="editorial-container grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_230px]">
          <CategorySidebar
            category={activeCategory}
            categories={categories}
            adPost={posts[2] || trendingPosts[2]}
            filters={filters}
            filterOptions={filterOptions}
            onToggleFilter={toggleFilter}
            onClearFilters={clearFilters}
          />

          <CategoryPostGrid
            title={activeCategory.name}
            posts={displayedPosts}
            adPost={posts[3] || trendingPosts[3]}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            isLoading={isPostsLoading}
            emptyMessage={
              hasApiError
                ? 'Unable to connect to WordPress.'
                : posts.length && hasActiveFilters
                ? 'Refine your filters to continue browsing.'
                : 'No articles found in this category.'
            }
          />

          <aside className="space-y-6 lg:col-span-2 xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CategoryBanner post={posts[1] || trendingPosts[1]} slot={2} variant="skyscraper" title="Dior" />
              <Suspense fallback={<div className="h-80 border border-ink/10 bg-porcelain" />}>
                <TrendingWidget posts={trendingPosts} />
              </Suspense>
            </div>
          </aside>
        </section>

        <div className="editorial-container">
          <CategoryBanner post={posts[4] || trendingPosts[4]} slot={5} variant="inline" title="Celine" action="Shop Collection" />
        </div>

        <Suspense fallback={<div className="editorial-container h-64 border border-ink/10 bg-porcelain" />}>
          <Newsletter />
        </Suspense>

        <div className="editorial-container">
          <CategoryBanner post={posts[5] || trendingPosts[5]} slot={6} variant="inline" title="Chanel" action="Subscribe" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
