import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import TrackingPage from "./pages/TrackingPage";
import BusNavbar from "./components/BusNavbar";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <BusNavbar />
          <Switch>
            <Route exact path="/bus-tracker/build/" component={HomePage} />
            <Route
              path="/bus-tracker/build/track/:id"
              component={TrackingPage}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
