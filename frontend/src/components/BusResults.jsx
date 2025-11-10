import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import PullToRefresh from 'pulltorefreshjs';
import { motion, AnimatePresence } from 'framer-motion';
import { getBuses } from '../util/api';
import BusResultRow from './BusResultRow';
import BusInfoModal from './BusInfoModal';

const BusResults = ({ stopInfo, resultCallback, style, shouldRefresh, errorHandler }) => {
  const [departures, setDepartures] = useState([]);
  const [validRequest, setValidRequest] = useState(null);
  const [modalInfo, setModalInfo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleRequestError = useCallback(
    (numRetries) => {
      errorHandler(
        `Looks like at this moment, the MTD servers are under heavy load and are unresponsive. We'll keep retrying in the meantime. (Number of tries: ${numRetries})`
      );
    },
    [errorHandler]
  );

  const getData = useCallback(async () => {
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
    resultCallback();
  }, [stopInfo.stop_id, handleRequestError, resultCallback]);

  useEffect(() => {
    PullToRefresh.init({
      mainElement: 'body',
      triggerElement: '.data',
      shouldPullToRefresh: () => {
        return stopInfo.stop_id !== undefined;
      },
      onRefresh: getData,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, [stopInfo.stop_id, getData]);

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

  if (validRequest === null) {
    return <div />;
  }

  if (validRequest === false) {
    return (
      <motion.h4
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        This page cannot be loaded.
      </motion.h4>
    );
  }

  if (validRequest === true && departures.length === 0) {
    return (
      <motion.h4
        className="no-bus"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        No buses coming in the next hour.
      </motion.h4>
    );
  }

  return (
    <div style={style}>
      <BusInfoModal
        busInfo={modalInfo}
        isOpen={modalOpen}
        toggle={toggleModal}
        stopInfo={stopInfo}
        headerStyle={getModalStyle(modalInfo)}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Table responsive>
          <thead>
            <tr>
              <th id="bus-name">Bus Name</th>
              <th id="mins-left">Mins Left</th>
              <th id="eta">ETA</th>
              <th id="last-location">Last Location</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {departures.map((element, key) => (
                <BusResultRow
                  info={element}
                  toggleModal={toggleModal}
                  key={`${element.headsign}-${element.expected_mins}-${key}`}
                  elementOrder={key}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </motion.div>
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
