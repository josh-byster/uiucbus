import React, { Component } from "react";
import BusResults from "../components/BusResults";
import "../styles/tracking.scss";
class TrackingPage extends Component {
  render() {
    return (
      <div className="tracking-page">
        <h1>{this.props.match.params.id}</h1>
        <BusResults stop_id={this.props.match.params.id} />
      </div>
    );
  }
}

export default TrackingPage;
