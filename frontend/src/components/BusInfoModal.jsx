import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { motion } from 'framer-motion';
import { MAPBOX_API_KEY, getVehicleInfo, getStop } from '../util/api';
import '../styles/InfoModal.scss';

const BusInfoModal = ({ isOpen, toggle, busInfo, stopInfo, headerStyle }) => {
  const [nextStop, setNextStop] = useState('');
  const [previousStop, setPreviousStop] = useState('');
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [mapURL, setMapURL] = useState('');

  const getMapURL = useCallback(() => {
    if (busInfo.location !== undefined && stopInfo.stop_points !== undefined) {
      const long = busInfo.location.lon;
      const { lat } = busInfo.location;
      const stopLat = stopInfo.stop_points[0].stop_lat;
      const stopLong = stopInfo.stop_points[0].stop_lon;
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stopLong},${stopLat})/auto/400x400@2x?access_token=${MAPBOX_API_KEY}`;
    }
    return null;
  }, [busInfo.location, stopInfo.stop_points]);

  const getNameOfStop = useCallback(async (stopID) => {
    if (stopID !== null) {
      const nextStop = await getStop(stopID);
      if (!nextStop.stops[0]) {
        return 'Unknown';
      }
      const stopPoint = nextStop.stops[0].stop_points.find(
        (obj) => obj.stop_id === stopID
      );
      return stopPoint ? stopPoint.stop_name : 'Unknown';
    }
    return 'Unknown';
  }, []);

  const getNextPrevStops = useCallback(async () => {
    try {
      const { vehicles } = await getVehicleInfo(busInfo.vehicle_id);
      const nextStopID = vehicles[0].next_stop_id;
      const prevStopID = vehicles[0].previous_stop_id;
      const nextStopName = await getNameOfStop(nextStopID);
      const prevStopName = await getNameOfStop(prevStopID);

      const lastUpdatedDate = vehicles[0].last_updated;
      setNextStop(nextStopName);
      setPreviousStop(prevStopName);
      setLastUpdated(
        !Number.isNaN(new Date() - new Date(lastUpdatedDate))
          ? Math.round((new Date() - new Date(lastUpdatedDate)) / 1000)
          : 'Unknown'
      );
    } catch (e) {
      setNextStop('Unknown');
      setPreviousStop('Unknown');
      setLastUpdated('N/A');
      setMapURL('');
    }
  }, [busInfo.vehicle_id, getNameOfStop]);

  useEffect(() => {
    if (isOpen) {
      const url = getMapURL();
      setMapURL(url);
      setImgLoaded(false);
      getNextPrevStops();
    }
  }, [isOpen, getMapURL, getNextPrevStops]);

  const toggleImageExpand = useCallback(() => {
    setImageExpanded((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setNextStop('');
    setPreviousStop('');
    setImageExpanded(false);
    setImgLoaded(false);
    setLastUpdated(0);
    toggle();
  }, [toggle]);

  return (
    <Modal isOpen={isOpen} toggle={handleClose} className="info-modal">
      <ModalHeader toggle={handleClose} style={headerStyle}>
        {busInfo.headsign}
      </ModalHeader>
      <ModalBody>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img
            className={`img-fluid map-image ${imageExpanded ? 'full' : ''}`}
            alt="bus information"
            src={mapURL}
            style={imgLoaded ? {} : { visibility: 'hidden' }}
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>
        <p
          className="expand-text"
          onClick={toggleImageExpand}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleImageExpand();
            }
          }}
        >
          {imageExpanded ? 'Make Smaller' : 'Expand'}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded || mapURL === '' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="stop-info">
            <b>Next Stop: </b>
            {nextStop}
            <br />
            <b>Previous Stop: </b>
            {previousStop}
            <br />
            <br />
            {lastUpdated !== 'Unknown' && (
              <i>Position last updated {lastUpdated} seconds ago</i>
            )}
          </p>
        </motion.div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Exit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

BusInfoModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  busInfo: PropTypes.object.isRequired,
  stopInfo: PropTypes.object.isRequired,
  headerStyle: PropTypes.object,
};

export default BusInfoModal;
