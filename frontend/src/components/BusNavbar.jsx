import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Clock, X, Menu as MenuIcon, Bus } from 'lucide-react';
import { appendRecentStop, getRecentStops, clearAllRecents } from '../util/CookieHandler';
import { ThemeToggle } from './ui/theme-toggle';
import { cn } from '@/lib/utils';

const DEFAULT_STOPS = [
  { name: 'Transit Plaza', id: 'PLAZA' },
  { name: 'Illini Union', id: 'IU' },
  { name: 'PAR', id: 'PAR' },
  { name: 'Krannert Center', id: 'KRANNERT' },
  { name: 'First & Stadium', id: '1STSTDM' },
];

const BusNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentStops, setRecentStops] = useState([]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeNavbar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updateRecents = useCallback(() => {
    setRecentStops(getRecentStops());
  }, []);

  useEffect(() => {
    updateRecents();
  }, [updateRecents]);

  const handleStopClick = useCallback(
    (stop) => () => {
      appendRecentStop({ name: stop.name, id: stop.id });
      closeNavbar();
    },
    [closeNavbar]
  );

  const handleRecentClick = useCallback(() => {
    closeNavbar();
  }, [closeNavbar]);

  const handleClearAll = useCallback(() => {
    clearAllRecents();
    // Delay state update to allow menu close animation to complete
    setTimeout(() => {
      updateRecents();
    }, 200);
  }, [updateRecents]);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <Bus className="h-6 w-6" />
            <span className="hidden sm:inline">UIUC Bus Tracker</span>
            <span className="sm:hidden">UIUCBus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {DEFAULT_STOPS.map((stop) => (
              <Link
                key={stop.id}
                to={`/track/${stop.id}`}
                onClick={handleStopClick(stop)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-all"
              >
                {stop.name}
              </Link>
            ))}

            {/* Recents Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-all"
              >
                <Clock className="h-4 w-4" />
                <span>Recents</span>
                <ChevronDown className="h-4 w-4" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-card border-2 border-border shadow-xl focus:outline-none overflow-hidden">
                  <div className="py-1">
                    {recentStops.length > 0 ? (
                      <>
                        {recentStops.map((stop, index) => (
                          <Menu.Item key={`${stop.id}-${index}`}>
                            {({ active }) => (
                              <Link
                                to={`/track/${stop.id}`}
                                onClick={handleRecentClick}
                                className={cn(
                                  'block px-4 py-2 text-sm transition-colors',
                                  active
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-foreground'
                                )}
                              >
                                {stop.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <div className="border-t border-border my-1" />
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No recent stops
                      </div>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleClearAll}
                          className={cn(
                            'w-full text-left px-4 py-2 text-sm transition-colors',
                            active
                              ? 'bg-destructive text-destructive-foreground'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          Clear All
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {DEFAULT_STOPS.map((stop) => (
              <Link
                key={stop.id}
                to={`/track/${stop.id}`}
                onClick={handleStopClick(stop)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-accent transition-all"
              >
                {stop.name}
              </Link>
            ))}

            {/* Mobile Recents Section */}
            <div className="pt-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Stops
              </div>
              {recentStops.length > 0 ? (
                <>
                  {recentStops.map((stop, index) => (
                    <Link
                      key={`${stop.id}-${index}`}
                      to={`/track/${stop.id}`}
                      onClick={handleRecentClick}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-accent transition-all"
                    >
                      {stop.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleClearAll}
                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Clear All
                  </button>
                </>
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No recent stops
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default BusNavbar;
