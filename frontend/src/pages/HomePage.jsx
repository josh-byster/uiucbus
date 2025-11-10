import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import StopSearch from '../components/StopSearch';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Home - UIUC Bus Tracker';
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative flex items-start justify-center pt-16 md:pt-24 px-4">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glass card */}
          <div className="glass rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              UIUC Bus Tracker
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Real-time bus arrival information at your fingertips
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StopSearch />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 text-center py-6 px-4 text-white/90 dark:text-white/80">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm md:text-base leading-relaxed">
            Copyright © 2019 UIUCBus.com
            <br />
            Data provided by{' '}
            <a
              href="https://mtd.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-white transition-colors"
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
              className="font-medium underline underline-offset-2 hover:text-white transition-colors"
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
