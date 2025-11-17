import React, { useState, useEffect, useCallback } from 'react';
import { formatDistance } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import BusResults from '../components/BusResults';
import { getStop } from '../util/api';
import StopSearch from '../components/StopSearch';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const SECS_UNTIL_REFRESH_WARN = 30;

const TrackingPage = () => {
  const { id } = useParams();
  const [stopInfo, setStopInfo] = useState({});
  const [stopNameLoaded, setStopNameLoaded] = useState(null);
  const [stopResultsLoaded, setStopResultsLoaded] = useState(null);
  const [secsSinceRefresh, setSecsSinceRefresh] = useState(0);
  const [shouldRefreshResults, setShouldRefreshResults] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const incrementCounter = useCallback(() => {
    setSecsSinceRefresh((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(incrementCounter, 1000);
    return () => clearInterval(intervalID);
  }, [incrementCounter]);

  const handleCurrentStopError = useCallback((numRetries) => {
    const errorMsg = `MTD servers are currently experiencing high load. Retrying... (Attempt ${numRetries})`;
    setError(errorMsg);
    toast.error(errorMsg);
  }, []);

  const getStopName = useCallback(
    async (stopId) => {
      const { status, stops } = await getStop(stopId, handleCurrentStopError);
      if (status.code === 200 && stops.length > 0) {
        const stopObj = stops[0];
        setStopInfo(stopObj);
        setStopNameLoaded(true);
        document.title = `${stopObj.stop_name} - UIUC Bus Tracker`;
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
    setIsRefreshing(false);
  }, []);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setShouldRefreshResults(true);
    setStopResultsLoaded(false);
    toast.success('Refreshing bus arrivals...');
  }, []);

  const resultStyle = !stopResultsLoaded && stopNameLoaded !== false ? { opacity: 0.5 } : {};
  const displayReload = secsSinceRefresh > SECS_UNTIL_REFRESH_WARN;
  const timeSinceRefreshText = formatDistance(0, secsSinceRefresh * 1000, {
    addSuffix: false,
    includeSeconds: true,
  });

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-destructive/10 border-destructive/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground" data-testid="stop-name">
            {stopInfo.stop_name || 'Loading...'}
          </h1>

          {/* Search Section */}
          <div className="max-w-md mx-auto">
            <StopSearch />
          </div>

          {/* Refresh Section */}
          <AnimatePresence>
            {displayReload && stopResultsLoaded && (
              <motion.div
                className="inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="inline-flex items-center gap-3 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Last refresh: {timeSinceRefreshText} ago
                  </p>
                  <Button
                    size="sm"
                    onClick={refresh}
                    disabled={isRefreshing}
                    aria-label="Refresh bus arrivals"
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <div style={resultStyle}>
          {stopNameLoaded === false ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl mb-4">❌</div>
              <h4 className="text-2xl font-semibold text-foreground mb-2">Stop Not Found</h4>
              <p className="text-muted-foreground">This stop does not exist</p>
            </motion.div>
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
