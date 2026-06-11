import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { logRequestSummary, setRequestPage } from './utils/requestTracker';

const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SubcategoryPage = lazy(() => import('./pages/SubcategoryPage'));
const ContentPage = lazy(() => import('./pages/ContentPage'));

const RouteFallback = () => (
  <div className="min-h-[60vh] bg-ivory" aria-label="Loading page">
    <div className="editorial-container space-y-6 py-10">
      <div className="h-10 w-48 animate-pulse bg-espresso/10" />
      <div className="h-[420px] animate-pulse bg-champagne/60" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-72 animate-pulse border border-ink/10 bg-porcelain" />
        ))}
      </div>
    </div>
  </div>
);

const categoryRoutes = new Set(['/fashion', '/beauty', '/lifestyle', '/trends', '/news']);

const getPageLabel = (pathname) => {
  if (pathname === '/') {
    return 'homepage';
  }

  if (pathname.startsWith('/blog/')) {
    return 'article';
  }

  if (
    categoryRoutes.has(pathname) ||
    pathname.startsWith('/category/') ||
    /^\/(fashion|beauty|lifestyle|trends|news)\/[^/]+/.test(pathname)
  ) {
    return 'category';
  }

  return pathname;
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const page = getPageLabel(location.pathname);
    setRequestPage(page);

    const summaryTimer = window.setTimeout(() => {
      logRequestSummary(page);
    }, 4000);

    return () => {
      window.clearTimeout(summaryTimer);
      logRequestSummary(page);
    };
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/fashion/:subSlug" element={<SubcategoryPage />} />
            <Route path="/beauty/:subSlug" element={<SubcategoryPage />} />
            <Route path="/lifestyle/:subSlug" element={<SubcategoryPage />} />
            <Route path="/trends/:subSlug" element={<SubcategoryPage />} />
            <Route path="/news/:subSlug" element={<SubcategoryPage />} />
            <Route path="/fashion" element={<CategoryPage />} />
            <Route path="/beauty" element={<CategoryPage />} />
            <Route path="/lifestyle" element={<CategoryPage />} />
            <Route path="/trends" element={<CategoryPage />} />
            <Route path="/news" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route
              path="/about"
              element={
                <ContentPage
                  title="About"
                  description="Sassy Strides is a refined digital fashion magazine for elevated style, contemporary beauty, and editorial culture."
                />
              }
            />
            <Route
              path="/editorial"
              element={
                <ContentPage
                  title="Editorial"
                  description="Our editorial desk curates runway notes, beauty edits, and refined style inspiration for the modern wardrobe."
                />
              }
            />
            <Route
              path="/contact"
              element={
                <ContentPage
                  title="Contact"
                  description="For partnerships, press, and editorial inquiries, connect with the Sassy Strides team."
                />
              }
            />
            <Route
              path="/advertise"
              element={
                <ContentPage title="Advertise">
                  <div className="mx-auto max-w-2xl space-y-5 text-left text-sm leading-7 text-taupe">
                    <p>Interested in advertising with SassyStrides?</p>
                    <p>
                      Promote your brand through banner ads, product features, and collaborations
                      to reach a wider shopping audience.
                    </p>
                    <p>For inquiries, partnerships, or promotions, please contact:</p>
                    <p>
                      <a
                        href="mailto:affiliate@webaffino.com"
                        className="text-espresso underline decoration-ink/20 underline-offset-4"
                      >
                        affiliate@webaffino.com
                      </a>
                    </p>
                    <p>Thank you for supporting SassyStrides!</p>
                  </div>
                </ContentPage>
              }
            />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
