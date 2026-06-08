import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { logWordPressConfig } from './config/wordpress.js';
import { BannersProvider } from './context/BannersContext.jsx';
import { prefetchHomepageAds } from './services/adQueries.js';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchHomepagePostsQuery,
} from './services/categoryQueries.js';
import { queryClient } from './services/queryClient.js';
import './styles/index.css';

logWordPressConfig();

queryClient.prefetchQuery({
  queryKey: categoryQueryKeys.homepagePosts,
  queryFn: fetchHomepagePostsQuery,
  staleTime: CATEGORY_STALE_TIME,
  gcTime: CATEGORY_CACHE_TIME,
});

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => prefetchHomepageAds(queryClient), { timeout: 3000 });
} else {
  window.setTimeout(() => prefetchHomepageAds(queryClient), 1500);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BannersProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BannersProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
