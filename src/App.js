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
            <Route exact path="/bus-tracker" component={HomePage} />
            <Route path="/bus-tracker/track/:id" component={TrackingPage} />
            {/* <Route path='/contact' component={Contact}></Route> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
