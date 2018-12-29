import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  appendRecentStop,
  getRecentStops,
  clearAllRecents
} from "../util/CookieHandler";
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
  DropdownItem
} from "reactstrap";

class BusNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      recentStops: []
    };
  }

  toggle = () => {
    console.log(getRecentStops());
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  updateRecents = () => {
    this.setState({ recentStops: getRecentStops() });
  };
  defaultStops = [
    {
      name: "Transit Plaza",
      id: "PLAZA"
    },
    {
      name: "Illini Union",
      id: "IU"
    },
    {
      name: "PAR",
      id: "PAR"
    },
    {
      name: "Krannert Center",
      id: "KRANNERT"
    },
    {
      name: "First & Stadium",
      id: "1STSTDM"
    }
  ];
  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={Link} to="/">
            uiucbus
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.defaultStops.map((value, key) => {
                return (
                  <NavItem key={key}>
                    <NavLink
                      tag={Link}
                      to={`/track/${value.id}`}
                      onClick={e => {
                        appendRecentStop({ name: value.name, id: value.id });
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
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  {this.state.recentStops.map((value, key) => {
                    return (
                      <DropdownItem key={key}>
                        <NavLink
                          tag={Link}
                          to={`/track/${value.id}`}
                          onClick={e => e.target.blur()}
                          style={{ color: "#000000" }}
                        >
                          {value.name}
                        </NavLink>
                      </DropdownItem>
                    );
                  })}
                  <DropdownItem divider />
                  <DropdownItem>
                    <NavLink
                      onClick={e => clearAllRecents()}
                      style={{ color: "#000000" }}
                    >
                      Reset
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
