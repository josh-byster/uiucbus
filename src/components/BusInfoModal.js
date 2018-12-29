import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Card
} from "reactstrap";
import { MAPBOX_API_KEY, getVehicleInfo, getStop } from "../util/api.js";
import "../styles/InfoModal.scss";
class BusInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapURL: "",
      nextStop: "",
      previousStop: ""
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.busInfo !== this.props.busInfo) {
      var mapURL = this.getMapURL();

      this.setState({ mapURL: mapURL, imgLoaded: false });
      this.getNextPrevStops();
      console.log(this.props.busInfo);
      console.log(this.props.stopInfo);
    }
  }

  getNextPrevStops = async () => {
    const { status, vehicles } = await getVehicleInfo(
      this.props.busInfo.vehicle_id
    );
    if (status.code === 200) {
      var nextStopID = vehicles[0].next_stop_id;
      var prevStopID = vehicles[0].previous_stop_id;

      if (nextStopID !== null) {
        var nextStop = await getStop(nextStopID);
        var nextStopName = nextStop.stops[0].stop_points.filter(obj => {
          return obj.stop_id === nextStopID;
        })[0].stop_name;
      } else {
        nextStopName = "Unknown";
      }

      if (prevStopID !== null) {
        var prevStop = await getStop(prevStopID);
        var prevStopName = prevStop.stops[0].stop_points.filter(obj => {
          return obj.stop_id === prevStopID;
        })[0].stop_name;
      } else {
        prevStopName = "Unknown";
      }

      this.setState({ nextStop: nextStopName, previousStop: prevStopName });
    }
  };

  getMapURL = () => {
    if (
      this.props.busInfo.location !== undefined &&
      this.props.stopInfo.stop_points !== undefined
    ) {
      var long = this.props.busInfo.location.lon;
      var lat = this.props.busInfo.location.lat;
      var stop_lat = this.props.stopInfo.stop_points[0].stop_lat;
      var stop_long = this.props.stopInfo.stop_points[0].stop_lon;
      var mapbox_api = MAPBOX_API_KEY;
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stop_long},${stop_lat})/auto/400x400@2x?access_token=${mapbox_api}`;
    }
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={e => this.props.toggle()}
          className="info-modal"
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.busInfo.headsign}
          </ModalHeader>
          <ModalBody>
            <img
              className="img-fluid map-image"
              alt="bus information"
              src={this.state.mapURL}
              style={this.state.imgLoaded ? {} : { visibility: "hidden" }} // Toggle visibility based on the image loaded
              onLoad={() => this.setState({ imgLoaded: true })}
            />

            <p className="stop-info">
              <b>Next Stop:</b> {this.state.nextStop}
              <br />
              <b>Previous Stop</b> {this.state.previousStop}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={e => this.props.toggle()}>
              Exit
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
