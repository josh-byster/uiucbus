import React from 'react';
import * as Sentry from '@sentry/browser';
import { Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import BusNavbar from './components/BusNavbar';
import { ThemeProvider } from './components/theme-provider';
import LogRocket from 'logrocket';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true,
    },
  },
});

if (import.meta.env.PROD) {
  ReactGA.initialize('UA-109186351-1');
  ReactGA.pageview(window.location.pathname + window.location.search);

  Sentry.init({
    dsn: 'https://a3cd776e555b4f62b9215dee5e11a886@sentry.io/306037',
  });

  LogRocket.init('oh67gs/uiucbus');

  LogRocket.getSessionURL((sessionURL) => {
    Sentry.setContext('logrocket', { sessionURL });
  });
  window.addEventListener('offline', function (e) {
    // Network offline - could add toast notification here if needed
  });

  window.addEventListener('online', function (e) {
    // Network back online - could add toast notification here if needed
  });
}
function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <BusNavbar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/track/:id" element={<TrackingPage />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
