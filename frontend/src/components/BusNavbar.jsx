import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  appendRecentStop,
  getRecentStops,
  clearAllRecents,
} from '../util/CookieHandler';
import '../styles/navbar.scss';

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

  const handleStopClick = useCallback(
    (stop) => (e) => {
      appendRecentStop({ name: stop.name, id: stop.id });
      closeNavbar();
      e.target.blur();
    },
    [closeNavbar]
  );

  const handleRecentClick = useCallback(
    (e) => {
      e.target.blur();
      closeNavbar();
    },
    [closeNavbar]
  );

  return (
    <Navbar color="dark" dark expand="md" className="navbar-modern">
      <NavbarBrand tag={Link} to="/">
        UIUC Bus Tracker
      </NavbarBrand>
      <NavbarToggler onClick={toggle} aria-label="Toggle navigation" />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          {DEFAULT_STOPS.map((stop) => (
            <NavItem key={stop.id}>
              <NavLink tag={Link} to={`/track/${stop.id}`} onClick={handleStopClick(stop)}>
                {stop.name}
              </NavLink>
            </NavItem>
          ))}

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret onClick={updateRecents}>
              Recents
            </DropdownToggle>
            <DropdownMenu end>
              {recentStops.length > 0 ? (
                <>
                  {recentStops.map((stop, index) => (
                    <DropdownItem key={`${stop.id}-${index}`}>
                      <Link
                        to={`/track/${stop.id}`}
                        onClick={handleRecentClick}
                        className="dropdown-link"
                      >
                        {stop.name}
                      </Link>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem onClick={clearAllRecents} className="clear-recents">
                    Clear All
                  </DropdownItem>
                </>
              ) : (
                <DropdownItem disabled>No recent stops</DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default BusNavbar;
