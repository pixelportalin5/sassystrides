import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { logWordPressConfig } from './config/wordpress.js';
import { BannersProvider } from './context/BannersContext.jsx';
import { queryClient } from './services/queryClient.js';
import './styles/index.css';

logWordPressConfig();

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
