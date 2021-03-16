import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { MAPBOX_API_KEY, getVehicleInfo, getStop } from '../util/api';
import '../styles/InfoModal.scss';

class BusInfoModal extends Component {
  defaultState = {
    nextStop: '',
    previousStop: '',
    imageExpanded: false,
    imgLoaded: false,
    lastUpdated: 0,
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (prevProps.isOpen === false && isOpen === true) {
      const mapURL = this.getMapURL();

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mapURL, imgLoaded: false });
      this.getNextPrevStops();
    }
  }

  resetState = () => {
    this.setState();
  };

  getNameOfStop = async (stopID) => {
    if (stopID !== null) {
      const nextStop = await getStop(stopID);
      if (!nextStop.stops[0]) {
        return 'Unknown';
      }
      return nextStop.stops[0].stop_points.filter(
        (obj) => obj.stop_id === stopID
      )[0].stop_name;
    }
    return 'Unknown';
  };

  getNextPrevStops = async () => {
    const { busInfo } = this.props;
    let vehicles;
    try {
      ({ vehicles } = await getVehicleInfo(busInfo.vehicle_id));
    } catch (e) {
      this.setState({
        nextStop: 'Unknown',
        previousStop: 'Unknown',
        lastUpdated: 'N/A',
        mapURL: '',
      });
      return;
    }
    const nextStopID = vehicles[0].next_stop_id;
    const prevStopID = vehicles[0].previous_stop_id;
    const nextStopName = await this.getNameOfStop(nextStopID);
    const prevStopName = await this.getNameOfStop(prevStopID);

    const lastUpdatedDate = vehicles[0].last_updated;
    this.setState({
      nextStop: nextStopName,
      previousStop: prevStopName,
      lastUpdated: !Number.isNaN(new Date() - new Date(lastUpdatedDate))
        ? Math.round((new Date() - new Date(lastUpdatedDate)) / 1000)
        : 'Unknown',
    });
  };

  getMapURL = () => {
    const { busInfo, stopInfo } = this.props;
    if (busInfo.location !== undefined && stopInfo.stop_points !== undefined) {
      const long = busInfo.location.lon;
      const { lat } = busInfo.location;
      const stopLat = stopInfo.stop_points[0].stop_lat;
      const stopLong = stopInfo.stop_points[0].stop_lon;
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stopLong},${stopLat})/auto/400x400@2x?access_token=${MAPBOX_API_KEY}`;
    }
    return null;
  };

  toggleImageExpand = () =>
    this.setState((prevState) => {
      return {
        imageExpanded: !prevState.imageExpanded,
      };
    });

  render() {
    const { props, state } = this;
    // silencing the linter warnings
    const { isOpen, toggle } = this.props;
    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={() => {
            this.setState(this.defaultState);
            toggle();
          }}
          className="info-modal"
        >
          <ModalHeader toggle={this.toggle} style={this.props.headerStyle}>
            {props.busInfo.headsign}
          </ModalHeader>
          <ModalBody>
            <img
              className={
                state.imageExpanded
                  ? 'img-fluid map-image full'
                  : 'img-fluid map-image'
              }
              alt="bus information"
              src={state.mapURL}
              style={state.imgLoaded ? {} : { visibility: 'hidden' }} // Toggle visibility based on the image loaded
              onLoad={() => this.setState({ imgLoaded: true })}
            />
            <p className="expand-text" onClick={this.toggleImageExpand}>
              {state.imageExpanded ? 'Make Smaller' : 'Expand'}{' '}
            </p>
            <p
              className="stop-info"
              style={
                state.imgLoaded || state.mapURL === ''
                  ? {}
                  : { visibility: 'hidden' }
              }
            >
              <b>Next Stop: </b>
              {state.nextStop}
              <br />
              <b>Previous Stop: </b>
              {state.previousStop}
              <br />
              <br />
              {state.lastUpdated !== 'Unknown' && (
                <i>Position last updated {state.lastUpdated} seconds ago</i>
              )}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                this.setState({});
                toggle();
              }}
            >
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
  stopInfo: PropTypes.object.isRequired,
  headerStyle: PropTypes.object,
};

export default BusInfoModal;

// <center><img class='img-fluid' style='border-radius:20px;' src="https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-bus+3498db(${long},${lat}),pin-s-information+e74c3c(${stop_long},${stop_lat})/auto/500x500@2x?access_token=${mapbox_api}"></img>
