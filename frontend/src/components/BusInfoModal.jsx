import React, { useState, useEffect, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, MapPin, Navigation } from 'lucide-react';
import { MAPBOX_API_KEY, getVehicleInfo, getStop } from '../util/api';
import { Button } from './ui/button';

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
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-bus+3B82F6(${long},${lat}),pin-s+EF4444(${stopLong},${stopLat})/auto/600x400@2x?access_token=${MAPBOX_API_KEY}`;
    }
    return null;
  }, [busInfo.location, stopInfo.stop_points]);

  const getNameOfStop = useCallback(async (stopID) => {
    if (stopID !== null) {
      const nextStop = await getStop(stopID);
      if (!nextStop.stops[0]) {
        return 'Unknown';
      }
      const stopPoint = nextStop.stops[0].stop_points.find((obj) => obj.stop_id === stopID);
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-2xl transform overflow-hidden rounded-2xl bg-card shadow-2xl transition-all ${
                  imageExpanded ? 'max-w-5xl' : ''
                }`}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-6 py-4 text-white"
                  style={headerStyle}
                >
                  <Dialog.Title className="text-xl font-bold">{busInfo.headsign}</Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="rounded-full p-1 hover:bg-white/20 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4">
                  {/* Map Image */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imgLoaded ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {mapURL && (
                        <img
                          className="w-full rounded-lg"
                          alt="Bus location on map"
                          src={mapURL}
                          style={imgLoaded ? {} : { visibility: 'hidden', height: '400px' }}
                          onLoad={() => setImgLoaded(true)}
                        />
                      )}
                    </motion.div>
                    {!imgLoaded && mapURL && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Expand/Collapse Button */}
                  {mapURL && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleImageExpand}
                      className="w-full gap-2"
                    >
                      {imageExpanded ? (
                        <>
                          <Minimize2 className="h-4 w-4" />
                          Make Smaller
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-4 w-4" />
                          Expand Map
                        </>
                      )}
                    </Button>
                  )}

                  {/* Stop Information */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imgLoaded || mapURL === '' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                      <Navigation className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Next Stop</p>
                        <p className="text-sm text-muted-foreground">{nextStop || 'Loading...'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Previous Stop</p>
                        <p className="text-sm text-muted-foreground">
                          {previousStop || 'Loading...'}
                        </p>
                      </div>
                    </div>

                    {lastUpdated !== 'Unknown' && lastUpdated !== 'N/A' && (
                      <p className="text-xs text-center text-muted-foreground italic">
                        Position last updated {lastUpdated} seconds ago
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-accent/30">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
