import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useGeolocated } from 'react-geolocated';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNearestStops } from '../util/api';
import '../styles/NearestStopModal.scss';
import { appendRecentStop } from '../util/CookieHandler';

const NearestStop = forwardRef(({ isOpen, toggle }, ref) => {
  const [stops, setStops] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const { coords, getPosition } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  useImperativeHandle(ref, () => ({
    getLocation: () => {
      getPosition();
    },
  }));

  const getStops = useCallback(async () => {
    if (coords) {
      const { latitude, longitude } = coords;
      const { status, stops: fetchedStops } = await getNearestStops(latitude, longitude);

      if (status.code === 200) {
        setStops(fetchedStops);
      }
    }
  }, [coords]);

  useEffect(() => {
    if (isOpen) {
      getStops();
    }
  }, [isOpen, getStops]);

  const handleStopClick = useCallback(
    (stop) => () => {
      toggle();
      appendRecentStop({
        name: stop.stop_name,
        id: stop.stop_id,
      });
    },
    [toggle]
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="nearest-stop-modal">
      <ModalHeader toggle={toggle}>Nearest Stops</ModalHeader>
      <ModalBody>
        {!coords ? (
          <p>Location services are not enabled.</p>
        ) : (
          <>
            {stops.slice(0, showMore ? 10 : 5).map((stop, key) => (
              <motion.div
                key={`${stop.stop_id}-${key}`}
                className="link"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: key * 0.05 }}
              >
                <Link to={`/track/${stop.stop_id}`} onClick={handleStopClick(stop)}>
                  {stop.stop_name} ({Math.round((stop.distance / 5280) * 100) / 100}{' '}
                  mi.)
                </Link>
              </motion.div>
            ))}
            {coords && stops.length > 5 && (
              <Button
                className="showMoreBtn"
                color="primary"
                onClick={() => setShowMore(!showMore)}
              >
                Show {showMore ? 'Less' : 'More'}
              </Button>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Exit
        </Button>
      </ModalFooter>
    </Modal>
  );
});

NearestStop.displayName = 'NearestStop';

NearestStop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default NearestStop;
