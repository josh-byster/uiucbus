import React, { Component } from "react";
import { geolocated } from "react-geolocated";
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";

class NearestStop extends Component {
  render() {
    console.log(this.props.coords);
    if (!this.props.coords) {
      return <div />;
    }
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader>Nearest Stops</ModalHeader>
          <ModalBody>{this.props.coords.latitude}</ModalBody>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000,
  suppressLocationOnMount: true
})(NearestStop);
