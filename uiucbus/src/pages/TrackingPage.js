import React, { Component } from "react";

class TrackingPage extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.match.params.id}</h1>
      </div>
    );
  }
}

export default TrackingPage;
