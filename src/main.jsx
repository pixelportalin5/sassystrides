import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { logHomepageBannerConfig } from './data/homepageAds.js';
import { logWordPressConfig } from './config/wordpress.js';
import { queryClient } from './services/queryClient.js';
import './styles/index.css';

logWordPressConfig();
logHomepageBannerConfig();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
