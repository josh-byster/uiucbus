import React, { Component } from "react";
import BusResults from "../components/BusResults";
import "../styles/tracking.scss";
import { getStop } from "../util/api";
class TrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stop_name: ""
    };
    this.getStopName(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getStopName(this.props.match.params.id);
    }
  }
  getStopName = async stop_id => {
    const { status, rqst, stops } = await getStop(stop_id);
    if (status.code === 200) {
      this.setState({ stop_name: stops[0].stop_name });
    }
  };

  render() {
    return (
      <div className="tracking-page">
        <h1>{this.state.stop_name}</h1>
        <BusResults stop_id={this.props.match.params.id} />
      </div>
    );
  }
}

export default TrackingPage;
