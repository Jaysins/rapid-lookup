import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const qc = new QueryClient({});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={ qc }>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
