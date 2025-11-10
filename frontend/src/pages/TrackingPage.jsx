import React, { useState, useEffect, useCallback } from 'react';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistance } from 'date-fns';
import { Alert } from 'reactstrap';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import BusResults from '../components/BusResults';
import '../styles/tracking.scss';
import { getStop } from '../util/api';
import StopSearch from '../components/StopSearch';
import { useParams } from 'react-router-dom';

const SECS_UNTIL_REFRESH_WARN = 10;

const TrackingPage = () => {
  const { id } = useParams();
  const [stopInfo, setStopInfo] = useState({});
  const [stopNameLoaded, setStopNameLoaded] = useState(null);
  const [stopResultsLoaded, setStopResultsLoaded] = useState(null);
  const [secsSinceRefresh, setSecsSinceRefresh] = useState(0);
  const [shouldRefreshResults, setShouldRefreshResults] = useState(false);
  const [error, setError] = useState('');

  const incrementCounter = useCallback(() => {
    setSecsSinceRefresh((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(incrementCounter, 1000);
    return () => clearInterval(intervalID);
  }, [incrementCounter]);

  const handleCurrentStopError = useCallback((numRetries) => {
    setError(
      `Looks like at this moment, the MTD servers are under heavy load and are unresponsive. We'll keep retrying in the meantime. (Number of tries: ${numRetries})`
    );
  }, []);

  const getStopName = useCallback(
    async (stopId) => {
      const { status, stops } = await getStop(stopId, handleCurrentStopError);
      if (status.code === 200 && stops.length > 0) {
        const stopObj = stops[0];
        setStopInfo(stopObj);
        setStopNameLoaded(true);
        document.title = `${stopObj.stop_name} - Bus Tracker`;
      } else {
        setStopInfo({});
        setStopNameLoaded(false);
      }
    },
    [handleCurrentStopError]
  );

  useEffect(() => {
    setStopNameLoaded(null);
    setStopResultsLoaded(null);
    getStopName(id);
  }, [id, getStopName]);

  const finishedLoadingResults = useCallback(() => {
    setError('');
    setStopResultsLoaded(true);
    setShouldRefreshResults(false);
    setSecsSinceRefresh(0);
  }, []);

  const refresh = useCallback(() => {
    setShouldRefreshResults(true);
    setStopResultsLoaded(false);
  }, []);

  const shouldDisplayProgress = useCallback(() => {
    return !stopResultsLoaded && stopNameLoaded !== false;
  }, [stopResultsLoaded, stopNameLoaded]);

  useEffect(() => {
    if (shouldDisplayProgress()) {
      if (stopNameLoaded === true && !stopResultsLoaded && nProgress.status < 0.5) {
        nProgress.set(0.5);
      }
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [stopNameLoaded, stopResultsLoaded, shouldDisplayProgress]);

  const resultStyle = shouldDisplayProgress() ? { display: 'none' } : {};
  const displayReload = secsSinceRefresh > SECS_UNTIL_REFRESH_WARN;
  const timeSinceRefreshText = formatDistance(0, secsSinceRefresh * 1000, {
    addSuffix: false,
    includeSeconds: true,
  });

  return (
    <div className="tracking-page">
      <div className="info">
        <div className="errors container">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert color="danger">{error}</Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="data" style={resultStyle}>
          <motion.h1
            className="stop_name"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {stopInfo.stop_name}
          </motion.h1>

          <StopSearch />
          <motion.div
            className={`refresh-text ${displayReload ? 'fadeIn' : 'fadeOut'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: displayReload ? 1 : 0 }}
            transition={{ duration: 0.75 }}
          >
            <h5>
              Last refresh happened {timeSinceRefreshText} ago. Reload?
              <br />
              <button
                type="button"
                className="refresh-btn"
                onClick={refresh}
                disabled={!displayReload}
                aria-label="Refresh bus arrivals"
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
            </h5>
          </motion.div>
        </div>
        <div style={resultStyle}>
          {stopNameLoaded === false ? (
            <motion.h4
              className="no-bus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Stop does not exist
            </motion.h4>
          ) : (
            <BusResults
              style={resultStyle}
              resultCallback={finishedLoadingResults}
              stopInfo={stopInfo}
              shouldRefresh={shouldRefreshResults}
              errorHandler={setError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
