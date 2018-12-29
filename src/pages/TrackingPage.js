import React, { Component } from "react";
import BusResults from "../components/BusResults";
import "../styles/tracking.scss";
import { getStop } from "../util/api";
import StopSearch from "../components/StopSearch";
class TrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopInfo: {},
      stopNameLoaded: false,
      stopResultsLoaded: false
    };
    this.getStopName(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ stopNameLoaded: false, stopResultsLoaded: false });
      this.getStopName(this.props.match.params.id);
    }
  }

  finishedLoadingResults = () => {
    this.setState({ stopResultsLoaded: true });
  };

  getStopName = async stop_id => {
    const { status, stops } = await getStop(stop_id);
    if (status.code === 200 && stops.length > 0) {
      this.setState({ stopInfo: stops[0], stopNameLoaded: true });
    }
  };

  render() {
    return (
      <div className="tracking-page">
        <div className="info">
          <h1 className="stop_name">{this.state.stopInfo.stop_name}</h1>
          <StopSearch />
        </div>
        <BusResults
          resultCallback={this.finishedLoadingResults}
          stopInfo={this.state.stopInfo}
        />
      </div>
    );
  }
}

export default TrackingPage;
