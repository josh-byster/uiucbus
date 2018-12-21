import React, { Component } from "react";
import BusResults from "../components/BusResults";

class TrackingPage extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.match.params.id}</h1>
        <BusResults stop_id={this.props.match.params.id} />
      </div>
    );
  }
}

export default TrackingPage;
