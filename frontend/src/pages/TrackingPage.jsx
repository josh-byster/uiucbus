import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistance } from 'date-fns';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import BusResults from '../components/BusResults';
import '../styles/tracking.scss';
import { getStop } from '../util/api';
import StopSearch from '../components/StopSearch';

const SECS_UNTIL_REFRESH_WARN = 10;

class TrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopInfo: {},
      stopNameLoaded: null,
      stopResultsLoaded: null,
      secsSinceRefresh: 0,
      shouldRefreshResults: false,
      intervalID: -1
    };
    const { match } = this.props;
    this.getStopName(match.params.id);
    this.state.intervalID = setInterval(this.incrementCounter, 1000);
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (prevProps.match.params.id !== match.params.id) {
      this.setState({ stopNameLoaded: null, stopResultsLoaded: null });
      this.getStopName(match.params.id);
    }
  }

  componentWillUnmount() {
    const { intervalID } = this.state;
    if (intervalID !== -1) {
      clearInterval(intervalID);
    }
  }

  finishedLoadingResults = () => {
    this.setState({
      stopResultsLoaded: true,
      shouldRefreshResults: false,
      secsSinceRefresh: 0
    });
  };

  getStopName = async stopId => {
    const { status, stops } = await getStop(stopId);
    if (status.code === 200 && stops.length > 0) {
      const stopObj = stops[0];
      this.setState({ stopInfo: stopObj, stopNameLoaded: true });
      document.title = `${stopObj.stop_name} - Bus Tracker`;
    } else {
      this.setState({ stopInfo: {}, stopNameLoaded: false });
    }
  };

  incrementCounter = () => {
    this.setState(prevState => ({
      secsSinceRefresh: prevState.secsSinceRefresh + 1
    }));
  };

  refresh = () => {
    this.setState({ shouldRefreshResults: true,stopResultsLoaded: false });
  };

  render() {
    const {
      stopNameLoaded,
      stopResultsLoaded,
      stopInfo,
      secsSinceRefresh,
      shouldRefreshResults
    } = this.state;
    const resultStyle =
      (stopNameLoaded && stopResultsLoaded) || stopNameLoaded === false // if the stop name invalid, display the "stop invalid"
        ? {}
        : { display: 'none' };
    const progressStyle = // mutual exclusive, when one is display none, the other is off
      (stopNameLoaded && stopResultsLoaded) || stopNameLoaded === false
        ? { display: 'none' }
        : {};
    const displayReload = secsSinceRefresh > SECS_UNTIL_REFRESH_WARN;
    const timeSinceRefreshText = formatDistance(0, secsSinceRefresh * 1000, {
      addSuffix: false,
      includeSeconds: true
    });
    return (
      <div className="tracking-page">
        <LinearProgress
          color="secondary"
          variant="indeterminate"
          style={progressStyle}
        />
        <div className="info" style={resultStyle}>
          <h1 className="stop_name">{stopInfo.stop_name}</h1>

          <StopSearch />
          <div
            className={`refresh-text ${displayReload ? 'fadeIn' : 'fadeOut'}`}
          >
            <h5>
              Last refresh happened {timeSinceRefreshText} ago. Reload?
              <br />
              <button
                type="button"
                className="refresh-btn"
                onClick={e => {
                  e.preventDefault();
                  this.refresh();
                }}
                disabled={!displayReload}
              >
                {' '}
                <FontAwesomeIcon icon={faSync} />
              </button>
            </h5>
          </div>
        </div>
        <div style={resultStyle}>
          {stopNameLoaded === false ? (
            <h4 className="no-bus">Stop does not exist</h4>
          ) : (
            <BusResults
              style={resultStyle}
              resultCallback={this.finishedLoadingResults}
              stopInfo={stopInfo}
              shouldRefresh={shouldRefreshResults}
            />
          )}
        </div>
      </div>
    );
  }
}

TrackingPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default TrackingPage;
