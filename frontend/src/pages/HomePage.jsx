import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import StopSearch from '../components/StopSearch';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Home - UIUC Bus Tracker';
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-12 text-white drop-shadow-lg">
            UIUC Bus Tracker
          </h1>

          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-8">
            <StopSearch />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 px-4 text-white/90 dark:text-white/80">
        <div className="max-w-3xl mx-auto text-sm">
          <p>
            Copyright © 2025 UIUCBus.com
            <br />
            Data provided by{' '}
            <a
              href="https://mtd.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Champaign—Urbana Mass Transit District
            </a>
            .
            <br />
            Suggestions, comments, or want to help contribute?{' '}
            <a
              href="https://github.com/josh-byster/bus-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Check it out on GitHub!
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
