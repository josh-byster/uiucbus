import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/home.scss';
import StopSearch from '../components/StopSearch';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Home - Bus Tracker';
  }, []);

  return (
    <div>
      <div className="home d-flex">
        <motion.div
          className="info-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1>UIUC Bus Tracker</h1>
          <StopSearch />
        </motion.div>
      </div>
      <footer className="text-muted">
        <div className="container">
          <p>
            Copyright © 2019 UIUCBus.com
            <br />
            Data provided by{' '}
            <a href="https://mtd.org/" target="_blank" rel="noopener noreferrer">
              Champaign—Urbana Mass Transit District
            </a>
            .
            <br />
            Suggestions, comments, or want to help contribute?{' '}
            <a href="https://github.com/josh-byster/bus-tracker" target="_blank" rel="noopener noreferrer">
              Check it out on GitHub!
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
