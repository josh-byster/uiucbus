import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { getBuses } from '../util/api';
import BusResultRow from './BusResultRow';
import BusResultSkeleton from './BusResultSkeleton';
import BusInfoModal from './BusInfoModal';

const BusResults = ({ stopInfo, resultCallback, style, shouldRefresh, errorHandler }) => {
  const [departures, setDepartures] = useState([]);
  const [validRequest, setValidRequest] = useState(null);
  const [modalInfo, setModalInfo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleRequestError = useCallback(
    (numRetries) => {
      errorHandler(
        `Looks like at this moment, the MTD servers are under heavy load and are unresponsive. We'll keep retrying in the meantime. (Number of tries: ${numRetries})`
      );
    },
    [errorHandler]
  );

  const getData = useCallback(async () => {
    setIsLoading(true);
    const { status, departures: fetchedDepartures } = await getBuses(
      stopInfo.stop_id,
      handleRequestError
    );
    if (status.code === 200) {
      setValidRequest(true);
      setDepartures(fetchedDepartures);
    } else {
      setValidRequest(false);
    }
    setIsLoading(false);
    resultCallback();
  }, [stopInfo.stop_id, handleRequestError, resultCallback]);

  useEffect(() => {
    if (stopInfo.stop_id || shouldRefresh) {
      setDepartures([]);
      setValidRequest(null);
      setModalInfo({});
      setModalOpen(false);
      getData();
    }
  }, [stopInfo.stop_id, shouldRefresh, getData]);

  const toggleModal = useCallback((info) => {
    if (info !== undefined) {
      setModalInfo(info);
      setModalOpen((prev) => !prev);
    } else {
      setModalOpen((prev) => !prev);
    }
  }, []);

  const getModalStyle = useCallback((info) => {
    if (info.route) {
      return {
        backgroundColor: `#${info.route.route_color}`,
        color: `#${info.route.route_text_color}`,
      };
    }
    return {};
  }, []);

  // Loading state with skeletons
  if (isLoading || validRequest === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <BusResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (validRequest === false) {
    return (
      <motion.div
        className="max-w-2xl mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-foreground mb-2">Unable to Load</h4>
        <p className="text-muted-foreground">This page cannot be loaded at the moment.</p>
      </motion.div>
    );
  }

  // No buses state
  if (validRequest === true && departures.length === 0) {
    return (
      <motion.div
        className="max-w-2xl mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-6xl mb-4">🚌</div>
        <h4 className="text-xl font-semibold text-foreground mb-2">No Buses Coming</h4>
        <p className="text-muted-foreground">No buses coming in the next hour.</p>
      </motion.div>
    );
  }

  return (
    <div style={style} className="max-w-4xl mx-auto px-4">
      <BusInfoModal
        busInfo={modalInfo}
        isOpen={modalOpen}
        toggle={toggleModal}
        stopInfo={stopInfo}
        headerStyle={getModalStyle(modalInfo)}
      />

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {departures.map((element, key) => (
            <BusResultRow
              info={element}
              toggleModal={toggleModal}
              key={`${element.headsign}-${element.expected_mins}-${key}`}
              elementOrder={key}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

BusResults.propTypes = {
  stopInfo: PropTypes.object.isRequired,
  resultCallback: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  shouldRefresh: PropTypes.bool.isRequired,
  errorHandler: PropTypes.func.isRequired,
};

export default BusResults;
