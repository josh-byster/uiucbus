import React, { useState, useCallback, useRef, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Check } from 'lucide-react';
import { appendRecentStop } from '../util/CookieHandler';
import NearestStop from './NearestStop';
import stops from '../util/allstops.json';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  const words = inputValue.split(' ');

  return inputLength === 0
    ? []
    : stops
        .filter((stop) => {
          return words.every((word) => stop.stop_name.toLowerCase().includes(word));
        })
        .slice(0, 8);
};

const StopSearch = ({ style }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedStop, setSelectedStop] = useState(null);
  const [nearestStopModalOpen, setNearestStopModalOpen] = useState(false);
  const nearestStopRef = useRef(null);

  const filteredStops = query === '' ? [] : getSuggestions(query);

  const handleSelect = useCallback(
    (stop) => {
      if (stop) {
        appendRecentStop({
          name: stop.stop_name,
          id: stop.stop_id,
        });
        setQuery('');
        setSelectedStop(null);
        navigate(`/track/${stop.stop_id}`);
      }
    },
    [navigate]
  );

  const toggleNearestStopModal = useCallback(() => {
    setNearestStopModalOpen((prev) => !prev);
  }, []);

  const getLocation = useCallback(() => {
    if (nearestStopRef.current) {
      nearestStopRef.current.getLocation();
    }
  }, []);

  return (
    <div className="w-full space-y-4" style={style}>
      <Combobox value={selectedStop} onChange={handleSelect}>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Combobox.Input
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base"
              displayValue={(stop) => stop?.stop_name ?? ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a bus stop..."
              aria-label="Search for bus stop"
              data-testid="stop-search-input"
            />
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl bg-card border-2 border-border shadow-xl max-h-60 overflow-y-auto" data-testid="stop-search-suggestions">
              {filteredStops.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-3 text-muted-foreground text-sm">
                  No stops found.
                </div>
              ) : (
                filteredStops.map((stop) => (
                  <Combobox.Option
                    key={stop.stop_id}
                    className={({ active }) =>
                      cn(
                        'relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground'
                      )
                    }
                    value={stop}
                    data-testid="stop-search-option"
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                          {stop.stop_name}
                        </span>
                        {selected && (
                          <span
                            className={cn(
                              'absolute inset-y-0 left-0 flex items-center pl-3',
                              active ? 'text-primary-foreground' : 'text-primary'
                            )}
                          >
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      <Button
        onClick={() => {
          getLocation();
          toggleNearestStopModal();
        }}
        variant="outline"
        className="w-full h-12 text-base font-medium"
        aria-label="Find nearest bus stops"
      >
        <MapPin className="mr-2 h-5 w-5" />
        Find Nearest Stops
      </Button>

      {nearestStopModalOpen && (
        <NearestStop
          isOpen={nearestStopModalOpen}
          toggle={toggleNearestStopModal}
          ref={nearestStopRef}
        />
      )}
    </div>
  );
};

StopSearch.propTypes = {
  style: PropTypes.object,
};

export default StopSearch;
