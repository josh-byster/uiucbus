import React, { Component } from "react";
import BusResults from "../components/BusResults";
import "../styles/tracking.scss";
import { getStop } from "../util/api";
import StopSearch from "../components/StopSearch";
import LinearProgress from "@material-ui/core/LinearProgress";
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
      const stopObj = stops[0];
      this.setState({ stopInfo: stopObj, stopNameLoaded: true });
      document.title = stopObj.stop_name + " - Bus Tracker";
    } else {
      this.setState({ stopInfo: {}, stopNameLoaded: false });
    }
  };

  render() {
    const resultStyle =
      this.state.stopNameLoaded && this.state.stopResultsLoaded
        ? {}
        : { display: "none" };
    const progressStyle =
      this.state.stopNameLoaded && this.state.stopResultsLoaded
        ? { display: "none" }
        : {};
    return (
      <div className="tracking-page">
        <LinearProgress
          color="secondary"
          variant="indeterminate"
          style={progressStyle}
        />
        <div className="info" style={resultStyle}>
          <h1 className="stop_name">{this.state.stopInfo.stop_name}</h1>
          <StopSearch />
        </div>
        <div style={resultStyle}>
          <BusResults
            style={resultStyle}
            resultCallback={this.finishedLoadingResults}
            stopInfo={this.state.stopInfo}
          />
        </div>
      </div>
    );
  }
}

export default TrackingPage;
