import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";
import { MAPBOX_API_KEY } from "../util/api.js";
class BusInfoModal extends Component {
  getMapURL = () => {
    if (this.props.busInfo.location !== undefined) {
      var long = this.props.busInfo.location.lon;
      var lat = this.props.busInfo.location.lat;
      var stop_lat = 0;
      var stop_long = 0;
      var mapbox_api = MAPBOX_API_KEY;
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stop_long},${stop_lat})/auto/500x500@2x?access_token=${mapbox_api}`;
    }
  };
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={e => this.props.toggle()}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {JSON.stringify(this.props.busInfo)}
          </ModalHeader>
          <ModalBody>
            <img
              className="img-fluid"
              alt="bus information"
              src={this.getMapURL()}
            />
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
  isOpen: PropTypes.bool.isRequired,
  busInfo: PropTypes.object.isRequired,
  stopInfo: PropTypes.object.isRequired
};

export default BusInfoModal;

// <center><img class='img-fluid' style='border-radius:20px;' src="https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stop_long},${stop_lat})/auto/500x500@2x?access_token=${mapbox_api}"></img>
