// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import TanstackQueryProvider from './lib/tanstack-query';
import { router } from './lib/router';
import { Toaster } from '@/components/ui/sonner';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <TanstackQueryProvider>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors />
  </TanstackQueryProvider>
);