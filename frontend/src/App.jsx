import React from 'react';
import * as Sentry from '@sentry/browser';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import BusNavbar from './components/BusNavbar';
import LogRocket from 'logrocket';
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-109186351-1');
  ReactGA.pageview(window.location.pathname + window.location.search);

  Sentry.init({
    dsn: 'https://a3cd776e555b4f62b9215dee5e11a886@sentry.io/306037',
  });

  LogRocket.init('oh67gs/uiucbus');

  LogRocket.getSessionURL((sessionURL) => {
    Sentry.configureScope((scope) => {
      scope.setExtra('sessionURL', sessionURL);
    });
  });
  window.addEventListener('offline', function (e) {
    console.log('Not connected to LAN');
  });

  window.addEventListener('online', function (e) {
    console.log('Connected back on LAN');
  });
}
function App() {
  return (
      <div>
        <BusNavbar />
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/track/:id" element={<TrackingPage/>} />
        </Routes>
      </div>
  );
}

export default App;
