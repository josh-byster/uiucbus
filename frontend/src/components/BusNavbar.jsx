import React, { Component } from 'react';
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

class BusNavbar extends Component {
  defaultStops = [
    {
      name: 'Transit Plaza',
      id: 'PLAZA',
    },
    {
      name: 'Illini Union',
      id: 'IU',
    },
    {
      name: 'PAR',
      id: 'PAR',
    },
    {
      name: 'Krannert Center',
      id: 'KRANNERT',
    },
    {
      name: 'First & Stadium',
      id: '1STSTDM',
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      recentStops: [],
    };
  }

  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  closeNavbar = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({
        isOpen: false,
      });
    }
  };

  updateRecents = () => {
    this.setState({ recentStops: getRecentStops() });
  };

  render() {
    const { isOpen, recentStops } = this.state;
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={Link} to="/">
            UIUC Bus Tracker
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.defaultStops.map((value, key) => {
                return (
                  <NavItem key={key}>
                    <NavLink
                      tag={Link}
                      to={`/track/${value.id}`}
                      onClick={(e) => {
                        appendRecentStop({ name: value.name, id: value.id });
                        this.closeNavbar();
                        e.target.blur();
                      }}
                    >
                      {value.name}
                    </NavLink>
                  </NavItem>
                );
              })}

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret onClick={this.updateRecents}>
                  Recents
                </DropdownToggle>
                <DropdownMenu end>
                  {recentStops.map((value, key) => {
                    return (
                      <DropdownItem key={key}>
                        <NavLink
                          tag={Link}
                          to={`/track/${value.id}`}
                          onClick={(e) => {
                            e.target.blur();
                            this.closeNavbar();
                          }}
                          style={{ color: '#000000' }}
                        >
                          {value.name}
                        </NavLink>
                      </DropdownItem>
                    );
                  })}
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink
                      onClick={() => clearAllRecents()}
                      style={{ color: '#000000' }}
                    >
                      Clear All
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default BusNavbar;
