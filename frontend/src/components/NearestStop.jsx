import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, Fragment } from 'react';
import { useGeolocated } from 'react-geolocated';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { getNearestStops } from '../util/api';
import { appendRecentStop } from '../util/CookieHandler';
import { Button } from './ui/button';

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggle}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground">
                  <Navigation2 className="h-6 w-6" />
                  <Dialog.Title className="text-xl font-bold">Nearest Stops</Dialog.Title>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                  {!coords ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">Getting your location...</p>
                    </div>
                  ) : stops.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Loading nearby stops...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stops.slice(0, showMore ? 10 : 5).map((stop, key) => (
                        <motion.div
                          key={`${stop.stop_id}-${key}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: key * 0.05 }}
                        >
                          <Link
                            to={`/track/${stop.stop_id}`}
                            onClick={handleStopClick(stop)}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent hover:border-primary transition-all group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {stop.stop_name}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground font-medium ml-2 flex-shrink-0">
                              {Math.round((stop.distance / 5280) * 100) / 100} mi
                            </span>
                          </Link>
                        </motion.div>
                      ))}

                      {stops.length > 5 && (
                        <Button
                          variant="outline"
                          onClick={() => setShowMore(!showMore)}
                          className="w-full gap-2 mt-4"
                        >
                          {showMore ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show More
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-accent/30">
                  <Button variant="outline" onClick={toggle}>
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
});

NearestStop.displayName = 'NearestStop';

NearestStop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default NearestStop;
