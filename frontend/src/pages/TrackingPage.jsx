import React, { Component } from 'react';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistance } from 'date-fns';
import { Alert } from 'reactstrap';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import BusResults from '../components/BusResults';
import '../styles/tracking.scss';
import { getStop } from '../util/api';
import StopSearch from '../components/StopSearch';
import { useParams } from 'react-router-dom';

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
      intervalID: -1,
      error: '',
    };
    const { params } = this.props;
    this.getStopName(params.id);
    this.state.intervalID = setInterval(this.incrementCounter, 1000);
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (prevProps.params.id !== params.id) {
      this.setState({ stopNameLoaded: null, stopResultsLoaded: null });
      this.getStopName(params.id);
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
      error: '',
      stopResultsLoaded: true,
      shouldRefreshResults: false,
      secsSinceRefresh: 0,
    });
  };

  errorManager = (msg) => {
    this.setState({ error: msg });
  };

  handleCurrentStopError = (numRetries) => {
    this.errorManager(
      `Looks like at this moment, the MTD servers are under heavy load and are unresponsive. We'll keep retrying in the meantime. (Number of tries: ${numRetries})`
    );
  };

  getStopName = async (stopId) => {
    const { status, stops } = await getStop(
      stopId,
      this.handleCurrentStopError
    );
    if (status.code === 200 && stops.length > 0) {
      const stopObj = stops[0];
      this.setState({ stopInfo: stopObj, stopNameLoaded: true });
      document.title = `${stopObj.stop_name} - Bus Tracker`;
    } else {
      this.setState({ stopInfo: {}, stopNameLoaded: false });
    }
  };

  incrementCounter = () => {
    this.setState((prevState) => ({
      secsSinceRefresh: prevState.secsSinceRefresh + 1,
    }));
  };

  refresh = () => {
    this.setState({ shouldRefreshResults: true, stopResultsLoaded: false });
  };

  shouldDisplayProgress = () => {
    const { stopNameLoaded, stopResultsLoaded } = this.state;
    return !stopResultsLoaded && stopNameLoaded !== false; // if the stop name invalid, display the "stop invalid"
  };

  changeLoaderStatus = () => {
    if (this.shouldDisplayProgress()) {
      if (
        this.state.stopNameLoaded === true &&
        !this.state.stopResultsLoaded &&
        nProgress.status < 0.5
      ) {
        nProgress.set(0.5);
      }
      nProgress.start();
    } else {
      nProgress.done();
    }
  };
  render() {
    const {
      stopNameLoaded,
      stopInfo,
      secsSinceRefresh,
      shouldRefreshResults,
      error,
    } = this.state;
    const resultStyle = this.shouldDisplayProgress() ? { display: 'none' } : {};
    this.changeLoaderStatus();
    const displayReload = secsSinceRefresh > SECS_UNTIL_REFRESH_WARN;
    const timeSinceRefreshText = formatDistance(0, secsSinceRefresh * 1000, {
      addSuffix: false,
      includeSeconds: true,
    });

    return (
      <div className="tracking-page">
        <div className="info">
          <div className="errors container">
            {error && <Alert color="danger">{error}</Alert>}
          </div>
          <div className="data" style={resultStyle}>
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
                  onClick={(e) => {
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
                errorHandler={this.errorManager}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

TrackingPage.propTypes = {
  params: PropTypes.object.isRequired,
};

const withRouter = WrappedComponent => props => {
  const params = useParams();
  // etc... other react-router-dom v6 hooks

  return (
    <WrappedComponent
      {...props}
      params={params}
      // etc...
    />
  );
};

export default withRouter(TrackingPage);
