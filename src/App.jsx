import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

const RouteFallback = () => (
  <div className="min-h-[60vh] bg-ivory" aria-label="Loading page" />
);

const App = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/fashion" element={<CategoryPage />} />
            <Route path="/beauty" element={<CategoryPage />} />
            <Route path="/lifestyle" element={<CategoryPage />} />
            <Route path="/trends" element={<CategoryPage />} />
            <Route path="/news" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
