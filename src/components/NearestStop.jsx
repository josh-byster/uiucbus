import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { getNearestStops } from '../util/api.js';
import { Link } from 'react-router-dom';
import '../styles/NearestStopModal.scss';
import { appendRecentStop } from '../util/CookieHandler';
class NearestStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validRequest: false,
      stops: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.coords && this.props.coords !== prevProps.coords) {
      this.getStops();
    }
  }
  getStops = async () => {
    const { latitude, longitude } = this.props.coords;

    const { status, stops } = await getNearestStops(latitude, longitude);

    if (status.code === 200) {
      this.setState({ validRequest: true, stops: stops });
    } else {
      // TODO: Maybe do something with invalid requests
      this.setState({ validRequest: false });
    }
  };

  render() {
    // if (!this.props.coords && this.props.isGeolocationEnabled) {
    //   // Geolocation is enabled but hasn't loaded coordinates yet, so don't render anything.
    //   return <div />;
    // }
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className="nearest-stop-modal"
        >
          <ModalHeader>Nearest Stops</ModalHeader>
          <ModalBody>
            {this.props.positionError != null
              ? 'Location services are not enabled.'
              : this.state.stops.slice(0, 5).map((value, key) => {
                  // only get 5 items max
                  return (
                    <div key={key} className="link">
                      <Link
                        to={`/track/${value.stop_id}`}
                        onClick={e => {
                          this.props.toggle();
                          appendRecentStop({
                            name: value.stop_name,
                            id: value.stop_id
                          });
                        }}
                      >
                        {value.stop_name} (
                        {Math.round((value.distance / 5280) * 100) / 100} mi.)
                      </Link>
                      <br />
                    </div>
                  );
                })}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.props.toggle}>
              Exit
            </Button>
          </ModalFooter>
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
