import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import BusResults from '../components/BusResults';
import '../styles/tracking.scss';
import { getStop } from '../util/api';
import StopSearch from '../components/StopSearch';

class TrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopInfo: {},
      stopNameLoaded: null,
      stopResultsLoaded: null
    };
    const { match } = this.props;
    this.getStopName(match.params.id);
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (prevProps.match.params.id !== match.params.id) {
      this.setState({ stopNameLoaded: null, stopResultsLoaded: null });
      this.getStopName(match.params.id);
    }
  }

  finishedLoadingResults = () => {
    this.setState({ stopResultsLoaded: true });
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

  render() {
    const { stopNameLoaded, stopResultsLoaded, stopInfo } = this.state;
    const resultStyle =
      (stopNameLoaded && stopResultsLoaded) || stopNameLoaded === false // if the stop name invalid, display the "stop invalid"
        ? {}
        : { display: 'none' };
    const progressStyle = // mutual exclusive, when one is display none, the other is off
      (stopNameLoaded && stopResultsLoaded) || stopNameLoaded === false
        ? { display: 'none' }
        : {};
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
        </div>
        <div style={resultStyle}>
          {stopNameLoaded === false ? (
            <h4 className="no-bus">Stop does not exist</h4>
          ) : (
            <BusResults
              style={resultStyle}
              resultCallback={this.finishedLoadingResults}
              stopInfo={stopInfo}
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
