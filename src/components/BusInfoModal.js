import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";
class BusInfoModal extends Component {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={e => this.props.toggle()}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

BusInfoModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default BusInfoModal;

// <center><img class='img-fluid' style='border-radius:20px;' src="https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stop_long},${stop_lat})/auto/500x500@2x?access_token=${mapbox_api}"></img>
