import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import CategoryHero from '../components/CategoryHero';
import CategoryPostGrid from '../components/CategoryPostGrid';
import CategorySidebar from '../components/CategorySidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  BRAND_NAME,
  getSubcategoriesByParent,
  getSubcategoryBySlugs,
  PARENT_CATEGORY_SLUGS,
} from '../constants/subcategories';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchCategoryPostsQuery,
  normalizePosts,
  slugify,
} from '../services/categoryQueries';
import { stripHtml } from '../services/wordpressApi';

const Newsletter = lazy(() => import('../components/Newsletter'));

const canonicalCategoryMeta = {
  fashion: { id: 21, name: 'Fashion', slug: 'fashion', description: '' },
  beauty: { id: 19, name: 'Beauty', slug: 'beauty', description: '' },
  lifestyle: { id: 20, name: 'Lifestyle', slug: 'lifestyle', description: '' },
  trends: { id: 23, name: 'Trends', slug: 'trends', description: '' },
  news: { id: 47, name: 'News', slug: 'news', description: '' },
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

const postMatchesKeyword = (post, keyword) => {
  const normalized = slugify(keyword);
  const text = getPostSearchText(post);
  return text.includes(keyword.toLowerCase()) || text.includes(normalized) || slugify(text).includes(normalized);
};

const SubcategoryPage = () => {
  const { subSlug } = useParams();
  const { pathname } = useLocation();

  const parentSlug = useMemo(() => {
    const [parent] = pathname.split('/').filter(Boolean);
    return PARENT_CATEGORY_SLUGS.includes(parent) ? parent : null;
  }, [pathname]);

  const subcategory = getSubcategoryBySlugs(parentSlug, subSlug);
  const parentMeta = canonicalCategoryMeta[parentSlug] || canonicalCategoryMeta.fashion;

  const [sort, setSort] = useState('latest');
  const [view, setView] = useState('grid');

  const postsQuery = useQuery({
    queryKey: categoryQueryKeys.categoryPosts(parentSlug),
    queryFn: () => fetchCategoryPostsQuery({ slug: parentSlug }),
    enabled: Boolean(parentSlug),
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });

  const filteredPosts = useMemo(() => {
    if (!subcategory) {
      return [];
    }

    const allPosts = normalizePosts(postsQuery.data?.posts || []);
    return allPosts.filter((post) =>
      subcategory.keywords.some((keyword) => postMatchesKeyword(post, keyword)),
    );
  }, [postsQuery.data, subcategory]);

  const category = useMemo(
    () =>
      subcategory
        ? {
            ...parentMeta,
            name: subcategory.name,
            slug: subcategory.slug,
            description: subcategory.description,
          }
        : parentMeta,
    [parentMeta, subcategory],
  );

  const categories = useMemo(
    () => Object.values(canonicalCategoryMeta),
    [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [parentSlug, subSlug]);

  const handleSortChange = useCallback((value) => setSort(value), []);
  const handleViewChange = useCallback((value) => setView(value), []);

  if (!subcategory) {
    return (
      <div className="min-h-screen bg-ivory text-ink">
        <Navbar />
        <main className="editorial-container grid min-h-[60vh] place-items-center text-center">
          <div>
            <p className="micro-label mb-4 text-bronze">{BRAND_NAME}</p>
            <h1 className="serif-title text-5xl leading-none text-espresso">Section not found.</h1>
            <Link to={`/${parentSlug || 'fashion'}`} className="btn-cta btn-cta--primary mt-8">
              Back to {parentMeta.name}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const siblingSubcategories = getSubcategoriesByParent(parentSlug);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar />
      <main className="space-y-6 pb-8">
        <CategoryHero
          category={category}
          heroPost={filteredPosts[0] || postsQuery.data?.posts?.[0]}
          categories={categories}
          subcategories={siblingSubcategories}
          activeSubSlug={subcategory.slug}
          parentSlug={parentSlug}
        />

        <section className="editorial-container grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
          <CategorySidebar
            category={category}
            categories={categories}
            parentSlug={parentSlug}
            activeSubSlug={subcategory.slug}
          />

          <CategoryPostGrid
            title={subcategory.name}
            posts={filteredPosts}
            categorySlug={parentSlug}
            sort={sort}
            onSortChange={handleSortChange}
            view={view}
            onViewChange={handleViewChange}
            isLoading={postsQuery.isLoading && !filteredPosts.length}
            emptyMessage={`No articles found in ${subcategory.name} yet.`}
          />
        </section>

        <Suspense fallback={null}>
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default SubcategoryPage;
