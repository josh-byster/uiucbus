import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapPin, Clock, Timer } from 'lucide-react';
import removeColors from './HelperFunctions';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

const BusResultRow = ({ info, toggleModal, elementOrder }) => {
  const computeHMS = (expectedDate) => {
    const date = new Date(expectedDate.toString());
    let hour = date.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    const minute = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute}:${seconds} ${ampm}`;
  };

  const bgColor = useMemo(() => `#${info.route.route_color}`, [info.route.route_color]);
  const textColor = useMemo(() => `#${info.route.route_text_color}`, [info.route.route_text_color]);

  const isArriving = info.expected_mins === 0;
  const isUrgent = info.expected_mins > 0 && info.expected_mins <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: elementOrder * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={cn(
          'overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-l-4',
          isArriving && 'animate-pulse'
        )}
        style={{ borderLeftColor: bgColor }}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Bus Info */}
            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold mb-2"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {removeColors(info.headsign)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Arrives at {computeHMS(info.expected)}</span>
              </div>
            </div>

            {/* Center: Time Display */}
            <div className="flex flex-col items-center justify-center px-4">
              <div
                className={cn(
                  'text-3xl sm:text-4xl font-bold tabular-nums',
                  isArriving && 'text-green-600 dark:text-green-400',
                  isUrgent && 'text-orange-600 dark:text-orange-400'
                )}
              >
                {isArriving ? (
                  <span className="text-2xl sm:text-3xl">Now</span>
                ) : (
                  <span>{info.expected_mins}m</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Timer className="h-3 w-3" />
                <span>{isArriving ? 'Arriving' : 'minutes'}</span>
              </div>
            </div>

            {/* Right: Location Button */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleModal(info)}
                className="gap-2"
                aria-label={`View location of ${removeColors(info.headsign)}`}
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Location</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

BusResultRow.propTypes = {
  info: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  elementOrder: PropTypes.number.isRequired,
};

export default BusResultRow;
