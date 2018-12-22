import React, { Component } from "react";
import "../styles/home.scss";
import StopSearch from "../components/StopSearch";
class HomePage extends Component {
  render() {
    return (
      <div className="home d-flex">
        <div className="info-box">
          <h1>UIUC Bus Tracker</h1>
          <StopSearch />
          <p>
            Data provided by{" "}
            <a href="https://mtd.org/">
              Champaign—Urbana Mass Transit District
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}

export default HomePage;
