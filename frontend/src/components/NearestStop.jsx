/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getNearestStops } from '../util/api';
import '../styles/NearestStopModal.scss';
import { appendRecentStop } from '../util/CookieHandler';

class NearestStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validRequest: false,
      stops: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { coords } = this.props;
    if (coords && coords !== prevProps.coords) {
      this.getStops();
    }
  }

  getStops = async () => {
    const {
      coords: { latitude, longitude },
    } = this.props;
    const { status, stops } = await getNearestStops(latitude, longitude);

    if (status.code === 200) {
      this.setState({ validRequest: true, stops });
    } else {
      // TODO: Maybe do something with invalid requests
      this.setState({ validRequest: false });
    }
  };

  render() {
    const { isOpen, toggle, positionError, coords } = this.props;
    const { stops, showMore } = this.state;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} className="nearest-stop-modal">
          <ModalHeader>Nearest Stops</ModalHeader>
          <ModalBody>
            {positionError != null
              ? 'Location services are not enabled.'
              : stops.slice(0, showMore ? 10 : 5).map((value, key) => {
                  // only get 5 items max
                  return (
                    <div key={key} className="link">
                      <Link
                        to={`/track/${value.stop_id}`}
                        onClick={() => {
                          toggle();
                          appendRecentStop({
                            name: value.stop_name,
                            id: value.stop_id,
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
            {coords && (
              <Button
                className="showMoreBtn"
                color="primary"
                onClick={() => this.setState({ showMore: !showMore })}
              >
                Show {showMore ? 'Less' : 'More'}
              </Button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Exit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

NearestStop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  positionError: PropTypes.object,
  coords: PropTypes.object,
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
  suppressLocationOnMount: true,
})(NearestStop);
