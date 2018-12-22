import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class BusNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
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
          <NavbarBrand tag={Link} to="/bus-tracker">
            uiucbus
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.defaultStops.map((value, key) => {
                return (
                  <NavItem key={key}>
                    <NavLink tag={Link} to={`/bus-tracker/track/${value.id}`}>
                      {value.name}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default BusNavbar;
