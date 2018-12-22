import React, { Component } from "react";
import "../styles/home.scss";
import StopSearch from "../components/StopSearch";
class HomePage extends Component {
  render() {
    return (
      <div>
        <div className="home d-flex">
          <div className="info-box">
            <h1>UIUC Bus Tracker</h1>
            <StopSearch />
          </div>
        </div>
        <footer className="text-muted">
          <div className="container">
            <p>
              Copyright © 2019 UIUCBus.com
              <br />
              Data provided by{" "}
              <a href="https://mtd.org/">
                Champaign—Urbana Mass Transit District
              </a>
              .
              <br />
              Suggestions, comments, or want to help contribute?{" "}
              <a href="https://github.com/josh-byster/bus-tracker">
                Check it out on GitHub!
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default HomePage;
